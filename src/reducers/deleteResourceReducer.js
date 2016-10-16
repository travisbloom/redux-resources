import {
    DELETE_RESOURCE_REQUEST,
    DELETE_RESOURCE_REQUEST_SUCCESS,
    DELETE_RESOURCE_REQUEST_ERROR,
} from '../constants'

const deleteResourceReducer = (state, action) => {
    const { meta, payload } = action
    const { timestamp, reduxResourcesActionType, resource, id } = meta
    const resourceState = state[resource]

    switch (reduxResourcesActionType) {
    case DELETE_RESOURCE_REQUEST:
        return {
            ...state,
            [resource]: {
                ...resourceState,
                isFetching: true,
                resources: {
                    ...resourceState.resources,
                    [id]: {
                        ...resourceState.resources[id],
                        isDeleting: true,
                    },
                },
            },
        }
    case DELETE_RESOURCE_REQUEST_SUCCESS: {
        let hasUpdatedResourceLists = false
        const resourceListKeys = Object.keys(resourceState.resourceLists)
        // determine what collections contain the deleted resource and remove it from them
        const newResourceLists = resourceListKeys.reduce((resourceLists, queryKey) => {
            const existingResultIndex = resourceState.resourceLists[queryKey].result.indexOf(id)
            if (existingResultIndex > -1) {
                hasUpdatedResourceLists = true
                resourceLists[queryKey] = {
                    ...resourceState.resourceLists[queryKey],
                    result: [
                        ...resourceState.resourceLists[queryKey].result.slice(
                            0,
                            existingResultIndex
                        ),
                        ...resourceState.resourceLists[queryKey].result.slice(
                            existingResultIndex + 1
                        ),
                    ],
                }
                return resourceLists
            }
                // if the resourceLists havent changed, return the existing object
            resourceLists[queryKey] = state.resourceLists[queryKey]
            return resourceLists
        }, {})

        const newState = {
            ...state,
            [resource]: {
                ...resourceState,
                isFetching: false,
                selectedResource: (
                    resourceState.selectedResource === id ?
                        undefined :
                        resourceState.selectedResource
                ),
                resources: { ...resourceState.resources },
                errors: [],
                lastDeletedAt: timestamp,
                resourceLists: (
                    hasUpdatedResourceLists ? newResourceLists : resourceState.resourceLists
                ),
            },
        }
        delete newState[resource].resources[id]
        return newState
    }
    case DELETE_RESOURCE_REQUEST_ERROR: {
        const newResource = { ...resourceState.resources[id] }
        delete newResource.isDeleting

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

export default deleteResourceReducer
