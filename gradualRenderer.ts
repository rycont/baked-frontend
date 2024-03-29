export class GradualRenderer {
    renderQueue: string[] = []
    currentElement: HTMLElement | null = null

    private flushing = false

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

            const content = this.renderQueue.shift()

            if (!content) {
                break
            }

            const actions = this.getActions(content)

            if (actions.length === 0) {
                const span = document.createElement('span')
                span.classList.add('appear')
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

                    this.currentElement = newElement
                }
            }

            await new Promise((resolve) => setTimeout(resolve, 20))
        }

        this.flushing = false
    }

    getActions(content: string) {
        const actions: {
            tag?: string
            escape?: boolean
            topLevel?: boolean
        }[] = []
        if (content === '\n') {
            actions.push({
                tag: 'p',
                topLevel: true,
            })
        }

        if (content === '#') {
            let level = 1

            while (this.renderQueue[0] === '#') {
                this.renderQueue.shift()
                level++
            }

            actions.push({
                tag: `h${level}`,
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
                tag: 'a',
            })
        }

        if (content === ')') {
            const content = this.currentElement?.textContent
            if (content) {
                const [text, href] = content.split('](').map((x) => x.trim())

                this.currentElement!.setAttribute('href', href)
                this.currentElement!.textContent = text

                actions.push({
                    escape: true,
                })
            }
        }

        return actions
    }
}
