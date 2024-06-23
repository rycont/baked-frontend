import { ErrorBoundary, Suspense, render } from 'solid-js/web'

import '@components/provider-editor'

import { assert } from '@utils/assert'
import NewsletterLoader from './widgets/newsletter-loader'
import { NoInterestsError, NoUsingProviderError } from './interrupts'
import SlotFiller from './widgets/slot-filler'
import Spinner from '@shade/icons/animated/spinner.svg?component-solid'
import { getMe } from '@/entity/user/getMe'
import { COLORS } from '@shade/colors'

function NewsletterPage() {
    return (
        <Suspense
            fallback={<Spinner width="9rem" height="9rem" color={COLORS.L4} />}
        >
            <ErrorBoundary
                fallback={(err, retry) => {
                    if (
                        err instanceof NoInterestsError ||
                        err instanceof NoUsingProviderError
                    ) {
                        return (
                            <SlotFiller
                                reason={err}
                                retry={() => {
                                    getMe.clearCache()
                                    retry()
                                }}
                            />
                        )
                    }

                    throw err
                }}
            >
                <NewsletterLoader />
            </ErrorBoundary>
        </Suspense>
    )
}

const renderTarget = document.getElementById('app')
assert(renderTarget, 'Cannot find renderTarget #app in this document')

render(() => <NewsletterPage />, renderTarget)
