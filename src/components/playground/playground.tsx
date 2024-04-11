import { useSignal } from '@preact/signals'
import { useEffect, useRef } from 'preact/hooks'
import { FaAngleLeft, FaCheck, FaCode, FaListUl, FaPlus, FaXmark } from 'react-icons/fa6'
import { LuTrash2 } from 'react-icons/lu'
import { PiSelectionAllFill, PiSelectionBold } from 'react-icons/pi'
import { navigation } from '../../store/slices/navigation'
import { actionsMenuSlice, activeActionsSlice } from '../../store/slices/workspace'
import { executeAction } from '../../store/slices/workspace/agents'
import { Button } from '../common/button'
import { Link } from '../common/link'
import { GraphComponent } from '../graph-editor/graph-editor'
import { PlaygroundOptionTypeIcon } from './option-type-icon'

export const Playground = () => {
  const { gotoLanding } = navigation

  const ref = useRef<HTMLDivElement>(null)
  const width = useSignal(0)
  const height = useSignal(0)

  const resize = () => {
    const rect = ref.current!.getBoundingClientRect()
    if (!rect.width && !rect.height) return
    width.value = Math.round(rect.width) - 360
    height.value = Math.round(rect.height) * 0.95 - 2
  }

  useEffect(() => {
    const windowsListButton = document.querySelector('#windows-list')
    if (windowsListButton) windowsListButton.addEventListener('click', resize)
    window.addEventListener('resize', resize)
    resize()
    return () => {
      // workspace.reset()
      window.removeEventListener('resize', resize)
      if (windowsListButton) windowsListButton.removeEventListener('click', resize)
    }
  }, [])

  return (
    <div ref={ref} class='grid h-full grid-rows-[5%,1fr] items-baseline'>
      <div class='flex items-center justify-between'>
        <button onClick={gotoLanding} class='cursor-pointer rounded-full bg-transparent p-3 text-xl hover:text-primary'>
          <FaAngleLeft />
        </button>
        <input class='cursor-default px-5 text-right text-lg focus:cursor-text' placeholder={'Новое пространство'} />
      </div>

      <div class='flex h-full gap-1'>
        <GraphComponent class='w-fit rounded border' w={width.value} h={height.value} />
        <div class='w-full rounded border p-3'>
          <div class='flex items-end justify-between pb-4'>
            <div class='pt-0.5 text-lg font-semibold'>Параметры</div>
            <div class='flex rounded border text-lg'>
              <div class='cursor-pointer bg-gray-50 px-2.5 py-1.5 text-primary hover:bg-gray-100'>
                <FaListUl />
              </div>
              <div class='cursor-pointer px-2.5 py-1.5 hover:bg-gray-100'>
                <FaCode />
              </div>
            </div>
          </div>

          <ul class='gap-y- flex flex-col'>
            {activeActionsSlice.activeActions.value.map(action => (
              <li class='group grid cursor-default grid-cols-[1fr,auto] items-center gap-x-2 rounded border border-transparent p-0.5 hover:border-inherit'>
                <div class='flex w-full items-center gap-x-2 px-2.5 py-1'>
                  <span class='text-sm text-green-600'>
                    {
                      {
                        True: (
                          <span class='text-sm text-green-600'>
                            <FaCheck />
                          </span>
                        ),
                        False: (
                          <span class='text-sm text-red-600'>
                            <FaXmark />
                          </span>
                        ),
                        Details: (
                          <span class='text-sm text-red-600'>
                            <FaXmark />
                          </span>
                        ),
                      }['Details']
                    }
                  </span>
                  <Link>{action.agent.name}</Link>
                </div>
                <div class='h-8 w-8 cursor-pointer rounded-sm text-lg text-gray-400 opacity-30 centeric hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100'
                onClick={() => activeActionsSlice.deleteActiveAction(action.addr)}>
                  <LuTrash2 />
                </div>
              </li>
            ))}
          </ul>

          <Button
            class='mt-3'
            onClick={() => {
              if (actionsMenuSlice.openedMenu.value) actionsMenuSlice.closeMenu()
              else actionsMenuSlice.openActionsMenu()
            }}
          >
            {actionsMenuSlice.openedMenu.value ? (
              <>
                {/* <FaAngleLeft /> */}
                Добавление...
              </>
            ) : (
              <>
                <FaPlus />
                Добавить
              </>
            )}
          </Button>

          {actionsMenuSlice.openedMenu.value &&
            (!actionsMenuSlice.openedActionClass.value ? (
              <div class='mt-3 grid grid-cols-2 gap-3 px-3'>
                {actionsMenuSlice.actionClasses.map(({ name, icon, ref }) => (
                  <Button
                    key={ref.ref.addr}
                    class='h-24 flex-col gap-y-1 text-center text-sm'
                    onClick={() => {
                      actionsMenuSlice.openActionsClass(ref)
                    }}
                  >
                    <PlaygroundOptionTypeIcon icon={icon} />
                    {name}
                  </Button>
                ))}
              </div>
            ) : (
              <>
                <Button class='mt-3' onClick={() => actionsMenuSlice.closeActionClass()}>
                  {actionsMenuSlice.openedActionClassName.value ?? ''}
                </Button>
                {!actionsMenuSlice.openedAction[0] ? (
                  <div class='mx-3 mt-3 flex max-h-72 flex-col gap-y-2 overflow-y-auto rounded px-2 scroll-default'>
                    {actionsMenuSlice.actions.length ? (
                      actionsMenuSlice.actions.map(({ name, ref, actionClassAddr }) =>
                        actionClassAddr === actionsMenuSlice.openedActionClass.value ? (
                          <Button
                            key={ref.ref.addr}
                            onClick={() => {
                              actionsMenuSlice.openAction(ref)
                            }}
                          >
                            {name}
                          </Button>
                        ) : null
                      )
                    ) : (
                      <div class='gap-2 rounded border-transparent text-gray-700 centeric'>- - -</div>
                    )}
                  </div>
                ) : (
                  <>
                    <Button class='mt-3' onClick={() => actionsMenuSlice.closeAction()}>
                      {actionsMenuSlice.openedAction[0]?.name}
                    </Button>

                    <div class='mt-3 flex-wrap gap-3 px-3 centeric'>
                      {actionsMenuSlice.openedArguments.value.map(({ title, value, selected }, index) => (
                        <Button
                          class={`relative h-20 !w-32 flex-col gap-y-1 text-center text-sm ${selected ? 'border-primary bg-gray-100' : '!text-gray-400 hover:border-gray-300'}`}
                          onClick={() => actionsMenuSlice.setArgSelector(index)}
                        >
                          <span class='text-xl'>{value ? <PiSelectionAllFill /> : <PiSelectionBold />}</span>
                          {value ? String(value) : title}
                          <span class='absolute right-1.5 top-1.5 text-xs'>{index + 1}</span>
                        </Button>
                      ))}
                      {actionsMenuSlice.openedArguments.value.every(_ => _.value) && (
                        <Button
                          class='w-[16.75rem] text-center text-sm'
                          onClick={() => executeAction(actionsMenuSlice.openedArguments.value.map(_ => _.value!))}
                        >
                          Готово
                        </Button>
                      )}
                    </div>
                  </>
                )}
              </>
            ))}
        </div>
      </div>
      <div />
    </div>
  )
}
