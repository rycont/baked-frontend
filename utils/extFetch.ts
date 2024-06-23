const corsAvoidServer = 'https://baked-rss.rycont.workers.dev'

export async function extFetch(...args: Parameters<typeof fetch>) {
    let [input, init] = args

    if (typeof input === 'string') {
        input = corsAvoidServer + '/' + input
    } else if (input instanceof Request) {
        input = new Request(corsAvoidServer + '/' + input.url, input)
    } else if (input instanceof URL) {
        input = new URL(corsAvoidServer + '/' + input.href)
    } else {
        throw new Error('Invalid input')
    }

    const response = await fetch(input, init)
    if (!response.ok) {
        throw new Error(response.statusText)
    }

    return response
}
