import {
    createResource,
    listResource,
    retrieveResource,
    updateResource,
    deleteResource,
} from './src/actions'

import {
    getResourceInitialState,
    resourcesReducer,
} from './src/reducers'

module.exports = {
    createResource,
    listResource,
    retrieveResource,
    updateResource,
    deleteResource,

    getResourceInitialState,
    resourcesReducer,
}
