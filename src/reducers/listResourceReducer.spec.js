import { RESOURCE, SERVER_ERRORS, INITIAL_STATE } from '../mocks'
import { generateListResourceActions } from '../actions/mocks'

import listResourceReducer from './listResourceReducer'

const initialState = INITIAL_STATE.resources

it('will update the state after the initial action', async () => {
    const [initialAction] = await generateListResourceActions({
        request: () => Promise.resolve([RESOURCE]),
    })
    expect(listResourceReducer(initialState, initialAction)).toMatchSnapshot()
})

it('will update the state after the success action', async () => {
    const [initialAction, successAction] = await generateListResourceActions({
        request: () => Promise.resolve([RESOURCE]),
    })
    const stateAfterInititalAction = listResourceReducer(initialState, initialAction)
    expect(listResourceReducer(stateAfterInititalAction, successAction)).toMatchSnapshot()
})

it('will update the state after the error action', async () => {
    const [initialAction, errorAction] = await generateListResourceActions({
        request: () => Promise.reject(SERVER_ERRORS),
    })
    const stateAfterInititalAction = listResourceReducer(initialState, initialAction)
    expect(listResourceReducer(stateAfterInititalAction, errorAction)).toMatchSnapshot()
})
