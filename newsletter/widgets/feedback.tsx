import '@shade/dist/elements/hovert'
import '@shade/dist/elements/card'
import '@shade/dist/elements/chip'
import '@shade/dist/elements/button'
import '@shade/dist/elements/typo'

import '@components/gradual-renderer'

import { READING_LEVEL_ORDER } from '@/constants'
import { pb } from '@/utils/db'
import { Collections, UsersReadingLevelOptions } from '@/pocketbase-types'
import { For, Show, createSignal } from 'solid-js'
import { popAppearProgressiveStyle } from '@shade/theme.css'
import { User } from '@/entity/user'

const [responseMesage, setResponseMessage] = createSignal<string | null>(null)

const feedbacks = [
    {
        label: '쉬웠어요',
        key: 'easy',
    },
    {
        label: '좋았어요',
        key: 'good',
    },
    {
        label: '어려웠어요',
        key: 'hard',
    },
]

export function FeedbackPanel() {
    return (
        <>
            <sh-card>
                <sh-subtitle>오늘의 뉴스레터는 어땠나요?</sh-subtitle>
                <sh-vert gap={2}>
                    <For each={feedbacks}>
                        {({ label, key }) => (
                            <sh-button
                                type="ghost"
                                key={key}
                                onClick={() => handleFeedback(key)}
                            >
                                {label}
                            </sh-button>
                        )}
                    </For>
                </sh-vert>
                <Show when={responseMesage()}>
                    <sh-text class={popAppearProgressiveStyle}>
                        {responseMesage}
                    </sh-text>
                </Show>
            </sh-card>
        </>
    )
}

function handleFeedback(feedback: string) {
    if (feedback === 'good') {
        setResponseMessage('좋게 읽어주셔서 감사합니다')
    } else if (feedback === 'easy') {
        setResponseMessage('참고해서 다음엔 더 적절하게 작성해볼게요')
        moveReadingLevel(1)
    } else if (feedback === 'hard') {
        setResponseMessage('더 쉽게 쓰도록 노력할게요')
        moveReadingLevel(-1)
    }
}

async function moveReadingLevel(delta: number) {
    const me = await User.getMe()
    const currentReadingLevel = me.reading_level || UsersReadingLevelOptions.E15

    const currentIndex = READING_LEVEL_ORDER.indexOf(currentReadingLevel)

    const nextIndex = currentIndex + delta
    if (nextIndex < 0 || nextIndex >= READING_LEVEL_ORDER.length) {
        return
    }

    const nextReadingLevel = READING_LEVEL_ORDER[nextIndex]

    await pb.collection(Collections.Users).update(me.id, {
        reading_level: nextReadingLevel,
    })
}
