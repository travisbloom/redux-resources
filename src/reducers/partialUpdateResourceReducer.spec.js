import {
    RESOURCE,
    SERVER_ERRORS,
    INITIAL_STATE_WITH_CACHED_RESOURCE,
    RESOURCE_UPDATE_PAYLOAD,
} from '../mocks'
import { generatePartialUpdateResourceActions } from '../actions/mocks'

import partialUpdateResourceReducer from './partialUpdateResourceReducer'

const request = () => Promise.resolve({ ...RESOURCE, ...RESOURCE_UPDATE_PAYLOAD })
const errorRequest = () => Promise.reject(SERVER_ERRORS)

const initialState = (
    INITIAL_STATE_WITH_CACHED_RESOURCE.resources
)

it('will update the state after the initial action', async () => {
    const [initialAction] = await generatePartialUpdateResourceActions({
        request,
    })
    const stateAfterInititalAction = partialUpdateResourceReducer(
        initialState,
        initialAction
    )
    expect(stateAfterInititalAction).toMatchSnapshot()
})

it('will update the state after the success action', async () => {
    const [initialAction, successAction] = await generatePartialUpdateResourceActions({
        request,
    })
    const stateAfterInititalAction = partialUpdateResourceReducer(
        initialState,
        initialAction
    )
    expect(partialUpdateResourceReducer(stateAfterInititalAction, successAction)).toMatchSnapshot()
})

it('will update the state after the error action', async () => {
    const [initialAction, errorAction] = await generatePartialUpdateResourceActions({
        request: errorRequest,
    })
    const stateAfterInititalAction = partialUpdateResourceReducer(
        initialState,
        initialAction
    )
    expect(partialUpdateResourceReducer(stateAfterInititalAction, errorAction)).toMatchSnapshot()
})

it('will update the state after the error action on an optimistic update', async () => {
    const [initialAction, errorAction] = await generatePartialUpdateResourceActions({
        request: errorRequest,
        isOptimisticUpdate: true,
    })
    const stateAfterInititalAction = partialUpdateResourceReducer(
        initialState,
        initialAction
    )
    expect(partialUpdateResourceReducer(stateAfterInititalAction, errorAction)).toMatchSnapshot()
})
