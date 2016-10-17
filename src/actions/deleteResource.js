import { capitalize, generateConstantFromString } from '../utilities'
import {
    DELETE_RESOURCE_REQUEST,
    DELETE_RESOURCE_REQUEST_SUCCESS,
    DELETE_RESOURCE_REQUEST_ERROR,
} from '../constants'

const deleteResource = ({ formatErrors, request, resource }) => {
    const resourceActionTypeName = generateConstantFromString(resource)
    const initialActionType = `DELETE_${resourceActionTypeName}_REQUEST`
    const successActionType = `${initialActionType}_SUCCESS`
    const errorActionType = `${initialActionType}_ERROR`
    const actionCreatorName = `delete${capitalize(resource)}`

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
