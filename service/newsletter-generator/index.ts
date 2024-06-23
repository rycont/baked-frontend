import { LLMNewsletterCreator } from './implements'
import { MockNewsletterCreator } from './implements/mock'

export const NewsletterCreator = import.meta.env.VITE_MOCK_NEWSLETTER_CREATION
    ? MockNewsletterCreator
    : LLMNewsletterCreator
