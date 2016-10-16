import {
    CREATE_RESOURCE_REQUEST,
    CREATE_RESOURCE_REQUEST_SUCCESS,
    CREATE_RESOURCE_REQUEST_ERROR,

    DELETE_RESOURCE_REQUEST,
    DELETE_RESOURCE_REQUEST_SUCCESS,
    DELETE_RESOURCE_REQUEST_ERROR,

    LIST_RESOURCE_REQUEST,
    LIST_RESOURCE_REQUEST_SUCCESS,
    LIST_RESOURCE_REQUEST_ERROR,
    SELECT_RESOURCE_LIST,

    RETRIEVE_RESOURCE_REQUEST,
    RETRIEVE_RESOURCE_REQUEST_SUCCESS,
    RETRIEVE_RESOURCE_REQUEST_ERROR,
    SELECT_RESOURCE,

    UPDATE_RESOURCE_REQUEST,
    UPDATE_RESOURCE_REQUEST_SUCCESS,
    UPDATE_RESOURCE_REQUEST_ERROR,

    PARTIAL_UPDATE_RESOURCE_REQUEST,
    PARTIAL_UPDATE_RESOURCE_REQUEST_SUCCESS,
    PARTIAL_UPDATE_RESOURCE_REQUEST_ERROR,
} from '../constants'

import createResourceReducer from './createResourceReducer'
import deleteResourceReducer from './deleteResourceReducer'
import listResourceReducer from './listResourceReducer'
import partialUpdateResourceReducer from './partialUpdateResourceReducer'
import retrieveResourceReducer from './retrieveResourceReducer'
import updateResourceReducer from './updateResourceReducer'

const routeReduxResourceAction = (state, action) => {
    const { reduxResourcesActionType } = action.meta

    switch (reduxResourcesActionType) {
    case (CREATE_RESOURCE_REQUEST):
    case (CREATE_RESOURCE_REQUEST_SUCCESS):
    case (CREATE_RESOURCE_REQUEST_ERROR):
        return createResourceReducer(state, action)

    case (DELETE_RESOURCE_REQUEST):
    case (DELETE_RESOURCE_REQUEST_SUCCESS):
    case (DELETE_RESOURCE_REQUEST_ERROR):
        return deleteResourceReducer(state, action)

    case (LIST_RESOURCE_REQUEST):
    case (LIST_RESOURCE_REQUEST_SUCCESS):
    case (LIST_RESOURCE_REQUEST_ERROR):
    case (SELECT_RESOURCE_LIST):
        return listResourceReducer(state, action)

    case (RETRIEVE_RESOURCE_REQUEST):
    case (RETRIEVE_RESOURCE_REQUEST_SUCCESS):
    case (RETRIEVE_RESOURCE_REQUEST_ERROR):
    case (SELECT_RESOURCE):
        return retrieveResourceReducer(state, action)

    case (UPDATE_RESOURCE_REQUEST):
    case (UPDATE_RESOURCE_REQUEST_SUCCESS):
    case (UPDATE_RESOURCE_REQUEST_ERROR):
        return updateResourceReducer(state, action)

    case (PARTIAL_UPDATE_RESOURCE_REQUEST):
    case (PARTIAL_UPDATE_RESOURCE_REQUEST_SUCCESS):
    case (PARTIAL_UPDATE_RESOURCE_REQUEST_ERROR):
        return partialUpdateResourceReducer(state, action)
    }
}

export default routeReduxResourceAction
