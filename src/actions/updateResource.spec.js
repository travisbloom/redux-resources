import {
    RESOURCE,
    SERVER_ERRORS,
    RESOURCE_UPDATE_PAYLOAD,
} from '../mocks'
import { generateUpdateResourceActions } from './mocks'

const request = () => Promise.resolve({ ...RESOURCE, ...RESOURCE_UPDATE_PAYLOAD })
const errorRequest = () => Promise.reject(SERVER_ERRORS)

it('will dispatch two actions on success', async () => {
    const actions = await generateUpdateResourceActions({ request })
    expect(actions.length).toBe(2)
})

it('will dispatch one action on success if its an optimistic update', async () => {
    const actions = await generateUpdateResourceActions({
        request,
        isOptimisticUpdate: true,
    })
    expect(actions.length).toBe(1)
})

it('will dispatch two actions on error', async () => {
    const actions = await generateUpdateResourceActions({ request: errorRequest })
    expect(actions.length).toBe(2)
})

it('will have an initial action', async () => {
    const [inititalAction] = await generateUpdateResourceActions({ request })
    expect(inititalAction).toMatchSnapshot()
})

it('will have a success action', async () => {
    const [_, successAction] = await generateUpdateResourceActions({ request })
    expect(successAction).toMatchSnapshot()
})

it('will have a error action', async () => {
    const [_, errorAction] = await generateUpdateResourceActions({ request: errorRequest })
    expect(errorAction).toMatchSnapshot()
})

it('will have a error action with previous info if its an optimistic update', async () => {
    const [_, errorAction] = await generateUpdateResourceActions({
        request: errorRequest,
        isOptimisticUpdate: true,
    })
    expect(errorAction).toMatchSnapshot()
})
