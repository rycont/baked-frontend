import { InterestEditor } from '@components/interest-editor'
import { popAppearProgressiveStyle } from '@shade/theme.css'
import { Show } from 'solid-js'
import { NoInterestsError, NoUsingProviderError } from '../interrupts'

function SlotFiller(props: { reason: Error; retry: () => void }) {
    return (
        <>
            <Show when={props.reason instanceof NoInterestsError}>
                <sh-title>관심사가 등록되지 않았어요</sh-title>
                <InterestEditor />
                <sh-button
                    size="big"
                    class={popAppearProgressiveStyle}
                    onClick={props.retry}
                >
                    <img src="/shade-ui/icons/Send.svg" alt="전송 아이콘" />
                    입력 완료
                </sh-button>
            </Show>
            <Show when={props.reason instanceof NoUsingProviderError}>
                <sh-title>어떤 출처에서 글을 받아올까요?</sh-title>
                <provider-editor />
            </Show>
        </>
    )
}

export default SlotFiller
