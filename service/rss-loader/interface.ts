import { Article } from '@/types/article'

export type RSSLoader = (url: string, encoding?: string) => Promise<Article[]>
