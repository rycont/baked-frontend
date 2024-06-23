export const NoInterestsError = class extends Error {
    constructor() {
        super('NO_INTERESTS')
    }
}

export const NoUsingProviderError = class extends Error {
    constructor() {
        super('NO_USING_PROVIDER')
    }
}
