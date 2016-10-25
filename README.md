# Redux Resources

[![Build Status](https://travis-ci.org/travisbloom/redux-resources.svg?branch=master)](https://travis-ci.org/travisbloom/redux-resources)


### An opinionated, yet extendable, set of redux action creators and reducers that simplify creating, reading, updating, and deleting remote resources. Redux Resources takes the boilerplate out of managing your api cache.

## The Gist
Redux Resources gives you a set of functions, (`retrieveResource`, `listResource`, `createResource`, `updateResource`, `partialUpdateResource`, `deleteResource`), that return action creators and their respective action type constants that can be used to interact with remote resources. These methods accept a configuration object that lets you define the name of the resource and how it should be interacted with (how to fetch, normalize, what to do with errors, etc).

All action creators use redux-thunk to trigger one to many actions, based on your state tree. In general, an initial action will be triggered to set your state tree to "isFetching" and a following action will be triggered that adds any changes to the targeted resources. Errors will also trigger an action to remove the isFetching state and add any formatted Errors to that resources state.


Before getting started, make sure you have redux-thunk added in your redux middleware:
```javascript
import {configureStore} from 'redux'
import thunk from 'redux-thunk'

const middleware = [thunk]
const store = configureStore(middleware)
```

Then, in your root reducer file add:
```javascript
import {resourcesReducer} from 'redux-resources'

const rootReducer = combineReducers({
    //your other reducers...

    /*
    resourcesReducer expects a reducer with a series of properties that represent the names of all the
    resources you'll be interacting with. These reducers will generally just return state unless you'd
    like to layer any additional business logic on to the reducer that should occur when actions are triggered
    */
    resources: resourcesReducer(
        combineReducers({
            //make sure the initialState is set to getResourceInitialState()
            exampleResource: (state = getResourceInitialState(), action) => state
        })
    )
})
```

In your actions file, call retrieveResource with some config to get back the `retrieveExampleResource` action creator and it's action type constants:
```javascript
import {retrieveResource} from 'redux-resources'

export const {
    RETRIEVE_EXAMPLE_RESOURCE_REQUEST,
    RETRIEVE_EXAMPLE_RESOURCE_REQUEST_SUCCESS,
    RETRIEVE_EXAMPLE_RESOURCE_REQUEST_ERROR,
    retrieveExampleResource
} = retrieveResource({
    resource: 'exampleResource',
    request: (id, options) => fetch(`/yourAPI/exampleResource/${id}`),
    normalizer: normalizeExampleResource,
    formatErrors: (response) => transformErrorResponse(response)
})
```

Now, call `retrieveExampleResource` with an ID
```javascript
import {retrieveExampleResource} from './path/to/actionCreator'

dispatch(retrieveExampleResource('aResourceId'))
```

and after the request has complete, your state tree will look like:
```javascript
{
    //your existing state...

    resources: {
        exampleResource: {
            selectedResource: 'aResourceId',
            selectedResourceList: null,
            resources: {
                'aResourceId': {/* whatever was returned by the API */}
            },
            resourceLists: {},
            resourcesBeingFetched: [],
            resourceListsBeingFetched: [],
            errors: [],
            isFetching: false,
            lastListedAt: null,
            lastRetrievedAt: '2016-10-16T22:51:48.473Z',
            lastDeletedAt: null,
            lastCreatedAt: null,
            lastUpdatedAt: null,
        }
    }
}
```

To use that returned resource, use one of the included selectors:
```javascript
import {selectResource} from 'redux-resources'
import {connect} from 'redux-react'

const SomeComponent = ({exampleResource}) => (
    //render JSX
)

const mapStateToProps = (state, {idPassedInProps}) => ({
    exampleResource: selectResource(state, 'exampleResource', idPassedInProps)
})

export default connect(mapStateToProps)(SomeComponent)
```

## Installation

To install:
```
npm install --save redux-resources
```

This library uses a set of peer dependencies that have been widely adopted by the redux community:
* [redux](https://github.com/reactjs/redux)
* [redux-thunk](https://github.com/gaearon/redux-thunk)
* [normalizr](https://github.com/paularmstrong/normalizr)
* [reselect](https://github.com/reactjs/reselect)

## API Reference
*Note:* You can see snapshot examples of [actions](https://github.com/travisbloom/redux-resources/tree/master/src/actions/__snapshots__) triggered by redux resource generated action creators and the resulting [reducer states](https://github.com/travisbloom/redux-resources/tree/master/src/reducers/__snapshots__).

### Action Functions
All redux-resources action functions accept a single config object as it's only param. The response will always be an action creator with the camelCased name, "action type" + "capitalized resource". Action type constants follow a similar uppercased naming schema:
```javascript
//some examples of the returned action creator/constants

const {
    RETRIEVE_FOOBAR_REQUEST,
    RETRIEVE_FOOBAR_REQUEST_SUCCESS,
    RETRIEVE_FOOBAR_REQUEST_ERROR,
    retrieveFoobar
} = retrieveResource({
    resource: 'foobar',
    ...additonalConfigProperties
})

const {
    UPDATE_SOME_WEIRD_NAME_REQUEST,
    UPDATE_SOME_WEIRD_NAME_REQUEST_SUCCESS,
    UPDATE_SOME_WEIRD_NAME_REQUEST_ERROR,
    updateSomeWeirdName
} = updateResource({
    resource: 'someWeirdName',
    ...additonalConfigProperties
})
```

There are also a set of common config properties that must be passed to all of Redux Resource's action functions:
```javascript
createResource({
    /*
    the name of the resource your interacting with. Should match the names used
    in other parts of the codebase (for example, the normalizr Schema key)
    */
    resource: 'exampleResource',
    /*
    the normalizer function that will be used on this resource. It is suggested you use the excellent
    normalizr library but as long as function returns an object with {entities, result}, it will work
    */
    normalizer: (response) => normalize(response, someNormalizrSchema),
    /*
    request is a function that returns a Promise. The parameters passed to request vary between the
    different actions, but the last param will always be an options object that includes any metadata
    passed to the called action creator as well as dispatch and getState. This allows users to pass any
    params needed by custom business logic that occurs in the request fn. The only requirement is the
    promise resolve with the payload that should be passed in to the normalizer function
    */
    request: (payload, options) => fetch('yourAPI/exampleResource').then((response) => {
        const {getState, dispatch, someMetadataPropertyPassed} = options;
        if (someBusinessLogicFn(getState())) {
            return response
        } else if (someMetadataPropertyPassed) {
            return transformResponse(response)
        }
        return dispatch(someOtherAction(response)).then(() => response)
    }),
    /*
    The function that should be used to format any returned server errors. should return an array
    */
    formatErrors: (response) => myCustomErrorFormattingFn(response)
})
```

#### `createResource(configObject)`
Returns an action creator used to create a new resource:
```javascript
const {
    CREATE_EXAMPLE_RESOURCE_REQUEST,
    CREATE_EXAMPLE_RESOURCE_REQUEST_SUCCESS,
    CREATE_EXAMPLE_RESOURCE_REQUEST_ERROR,
    createExampleResource
} = createResource({
    resource: 'exampleResource',
    formatErrors: someFormattingFn,
    normalizer: someNormalizerFn,
    request: (payload, options) => somePOSTRequest(payload)
})

//action creator has one param before the options object, the payload of the create resource request
const payload = {newField: 'newField', anotherNewField: 'anotherNewField'}
retrieveExampleResource(payload, options)
```

#### `retrieveResource(configObject)`
Returns an action creator used to retrieves a single resource. This action creator will only fetch the resource if it doesn't already exist within the client cache (see isCachedFn below). If the resource does exist and is not the current `selectedResource`, trigger the `SELECT_RESOURCE` action:
```javascript
const {
    RETRIEVE_EXAMPLE_RESOURCE_REQUEST,
    RETRIEVE_EXAMPLE_RESOURCE_REQUEST_SUCCESS,
    RETRIEVE_EXAMPLE_RESOURCE_REQUEST_ERROR,
    SELECT_EXAMPLE_RESOURCE,
    retrieveExampleResource
} = createResource({
    resource: 'exampleResource',
    formatErrors: someFormattingFn,
    normalizer: someNormalizerFn,
    /*
    function used to determine if the resource being requested already exists. Defaults to the fn below
    @param {previousResource} - the resource that current exists with that ID
    @param {id} - the id of the requested resource
    @param {options} - same options object passed to the request fn
    */
    isCachedFn: (previousResource, id, options) => !!previousResource
    //request has one param before the options object, the id of the resource being requested
    request: (id, options) => someGETRequest(id)
})

//action creator has one param before the options object, the id of the requested resource
retrieveExampleResource('aResourceId')

/*
retrieveResource action creators also accept a shouldIgnoreCache prop that can be passed in to options.
if passed, the resource will be fetched and updated even if it already exists in the redux state
*/
retrieveExampleResource('aResourceId', {shouldIgnoreCache: true})
```

#### `listResource(configObject)`
Returns an action creator used to retrieves a list of resources. This action creator accepts a query object as it's only param other than the options object and will only fetch the list of resources if the set matching the passed query params doesn't already exist within the client cache (see isCachedFn below). If the list does exist and is not the current `selectedResourceList`, trigger the `SELECT_RESOURCE` action:
```javascript
const {
    LIST_EXAMPLE_RESOURCE_REQUEST,
    LIST_EXAMPLE_RESOURCE_REQUEST_SUCCESS,
    LIST_EXAMPLE_RESOURCE_REQUEST_ERROR,
    SELECT_EXAMPLE_RESOURCE_LIST,
    listExampleResource
} = listResource({
    resource: 'exampleResource',
    formatErrors: someFormattingFn,
    normalizer: someNormalizerFn,
    /*
    by default, redux-resources will stringify the passed query object and use that to represent the
    primary key of the list. If you'd like to use a different function to handle that serialization, pass
    the fn below in to the config
    */
    stringifyQueryFn: (query) => customeStringifyFn(query),
    /*
    function used to determine if the list being requested already exists. Defaults to the fn below
    @param {previousList} - the list that current exists with that ID
    @param {query} - the query passed to the action creator
    @param {options} - same options object passed to the request fn
    */
    isCachedFn: (previousList, query, options) => !!previousList
    //request has one param before the options object, the id of the resource being requested
    request: (query, options) => someGETRequest(querystring.stringify(query))
})

const exampleQuery = {limit: 30, offset: 0, status: 'active'}
//action creator has one param before the options object, the query of the requested list
listExampleResource(exampleQuery)

/*
similar to retrieveResource, you can pass a shouldIgnoreCache prop within the options object. if passed,
the list will be fetched and updated even if it already exists in the redux state
*/
listExampleResource(exampleQuery, {shouldIgnoreCache: true})
```

#### `updateResource(configObject)` and `partialUpdateResource(configObject)`
Both return an action creator used to update a given resource. The difference is whether the payload includes only the updated fields or the entire new resource (PATCH vs. PUT in most RESTful APIs):
```javascript
const {
    PARTIAL_UPDATE_EXAMPLE_RESOURCE_REQUEST,
    PARTIAL_UPDATE_EXAMPLE_RESOURCE_REQUEST_SUCCESS,
    PARTIAL_UPDATE_EXAMPLE_RESOURCE_REQUEST_ERROR,
    partialUpdateExampleResource
} = updateResource({
    resource: 'exampleResource',
    formatErrors: someFormattingFn,
    normalizer: someNormalizerFn,
    //request has two params before the options object, the id of the resource being updated and the payload of the request
    request: (id, payload, options) => somePUTRequest(id, payload)
})

const payload = {someField: 'field being updated'}
partialUpdateExampleResource('someId', payload)

/*
both action creators also accept an option isOptimisticUpdate property in the options object. When
passed, the `PARTIAL_UPDATE_RESOURCE_REQUEST_SUCCESS` action triggers immediately with the new info and
if an error is returned, `PARTIAL_UPDATE_RESOURCE_REQUEST_ERROR` will revert the changes in addition to
setting any errors
*/
partialUpdateExampleResource('someId', payload, {isOptimisticUpdate: true})
```

#### `deleteResource(configObject)`
Returns an action creator used to deletes a resource. This action creator accepts id of the resource being deleted:
```javascript
const {
    DELETE_EXAMPLE_RESOURCE_REQUEST,
    DELETE_EXAMPLE_RESOURCE_REQUEST_SUCCESS,
    DELETE_EXAMPLE_RESOURCE_REQUEST_ERROR,
    deleteExampleResource
} = deleteResource({
    resource: 'exampleResource',
    formatErrors: someFormattingFn,
    //request has one param before the options object, the id of the resource being requested
    request: (id, options) => someDELETERequest(id)
})

//action creator has one param before the options object, the query of the requested list
listExampleResource('exampleId')
```

## Extending Redux Resources functionality
The library builds on top of redux but purposely plays nice with any other existing business logic you would like to add.

Reducers that you pass to `resourcesReducer` must have all the fields in `getResourceInitialState`, but you can layer on anything else you'd like:
```javascript
const initialState = {
    ...getResourceInitialState(),
    customReducerProperty: null
}
const exampleResourceReducer = (state = initialState, action) => state
```

And just like normal redux reducers, you can respond to any dispatched redux resource action
```javascript
const exampleResourceReducer = (state = initialState, action) => {
    switch(action.type) {
        case(RETRIEVE_SOME_OTHER_RESOURCE_REQUEST):
            return {
                ...state,
                customReducerProperty: action.meta.id
            }
            default: return state
    }
}
```
