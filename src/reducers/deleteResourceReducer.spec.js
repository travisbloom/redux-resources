import {
    RESOURCE,
    SERVER_ERRORS,
    INITIAL_STATE_WITH_CACHED_RESOURCE_AND_CACHED_RESOURCE_LIST,
} from '../mocks'
import { generateDeleteResourceActions } from '../actions/mocks'
import deleteResourceReducer from './deleteResourceReducer'

const initialState = (
    INITIAL_STATE_WITH_CACHED_RESOURCE_AND_CACHED_RESOURCE_LIST.resources
)

it('will update the state after the initial action', async () => {
    const [initialAction] = await generateDeleteResourceActions({
        request: () => Promise.resolve(RESOURCE),
    })
    expect(deleteResourceReducer(initialState, initialAction)).toMatchSnapshot()
})

it('will update the state after the success action', async () => {
    const [initialAction, successAction] = await generateDeleteResourceActions({
        request: () => Promise.resolve(RESOURCE),
    })
    const stateAfterInititalAction = deleteResourceReducer(initialState, initialAction)
    expect(deleteResourceReducer(stateAfterInititalAction, successAction)).toMatchSnapshot()
})

it('will update the state after the error action', async () => {
    const [initialAction, errorAction] = await generateDeleteResourceActions({
        request: () => Promise.reject(SERVER_ERRORS),
    })
    const stateAfterInititalAction = deleteResourceReducer(initialState, initialAction)
    expect(deleteResourceReducer(stateAfterInititalAction, errorAction)).toMatchSnapshot()
})
