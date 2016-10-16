import {
    RETRIEVE_RESOURCE_REQUEST,
    RETRIEVE_RESOURCE_REQUEST_SUCCESS,
    RETRIEVE_RESOURCE_REQUEST_ERROR,
    UPDATE_SELECTED_RESOURCE,
} from '../constants'
import { removeFromArray, addToArray } from '../utilities'

const retrieveResourceReducer = (state, action) => {
    const { payload, meta } = action
    const { timestamp, reduxResourcesActionType, normalizedResponse, id, resource } = meta
    const resourceState = state[resource]

    switch (reduxResourcesActionType) {
    case UPDATE_SELECTED_RESOURCE:
        return {
            ...state,
            [resource]: {
                ...resourceState,
                selectedResource: id,
            },
        }

    case RETRIEVE_RESOURCE_REQUEST:
        return {
            ...state,
            [resource]: {
                ...resourceState,
                resourcesBeingFetched: addToArray(id, resourceState.resourcesBeingFetched),
                isFetching: true,
            },
        }

    case RETRIEVE_RESOURCE_REQUEST_ERROR:
        return {
            ...state,
            [resource]: {
                ...resourceState,
                isFetching: false,
                resourcesBeingFetched: removeFromArray(id, resourceState.resourcesBeingFetched),
                errors: [
                    ...resourceState.errors,
                    ...payload,
                ],
            },
        }

    case RETRIEVE_RESOURCE_REQUEST_SUCCESS: {
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
                    lastRetrievedAt: timestamp,
                    selectedResource: id,
                    resourcesBeingFetched: removeFromArray(
                        id,
                        state[resourceKey].resourcesBeingFetched
                    ),
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
    }
}

export default retrieveResourceReducer
