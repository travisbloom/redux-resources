import { RESOURCE, SERVER_ERRORS } from '../mocks'
import { generateCreateResourceActions } from './mocks'

const request = () => Promise.resolve(RESOURCE)
const errorRequest = () => Promise.reject(SERVER_ERRORS)

it('will dispatch two actions on success', async () => {
    const actions = await generateCreateResourceActions({ request })
    expect(actions.length).toBe(2)
})

it('will dispatch two actions on error', async () => {
    const actions = await generateCreateResourceActions({ request: errorRequest })
    expect(actions.length).toBe(2)
})

it('will have an initial action', async () => {
    const [inititalAction] = await generateCreateResourceActions({ request })
    expect(inititalAction).toMatchSnapshot()
})

it('will have a success action', async () => {
    const [_, successAction] = await generateCreateResourceActions({ request })
    expect(successAction).toMatchSnapshot()
})

it('will have a error action', async () => {
    const [_, errorAction] = await generateCreateResourceActions({ request: errorRequest })
    expect(errorAction).toMatchSnapshot()
})
