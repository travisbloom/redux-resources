import { capitalize, generateConstantFromString } from '../utilities'
import {
    CREATE_RESOURCE_REQUEST,
    CREATE_RESOURCE_REQUEST_SUCCESS,
    CREATE_RESOURCE_REQUEST_ERROR,
} from '../constants'

const createResource = ({ formatErrors, request, resource, normalizer }) => {
    const resourceActionTypeName = generateConstantFromString(resource)
    const initialActionType = `CREATE_${resourceActionTypeName}_REQUEST`
    const successActionType = `${initialActionType}_SUCCESS`
    const errorActionType = `${initialActionType}_ERROR`
    const actionCreatorName = `create${capitalize(resource)}`

    const createResourceActionCreator = (body, options = {}) => (dispatch, getState) => {
        const { shouldThrowErrors } = options
        const meta = { ...options, timestamp: new Date().toISOString(), resource }
        dispatch({
            type: initialActionType,
            payload: body,
            meta: { ...meta, reduxResourcesActionType: CREATE_RESOURCE_REQUEST },
        })
        return request(body, { ...options, dispatch, getState }).then((response) => {
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
