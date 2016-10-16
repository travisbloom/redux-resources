import routeReduxResourceAction from './routeReduxResourceAction'

const getResourceInitialState = () => ({
    selectedResource: null,
    selectedResourceList: null,
    resources: {},
    resourceLists: {},
    resourcesBeingFetched: [],
    resourceListsBeingFetched: [],
    errors: [],
    isFetching: false,
    lastListedAt: null,
    lastRetrievedAt: null,
    lastDeletedAt: null,
    lastCreatedAt: null,
    lastUpdatedAt: null,
})

const generateResources = reducer => (state, action) => (
    reducer(routeReduxResourceAction(state, action))
)

module.exports = {
    getResourceInitialState,
    generateResources,
}
