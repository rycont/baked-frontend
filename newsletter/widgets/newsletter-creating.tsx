import editIcon from '@shade/icons/Pen.svg?url'
import { popAppearProgressiveStyle, popAppearStyle } from '@shade/theme.css'
import Spinner from '@shade/icons/animated/spinner.svg?component-solid'
import { For, Suspense } from 'solid-js'
import { getLogs } from '../resource'
import { COLORS } from '@shade/colors'

function NewsletterCreating(props: { interests: string[] }) {
    return (
        <>
            <Spinner width="9rem" height="9rem" color={COLORS.L4} />
            <sh-title class={popAppearProgressiveStyle}>
                신선한 뉴스레터를 굽고있어요
            </sh-title>
            <sh-card class={popAppearProgressiveStyle}>
                <sh-subtitle>내 관심사</sh-subtitle>
                <sh-horz gap={1} linebreak>
                    <Suspense fallback={<>Interests</>}>
                        <For each={props.interests}>
                            {(interest) => <sh-chip>{interest}</sh-chip>}
                        </For>
                    </Suspense>
                </sh-horz>
            </sh-card>
            <sh-button attr:type="ghost" class={popAppearProgressiveStyle}>
                <img src={editIcon} />
                수정
            </sh-button>

            <sh-vert gap={2} class={popAppearProgressiveStyle}>
                <For each={getLogs()}>
                    {(logline) => (
                        <sh-text L6 class={popAppearStyle}>
                            {logline}
                        </sh-text>
                    )}
                </For>
            </sh-vert>
        </>
    )
}

export default NewsletterCreating
