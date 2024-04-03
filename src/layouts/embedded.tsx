import { ComponentChildren } from 'preact'
// import { useEffect } from 'preact/hooks';

export const EmbeddedLayout = (props: { children: ComponentChildren; full?: true; class?: string }) => {
  // useEffect(() => {
  //   console.warn('mount?!')
  // })
  return (
    <section class={`absolute flex flex-col font-nunito ${props.full ? 'inset-0 rounded-[4px]' : 'inset-4'} ${props.class ?? ''}`}>
      <style type='text/css'>{`
        // #window-header-tools {
        //   top: -62px;
        //   right: 230px;
        // }
        // #window-header-tools #search-panel {
        //   display: none;
        // }
      `}</style>
      {props.children}
    </section>
  )
}
