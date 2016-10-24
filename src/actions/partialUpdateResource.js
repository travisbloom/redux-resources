import { capitalize, generateConstantFromString } from '../utilities'
import {
    selectResource,
} from '../selectors'
import {
    PARTIAL_UPDATE_RESOURCE_REQUEST,
    PARTIAL_UPDATE_RESOURCE_REQUEST_SUCCESS,
    PARTIAL_UPDATE_RESOURCE_REQUEST_ERROR,
} from '../constants'

/**
* update a resource, either remotely or just locally.
* @param {object} the config object for getResource
*     @property {string} resource - see above for details
*     @property {function} request - see above for details
*     @property {function} normalizer - see above for details
*     @property {string} resourceActionName - see above for details
*/
const partialUpdateResource = ({ request, resource, normalizer, formatErrors }) => {
    const resourceActionTypeName = generateConstantFromString(resource)
    const initialActionType = `PARTIAL_UPDATE_${resourceActionTypeName}_REQUEST`
    const successActionType = `${initialActionType}_SUCCESS`
    const errorActionType = `${initialActionType}_ERROR`
    const actionCreatorName = `partialUpdate${capitalize(resource)}`
        /**
        * @param {string|number} the ID of the resource being updated
        * @param {object} the json body payload of the update
        * @param {object} the options object
        *     @property {boolean} shouldThrowErrors - if true, will not pass returned
              errors to redux but instead throw them so the fn calling can .catch them
        *     @property {boolean} isOptimisticUpdate: determines whether the new fields
              should update before or after the server request
              (this will revert the changes on error)
        **/

    const partialUpdateResourceActionCreator = (id, body, options = {}) => (dispatch, getState) => {
        const { isOptimisticUpdate, shouldThrowErrors } = options
        const meta = { ...options, resource, id, timestamp: new Date().toISOString() }
        if (isOptimisticUpdate) {
            const state = getState()
                // we store the replaced resource here so we can revert if it fails
            const replacedResource = selectResource(state, resource, id)
            const replacedLastUpdatedAt = state.resources[resource].lastUpdatedAt

            const updatedResource = { ...replacedResource, ...body }
            dispatch({
                type: successActionType,
                payload: updatedResource,
                meta: {
                    ...meta,
                    normalizedResponse: normalizer(updatedResource),
                    reduxResourcesActionType: PARTIAL_UPDATE_RESOURCE_REQUEST_SUCCESS,
                },
            })

            return request(id, body, { ...options, dispatch, getState }).catch((response) => {
                dispatch({
                    type: errorActionType,
                    payload: formatErrors(response),
                    meta: {
                        ...meta,
                        replacedLastUpdatedAt,
                        replacedResource: { ...replacedResource },
                        reduxResourcesActionType: PARTIAL_UPDATE_RESOURCE_REQUEST_ERROR,
                    },
                })
                if (shouldThrowErrors) throw response
            })
        }

        dispatch({
            type: initialActionType,
            payload: id,
            meta: { ...meta, reduxResourcesActionType: PARTIAL_UPDATE_RESOURCE_REQUEST },
        })

        return request(id, body, { ...options, dispatch, getState }).then((response) => {
            dispatch({
                type: successActionType,
                payload: response,
                meta: {
                    ...meta,
                    normalizedResponse: normalizer(response),
                    reduxResourcesActionType: PARTIAL_UPDATE_RESOURCE_REQUEST_SUCCESS,
                },
            })
        })
        .catch((response) => {
            dispatch({
                type: errorActionType,
                payload: formatErrors(response),
                meta: {
                    ...meta,
                    reduxResourcesActionType: PARTIAL_UPDATE_RESOURCE_REQUEST_ERROR,
                },
            })
            if (shouldThrowErrors) throw response
        })
    }

    return {
        [initialActionType]: initialActionType,
        [successActionType]: successActionType,
        [errorActionType]: errorActionType,
        [actionCreatorName]: partialUpdateResourceActionCreator,
    }
}

export default partialUpdateResource
