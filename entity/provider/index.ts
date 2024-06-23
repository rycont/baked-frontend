import { Article } from '@/types/article'
import { RSSProvider } from './rss-provider'

const CHILDREN = [RSSProvider]

export abstract class Provider {
    public abstract type: string
    public abstract id: string
    public abstract name: string
    constructor() {}
    public abstract getArticles(): Promise<Article[]>

    public static fromJSON(
        json: any & {
            type: string
        }
    ): Provider {
        const provider = CHILDREN.find((child) => child.type === json.type)

        if (!provider) {
            throw new Error(`Unknown provider type: ${json.type}`)
        }

        return provider.fromJSON(json)
    }
}
