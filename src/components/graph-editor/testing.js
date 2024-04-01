import { jsx } from 'preact/jsx-runtime'
import { useMemo } from 'preact/hooks'
export const Testing = () => {
  const val = useMemo(() => 234, [])
  return jsx('p', { children: 'ok' })
}
