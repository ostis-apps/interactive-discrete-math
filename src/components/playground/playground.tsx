import { useSignal } from '@preact/signals'
import { useEffect, useRef } from 'preact/hooks'
import { FaAngleLeft, FaCheck, FaCode, FaListUl, FaPlus, FaXmark } from 'react-icons/fa6'
import { PiSelectionBold } from 'react-icons/pi'
import { navigation } from '../../store/slices/navigation'
import { OptionState } from '../../store/slices/workspace-tools'
import { useWorkspaceTools } from '../../store/store'
import { Button } from '../common/button'
import { Link } from '../common/link'
import { GraphComponent } from '../graph-editor/graph-editor'
import { PlaygroundOptionTypeIcon } from './option-type-icon'
import { workspace } from '../../store/slices/workspace'

export const Playground = () => {
  const { gotoLanding } = navigation
  const workspaceTools = useWorkspaceTools()

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
    console.log(Array.from(workspace.vertices))
  }, [])

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

      <div class='flex gap-1 h-full'>
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
            {workspaceTools.displayedMyOptions.map(({ type: _type, title, state }) => (
              <li class='flex cursor-default items-center gap-x-2 rounded border border-transparent px-3 py-1.5 hover:border-inherit'>
                <span class='text-sm text-green-600'>
                  {
                    {
                      [OptionState.True]: (
                        <span class='text-sm text-green-600'>
                          <FaCheck />
                        </span>
                      ),
                      [OptionState.False]: (
                        <span class='text-sm text-red-600'>
                          <FaXmark />
                        </span>
                      ),
                      [OptionState.Details]: (
                        <span class='text-sm text-red-600'>
                          <FaXmark />
                        </span>
                      ),
                    }[state]
                  }
                </span>
                <Link>{title}</Link>
              </li>
            ))}
          </ul>

          <Button class='mt-3' onClick={workspaceTools.toggleNewOptions}>
            {workspaceTools.newOptionsExpanded ? (
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

          {workspaceTools.newOptionsExpanded &&
            (!workspaceTools.newOptionType ? (
              <div class='mt-3 grid grid-cols-2 gap-3 px-3'>
                {workspaceTools.displayedAvailableOptionTypes.map(({ click, title, icon }) => (
                  <Button class='h-24 flex-col gap-y-1 text-center text-sm' onClick={click}>
                    <PlaygroundOptionTypeIcon icon={icon} />
                    {title}
                  </Button>
                ))}
              </div>
            ) : (
              <>
                <Button class='mt-3' onClick={() => workspaceTools.selectNewOptionType(undefined)}>
                  {workspaceTools.selectedNewOptionTypeTitle}
                </Button>
                {!workspaceTools.selectedNewOptionId ? (
                  <div class='mx-3 mt-3 flex max-h-72 flex-col gap-y-2 overflow-y-auto rounded px-2 scroll-default'>
                    {workspaceTools.displayedAvailableOptions.length ? (
                      workspaceTools.displayedAvailableOptions.map(({ id, title, click }) => (
                        <Button key={id} onClick={click}>
                          {title}
                        </Button>
                      ))
                    ) : (
                      <div class='gap-2 rounded border-transparent text-gray-700 centeric'>- - -</div>
                    )}
                  </div>
                ) : (
                  <>
                    <Button class='mt-3' onClick={() => workspaceTools.selectNewOption(undefined)}>
                      {workspaceTools.selectedNewOptionTitle}
                    </Button>

                    <div class='mt-3 flex-wrap gap-3 px-3 centeric'>
                      {workspaceTools.selectedNewOptionTypeArgs.map(({ title, selected, click }, index) => (
                        <Button
                          class={`relative h-20 !w-32 flex-col gap-y-1 text-center text-sm ${selected ? 'border-primary bg-gray-100' : '!text-gray-400 hover:border-gray-300'}`}
                          onClick={click}
                        >
                          <span class='text-xl'>
                            <PiSelectionBold />
                          </span>
                          {title}
                          <span class='absolute right-1.5 top-1.5 text-xs'>{index + 1}</span>
                        </Button>
                      ))}
                      {workspaceTools.selectedNewOptionArgs.filter(Boolean).length ===
                        workspaceTools.selectedNewOptionTypeArgs.length && (
                        <Button class='w-[16.75rem] text-center text-sm' onClick={() => {}}>
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
