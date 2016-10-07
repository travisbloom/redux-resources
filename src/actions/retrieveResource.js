import { capitalize, generateConstantFromString, defaultIsCached } from '../utilities'
import {
    selectResource,
    selectSelectedResource,
    selectResourcesBeingFetched,
} from '../selectors'
import {
    RETRIEVE_RESOURCE_REQUEST,
    RETRIEVE_RESOURCE_REQUEST_SUCCESS,
    RETRIEVE_RESOURCE_REQUEST_ERROR,
    SELECT_RESOURCE,
} from '../constants'

/**
* get a resource with a given ID. Will not fetch resource that
* have been previously returned and exist in Redux (unless shouldIgnoreCache is passed).
* @param {object} the config object for retrieveResource
*     @property {string} resource - see above for details
*     @property {function} request - see above for details
*     @property {function} normalizer - see above for details
*     @property {string} resourceActionName - see above for details
*     @property {function} formatErrors - a custom function that will be
      used to format returned errors
*/
const retrieveResource = ({ formatErrors, resource, request, normalizer, isCachedFn }) => {
    const resourceActionTypeName = generateConstantFromString(resource)
    const initialActionType = `GET_${resourceActionTypeName}_REQUEST`
    const successActionType = `${initialActionType}_SUCCESS`
    const errorActionType = `${initialActionType}_ERROR`
    const selectActionType = `SELECT_${resourceActionTypeName}`
    const actionCreatorName = `retrieve${capitalize(resource)}`
    const isCached = isCachedFn || defaultIsCached
    /**
    * @param {string|number} the ID of the resource being fetched
    * @param {object} the options object
    *     @property {boolean} shouldIgnoreCache - if true, will fetch the remote resource even if
    *     it has been previously retrieved
    *     @property {boolean} shouldThrowErrors - if true, will not pass returned errors to
    *     redux but instead throw them so the fn calling can .catch them
    *     @property {boolean} query - query params that will be passed to
    *     the request object (used to check for expand param and see if expanded resource exist)
    */
    const retrieveResourceActionCreator = (id, options = {}) => (dispatch, getState) => {
        const { shouldIgnoreCache, shouldThrowErrors } = options
        // Check returned resource cache first
        const state = getState()
        const previousResource = selectResource(state, resource, id)
        const meta = {
            id,
            resource,
            isSelected: true,
            timestamp: new Date().toISOString(),
            ...options,
        }
        // if the previous resource and all its required expanded properties already exist in redux
        if (!shouldIgnoreCache && isCached(previousResource, id, options)) {
            // update the selectedResource if the requested one is not currently the selected one
            if (selectSelectedResource(state, resource) !== id) {
                dispatch({
                    type: selectActionType,
                    meta: { ...meta, reduxResourcesActionType: SELECT_RESOURCE },
                })
            }
            return Promise.resolve()
        }

        // if the resource is currently being fetched already
        if (selectResourcesBeingFetched(state).includes(id)) return Promise.resolve()

        // dispatch the initial action that will set any fetching logic in the passed resource
        dispatch({
            type: initialActionType,
            payload: id,
            meta: { ...meta, reduxResourcesActionType: RETRIEVE_RESOURCE_REQUEST },
        })

        return request(id, { ...options, dispatch, getState })
            .then((response) => {
                dispatch({
                    type: successActionType,
                    payload: response,
                    meta: {
                        ...meta,
                        normalizedResponse: normalizer(response),
                        reduxResourcesActionType: RETRIEVE_RESOURCE_REQUEST_SUCCESS,
                    },
                })
            })
            .catch((response) => {
                dispatch({
                    type: errorActionType,
                    payload: formatErrors(response),
                    meta: { ...meta, reduxResourcesActionType: RETRIEVE_RESOURCE_REQUEST_ERROR },
                })
                if (shouldThrowErrors) throw response
            })
    }

    return {
        [initialActionType]: initialActionType,
        [successActionType]: successActionType,
        [errorActionType]: errorActionType,
        [selectActionType]: selectActionType,
        [actionCreatorName]: retrieveResourceActionCreator,
    }
}

export default retrieveResource
