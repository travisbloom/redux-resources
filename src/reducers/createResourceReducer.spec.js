import { RESOURCE, SERVER_ERRORS } from '../mocks'
import { generateCreateResourceActions } from '../actions/mocks'
import { snap } from '../tests'

import { getResourceInitialState } from './'
import createResourceReducer from './createResourceReducer'

it('will update the state after the initial action', async () => {
    const [initialAction] = await generateCreateResourceActions({
        request: () => Promise.resolve(RESOURCE),
    })
    snap(createResourceReducer(getResourceInitialState(), initialAction))
})

it('will update the state after the success action', async () => {
    const [initialAction, successAction] = await generateCreateResourceActions({
        request: () => Promise.resolve(RESOURCE),
    })
    const stateAfterInititalAction = createResourceReducer(getResourceInitialState(), initialAction)
    snap(createResourceReducer(stateAfterInititalAction, successAction))
})

it('will update the state after the error action', async () => {
    const [initialAction, errorAction] = await generateCreateResourceActions({
        request: () => Promise.reject(SERVER_ERRORS),
    })
    const stateAfterInititalAction = createResourceReducer(getResourceInitialState(), initialAction)
    snap(createResourceReducer(stateAfterInititalAction, errorAction))
})
