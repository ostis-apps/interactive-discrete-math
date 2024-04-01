import { Enneract, effect } from '@ennealand/enneract'
import { App } from './types.ts'

const enneract = new Enneract<App>('ws://localhost:9002/ws_json')
const { Album } = enneract.magic

const albums = await Album.element.where({ name: ['Alternative', 'Super'] }).ref.one.then(x => x!.name.many.reactive)

effect(() => {
  console.log(Array.from(albums))
})

await Album.element.where({ name: 'Super' }).name.link('Alternative')

setTimeout(async () => {
  await Album.element.where({ name: 'Super' }).name.unlink('Alternative')
}, 1000)
