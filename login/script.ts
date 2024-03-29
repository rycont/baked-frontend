import { assert } from '../utils/assert'
import { pb } from '../db'

const buttons = {
    google: document.getElementById('login_with_google'),
}

assert(buttons.google)

buttons.google.addEventListener('click', loginWithGoogle)

const googleLoginLink = await getGoogleLoginLink()

function getGoogleLoginLink() {
    return new Promise<string>((ok) => {
        pb.collection('users')
            .authWithOAuth2({
                provider: 'google',
                urlCallback(url) {
                    ok(url)
                },
            })
            .then(() => {
                location.href = '/'
            })
    })
}

function loginWithGoogle() {
    window.open(googleLoginLink, '_blank', 'popup, width=500, height=600')
}
