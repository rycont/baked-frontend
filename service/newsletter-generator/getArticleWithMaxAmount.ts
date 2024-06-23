import { Article } from '@/types/article'

export function getArticleWithMaxAmount(
    articlesMap: Map<string, Article[]>,
    maxArticles = 100
) {
    while (true) {
        const articleAmount = getArticleAmounts(articlesMap)

        if (articleAmount <= maxArticles) {
            break
        }

        const maxProviders = getMaxProvider(articlesMap)

        const articles = articlesMap.get(maxProviders)

        if (!articles) {
            break
        }

        articlesMap.set(maxProviders, articles.slice(0, articles.length - 1))
    }

    return articlesMap
}

function getMaxProvider(articlesByProviders: Map<string, Article[]>) {
    let maxProviderId = ''
    let maxProviderArticleCount = 0

    for (const [providerId, articles] of articlesByProviders) {
        if (articles.length > maxProviderArticleCount) {
            maxProviderId = providerId
            maxProviderArticleCount = articles.length
        }
    }

    return maxProviderId
}

function getArticleAmounts(articlesByProviders: Map<string, Article[]>) {
    return [...articlesByProviders.values()].reduce(
        (acc, articles) => acc + articles.length,
        0
    )
}
