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

module.exports = {
    getResourceInitialState,
}
