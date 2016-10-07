import { capitalize, generateConstantFromString } from '../utilities'
import {
    UPDATE_RESOURCE_REQUEST,
    UPDATE_RESOURCE_REQUEST_SUCCESS,
    UPDATE_RESOURCE_REQUEST_ERROR,
} from '../constants'

/**
* update a resource, either remotely or just locally. Allows both patches(passing only the fields that changed) and updates (passing the entire new resource)
* @param {object} the config object for getResource
*     @property {string} resource - see above for details
*     @property {function} request - see above for details
*     @property {function} normalizer - see above for details
*     @property {string} resourceActionName - see above for details
*     @property {function} patchRequest - an optional request object that can be passed in if the resource patch request differs from the normal request
*/
const updateResource = ({ request, resource, patchRequest, normalizer, formatErrors }) => {
    const resourceActionTypeName = generateConstantFromString(resource)
    const initialActionType = `UPDATE_${resourceActionTypeName}_REQUEST`
    const successActionType = `${initialActionType}_SUCCESS`
    const errorActionType = `${initialActionType}_ERROR`
    const actionCreatorName = `update${capitalize(resource)}`
        /**
        * @param {string|number} the ID of the resource being updated
        * @param {object} the json body payload of the update
        * @param {object} the options object
        *     @property {boolean} shouldThrowErrors - if true, will not pass returned errors to redux but instead throw them so the fn calling can .catch them
        *     @property {boolean} isOptimisticUpdate: determines whether the new fields should update before or after the server request (this will revert the changes on error)
        **/
    return function updateResourceActionCreator(id, body, options = {}) {
        const { isOptimisticUpdate, shouldThrowErrors } = options
        const meta = { ...options, resource, id, timestamp: new Date().toISOString(), isPatch }
        return (dispatch, getState) => {
            if (isOptimisticUpdate) {
                const state = getState()
                    // we store the replaced resource here so we can revert if it fails
                const replacedResource = state[resource].resources[id]
                const replacedLastUpdatedAt = state[resource].lastUpdatedAt
                dispatch({
                    type: successActionType,
                    payload: { ...replacedResource, ...body },
                    meta: { ...meta, reduxResourcesActionType: UPDATE_RESOURCE_REQUEST_OPTIMISTIC_SUCCESS },
                })

                return requestMethod(id, body, { ...options, dispatch, getState })
                        .catch((response) => {
                            dispatch({
                                type: requestOptimisticErrorActionType,
                                payload: {
                                    replacedLastUpdatedAt,
                                    replacedResource: { ...replacedResource },
                                    errors: formatErrors(response),
                                },
                                meta: { ...meta, reduxResourcesActionType: UPDATE_RESOURCE_REQUEST_OPTIMISTIC_ERROR },
                            })
                            if (shouldThrowErrors) throw response
                        })
            }

            dispatch({
                type: initialActionType,
                payload: id,
                meta: { ...meta, reduxResourcesActionType: UPDATE_RESOURCE_REQUEST },
            })

            return requestMethod(id, body, { ...options, dispatch, getState })
                    .then((result) => {
                        dispatch({
                            type: successActionType,
                            payload: normalizer(result),
                            meta: { ...meta, reduxResourcesActionType: UPDATE_RESOURCE_REQUEST_SUCCESS },
                        })
                    })
                    .catch((response) => {
                        // by default we should handle errors unless the shouldThrowErrors prop is passed
                        const errors = shouldThrowErrors ? {} : { general: formatErrors(response) }
                        dispatch({
                            type: errorActionType,
                            payload: errors,
                            meta: { ...meta, reduxResourcesActionType: UPDATE_RESOURCE_REQUEST_ERROR },
                        })
                        if (shouldThrowErrors) throw response
                    })
        }
    }

    /**
    * @param {string|number} the ID of the resource being updated
    * @param {object} the json body payload of the update
    * @param {object} the options object (just for passing to resource in case it's needed)
    **/
    const updateLocalResource = (id, body, options = {}) => ({
        type: successActionType,
        payload: (body.entities && body.result) ? body : normalizer(body),
        meta: { ...options, resource, id, reduxResourcesActionType: UPDATE_RESOURCE_REQUEST_SUCCESS },
    })

    /**
    * @param {string|number} the ID of the resource being updated
    * @param {object} the json body payload of the update
    * @param {object} the options object (just for passing to resource in case it's needed)
    **/
    const patchLocalResource = (id, body, options = {}) => (dispatch, getState) => {
        const existingResource = getState()[resource].resources[id]
        dispatch({
            type: requestOptimisticSuccessActionType,
            payload: { ...existingResource, ...body },
            meta: { ...options, resource, id, reduxResourcesActionType: UPDATE_RESOURCE_REQUEST_OPTIMISTIC_SUCCESS },
        })
    }

    return {
        [initialActionType]: initialActionType,
        [successActionType]: successActionType,
        [errorActionType]: errorActionType,
        [requestOptimisticSuccessActionType]: requestOptimisticSuccessActionType,
        [requestOptimisticErrorActionType]: requestOptimisticErrorActionType,
        [actionCreatorName]: updateFunctionFactory(request),
        [patchActionCreatorName]: updateFunctionFactory(patchRequest || request, true),
        [`updateLocal${capitalize(resource)}`]: updateLocalResource,
        [`patchLocal${capitalize(resource)}`]: patchLocalResource,
    }
}

export default updateResource
