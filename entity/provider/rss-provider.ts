import { RSSLoader } from '@/service/rss-loader/interface'
import { Provider } from '.'
import { clientRSSLoader } from '@/service/rss-loader/implements/client-rss-loader'
import { ContentProvidersTypeOptions } from '@/pocketbase-types'
import { mockRSSLoader } from '@/service/rss-loader/implements/mock'

const DEFAULT_RSS_LOADER = import.meta.env.VITE_MOCK_RSS_REQUEST
    ? mockRSSLoader
    : clientRSSLoader

export class RSSProvider implements Provider {
    static DEFAULT_RSS_LOADER = DEFAULT_RSS_LOADER
    static type = ContentProvidersTypeOptions.rss

    public type = ContentProvidersTypeOptions.rss
    public id: string
    public url: string
    public name: string
    public encoding?: string

    constructor(
        source: {
            url: string
            name: string
            id: string
            encoding?: string
        },
        private RSSLoader: RSSLoader = RSSProvider.DEFAULT_RSS_LOADER
    ) {
        this.name = source.name
        this.url = source.url
        this.encoding = source.encoding

        this.id = source.id
    }

    public async getArticles() {
        const articles = await this.RSSLoader(this.url, this.encoding)

        return articles
    }

    public toJSON() {
        return {
            type: this.type,
            url: this.url,
            encoding: this.encoding,
        }
    }

    static fromJSON(json: {
        url: string
        encoding?: string
        name: string
        id: string
    }) {
        return new RSSProvider(json)
    }
}

export interface RSSSource {
    url: string
    encoding?: string
}
