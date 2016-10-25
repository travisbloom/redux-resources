import {
    INITIAL_STATE_WITH_CACHED_RESOURCE_AND_CACHED_RESOURCE_LIST,
    QUERY_STRING,
    RESOURCE_REDUCER,
} from '../mocks'

import { selectAndDenormalizeResourceList } from './'

it('will update the state after the success action', async () => {
    const selector = selectAndDenormalizeResourceList(RESOURCE_REDUCER)
    expect(selector(
        INITIAL_STATE_WITH_CACHED_RESOURCE_AND_CACHED_RESOURCE_LIST,
        QUERY_STRING
    )).toMatchSnapshot()
})
