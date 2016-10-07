import {
    CREATE_RESOURCE_REQUEST,
    CREATE_RESOURCE_REQUEST_ERROR,
    CREATE_RESOURCE_REQUEST_SUCCESS,
} from '../constants'

const createResourceReducer = (state, action) => {
    const { payload, meta } = action
    const { resource, timestamp, reduxResourcesActionType, normalizedResponse } = meta
    switch (reduxResourcesActionType) {
    case CREATE_RESOURCE_REQUEST:
        return {
            ...state,
            isFetching: true,
        }
    case CREATE_RESOURCE_REQUEST_SUCCESS: {
        const { entities, result } = normalizedResponse
        return {
            ...state,
            isFetching: false,
            errors: [],
            selectedResource: result[0],
            lastCreatedAt: timestamp,
            resources: {
                ...state.resources,
                ...entities[resource],
            },
        }
    }
    case CREATE_RESOURCE_REQUEST_ERROR:
        return {
            ...state,
            isFetching: false,
            errors: [
                ...state.errors,
                ...payload,
            ],
        }
    }
}

export default createResourceReducer
