import mockResponse from './mock-response.json'
import { RSSLoader } from '../interface'

const SIMULATED_DELAY_MAX = import.meta.env.VITE_FASTMOCK ? 300 : 10000

const SIMULATED_DELAY_BIAS = import.meta.env.VITE_FASTMOCK ? 0 : 500

export const mockRSSLoader: RSSLoader = async () => {
    console.info('Using mocked RSS loader.')
    const delay = Math.random() * SIMULATED_DELAY_MAX + SIMULATED_DELAY_BIAS

    await new Promise((resolve) => setTimeout(resolve, delay))

    return mockResponse.map((item) => ({
        ...item,
        date: new Date(item.date),
    }))
}
