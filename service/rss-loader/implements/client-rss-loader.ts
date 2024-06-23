import Parser from 'rss-parser/dist/rss-parser.min.js'

import { dismissUsedArticles } from '@utils/freshArticles'
import { extFetch } from '@utils/extFetch'
import { assert } from '@utils/assert'

import { Article } from '@/types/article'

import { RSSLoader } from '../interface'

export const clientRSSLoader: RSSLoader = async (url, encoding) => {
    const response = await extFetch(url)

    const text = encoding
        ? await decode(response, encoding)
        : await response.text()

    const parser: Parser = new Parser()
    const { items } = await parser.parseString(text)

    const articlesFromProvider = items.map(createArticleRecordFromItem)
    const freshArticles = dismissUsedArticles(articlesFromProvider)

    return freshArticles
}

async function decode(response: Response, encoding: string) {
    const decoder = new TextDecoder(encoding)
    const text = decoder.decode(await response.arrayBuffer())

    return text
}

function createArticleRecordFromItem(item: Parser.Item): Article {
    const link = item.link || item.guid
    const content = (item.summary ||
        item.content ||
        item.contentSnippet ||
        ('content:encodedSnippet' in item &&
            item['content:encodedSnippet'])) as string

    const date = item.isoDate as string

    assert(link)
    assert(item.title)

    return {
        title: item.title,
        link,
        content,
        date: new Date(date),
    }
}
