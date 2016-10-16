import {
    mockStore,
    normalizer,
    RESOURCE_REDUCER,
    RESOURCE,
    RESOURCE_ID,
    INITIAL_STATE,
    INITIAL_STATE_WITH_CACHED_RESOURCE,
    QUERY,
    RESOURCE_UPDATE_PAYLOAD,
    formatErrors,
} from '../mocks'
import createResource from './createResource'
import deleteResource from './deleteResource'
import listResource from './listResource'
import partialUpdateResource from './partialUpdateResource'
import updateResource from './updateResource'
import retrieveResource from './retrieveResource'

const generateCreateResourceActions = async ({ request, initialState, ...options }) => {
    const store = mockStore(initialState)
    const { createMockResources } = createResource({
        resource: RESOURCE_REDUCER,
        normalizer,
        request,
        formatErrors,
    })
    await store.dispatch(createMockResources(RESOURCE, options))
    return store.getActions()
}

const generateDeleteResourceActions = async ({ request, initialState, ...options }) => {
    const store = mockStore(initialState || INITIAL_STATE)
    const { deleteMockResources } = deleteResource({
        resource: RESOURCE_REDUCER,
        request,
        formatErrors,
    })
    await store.dispatch(deleteMockResources(RESOURCE_ID, options))
    return store.getActions()
}

const generateListResourceActions = async ({ request, initialState, ...options }) => {
    const store = mockStore(initialState || INITIAL_STATE)
    const { listMockResources } = listResource({
        resource: RESOURCE_REDUCER,
        request,
        normalizer,
        formatErrors,
    })
    await store.dispatch(listMockResources(QUERY, options))
    return store.getActions()
}

const generateRetrieveResourceActions = async ({ request, initialState, ...options }) => {
    const store = mockStore(initialState || INITIAL_STATE)
    const { retrieveMockResources } = retrieveResource({
        resource: RESOURCE_REDUCER,
        request,
        normalizer,
        formatErrors,
    })
    await store.dispatch(retrieveMockResources(RESOURCE_ID, options))
    return store.getActions()
}

const generatePartialUpdateResourceActions = async ({ request, initialState, ...options }) => {
    const store = mockStore(initialState || INITIAL_STATE_WITH_CACHED_RESOURCE)
    const { partialUpdateMockResources } = partialUpdateResource({
        resource: RESOURCE_REDUCER,
        request,
        normalizer,
        formatErrors,
    })
    await store.dispatch(partialUpdateMockResources(RESOURCE_ID, RESOURCE_UPDATE_PAYLOAD, options))
    return store.getActions()
}

const generateUpdateResourceActions = async ({ request, initialState, ...options }) => {
    const store = mockStore(initialState || INITIAL_STATE_WITH_CACHED_RESOURCE)
    const { updateMockResources } = updateResource({
        resource: RESOURCE_REDUCER,
        request,
        normalizer,
        formatErrors,
    })
    const body = { ...RESOURCE, ...RESOURCE_UPDATE_PAYLOAD }
    await store.dispatch(updateMockResources(RESOURCE_ID, body, options))
    return store.getActions()
}

module.exports = {
    generateCreateResourceActions,
    generateDeleteResourceActions,
    generateListResourceActions,
    generateRetrieveResourceActions,
    generatePartialUpdateResourceActions,
    generateUpdateResourceActions,
}
