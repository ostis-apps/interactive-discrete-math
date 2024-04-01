import { useNavigation } from '../../store/store'
import { LandingCard } from './landing-card'

export const Landing = () => {
  const { openTask, openSpace } = useNavigation()

  return (
    <div class='flex h-full flex-col'>
      <section class='pb-5'>
        <h2 class='py-1 text-2xl'>Теория</h2>
        <div class='flex gap-4 py-2'>
          <LandingCard>База знаний</LandingCard>
          <LandingCard>Карта понятий</LandingCard>
          <LandingCard click={() => (document.querySelector('a[sc_addr="94325"]') as any)?.click()}>SCn код</LandingCard>
        </div>
      </section>

      <section class='pb-5'>
        <h2 class='py-1 text-2xl'>Тренировочные задачи</h2>
        <div class='flex gap-4 py-2'>
          <LandingCard click={() => openTask('lala')}>Ориентированность графа</LandingCard>
          <LandingCard lock>Метаграф</LandingCard>
          <LandingCard lock>Цикл графа</LandingCard>
          <LandingCard lock>Граф</LandingCard>
        </div>
      </section>

      <section class='pb-5'>
        <h2 class='py-1 text-2xl'>Рабочие пространства</h2>
        <div class='flex gap-4 py-2'>
          <LandingCard lock>{'Пространство 1'}</LandingCard>
          <LandingCard new click={() => openSpace()} />
        </div>
      </section>
    </div>
  )
}
