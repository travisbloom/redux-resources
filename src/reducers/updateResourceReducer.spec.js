import {
    RESOURCE_REDUCER,
    RESOURCE,
    SERVER_ERRORS,
    INITIAL_STATE_WITH_CACHED_RESOURCE,
    RESOURCE_UPDATE_PAYLOAD,
} from '../mocks'
import { generateUpdateResourceActions } from '../actions/mocks'

import updateResourceReducer from './updateResourceReducer'

const request = () => Promise.resolve({ ...RESOURCE, ...RESOURCE_UPDATE_PAYLOAD })
const errorRequest = () => Promise.reject(SERVER_ERRORS)

const initialState = (
    INITIAL_STATE_WITH_CACHED_RESOURCE.resources
)

it('will update the state after the initial action', async () => {
    const [initialAction] = await generateUpdateResourceActions({
        request,
    })
    const stateAfterInititalAction = updateResourceReducer(
        initialState,
        initialAction
    )
    expect(stateAfterInititalAction).toMatchSnapshot()
})

it('will update the state after the success action', async () => {
    const [initialAction, successAction] = await generateUpdateResourceActions({
        request,
    })
    const stateAfterInititalAction = updateResourceReducer(
        initialState,
        initialAction
    )
    expect(updateResourceReducer(stateAfterInititalAction, successAction)).toMatchSnapshot()
})

it('will update the state after the error action', async () => {
    const [initialAction, errorAction] = await generateUpdateResourceActions({
        request: errorRequest,
    })
    const stateAfterInititalAction = updateResourceReducer(
        initialState,
        initialAction
    )
    expect(updateResourceReducer(stateAfterInititalAction, errorAction)).toMatchSnapshot()
})

it('will update the state after the error action on an optimistic update', async () => {
    const [initialAction, errorAction] = await generateUpdateResourceActions({
        request: errorRequest,
        isOptimisticUpdate: true,
    })
    const stateAfterInititalAction = updateResourceReducer(
        initialState,
        initialAction
    )
    expect(updateResourceReducer(stateAfterInititalAction, errorAction)).toMatchSnapshot()
})
