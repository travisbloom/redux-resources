import { mockStore, normalizer, RESOURCE_REDUCER, RESOURCE, formatErrors } from '../mocks'
import createResource from './createResource'

const generateCreateResourceActions = async ({ request }) => {
    const store = mockStore({})
    const { createResources } = createResource({
        resource: RESOURCE_REDUCER,
        normalizer,
        request,
        formatErrors,
    })
    await store.dispatch(createResources(RESOURCE))
    return store.getActions()
}

module.exports = {
    generateCreateResourceActions,
}
