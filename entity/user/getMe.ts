import { CachedFunction } from '@utils/cachedFunction'
import { pb } from '@utils/db'

import { UsersResponse, ContentProvidersResponse } from '@/pocketbase-types'
import { assert } from '@utils/assert'

export const getMe = new CachedFunction(async () => {
    try {
        assert(pb.authStore.model)
        const myId = pb.authStore.model.id

        const me = await pb.collection('users').getOne<
            UsersResponse<
                string[],
                {
                    using_providers: ContentProvidersResponse[]
                }
            >
        >(myId, {
            expand: 'using_providers',
        })

        return me
    } catch (e) {
        location.href = '/login/index.html'
        throw e
    }
})
