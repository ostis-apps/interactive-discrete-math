import { navigation } from '../../store/slices/navigation'
import { LandingCard } from './landing-card'

export const Landing = () => {
  const { spaces, openTask, openSpace, createSpace } = navigation

  return (
    <div class='flex h-full flex-col'>
      <section class='pb-5'>
        <h2 class='py-1 text-2xl'>Теория</h2>
        <div class='flex flex-col flex-wrap justify-center gap-4 px-10 py-2 sm:flex-row sm:justify-start sm:px-0'>
          <LandingCard>База знаний</LandingCard>
          <LandingCard lock>Карта понятий</LandingCard>
          <LandingCard click={() => (document.querySelector('a[sc_addr="94325"]') as any)?.click()}>SCn код</LandingCard>
        </div>
      </section>

      <section class='pb-5'>
        <h2 class='py-1 text-2xl'>Тренировочные задачи</h2>
        <div class='flex flex-col flex-wrap justify-center gap-4 px-10 py-2 sm:flex-row sm:justify-start sm:px-0'>
          <LandingCard click={() => openTask('lala')}>Ориентированность графа</LandingCard>
          <LandingCard lock>Метаграф</LandingCard>
          <LandingCard lock>Цикл графа</LandingCard>
          <LandingCard lock>Граф</LandingCard>
        </div>
      </section>

      <section class='pb-5'>
        <h2 class='py-1 text-2xl'>Рабочие пространства</h2>
        <div class='flex flex-col flex-wrap justify-center gap-4 px-10 py-2 sm:flex-row sm:justify-start sm:px-0'>
          {spaces.map(space => (
            <LandingCard click={() => openSpace(space.addr)}>{space.name}</LandingCard>
          ))}
          <LandingCard new click={() => createSpace()} />
        </div>
      </section>
    </div>
  )
}
