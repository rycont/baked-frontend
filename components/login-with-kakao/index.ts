import { pb } from '../../utils/db'
import { ShadeFloatingButton } from '@shade/dist/elements/floating-button'
import { DefineOnce } from '@shade/util'
import kakaoIcon from './kakao.svg?url'

let onLoginLinkGenerated: (link: string) => void

pb.collection('users')
    .authWithOAuth2({
        provider: 'kakao',
        urlCallback(url) {
            onLoginLinkGenerated?.(url)
        },
    })
    .then(() => {
        location.href = '/'
    })

export class LoginWithKakaoButton extends ShadeFloatingButton {
    constructor() {
        super()
        this.addEventListener('click', () => {})
    }

    connectedCallback() {
        this.style.setProperty('opacity', '0')
        this.style.setProperty('transform', 'translateX(-50%) translateY(5rem)')

        this.setAttribute('icon', kakaoIcon)
        this.style.setProperty('--sh-floating-button-icon-width', '6rem')
        this.style.setProperty('--sh-floating-button-icon-height', '6rem')
        this.style.setProperty(
            '--sh-floating-button-background-color',
            '#FFEB00'
        )
        this.style.setProperty('--sh-floating-button-text-color', 'black')

        super.connectedCallback()

        onLoginLinkGenerated = (link) => {
            this.style.setProperty('opacity', '1')
            this.style.setProperty(
                'transform',
                'translateX(-50%) translateY(0)'
            )

            this.addEventListener('click', () =>
                window.open(link, '_blank', 'popup, width=500, height=600')
            )
        }
    }
}

DefineOnce.define('login-with-kakao', LoginWithKakaoButton)
