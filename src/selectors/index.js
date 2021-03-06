import { createSelector } from 'reselect'

const selectResourceList = (state, resource, listKey) => (
    state.resources[resource].resourceLists[listKey]
)
const selectSelectedResourceList = (state, resource) => (
    state.resources[resource].selectedResourceList
)
const selectResourceListsBeingFetched = (state, resource) => (
    state.resources[resource].resourceListsBeingFetched
)

const selectResource = (state, resource, id) => (
    state.resources[resource].resources[id]
)
const selectSelectedResource = (state, resource) => (
    state.resources[resource].selectedResource
)
const selectResourcesBeingFetched = (state, resource) => (
    state.resources[resource].resourcesBeingFetched
)

const selectAndDenormalizeResourceList = resource => createSelector(
    (state, listKey) => selectResourceList(state, resource, listKey),
    state => state.resources[resource].resources,
    (resourceList, resources) => resourceList.result.map(id => resources[id])
)

module.exports = {
    selectResourceList,
    selectSelectedResourceList,
    selectResourceListsBeingFetched,
    selectResource,
    selectSelectedResource,
    selectResourcesBeingFetched,
    selectAndDenormalizeResourceList,
}
