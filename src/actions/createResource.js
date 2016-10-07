import { capitalize, generateConstantFromString } from '../utilities'
import {
    CREATE_RESOURCE_REQUEST,
    CREATE_RESOURCE_REQUEST_SUCCESS,
    CREATE_RESOURCE_REQUEST_ERROR,
} from '../constants'

/**
* create a resource with a given body payload
* @param {object} the config object for getResource
*     @property {string} resource - see above for details
*     @property {function} request - see above for details
*     @property {function} normalizer - see above for details
*     @property {string} resourceActionName - see above for details
*/
const createResource = ({ formatErrors, request, resource, normalizer }) => {
    const resourceActionTypeName = generateConstantFromString(resource)
    const initialActionType = `CREATE_${resourceActionTypeName}_REQUEST`
    const successActionType = `${initialActionType}_SUCCESS`
    const errorActionType = `${initialActionType}_ERROR`
    const actionCreatorName = `create${capitalize(resource)}`

    /**
    * @param {object} the body of the request, containing all the new properties of the resource
    * @param {object} the options object
    *     @property {boolean} shouldThrowErrors - if true, will not pass returned errors to redux
          but instead throw them so the fn calling can .catch them
    */
    const createResourceActionCreator = (body, options = {}) => (dispatch, getState) => {
        const { shouldThrowErrors } = options
        const meta = { ...options, timestamp: new Date().toISOString(), resource }
        dispatch({
            type: initialActionType,
            payload: body,
            meta: { ...meta, reduxResourcesActionType: CREATE_RESOURCE_REQUEST },
        })
        return request(body, { ...options, dispatch, getState })
            .then((response) => {
                dispatch({
                    type: successActionType,
                    payload: response,
                    meta: {
                        ...meta,
                        normalizedResponse: normalizer(response),
                        reduxResourcesActionType: CREATE_RESOURCE_REQUEST_SUCCESS,
                    },
                })
                return response
            })
            .catch((response) => {
                dispatch({
                    type: errorActionType,
                    payload: formatErrors(response),
                    meta: { ...meta, reduxResourcesActionType: CREATE_RESOURCE_REQUEST_ERROR },
                })
                if (shouldThrowErrors) throw response
            })
    }
    return {
        [initialActionType]: initialActionType,
        [successActionType]: successActionType,
        [errorActionType]: errorActionType,
        [actionCreatorName]: createResourceActionCreator,
    }
}

export default createResource
