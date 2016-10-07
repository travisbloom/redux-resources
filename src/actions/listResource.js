import { serializeOrderedQuery, capitalize, generateConstantFromString } from '../utilities'
import {
    selectResourceList,
    selectSelectedResourceList,
    selectResourceListsBeingFetched,
} from '../selectors'
import {
    LIST_RESOURCE_REQUEST,
    LIST_RESOURCE_REQUEST_SUCCESS,
    LIST_RESOURCE_REQUEST_ERROR,
    SELECT_RESOURCE_LIST,
    DEFAULT_QUERY_LIMIT,
} from '../constants'

const defaultIsCached = obj => !!obj

/**
* get a list of resource with a given set of query param filters.
* Will not fetch resource that have been previously returned and exist in Redux
* @param {object} the config object for getResource
*     @property {string} resource - see above for details
*     @property {function} request - see above for details
*     @property {function} normalizer - see above for details
*     @property {string} resourceActionName - see above for details
*/
const listResource = ({ formatErrors, resource, request, normalizer, isCachedFn }) => {
    const resourceActionTypeName = generateConstantFromString(resource)
    const initialActionType = `LIST_${resourceActionTypeName}_REQUEST`
    const successActionType = `${initialActionType}_SUCCESS`
    const errorActionType = `${initialActionType}_ERROR`
    const selectActionType = `SELECT_${resourceActionTypeName}_LIST`
    const actionCreatorName = `list${capitalize(resource)}`

    const isCached = isCachedFn || defaultIsCached
    /**
    * @param {object} the query param object being used to filter the resource request
    * @param {object} the options object
    *     @property {boolean} shouldIgnoreCache - if true, will fetch the remote resource even if it
          has been previously retrieved
    *     @property {boolean} shouldThrowErrors - if true, will not pass returned errors to redux
          but instead throw them so the fn calling can .catch them
    */
    const listResourceActionCreator = (passedQuery = {}, options = {}) => (dispatch, getState) => {
        const { shouldThrowErrors, shouldIgnoreCache } = options
        const query = {
            limit: DEFAULT_QUERY_LIMIT,
            offset: 0,
            ...passedQuery,
        }

        const queryString = serializeOrderedQuery(query)
        const state = getState()
        const previousResourceList = selectResourceList(state, resource, queryString)
        const meta = {
            query,
            queryString,
            resource,
            timestamp: new Date().toISOString(),
            ...options,
        }
        // if the resource already exists in redux
        if (!shouldIgnoreCache && isCached(previousResourceList, query, options)) {
            // if the requested resource is not the current selected resource
            if (selectSelectedResourceList(state, resource) !== queryString) {
                dispatch({
                    type: selectActionType,
                    meta: { ...meta, reduxResourcesActionType: SELECT_RESOURCE_LIST },
                })
            }
            return Promise.resolve()
        }

        // if the resource is currently being fetched already
        if (selectResourceListsBeingFetched(state, resource).includes(queryString)) {
            return Promise.resolve()
        }

        dispatch({
            type: initialActionType,
            meta: { ...meta, reduxResourcesActionType: LIST_RESOURCE_REQUEST },
        })

        return request(query, { ...options, dispatch, getState }).then((response) => {
            dispatch({
                type: successActionType,
                payload: response,
                meta: {
                    ...meta,
                    normalizedResponse: normalizer(response),
                    reduxResourcesActionType: LIST_RESOURCE_REQUEST_SUCCESS,
                },
            })
        })
        .catch((response) => {
            dispatch({
                type: errorActionType,
                errors: formatErrors(response),
                meta: {
                    ...meta,
                    reduxResourcesActionType: LIST_RESOURCE_REQUEST_ERROR,
                },
            })
            if (shouldThrowErrors) throw response
        })
    }
    return {
        [initialActionType]: initialActionType,
        [successActionType]: successActionType,
        [errorActionType]: errorActionType,
        [selectActionType]: selectActionType,
        [actionCreatorName]: listResourceActionCreator,
    }
}

export default listResource
