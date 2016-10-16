import { RESOURCE, SERVER_ERRORS } from '../mocks'
import { generateDeleteResourceActions } from './mocks'

const request = () => Promise.resolve(RESOURCE)
const errorRequest = () => Promise.reject(SERVER_ERRORS)

it('will dispatch two actions on success', async () => {
    const actions = await generateDeleteResourceActions({ request })
    expect(actions.length).toBe(2)
})

it('will dispatch two actions on error', async () => {
    const actions = await generateDeleteResourceActions({ request: errorRequest })
    expect(actions.length).toBe(2)
})

it('will have an initial action', async () => {
    const [inititalAction] = await generateDeleteResourceActions({ request })
    expect(inititalAction).toMatchSnapshot()
})

it('will have a success action', async () => {
    const [_, successAction] = await generateDeleteResourceActions({ request })
    expect(successAction).toMatchSnapshot()
})

it('will have a error action', async () => {
    const [_, errorAction] = await generateDeleteResourceActions({ request: errorRequest })
    expect(errorAction).toMatchSnapshot()
})
