// Implement `CachedFunction` class that caches the result of a function call for a given time period, in typescript.
// The class should have the following methods:
// - `constructor` - accepts a function and a cache time in milliseconds
// - `call` - calls the function and caches the result for the given time period
// - `clear` - clears the cache

export class CachedFunction<Args, Return> {
    private runCache: FunctionCache = {}

    static DEFAULT_CACHE_TIME = 1000 * 30

    constructor(
        private fn: (...args: Args[]) => Return,
        private cacheDuration: number = CachedFunction.DEFAULT_CACHE_TIME
    ) {}

    call(...args: Args[]): ReturnType<typeof this.fn> {
        const key = JSON.stringify(args)

        const cached = this.runCache[key]
        if (cached && Date.now() - cached.lastCall < this.cacheDuration) {
            return cached.cache
        }

        const result = this.fn(...args)

        this.runCache[key] = {
            lastCall: Date.now(),
            cache: result,
        }

        return result
    }

    clearCache() {
        this.runCache = {}
    }
}

interface FunctionCache {
    [key: string]: {
        lastCall: number
        cache: any
    }
}
