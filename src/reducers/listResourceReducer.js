import {
    LIST_RESOURCE_REQUEST,
    LIST_RESOURCE_REQUEST_SUCCESS,
    LIST_RESOURCE_REQUEST_ERROR,
    SELECT_RESOURCE_LIST,
} from '../constants'
import { removeFromArray, addToArray } from '../utilities'

export default function getCollectionReducer(state, action) {
    const { payload, meta } = action
    const { query, queryString, resource, timestamp, reduxResourcesActionType, normalizedResponse } = meta
    switch (reduxResourcesActionType) {
    case SELECT_RESOURCE_LIST:
        return {
            ...state,
            selectedResourceList: queryString,
        }
    case LIST_RESOURCE_REQUEST:
        return {
            ...state,
            isFetching: true,
            selectedResourceList: queryString,
            resourceListsBeingFetched: addToArray(queryString, state.resourceListsBeingFetched),
        }
    case LIST_RESOURCE_REQUEST_ERROR:
        return {
            ...state,
            isFetching: false,
            resourceListsBeingFetched: removeFromArray(queryString, state.resourceListsBeingFetched),
            errors: [
                ...state.errors,
                ...payload,
            ],
        }
    case LIST_RESOURCE_REQUEST_SUCCESS: {
        const { entities, result } = normalizedResponse
        return {
            ...state,
            isFetching: false,
            resources: {
                ...state.resources,
                ...(entities[resource] || {}),
            },
            errors: [],
            resourceListsBeingFetched: removeFromArray(queryString, state.resourceListsBeingFetched),
            lastListedAt: timestamp,
            resourceLists: {
                ...state.resourceLists,
                [queryString]: {
                    result,
                    response: payload,
                    query,
                    queryString,
                },
            },
        }
    }
    }
}
