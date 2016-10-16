import {
    RESOURCE,
    SERVER_ERRORS,
    INITIAL_STATE_WITH_CACHED_LIST,
    INITIAL_STATE_WITH_LIST_BEING_FETCHED,
    INITIAL_STATE_WITH_CACHED_AND_SELECTED_LIST,
} from '../mocks'
import { generateListResourceActions } from './mocks'

const request = () => Promise.resolve([RESOURCE])
const errorRequest = () => Promise.reject(SERVER_ERRORS)

it('will dispatch two actions on success', async () => {
    const actions = await generateListResourceActions({ request })
    expect(actions.length).toBe(2)
})

it('will dispatch two actions on error', async () => {
    const actions = await generateListResourceActions({ request: errorRequest })
    expect(actions.length).toBe(2)
})

it('will dispatch one action if the list is cached but not selected', async () => {
    const actions = await generateListResourceActions({
        request: errorRequest,
        initialState: INITIAL_STATE_WITH_CACHED_LIST,
    })
    expect(actions.length).toBe(1)
})

it('will dispatch two action if the list is cached but shouldIgnoreCache is passed', async () => {
    const actions = await generateListResourceActions({
        request: errorRequest,
        shouldIgnoreCache: true,
        initialState: INITIAL_STATE_WITH_CACHED_LIST,
    })
    expect(actions.length).toBe(2)
})

it('will dispatch no actions if the list is cached and selected', async () => {
    const actions = await generateListResourceActions({
        request: errorRequest,
        initialState: INITIAL_STATE_WITH_CACHED_AND_SELECTED_LIST,
    })
    expect(actions.length).toBe(0)
})

it('will dispatch no actions if the list is being fetched', async () => {
    const actions = await generateListResourceActions({
        request: errorRequest,
        initialState: INITIAL_STATE_WITH_LIST_BEING_FETCHED,
    })
    expect(actions.length).toBe(0)
})

it('will have a update selectedResourceList action', async () => {
    const [inititalAction] = await generateListResourceActions({
        request: errorRequest,
        initialState: INITIAL_STATE_WITH_CACHED_LIST,
    })
    expect(inititalAction).toMatchSnapshot()
})

it('will have an initial action', async () => {
    const [inititalAction] = await generateListResourceActions({ request })
    expect(inititalAction).toMatchSnapshot()
})

it('will have a success action', async () => {
    const [_, successAction] = await generateListResourceActions({ request })
    expect(successAction).toMatchSnapshot()
})

it('will have a error action', async () => {
    const [_, errorAction] = await generateListResourceActions({ request: errorRequest })
    expect(errorAction).toMatchSnapshot()
})
