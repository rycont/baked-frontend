import { Article } from '@/types/article'
import { NewsletterCreatorInterface } from '../interface'
import { Newsletter } from '@/types/newsletter'

export class MockNewsletterCreator extends NewsletterCreatorInterface {
    static TOKEN_INTERVAL = import.meta.env.VITE_FASTMOCK ? 10 : 40

    constructor() {
        super()
        console.info('Using mocked newsletter creator.')
    }

    async create(articles: Article[]): Promise<Newsletter> {
        await new Promise((resolve) =>
            setTimeout(resolve, import.meta.env.VITE_FASTMOCK ? 300 : 3000)
        )
        const usingArticle = articles.slice(0, 5)

        this.pubsub.pub('relatedArticles', [usingArticle])

        const mockContent =
            usingArticle
                .map(
                    (article) => `# ${article.title.slice(0, 3)}...라는 사실

[기사 출처](${article.link})

${article.link}라는 사실 알고 계셨나요? 꽤나 충격적이네요.`
                )
                .join('\n\n') + '오늘의 뉴스레터 어떠셨나요?     '

        let tokenQueue = [...mockContent]

        while (true) {
            const token = tokenQueue.slice(0, 5).join('')
            tokenQueue = tokenQueue.slice(5)

            await new Promise((resolve) =>
                setTimeout(resolve, MockNewsletterCreator.TOKEN_INTERVAL)
            )

            if (!token) {
                break
            }

            this.pubsub.pub('token', [token])
        }

        const mockedNewsletter = {
            content: mockContent,
            relatedArticles: usingArticle,
        }

        this.pubsub.pub('finished', [mockedNewsletter])

        return mockedNewsletter
    }
}
