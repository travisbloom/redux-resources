import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { Schema, normalize, arrayOf } from 'normalizr'

import { getResourceInitialState } from './reducers'

const RESOURCE_REDUCER = 'mockResources'
const RELATED_RESOURCE_REDUCER = 'relatedMockResources'

const RELATED_RESOURCE_ID = 'relatedResourceId'
const RELATED_RESOURCE = {
    id: RELATED_RESOURCE_ID,
    relatedProp1: 'initial relatedProp1',
}
const RESOURCE_ID = 'resourceId'
const RESOURCE = {
    id: RESOURCE_ID,
    prop1: 'initial prop1',
    prop2: 'initial prop2',
    relatedResource: RELATED_RESOURCE,
}
const NORMALIZED_RESOURCE = {
    id: RESOURCE_ID,
    prop1: 'initial prop1',
    prop2: 'initial prop2',
    relatedResource: RELATED_RESOURCE_ID,
}

const RESOURCE_UPDATE_PAYLOAD = {
    id: RESOURCE_ID,
    prop2: 'UPDATED PROP_1',
}

const SERVER_ERRORS = [
    'This is an initial error',
    'This is another error',
]

const QUERY = {
    limit: 30,
    offset: 0,
    someQueryParam: 'someValue',
}
const QUERY_STRING = 'key=30&key=0&key="someValue"'

const INITIAL_STATE = {
    resources: {
        [RELATED_RESOURCE_REDUCER]: getResourceInitialState(),
        [RESOURCE_REDUCER]: getResourceInitialState(),
    },
}
const INITIAL_STATE_WITH_LIST_BEING_FETCHED = {
    resources: {
        ...INITIAL_STATE.resources,
        [RESOURCE_REDUCER]: {
            ...INITIAL_STATE.resources[RESOURCE_REDUCER],
            resourceListsBeingFetched: [QUERY_STRING],
        },
    },
}
const INITIAL_STATE_WITH_CACHED_LIST = {
    resources: {
        ...INITIAL_STATE.resources,
        [RESOURCE_REDUCER]: {
            ...INITIAL_STATE.resources[RESOURCE_REDUCER],
            resourceLists: {
                [QUERY_STRING]: {
                    result: [RESOURCE_ID],
                },
            },
        },
    },
}
const INITIAL_STATE_WITH_CACHED_AND_SELECTED_LIST = {
    resources: {
        ...INITIAL_STATE_WITH_CACHED_LIST.resources,
        [RESOURCE_REDUCER]: {
            ...INITIAL_STATE_WITH_CACHED_LIST.resources[RESOURCE_REDUCER],
            selectedResourceList: QUERY_STRING,
        },
    },
}
const INITIAL_STATE_WITH_RESOURCE_BEING_FETCHED = {
    resources: {
        ...INITIAL_STATE.resources,
        [RESOURCE_REDUCER]: {
            ...INITIAL_STATE.resources[RESOURCE_REDUCER],
            resourcesBeingFetched: [RESOURCE_ID],
        },
    },
}
const INITIAL_STATE_WITH_CACHED_RESOURCE = {
    resources: {
        ...INITIAL_STATE.resources,
        [RESOURCE_REDUCER]: {
            ...INITIAL_STATE.resources[RESOURCE_REDUCER],
            resources: {
                [RESOURCE_ID]: NORMALIZED_RESOURCE,
            },
        },
    },
}
const INITIAL_STATE_WITH_CACHED_AND_SELECTED_RESOURCE = {
    resources: {
        ...INITIAL_STATE_WITH_CACHED_RESOURCE.resources,
        [RESOURCE_REDUCER]: {
            ...INITIAL_STATE_WITH_CACHED_RESOURCE.resources[RESOURCE_REDUCER],
            selectedResource: RESOURCE_ID,
        },
    },
}
const INITIAL_STATE_WITH_CACHED_RESOURCE_AND_CACHED_RESOURCE_LIST = {
    resources: {
        ...INITIAL_STATE.resources,
        [RESOURCE_REDUCER]: {
            ...INITIAL_STATE.resources[RESOURCE_REDUCER],
            resources: {
                [RESOURCE_ID]: NORMALIZED_RESOURCE,
            },
            resourceLists: {
                [QUERY_STRING]: {
                    result: [RESOURCE_ID],
                },
            },
        },
    },
}

const resourceSchema = new Schema(RESOURCE_REDUCER)
const relatedResourceSchema = new Schema(RELATED_RESOURCE_REDUCER)
resourceSchema.define({
    relatedResource: relatedResourceSchema,
})
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

    INITIAL_STATE,
    INITIAL_STATE_WITH_LIST_BEING_FETCHED,
    INITIAL_STATE_WITH_CACHED_LIST,
    INITIAL_STATE_WITH_CACHED_AND_SELECTED_LIST,
    INITIAL_STATE_WITH_RESOURCE_BEING_FETCHED,
    INITIAL_STATE_WITH_CACHED_RESOURCE,
    INITIAL_STATE_WITH_CACHED_AND_SELECTED_RESOURCE,
    INITIAL_STATE_WITH_CACHED_RESOURCE_AND_CACHED_RESOURCE_LIST,

    RESOURCE_UPDATE_PAYLOAD,

    SERVER_ERRORS,
    QUERY,
    QUERY_STRING,

    mockStore,
    formatErrors,
    normalizer,
}
