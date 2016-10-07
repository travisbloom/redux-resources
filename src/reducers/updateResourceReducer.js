import {
    UPDATE_RESOURCE_REQUEST,
    UPDATE_RESOURCE_REQUEST_SUCCESS,
    UPDATE_RESOURCE_REQUEST_ERROR,
    UPDATE_RESOURCE_REQUEST_OPTIMISTIC_SUCCESS,
    UPDATE_RESOURCE_REQUEST_OPTIMISTIC_ERROR,
} from '../actions'

export default function updateResourceReducer(state, action) {
    const { payload, meta } = action
    const { id, resource, timestamp, reduxResourcesActionType } = meta
    switch (reduxResourcesActionType) {
    case UPDATE_RESOURCE_REQUEST:
        return {
            ...state,
            isFetching: true,
            resources: {
                ...state.resources,
                [id]: {
                    ...state.resources[id],
                    isUpdating: true,
                },
            },
        }

    case UPDATE_RESOURCE_REQUEST_SUCCESS: {
        const { entities } = payload
        return {
            ...state,
            isFetching: false,
            errors: {},
            lastUpdatedAt: timestamp,
            resources: {
                ...state.resources,
                ...entities[resource],
            },
        }
    }

    case UPDATE_RESOURCE_REQUEST_ERROR: {
        const newResource = { ...state.resources[id] }
        delete newResource.isUpdating
        return {
            ...state,
            isFetching: false,
            errors: {
                ...state.errors,
                ...payload,
            },
            resources: {
                ...state.resources,
                [id]: newResource,
            },
        }
    }

    case UPDATE_RESOURCE_REQUEST_OPTIMISTIC_SUCCESS:
        return {
            ...state,
            isFetching: false,
            errors: {},
            lastUpdatedAt: timestamp,
            resources: {
                ...state.resources,
                [id]: payload,
            },
        }

    case UPDATE_RESOURCE_REQUEST_OPTIMISTIC_ERROR:
        return {
            ...state,
            isFetching: false,
            errors: { ...payload.errors },
            lastUpdatedAt: payload.replacedLastUpdatedAt,
            resources: {
                ...state.resources,
                [id]: payload.replacedResource,
            },
        }
    }
}
