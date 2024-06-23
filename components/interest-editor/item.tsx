import { pb } from '@/utils/db'
import { interestsSignal } from './storage'
import { InterestItemView, InterestItemViewProps } from './item.view'
import { User } from '@/entity/user'

export default function InterestItem(props: { index: number }) {
    const value = () => interestsSignal.get()?.[props.index] || ''

    const autofocus = () => !value()
    const onRemove = removeInterest.bind(null, props.index)
    const onChange: InterestItemViewProps['onChange'] = (event) => {
        const value = event.target.value.trim()
        const index = props.index

        setInterests(index, value)
    }

    return (
        <InterestItemView
            autofocus={autofocus()}
            value={value()}
            onChange={onChange}
            onRemove={onRemove}
        />
    )
}

async function setInterests(index: number, newInterest: string) {
    const me = await User.getMe()
    let interests = interestsSignal.get() || []

    interests[index] = newInterest

    pb.collection('users').update(me.id, { interests })
    interestsSignal.set([...interests])
}

async function removeInterest(index: number) {
    const me = await User.getMe()
    let interests = interestsSignal.get() || []

    interests = [...interests.slice(0, index), ...interests.slice(index + 1)]

    pb.collection('users').update(me.id, { interests })
    interestsSignal.set([...interests])
}
