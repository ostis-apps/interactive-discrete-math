import { PlaygroundOptionTypeIcons } from '../../components/playground/option-type-icon'
import { slice } from '../factory'

export enum OptionState {
  True,
  False,
  Details,
}

type OptionId = number & Number
type OptionTypeId = number & Number
// type ScAddr = number & Number

type Option = { type: OptionTypeId; title: string }
type OptionType = { title: string; icon: PlaygroundOptionTypeIcons; args: { title: string }[] }

type GroupSelection = { type: 'group'; action: (id: number) => void; values: Set<number>; indicators: Map<number, string> } | undefined

export const workspaceToolsSlice = slice({
  /**
   * The toggle state of "new options" in Workspace tools
   */
  newOptionsExpanded: false,
  // => nrel_opened: set_of_buttons_default;

  /**
   * The type of "new options" chosen
   */
  newOptionType: undefined as OptionTypeId | undefined,
  // => nrel_opened: set_of_actions_classification;

  /**
   * The id of "new option" chosen
   */
  selectedNewOptionId: undefined as OptionId | undefined,
  // => nrel_opened: action_directed_graph;

  /**
   * The id of "new option" chosen
   */
  selectedNewOptionArgs: [] as (number | undefined)[],
  // => nrel_args: fake_graph_group;

  /**
   * The index of new option arg that is being currently selected
   */
  newOptionArgSelection: undefined as number | undefined,
  // => nrel_arg_selector: [0];

  /**
   * The list of available option types
   */
  availableOptionTypes: {
    56431: { title: 'Свойство', icon: 'tag', args: [{ title: 'Выбрать граф' }] },
    56432: { title: 'Операция', icon: 'math', args: [{ title: 'Выбрать граф' }, { title: 'Выбрать граф' }] },
    56433: { title: 'Числовая характеристика', icon: 'calculator', args: [{ title: 'Выбрать граф' }] },
    56434: { title: 'Множество', icon: 'set', args: [{ title: 'Выбрать граф' }] },
  } as Record<OptionTypeId, OptionType>,

  /**
   * The option ids chosen by user
   */
  myOptions: [2341, 2342, 2343] satisfies OptionId[],

  /**
   * The options chosen by user
   */
  myOptionsResult: {
    2341: { state: OptionState.True },
    2342: { state: OptionState.False },
    2343: { state: OptionState.True },
  } as Record<OptionId, { state: OptionState }>,

  /**
   * The list of available options
   */
  availableOptions: {
    2341: { type: 56431, title: 'Ориентированный граф' },
    2342: { type: 56431, title: 'Неориентированный граф' },
    2343: { type: 56431, title: 'Мультиграф' },
    2344: { type: 56431, title: 'Псевдограф' },
    2345: { type: 56431, title: 'Граф частичного порядка' },
    2346: { type: 56431, title: 'Транзитивный граф' },
    2347: { type: 56431, title: 'Граф-звезда' },
    3341: { type: 56431, title: 'Ориентированный граф' },
    3342: { type: 56431, title: 'Неориентированный граф' },
    3343: { type: 56431, title: 'Мультиграф' },
    3344: { type: 56431, title: 'Псевдограф' },
    3345: { type: 56431, title: 'Граф частичного порядка' },
    3346: { type: 56431, title: 'Транзитивный граф' },
    3347: { type: 56431, title: 'Граф-звезда' },
    2348: { type: 56432, title: 'Объединение' },
    2349: { type: 56432, title: 'Пересечение' },
  } as Record<number, Option>,

  /**
   * The data of available option types
   */
  get displayedAvailableOptionTypes() {
    return Object.entries<{ title: string; icon: PlaygroundOptionTypeIcons }>(this.availableOptionTypes).map(([type, value]) => ({
      ...value,
      type: +type,
      click: () => this.selectNewOptionType(+type),
    }))
  },

  /**
   * The list of available options filtered by `newOptionType`
   */
  get displayedAvailableOptions() {
    if (!this.newOptionsExpanded || !this.newOptionType) return []
    const toDisplay = []
    for (const [id, { type, title }] of Object.entries<Option>(this.availableOptions)) {
      if (type !== this.newOptionType) continue
      toDisplay.push({ id, title, click: () => this.selectNewOption(+id) })
    }
    return toDisplay
  },

  /**
   * The data of options chosen by user
   */
  get displayedMyOptions(): { state: OptionState; type: OptionTypeId; title: string }[] {
    return this.myOptions.map(id => ({
      ...this.availableOptions[id],
      ...this.myOptionsResult[id],
    }))
  },

  /**
   * The title of selected new option type
   */
  get selectedNewOptionTypeTitle(): string {
    if (this.newOptionType === undefined) return ''
    return this.availableOptionTypes[this.newOptionType].title
  },

  /**
   * The title of selected new option type
   */
  get selectedNewOptionTypeArgs(): { title: string; value?: number; selected: boolean; click: () => void }[] {
    if (this.newOptionType === undefined) return []
    return this.availableOptionTypes[this.newOptionType].args.map((value, index) => ({
      title: value.title,
      value: this.selectedNewOptionArgs[index],
      selected: this.newOptionArgSelection === index,
      click: () => this.newOptionArgClick(index),
    }))
  },

  /**
   * The title of selected new option
   */
  get selectedNewOptionTitle(): string {
    if (this.selectedNewOptionId === undefined) return ''
    return this.availableOptions[this.selectedNewOptionId].title
  },

  toggleNewOptions() {
    this.newOptionsExpanded = !this.newOptionsExpanded
    if (!this.newOptionsExpanded) {
      this.newOptionType = undefined
      this.selectedNewOptionId = undefined
      if (this.selectedNewOptionArgs.length) this.selectedNewOptionArgs = []
      this.newOptionArgSelection = undefined
    }
  },

  selectNewOptionType(type?: OptionTypeId) {
    this.newOptionType = type
    if (type === undefined) {
      this.selectedNewOptionId = undefined
      if (this.selectedNewOptionArgs.length) this.selectedNewOptionArgs = []
      this.newOptionArgSelection = undefined
    }
  },

  selectNewOption(id?: number) {
    this.selectedNewOptionId = id
    if (this.selectedNewOptionId === undefined) {
      if (this.selectedNewOptionArgs.length) this.selectedNewOptionArgs = []
      this.newOptionArgSelection = undefined
    }
  },

  groupSelection: undefined as GroupSelection,
  newOptionArgClick(index: number) {
    if (this.newOptionArgSelection === index) {
      this.newOptionArgSelection = undefined
      this.groupSelection = undefined
      return
    }
    this.newOptionArgSelection = index

    if (this.groupSelection) return

    this.groupSelection = {
      type: 'group',
      action: this.selectNewOptionArg,
      values: new Set(),
      indicators: new Map(),
    }
  },

  selectNewOptionArg(groupId: number) {
    const index = this.newOptionArgSelection
    if (!this.groupSelection || index === undefined) return
    console.log('got a new group selected:', groupId)
    const existing = this.selectedNewOptionArgs[index]
    if (existing) this.groupSelection.indicators.delete(existing)

    if (existing === groupId) {
      this.selectedNewOptionArgs[index] = undefined
    } else {
      const existingIndex = this.groupSelection.indicators.get(groupId)
      if (existingIndex !== undefined) this.selectedNewOptionArgs[+existingIndex - 1] = undefined
      this.selectedNewOptionArgs[index] = groupId
      this.groupSelection.indicators.set(groupId, String(index + 1))
    }
    this.groupSelection.values = new Set(this.groupSelection.indicators.keys())
  },

  addNewOption(id: number) {
    this.myOptions.push(id)
    this.selectedNewOptionId = undefined
    this.newOptionType = undefined
    this.newOptionsExpanded = false
  },

  reset() {
    this.selectedNewOptionId = undefined
    this.newOptionType = undefined
    this.newOptionsExpanded = false
  },
})
