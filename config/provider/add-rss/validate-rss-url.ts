import Parser from 'rss-parser/dist/rss-parser.min.js'

import { extFetch } from '@utils/extFetch'
import { Result } from '@/types/result'

const parser = new Parser()

async function validateRSSURL(url: string): Promise<
    Result<
        {
            title?: string
        },
        null
    >
> {
    try {
        const text = await (await extFetch(url)).text()
        const result = await parser.parseString(text)

        const title = result.title || result.description

        return {
            success: true,
            value: {
                title,
            },
        }
    } catch (error) {
        console.error(error)
        return {
            success: false,
        }
    }
}

export default validateRSSURL
