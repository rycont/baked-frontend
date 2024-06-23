import '@/components/gradual-renderer'
import { Article } from '@/types/article'

function RenderNewsletter(props: {
    newsletterContent: string | null
    relatedArticles: Article[]
}) {
    return (
        <>
            {/* <Show when={getIsStaleNewsletter()}>
                <info-card class={popAppearStyle}>
                    아직 새 소식이 충분하지 않아요. 이전 뉴스레터를 보여드릴게요
                </info-card>
            </Show> */}
            <gradual-renderer
                attr:content={props.newsletterContent}
                attr:referring-article={JSON.stringify(props.relatedArticles)}
            />
            {/* <Show when={getIsGenerationEnd() && !getIsStaleNewsletter()}>
                <FeedbackPanel />
            </Show> */}
        </>
    )
}

export default RenderNewsletter
