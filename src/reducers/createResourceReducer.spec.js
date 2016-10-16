import { RESOURCE, SERVER_ERRORS, INITIAL_STATE } from '../mocks'
import { generateCreateResourceActions } from '../actions/mocks'

import createResourceReducer from './createResourceReducer'

const initialState = INITIAL_STATE.resources

it('will update the state after the initial action', async () => {
    const [initialAction] = await generateCreateResourceActions({
        request: () => Promise.resolve(RESOURCE),
    })
    expect(createResourceReducer(initialState, initialAction)).toMatchSnapshot()
})

it('will update the state after the success action', async () => {
    const [initialAction, successAction] = await generateCreateResourceActions({
        request: () => Promise.resolve(RESOURCE),
    })
    const stateAfterInititalAction = createResourceReducer(initialState, initialAction)
    expect(createResourceReducer(stateAfterInititalAction, successAction)).toMatchSnapshot()
})

it('will update the state after the error action', async () => {
    const [initialAction, errorAction] = await generateCreateResourceActions({
        request: () => Promise.reject(SERVER_ERRORS),
    })
    const stateAfterInititalAction = createResourceReducer(initialState, initialAction)
    expect(createResourceReducer(stateAfterInititalAction, errorAction)).toMatchSnapshot()
})
