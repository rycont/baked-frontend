import { Article } from './article'

export interface Newsletter {
    content: string
    relatedArticles: Article[]
}
