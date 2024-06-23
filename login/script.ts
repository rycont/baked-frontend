import { pb } from '@/utils/db'
import { GradualRenderer } from '../components/gradual-renderer'
import { getElements } from '../utils/getElements'

pb.authStore.clear()

const elements = getElements({
    content_wrapper: HTMLElement,
})

const renderer = new GradualRenderer(elements.content_wrapper)

renderer.referringArticles = [
    {
        title: 'Baking News: 꼭 너만을 위한 AI 뉴스레터',
        link: 'https://baking-news.vercel.app',
        content: `Baking News는 문해력과 관심사를 반영해 맞춤 뉴스레터를 제공합니다`,
        date: new Date(),
    },
]

let content = `# 꼭 너만을 위한 AI 뉴스레터,\nBaking News

[https://baking-news.vercel.app](https://baking-news.vercel.app)

Baking News는 문해력과 관심사를 반영해 맞춤 뉴스레터를 제공합니다.     
`

;(async () => {
    while (content.length > 0) {
        const token = content.slice(0, 3)
        content = content.slice(3)

        renderer.render(token)
    }
})()
