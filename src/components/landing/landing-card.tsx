import { JSX } from 'preact/jsx-runtime'
import { FaLock, FaPlus } from 'react-icons/fa6'
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U

const BaseLandingCard = ({ class: classname, children, ...props }: JSX.HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      class={`centeric h-40 w-52 flex-col rounded-md border bg-gray-50 text-center font-nunito text-lg font-bold ${classname}`}
      {...props}
    >
      {children}
    </button>
  )
}

export const LandingCard = (
  props: XOR<{ lock?: true; children: string }, { new: true }> & { click?: JSX.MouseEventHandler<HTMLButtonElement> }
) => {
  if (props.new)
    return (
      <BaseLandingCard
        class='text-primary hover:border-primary cursor-pointer text-xl hover:bg-gray-100'
        onClick={props.click}
      >
        <FaPlus />
      </BaseLandingCard>
    )

  if (props.lock)
    return (
      <BaseLandingCard class='text-gray-400' disabled>
        <FaLock />
        {props.children}
      </BaseLandingCard>
    )

  return (
    <BaseLandingCard class='text-primary hover:border-primary cursor-pointer hover:bg-gray-100' onClick={props.click}>
      {props.children}
    </BaseLandingCard>
  )
}
