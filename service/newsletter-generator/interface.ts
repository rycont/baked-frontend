import { Article } from '@/types/article'
import { Newsletter } from '@/types/newsletter'
import { Prettify } from '@/types/prettify'
import { PubSub } from '@/types/pubsub'

export abstract class NewsletterCreatorInterface {
    public pubsub = new PubSub<Prettify<NewsletterCreationEvents>>()

    abstract create(articles: Article[]): Promise<Newsletter>
}

export interface NewsletterCreationEvents {
    token(token: string): void
    relatedArticles(articles: Article[]): void
    finished(newsletter: Newsletter): void
}
