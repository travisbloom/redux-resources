import { RESOURCE, SERVER_ERRORS, INITIAL_STATE } from '../mocks'
import { generateRetrieveResourceActions } from '../actions/mocks'

import retrieveResourceReducer from './retrieveResourceReducer'

const initialState = INITIAL_STATE.resources

it('will update the state after the initial action', async () => {
    const [initialAction] = await generateRetrieveResourceActions({
        request: () => Promise.resolve([RESOURCE]),
    })
    expect(retrieveResourceReducer(initialState, initialAction)).toMatchSnapshot()
})

it('will update the state after the success action', async () => {
    const [initialAction, successAction] = await generateRetrieveResourceActions({
        request: () => Promise.resolve([RESOURCE]),
    })
    const stateAfterInititalAction = retrieveResourceReducer(
        initialState,
        initialAction
    )
    expect(retrieveResourceReducer(stateAfterInititalAction, successAction)).toMatchSnapshot()
})

it('will update the state after the error action', async () => {
    const [initialAction, errorAction] = await generateRetrieveResourceActions({
        request: () => Promise.reject(SERVER_ERRORS),
    })
    const stateAfterInititalAction = retrieveResourceReducer(
        initialState,
        initialAction
    )
    expect(retrieveResourceReducer(stateAfterInititalAction, errorAction)).toMatchSnapshot()
})
