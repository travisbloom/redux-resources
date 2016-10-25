import {
    createResource,
    listResource,
    retrieveResource,
    updateResource,
    deleteResource,
} from './actions'

import {
    getResourceInitialState,
    resourcesReducer,
} from './reducers'

import { serializeOrderedQuery } from './utilities'

import {
    selectResourceList,
    selectSelectedResourceList,
    selectResourceListsBeingFetched,
    selectResource,
    selectSelectedResource,
    selectResourcesBeingFetched,
    selectAndDenormalizeResourceList,
 } from './selectors'

module.exports = {
    createResource,
    listResource,
    retrieveResource,
    updateResource,
    deleteResource,

    getResourceInitialState,
    resourcesReducer,

    selectResourceList,
    selectSelectedResourceList,
    selectResourceListsBeingFetched,
    selectResource,
    selectSelectedResource,
    selectResourcesBeingFetched,
    selectAndDenormalizeResourceList,

    serializeOrderedQuery,
}
