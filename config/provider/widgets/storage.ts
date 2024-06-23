import { pb } from '@/utils/db'
import { User } from '@/entity/user'
import { Collections } from '@/pocketbase-types'
import { createSignal } from 'solid-js'

export const getAllProviders = () =>
    pb.collection(Collections.ContentProviders).getFullList()

export const [usingProviderIds, setUsingProviderIds] = createSignal<string[]>(
    (await User.getMe()).usingProviders.map((provider) => provider.id)
)
