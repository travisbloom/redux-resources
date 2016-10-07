import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Schema, normalize, arrayOf } from 'normalizr'

const RESOURCE_REDUCER = 'resources'

const RESOURCE_ID = 'resourceId'
const RESOURCE = {
    id: RESOURCE_ID,
    prop1: 'initial prop1',
    prop2: 'initial prop2',
}

const RESOURCE_UPDATE_PAYLOAD = {
    id: RESOURCE_ID,
    prop1: 'updated prop1',
    prop2: 'updated prop1',
}

const SERVER_ERRORS = [
    'This is an initial error',
    'This is another error',
]

const resourceSchema = new Schema(RESOURCE_REDUCER)
const normalizer = (resources) => {
    const array = Array.isArray(resources) ? resources : [resources]
    return normalize(array, arrayOf(resourceSchema))
}
const formatErrors = errors => errors

const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

module.exports = {
    RESOURCE_REDUCER,
    RESOURCE_ID,
    RESOURCE,

    RESOURCE_UPDATE_PAYLOAD,

    SERVER_ERRORS,

    mockStore,
    formatErrors,
    normalizer,
}
