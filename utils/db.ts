import PocketBase from 'pocketbase'
import { TypedPocketBase } from '../pocketbase-types'

export const pb = new PocketBase('https://pb.postica.app') as TypedPocketBase
window.pb = pb

declare global {
    interface Window {
        pb: TypedPocketBase
    }
}
