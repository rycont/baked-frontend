import { Article } from '../types/article'

export function dismissUsedArticles(articles: Article[]) {
    if (import.meta.env.VITE_IGNORE_DISMISSED_ARTICLES) {
        console.log('Ignoring dismissed articles')
        return articles
    }

    const usedArticles = JSON.parse(
        localStorage.getItem('usedArticles') || '[]'
    )

    const newArticles = articles.filter(
        (article) => !usedArticles.includes(article.link)
    )

    return newArticles
}

export function addUsedArticles(articlesIds: string[]) {
    const usedArticles = JSON.parse(
        localStorage.getItem('usedArticles') || '[]'
    )

    const newUsedArticles = [...usedArticles, ...articlesIds]

    localStorage.setItem('usedArticles', JSON.stringify(newUsedArticles))
}
