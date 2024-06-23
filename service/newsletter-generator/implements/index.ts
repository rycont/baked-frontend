import { pb } from '@utils/db'

import { Newsletter } from '@/types/newsletter'
import { Article } from '@/types/article'

import { NewsletterCreatorInterface } from '../interface'
import { User } from '@/entity/user'

export class LLMNewsletterCreator extends NewsletterCreatorInterface {
    private socket?: WebSocket
    private articles?: Article[]

    constructor() {
        super()
        console.info('Using LLM newsletter creator.')
    }

    create(articles: Article[]): Promise<Newsletter> {
        this.articles = articles
        this.socket = new WebSocket('wss://baked-api.deno.dev/ws')

        this.socket.addEventListener('open', this.onOpen.bind(this))
        this.socket.addEventListener('message', this.onMessage.bind(this))

        return new Promise((resolve) => {
            this.pubsub.sub('finished', (newsletter) => {
                resolve(newsletter)
            })
        })
    }

    send(type: string, data: any) {
        this.socket!.send(JSON.stringify({ type, data }))
    }

    async onOpen() {
        const token = await this.getToken()
        this.send('setAuthorization', { token })
    }

    onMessage(event: MessageEvent) {
        const payload = JSON.parse(event.data)

        if (payload.type === 'authorizationSuccess') {
            this.send('setSourceArticles', {
                articles: this.articles,
            })

            return
        }

        if (payload.type === 'tokenStream') {
            this.pubsub.pub('token', [payload.data.token])

            return
        }

        if (payload.type === 'relatedArticles') {
            this.pubsub.pub('relatedArticles', [payload.data.articles])

            return
        }

        if (payload.type === 'finished') {
            this.pubsub.pub('finished', [
                {
                    content: payload.data.content,
                    relatedArticles: payload.data.articles,
                },
            ])

            return
        }
    }

    private async getToken() {
        await User.getMe()
        return pb.authStore.token
    }
}
