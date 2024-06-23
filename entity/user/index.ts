import { Provider } from '@/entity/provider'
import { getMe } from './getMe'
import { UsersReadingLevelOptions } from '@/pocketbase-types'

export class User {
    constructor(
        public id: string,
        public email: string,
        public interests: string[],
        public reading_level: UsersReadingLevelOptions,
        public created: Date,
        public usingProviders: Provider[]
    ) {}

    static async getMe() {
        const me = await getMe.call()
        const instance = User.fromJSON(me)

        return instance
    }

    static fromJSON(object: {
        created: string
        email: string
        id: string
        interests: string[] | null
        reading_level: string
        using_providers: string[] | null
        expand?: {
            using_providers: {}[] | null
        }
    }) {
        const created = new Date(object.created)
        const email = object.email
        const id = object.id
        const interests = object.interests || []
        const reading_level = object.reading_level as UsersReadingLevelOptions
        const using_providers = (object.expand?.using_providers || []).map(
            Provider.fromJSON
        )

        return new User(
            id,
            email,
            interests,
            reading_level,
            created,
            using_providers
        )
    }
}
