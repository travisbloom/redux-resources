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

module.exports = {
    createResource,
    listResource,
    retrieveResource,
    updateResource,
    deleteResource,

    getResourceInitialState,
    resourcesReducer,
}
