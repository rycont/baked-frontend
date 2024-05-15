import { Article } from './article'
import CARD from './shade-ui/dist/card'
import { SUBTITLE, SMALL_TEXT } from './shade-ui/dist/typo'

export function buildLinkCard(article: Article) {
    const card = document.createElement(CARD)
    const title = document.createElement(SUBTITLE)
    const link = document.createElement(SMALL_TEXT)

    card.setAttribute('g', '3')

    title.appendChild(document.createTextNode(article.title))
    link.appendChild(document.createTextNode(article.link))

    link.setAttribute('l6', '')

    card.appendChild(title)
    card.appendChild(link)

    return card
}
