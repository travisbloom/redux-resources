import {
    DELETE_RESOURCE_REQUEST,
    DELETE_RESOURCE_REQUEST_SUCCESS,
    DELETE_RESOURCE_REQUEST_ERROR,
} from '../constants'

export default function deleteResourceReducer(state, action) {
    const { meta, payload } = action
    const { timestamp, reduxResourcesActionType } = meta
    const id = action.payload
    switch (reduxResourcesActionType) {
    case DELETE_RESOURCE_REQUEST:
        return {
            ...state,
            isFetching: true,
            resources: {
                ...state.resources,
                [id]: {
                    ...state.resources[id],
                    isDeleting: true,
                },
            },
        }
    case DELETE_RESOURCE_REQUEST_SUCCESS: {
        let hasUpdatedResourceLists = false
        const resourceListKeys = Object.keys(state.resourceLists)
            // determine what collections contain the deleted resource and remove it from them
        const newResourceLists = resourceListKeys.reduce((resourceLists, queryKey) => {
            if (state.resourceLists[queryKey].result) {
                const existingResultIndex = state.resourceLists[queryKey].result.indexOf(id)
                if (existingResultIndex > -1) {
                    hasUpdatedResourceLists = true
                    resourceLists[queryKey] = {
                        ...state.resourceLists[queryKey],
                        result: [
                            ...state.resourceLists[queryKey].result.slice(0, existingResultIndex),
                            ...state.resourceLists[queryKey].result.slice(existingResultIndex + 1),
                        ],
                        count: state.resourceLists[queryKey].count - 1,
                    }
                    return resourceLists
                }
            }
                // if the resourceLists havent changed, return the existing object
            resourceLists[queryKey] = state.resourceLists[queryKey]
            return resourceLists
        }, {})

        const newState = {
            ...state,
            isFetching: false,
            selectedResource: state.selectedResource === id ? undefined : state.selectedResource,
            resources: { ...state.resources },
            errors: [],
            lastDeletedAt: timestamp,
            resourceLists: hasUpdatedResourceLists ? newResourceLists : state.resourceLists,
        }
        delete newState.resources[id]
        return newState
    }
    case DELETE_RESOURCE_REQUEST_ERROR: {
        const newResource = { ...state.resources[id] }
        delete newResource.isDeleting
        return {
            ...state,
            isFetching: false,
            errors: [
                ...state.errors,
                ...payload,
            ],
            resources: {
                ...state.resources,
                [id]: newResource,
            },
        }
    }
    }
}
