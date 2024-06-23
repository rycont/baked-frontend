import { customElement, noShadowDOM } from 'solid-element'
import { createResource } from 'solid-js'
import { ProviderEditorView } from './index.view'
import { User } from '@/entity/user'
import { Provider } from '@/entity/provider'

function ProviderEditor() {
    const [usingProviders] = createResource(getUsingProviders)

    function usingProviderNames() {
        return usingProviders()?.map((provider) => provider.name) || []
    }

    return <ProviderEditorView usingProviders={usingProviderNames()} />
}

async function getUsingProviders(): Promise<Provider[]> {
    const me = await User.getMe()
    const usingProviders = me.usingProviders

    return usingProviders || []
}

const name = 'provider-editor'
customElement(name, () => {
    noShadowDOM()
    return <ProviderEditor />
})

export default name
