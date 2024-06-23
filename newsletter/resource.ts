import { Provider } from '@/entity/provider'
import { User } from '@/entity/user'
import { NewsletterCreator } from '@/service/newsletter-generator'
import { getArticleWithMaxAmount } from '@/service/newsletter-generator/getArticleWithMaxAmount'
import { Article } from '@/types/article'
import { Newsletter } from '@/types/newsletter'
import { dismissUsedArticles } from '@utils/freshArticles'
import { createEffect, createResource, createSignal } from 'solid-js'
import { NoInterestsError, NoUsingProviderError } from './interrupts'

export const [getLogs, setLogs] = createSignal<string[]>([])

export function useNewsletterGeneration() {
    const [getMe] = createResource(User.getMe)
    const [getNewsletter, setNewsletter] = createSignal<Newsletter | null>(null)

    const [getReferringArticles, setReferringArticles] = createSignal<
        Article[] | null
    >(null)

    const [getNewsletterContent, setNewsletterContent] =
        createSignal<string>('')

    const newsletterCreator = new NewsletterCreator()

    newsletterCreator.pubsub.sub('token', (token) => {
        setNewsletterContent((prev) => prev + token)
    })

    newsletterCreator.pubsub.sub('relatedArticles', (relatedArticles) => {
        setReferringArticles(relatedArticles)
    })

    newsletterCreator.pubsub.sub('finished', (newsletter) => {
        setNewsletter(newsletter)
    })

    createEffect(() => {
        const relatedArticles = getReferringArticles()
        if (!relatedArticles) return

        const content = getNewsletterContent()
        if (!content) return

        setNewsletter({
            relatedArticles,
            content,
        })
    })

    createEffect(() => {
        const me = getMe()
        if (!me) return

        checkNewsletterRequirementsValid(me)

        getArticlesFromProviders(me.usingProviders).then(
            newsletterCreator.create.bind(newsletterCreator)
        )
    })

    return () => {
        const me = getMe()
        if (!me) return

        return {
            newsletter: getNewsletter(),
            me,
        }
    }
}

export function checkNewsletterRequirementsValid(me: User): true {
    if (me.usingProviders.length === 0) {
        throw new NoUsingProviderError()
    }

    if (me.interests.length === 0) {
        throw new NoInterestsError()
    }

    return true
}

async function getArticlesFromProviders(providers: Provider[]) {
    const articlesByProvider = new Map(
        await Promise.all(
            providers.map(
                async (provider: Provider) =>
                    [
                        provider.id,
                        dismissUsedArticles(
                            await getProviderArticles(provider)
                        ),
                    ] as const
            )
        )
    )

    return [...getArticleWithMaxAmount(articlesByProvider).values()].flat()
}

async function getProviderArticles(provider: Provider) {
    try {
        const articles = await provider.getArticles()
        addLog(`${provider.name} 읽었어요`)

        return articles
    } catch (_e) {
        addLog(`${provider.name} 읽는 중 오류가 발생했어요`)
        return []
    }
}

function addLog(log: string) {
    setLogs((prev) => [...prev, log])
}
