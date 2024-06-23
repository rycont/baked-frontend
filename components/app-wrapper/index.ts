import { DefineOnce } from '@shade/util'
import { ShadeContainerNarrow } from '@shade/elements/container-narrow'
import { BOTTOM_BAR, BottomBar } from '../bottom-bar'
import { wrapperStyle } from './style.css'

export class AppWrapper extends ShadeContainerNarrow {
    static observedAttributes = ['appbar']
    static paddingInset = 6

    private _appBar: BottomBar | null = null

    constructor() {
        super()
    }

    connectedCallback() {
        super.connectedCallback()
        this.classList.add(wrapperStyle)
    }

    attributeChangedCallback(
        name: string,
        _oldValue: string | null,
        newValue: string | null
    ) {
        if (name === 'appbar') {
            const showAppBar = newValue !== null

            if (showAppBar) {
                this.style.setProperty(
                    'padding-bottom',
                    19 + AppWrapper.paddingInset + 'rem'
                )
                this.appBar.show()
            } else {
                this.style.setProperty(
                    'padding-bottom',
                    AppWrapper.paddingInset + 'rem'
                )
                this.appBar.hide()
            }
        }
    }

    get appBar() {
        if (!this._appBar) {
            const appbarInstance = document.createElement(BOTTOM_BAR)

            if (!(appbarInstance instanceof BottomBar)) {
                throw new Error('Cannot build appbar instance')
            }

            this.appendChild(appbarInstance)
            this._appBar = appbarInstance
        }

        return this._appBar
    }
}

DefineOnce.define('app-wrapper', AppWrapper)
