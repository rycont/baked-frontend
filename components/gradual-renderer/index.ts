import { Article } from '../../types/article'
import INLINE_LINK, { ShadeInlineLink } from '@shade/dist/elements/inline-link'
import { TEXT_CONTENT, TITLE } from '@shade/dist/elements/typo'
import { DefineOnce } from '@shade/util'
import { rendererStyle, tokenAnimation } from './style.css'
import { buildLinkCard } from '@components/link-card/build'

export class GradualRenderer {
    renderQueue: string[] = []
    currentElement: HTMLElement | null = null

    private flushing = false
    public referringArticleMap?: Map<string, Article>

    set referringArticles(referringArticles: Article[]) {
        this.referringArticleMap = new Map(
            referringArticles.map((article) => [article.link, article])
        )
    }

    constructor(private articleElement: HTMLElement) {}

    render(content: string) {
        for (const char of content) {
            this.renderChar(char)
        }
    }

    private renderChar(content: string) {
        this.renderQueue.push(content)

        if (!this.flushing) {
            this.flush()
        }
    }

    private async flush() {
        this.flushing = true

        while (true) {
            if (this.renderQueue.length < 5) {
                break
            }

            await new Promise((resolve) => setTimeout(resolve, 1))

            const content = this.renderQueue.shift()

            if (!content) {
                break
            }

            const actions = this.getActions(content)

            if (actions.length === 0) {
                const span = document.createElement('span')
                span.classList.add(tokenAnimation)
                span.appendChild(document.createTextNode(content))

                if (!this.currentElement) {
                    this.currentElement = document.createElement('p')
                    this.articleElement.appendChild(this.currentElement)
                }

                this.currentElement.appendChild(span)
            }

            for (const action of actions) {
                if (action.escape) {
                    const parent = this.currentElement?.parentElement
                    if (parent) {
                        this.currentElement = parent
                    }
                }

                if (action.tag) {
                    const newElement = document.createElement(action.tag)

                    if (!action.topLevel) {
                        this.currentElement?.appendChild(newElement)
                    } else {
                        this.articleElement.appendChild(newElement)
                    }

                    if (!action.noChild) {
                        this.currentElement = newElement
                    }
                }
            }
        }

        this.flushing = false
    }

    getActions(content: string) {
        const actions: {
            tag?: string
            escape?: boolean
            topLevel?: boolean
            noChild?: boolean
        }[] = []
        if (content === '\n') {
            if (this.renderQueue[0] === '\n') {
                actions.push({
                    tag: TEXT_CONTENT,
                    topLevel: true,
                })
            } else {
                if (
                    this.currentElement &&
                    this.currentElement.childNodes.length > 0
                ) {
                    actions.push({
                        tag: 'br',
                        noChild: true,
                    })
                }
            }
        }

        if (content === '#') {
            actions.push({
                tag: TITLE,
                topLevel: true,
            })
        }

        if (content === '*') {
            if (this.renderQueue[0] === '*') {
                this.renderQueue.shift()

                if (this.currentElement?.tagName === 'B') {
                    actions.push({
                        escape: true,
                    })
                } else {
                    actions.push({
                        tag: 'b',
                    })
                }
            } else if (this.renderQueue[0] === ' ') {
                this.renderQueue.shift()

                actions.push({
                    tag: 'li',
                })
            } else {
                actions.push({
                    tag: 'i',
                })
            }
        }

        if (content === '[') {
            actions.push({
                tag: INLINE_LINK,
            })
        }

        if (
            content === ')' &&
            this.currentElement instanceof ShadeInlineLink &&
            this.currentElement.textContent?.includes('](')
        ) {
            const { textContent } = this.currentElement

            if (textContent) {
                const [text, href] = textContent
                    .split('](')
                    .map((x) => x.trim())

                this.currentElement.setAttribute('href', href)
                this.currentElement.setAttribute('text', text)

                const article = this.referringArticleMap?.get(href)

                if (article) {
                    showArticleCard(
                        this.articleElement,
                        this.currentElement,
                        article
                    )
                }

                actions.push({
                    escape: true,
                })
            }
        }

        return actions
    }
}

function showArticleCard(
    articleElement: HTMLElement,
    element: HTMLElement,
    article: Article
) {
    let currentElement: HTMLElement = element

    while (true) {
        const parent = currentElement.parentElement

        if (!parent) {
            return
        }

        if (parent === articleElement) {
            break
        }

        currentElement = parent
    }

    const linkCard = buildLinkCard(article)

    currentElement.parentNode?.insertBefore(
        linkCard,
        currentElement.nextSibling
    )
}

export class GradualRendererComponent extends HTMLElement {
    wrapper = document.createElement('div')
    renderer: GradualRenderer = new GradualRenderer(this.wrapper)

    static observedAttributes = ['content', 'referring-article']

    constructor() {
        super()
        this.wrapper.classList.add(rendererStyle)
    }

    connectedCallback() {
        this.appendChild(this.wrapper)
    }

    attributeChangedCallback(
        name: string,
        oldValue: string | null,
        newValue: string | null
    ) {
        if (name === 'content' && newValue) {
            if (!oldValue) {
                this.renderer.render(newValue)
                return
            }

            const newParts = newValue.slice(oldValue.length)
            this.renderer.render(newParts)
        }

        if (name === 'referring-article' && newValue) {
            let referringArticles: Article[] = []

            try {
                referringArticles = JSON.parse(newValue)
            } catch (e) {}

            this.renderer.referringArticles = referringArticles
        }
    }
}

const NAME = 'gradual-renderer'
export default NAME

DefineOnce.define(NAME, GradualRendererComponent)

export interface GradualRendererProps {
    content?: string
    'referring-articles'?: string
}

declare global {
    interface HTMLElementTagNameMap {
        'gradual-renderer': GradualRendererComponent
    }
}
