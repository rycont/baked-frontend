import { pb } from '@/utils/db'
import { User } from '@/entity/user'
import { Collections } from '@/pocketbase-types'

export async function useRSSProvider(providerId: string) {
    const me = await User.getMe()

    const newUsingProviders = [...me.usingProviders, providerId]

    await pb.collection(Collections.Users).update(me.id, {
        using_providers: newUsingProviders,
    })
}
