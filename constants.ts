import { UsersReadingLevelOptions } from './pocketbase-types'

export const API_URL = import.meta.env.VITE_API_URL
export const NEWSLETTER_STORAGE_PREFIX = 'newsletter'

export const READING_LEVEL_ORDER = [
    UsersReadingLevelOptions.E7,
    UsersReadingLevelOptions.E15,
    UsersReadingLevelOptions.E25,
]
