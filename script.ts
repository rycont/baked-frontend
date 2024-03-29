import { ClientResponseError } from 'pocketbase'
import { pb } from './db'
import { assert } from './utils/assert'
import { getMe } from './utils/getMe'
import { isValidInterests } from './utils/isValidInterests'
import { GradualRenderer } from './gradualRenderer'

const API_URL = 'https://baked-api.deno.dev'

const isLoggedIn = pb.authStore.isValid

if (!isLoggedIn) {
    location.href = '/login/index.html'
}

const interests = await getInterestsAssuredly()
// const providers = await getProvidersAssuredly()

renderInterests()

const today = {
    year: new Date().getFullYear().toString().padStart(4, '0'),
    month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    date: new Date().getDate().toString().padStart(2, '0'),
}

const todayString = `${today.year}-${today.month}-${today.date}`
const readableTodayString = `${today.year}년 ${today.month}월 ${today.date}일, 오늘`

const articleElement = document.getElementById('article_content')!
let loadingElement = document.getElementById('loading')!
const dateElement = document.getElementById('date')!

dateElement.appendChild(document.createTextNode(readableTodayString))

try {
    const todayNewsletter = await pb
        .collection('newsletters')
        .getFirstListItem(`date = "${todayString}"`)

    renderNewsletterFromText(todayNewsletter.content)
} catch (e) {
    if (e instanceof ClientResponseError) {
        if (e.status === 404) {
            renderNewsletter()
        }
    }
}

function renderInterests() {
    const interestsElement = document.getElementById('interests')
    interestsElement?.appendChild(
        document.createTextNode(interests.map((e) => '#' + e).join(' '))
    )
}

async function renderNewsletterFromText(content: string) {
    loadingElement.remove()
    const gradualRenderer = new GradualRenderer(articleElement)
    gradualRenderer.render(content)
}

const STAGE_STATUS_MAP: Record<string, string[] | string> = {
    getArticles: '소식을 들춰보고 있어요',
    getRelatedArticles: '관심 있어할 만한 소식을 살펴보고 있어요',
    createNewsletterWithArticles: '오늘의 뉴스레터를 작성하고 있어요',
}

async function renderNewsletter() {
    const source = new EventSource(
        `${API_URL}/stream_newsletter/${todayString}?authorization=${pb.authStore.token}`
    )

    const gradualRenderer = new GradualRenderer(articleElement)
    let interval: NodeJS.Timeout

    source.addEventListener('message', (e) => {
        const data = JSON.parse(e.data)
        console.log(data)

        if (data.event === 'progress') {
            const { stage } = data as { stage: string }
            if (!(stage in STAGE_STATUS_MAP)) return

            const messageElement = document.createElement('p')
            const message = STAGE_STATUS_MAP[stage]

            if (typeof message === 'string') {
                messageElement.appendChild(document.createTextNode(message))
            } else {
                let index = 0

                if (interval) {
                    clearInterval(interval)
                }

                interval = setInterval(() => {
                    messageElement.innerHTML = ''
                    messageElement.appendChild(
                        document.createTextNode(message[index])
                    )
                    index = (index + 1) % message.length
                }, 1000)
            }

            loadingElement.appendChild(messageElement)
        }

        if (data.event === 'token') {
            loadingElement.remove()
            gradualRenderer.render(data.token)
        }
    })
}

async function getInterestsAssuredly() {
    const me = await getMe()
    const { interests } = me

    if (!interests) {
        location.href = '/setting-required/index.html'
        throw new Error('Redirecting to setting-required')
    }

    assert(
        isValidInterests(interests, {
            checkIsEmpty: true,
        })
    )

    return interests
}

// async function getProvidersAssuredly() {
//     const me = await getMe()
//     const providers = me.expand?.using_providers

//     console.log(me)

//     assert(Array.isArray(providers))
//     assert(providers.length > 0)

//     return providers
// }
