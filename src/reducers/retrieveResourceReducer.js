import {
    GET_RESOURCE_REQUEST,
    GET_RESOURCE_REQUEST_SUCCESS,
    GET_RESOURCE_REQUEST_ERROR,
    UPDATE_SELECTED_RESOURCE,
} from '../actions'
import { removeFromArray, addToArray } from '../utilities'

export default function getResourceReducer(state, action) {
    const { payload, meta } = action
    const { timestamp, reduxResourcesActionType, normalizedResponse } = meta
    switch (reduxResourcesActionType) {
    case UPDATE_SELECTED_RESOURCE:
        return {
            ...state,
            selectedResource: meta.id,
        }

    case GET_RESOURCE_REQUEST:
        return {
            ...state,
            selectedResource: meta.id,
            resourcesBeingFetched: addToArray(meta.id, state.resourcesBeingFetched),
            isFetching: true,
        }

    case GET_RESOURCE_REQUEST_ERROR:
        return {
            ...state,
            isFetching: false,
            resourcesBeingFetched: removeFromArray(meta.id, state.resourcesBeingFetched),
            errors: [
                ...state.errors,
                ...payload,
            ],
        }

    case GET_RESOURCE_REQUEST_SUCCESS: {
        const { entities } = normalizedResponse
        return {
            ...state,
            isFetching: false,
            errors: [],
            lastRetrievedAt: timestamp,
            resourcesBeingFetched: removeFromArray(meta.id, state.resourcesBeingFetched),
            resources: {
                ...state.resources,
                ...entities[meta.resource],
            },
        }
    }
    }
}
