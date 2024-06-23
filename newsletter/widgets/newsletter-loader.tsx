import { Match, Switch } from 'solid-js'

import { useNewsletterGeneration } from '../resource'

import RenderNewsletter from './render-newsletter'
import NewsletterCreating from './newsletter-creating'
import { Show } from 'solid-js'

function NewsletterLoader() {
    const newsletterGeneration = useNewsletterGeneration()

    return (
        <Switch
            fallback={
                <Show when={newsletterGeneration()?.me.interests}>
                    {(interests) => (
                        <NewsletterCreating interests={interests()} />
                    )}
                </Show>
            }
        >
            <Match when={newsletterGeneration()?.newsletter}>
                {(newsletter) => (
                    <RenderNewsletter
                        newsletterContent={newsletter().content}
                        relatedArticles={newsletter().relatedArticles}
                    />
                )}
            </Match>
        </Switch>
    )
}

export default NewsletterLoader
