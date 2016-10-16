import {
    RESOURCE,
    SERVER_ERRORS,
    INITIAL_STATE_WITH_CACHED_RESOURCE,
    INITIAL_STATE_WITH_RESOURCE_BEING_FETCHED,
    INITIAL_STATE_WITH_CACHED_AND_SELECTED_RESOURCE,
} from '../mocks'
import { generateRetrieveResourceActions } from './mocks'

const request = () => Promise.resolve(RESOURCE)
const errorRequest = () => Promise.reject(SERVER_ERRORS)

it('will dispatch two actions on success', async () => {
    const actions = await generateRetrieveResourceActions({ request })
    expect(actions.length).toBe(2)
})

it('will dispatch two actions on error', async () => {
    const actions = await generateRetrieveResourceActions({ request: errorRequest })
    expect(actions.length).toBe(2)
})

it('will dispatch one action if the resource is cached but not selected', async () => {
    const actions = await generateRetrieveResourceActions({
        request: errorRequest,
        initialState: INITIAL_STATE_WITH_CACHED_RESOURCE,
    })
    expect(actions.length).toBe(1)
})

it('will dispatch two action if the resource is cached but shouldIgnoreCache is passed', async () => {
    const actions = await generateRetrieveResourceActions({
        request: errorRequest,
        shouldIgnoreCache: true,
        initialState: INITIAL_STATE_WITH_CACHED_RESOURCE,
    })
    expect(actions.length).toBe(2)
})

it('will dispatch no actions if the resource is cached and selected', async () => {
    const actions = await generateRetrieveResourceActions({
        request: errorRequest,
        initialState: INITIAL_STATE_WITH_CACHED_AND_SELECTED_RESOURCE,
    })
    expect(actions.length).toBe(0)
})

it('will dispatch no actions if the resource is being fetched', async () => {
    const actions = await generateRetrieveResourceActions({
        request: errorRequest,
        initialState: INITIAL_STATE_WITH_RESOURCE_BEING_FETCHED,
    })
    expect(actions.length).toBe(0)
})

it('will have a update selectedResource action', async () => {
    const [inititalAction] = await generateRetrieveResourceActions({
        request: errorRequest,
        initialState: INITIAL_STATE_WITH_CACHED_RESOURCE,
    })
    expect(inititalAction).toMatchSnapshot()
})

it('will have an initial action', async () => {
    const [inititalAction] = await generateRetrieveResourceActions({ request })
    expect(inititalAction).toMatchSnapshot()
})

it('will have a success action', async () => {
    const [_, successAction] = await generateRetrieveResourceActions({ request })
    expect(successAction).toMatchSnapshot()
})

it('will have a error action', async () => {
    const [_, errorAction] = await generateRetrieveResourceActions({ request: errorRequest })
    expect(errorAction).toMatchSnapshot()
})
