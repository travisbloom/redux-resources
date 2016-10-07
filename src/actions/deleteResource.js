import { capitalize, generateConstantFromString } from '../utilities'
import {
    DELETE_RESOURCE_REQUEST,
    DELETE_RESOURCE_REQUEST_SUCCESS,
    DELETE_RESOURCE_REQUEST_ERROR,
} from '../constants'
/**
* delete a resource with a given id
* @param {object} the config object for getResource
*     @property {string} resource - see above for details
*     @property {function} request - see above for details
*     @property {string} resourceActionName - see above for details
*/
const deleteResource = ({ formatErrors, request, resource }) => {
    const resourceActionTypeName = generateConstantFromString(resource)
    const initialActionType = `DELETE_${resourceActionTypeName}_REQUEST`
    const successActionType = `${initialActionType}_SUCCESS`
    const errorActionType = `${initialActionType}_ERROR`
    const actionCreatorName = `delete${capitalize(resource)}`

    /**
    * @param {string|number} the id of the resource
    * @param {object} the options object
    *     @property {boolean} shouldThrowErrors - if true, will not pass returned errors to redux
          but instead throw them so the fn calling can .catch them
    */
    const deleteResourceActionCreator = (id, options = {}) => (dispatch, getState) => {
        const { shouldThrowErrors } = options
        const meta = { ...options, resource, timestamp: new Date().toISOString(), id }
        dispatch({
            type: initialActionType,
            payload: id,
            meta: { ...meta, reduxResourcesActionType: DELETE_RESOURCE_REQUEST },
        })
        return request(id, { ...options, dispatch, getState })
            .then(() => {
                dispatch({
                    type: successActionType,
                    payload: id,
                    meta: { ...meta, reduxResourcesActionType: DELETE_RESOURCE_REQUEST_SUCCESS },
                })
            })
            .catch((response) => {
                dispatch({
                    type: errorActionType,
                    payload: formatErrors(response),
                    meta: { ...meta, reduxResourcesActionType: DELETE_RESOURCE_REQUEST_ERROR },
                })
                if (shouldThrowErrors) throw response
            })
    }
    return {
        [initialActionType]: initialActionType,
        [successActionType]: successActionType,
        [errorActionType]: errorActionType,
        [actionCreatorName]: deleteResourceActionCreator,
    }
}

export default deleteResource
