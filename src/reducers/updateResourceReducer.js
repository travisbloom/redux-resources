import {
    UPDATE_RESOURCE_REQUEST,
    UPDATE_RESOURCE_REQUEST_SUCCESS,
    UPDATE_RESOURCE_REQUEST_ERROR,
} from '../constants'

const updateResourceReducer = (state, action) => {
    const { payload, meta } = action
    const {
        id,
        resource,
        timestamp,
        reduxResourcesActionType,
        isOptimisticUpdate,
        replacedResource,
        normalizedResponse,
        replacedLastUpdatedAt,
    } = meta
    const resourceState = state[resource]

    switch (reduxResourcesActionType) {
    case UPDATE_RESOURCE_REQUEST:
        return {
            ...state,
            [resource]: {
                ...resourceState,
                isFetching: true,
                resources: {
                    ...resourceState.resources,
                    [id]: {
                        ...resourceState.resources[id],
                        isUpdating: true,
                    },
                },
            },
        }

    case UPDATE_RESOURCE_REQUEST_SUCCESS: {
        const { entities } = normalizedResponse
        return Object.keys(state).reduce((newState, resourceKey) => {
            if (resourceKey !== resource && entities[resourceKey]) {
                newState[resourceKey] = {
                    ...state[resourceKey],
                    resources: {
                        ...state[resourceKey].resources,
                        ...entities[resourceKey],
                    },
                }
            } else if (resourceKey === resource) {
                newState[resourceKey] = {
                    ...state[resourceKey],
                    isFetching: false,
                    errors: [],
                    lastUpdatedAt: timestamp,
                    resources: {
                        ...state[resourceKey].resources,
                        ...entities[resourceKey],
                    },
                }
            } else {
                newState[resourceKey] = state[resourceKey]
            }
            return newState
        }, {})
    }

    case UPDATE_RESOURCE_REQUEST_ERROR: {
        if (isOptimisticUpdate) {
            return {
                ...state,
                [resource]: {
                    ...resourceState,
                    errors: [
                        ...resourceState.errors,
                        ...payload,
                    ],
                    lastUpdatedAt: replacedLastUpdatedAt,
                    resources: {
                        ...resourceState.resources,
                        [id]: replacedResource,
                    },
                },
            }
        }
        const newResource = { ...resourceState.resources[id] }
        delete newResource.isUpdating
        return {
            ...state,
            [resource]: {
                ...resourceState,
                isFetching: false,
                errors: [
                    ...resourceState.errors,
                    ...payload,
                ],
                resources: {
                    ...resourceState.resources,
                    [id]: newResource,
                },
            },
        }
    }
    }
}

export default updateResourceReducer
