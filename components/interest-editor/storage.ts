import { User } from '@/entity/user'
import { createResource } from 'solid-js'

const [interests, { mutate }] = createResource(getInterests)

async function getInterests() {
    const me = await User.getMe()
    const interests = me.interests || []

    return interests
}

export const interestsSignal = {
    get: interests,
    set: mutate,
}
