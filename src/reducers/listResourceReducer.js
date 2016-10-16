import {
    LIST_RESOURCE_REQUEST,
    LIST_RESOURCE_REQUEST_SUCCESS,
    LIST_RESOURCE_REQUEST_ERROR,
    SELECT_RESOURCE_LIST,
} from '../constants'
import { removeFromArray, addToArray } from '../utilities'

const listResourceReducer = (state, action) => {
    const { payload, meta } = action
    const {
        query,
        queryString,
        resource,
        timestamp,
        reduxResourcesActionType,
        normalizedResponse,
    } = meta
    const resourceState = state[resource]

    switch (reduxResourcesActionType) {
    case SELECT_RESOURCE_LIST:
        return {
            ...state,
            [resource]: {
                ...resourceState,
                selectedResourceList: queryString,
            },
        }
    case LIST_RESOURCE_REQUEST:
        return {
            ...state,
            [resource]: {
                ...resourceState,
                isFetching: true,
                resourceListsBeingFetched: addToArray(
                    queryString,
                    resourceState.resourceListsBeingFetched
                ),
            },
        }
    case LIST_RESOURCE_REQUEST_ERROR:
        return {
            ...state,
            [resource]: {
                ...resourceState,
                isFetching: false,
                resourceListsBeingFetched: removeFromArray(
                    queryString,
                    resourceState.resourceListsBeingFetched
                ),
                errors: [
                    ...resourceState.errors,
                    ...payload,
                ],
            },
        }
    case LIST_RESOURCE_REQUEST_SUCCESS: {
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
                    resources: {
                        ...state[resourceKey].resources,
                        ...(entities[resource] || {}),
                    },
                    errors: [],
                    resourceListsBeingFetched: removeFromArray(
                        queryString,
                        state[resourceKey].resourceListsBeingFetched
                    ),
                    selectedResourceList: queryString,
                    lastListedAt: timestamp,
                    resourceLists: {
                        ...state[resourceKey].resourceLists,
                        [queryString]: {
                            result,
                            query,
                            queryString,
                        },
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

export default listResourceReducer
