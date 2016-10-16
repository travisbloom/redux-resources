import {
    CREATE_RESOURCE_REQUEST,
    CREATE_RESOURCE_REQUEST_ERROR,
    CREATE_RESOURCE_REQUEST_SUCCESS,
} from '../constants'

const createResourceReducer = (state, action) => {
    const { payload, meta } = action
    const { resource, timestamp, reduxResourcesActionType, normalizedResponse } = meta
    const resourceState = state[resource]

    switch (reduxResourcesActionType) {
    case CREATE_RESOURCE_REQUEST:
        return {
            ...state,
            [resource]: {
                ...resourceState,
                isFetching: true,
            },
        }
    case CREATE_RESOURCE_REQUEST_SUCCESS: {
        const { entities, result } = normalizedResponse
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
                    selectedResource: result[0],
                    lastCreatedAt: timestamp,
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
    case CREATE_RESOURCE_REQUEST_ERROR:
        return {
            ...state,
            isFetching: false,
            [resource]: {
                ...resourceState,
                isFetching: false,
                errors: [
                    ...resourceState.errors,
                    ...payload,
                ],
            },
        }
    }
}

export default createResourceReducer
