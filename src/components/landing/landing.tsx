import { navigation } from '../../store/slices/navigation'
import { links } from '../../store/slices/links'
import { LandingCard } from './landing-card'
import { AuthContainer } from '../auth/auth-container.tsx'
import { UserMenu } from '../common/user-menu.tsx'
import { useAuthState } from '../auth/use-auth-state.ts'


export const Landing = () => {
  const { isAuthenticated, username, logout } = useAuthState();

  if (!isAuthenticated) {
    return <AuthContainer />;
  }

  return (
    <div class='flex h-full flex-col'>
      {username && <UserMenu username={username} onLogout={logout} />}

      <section class='pb-5'>
        <h2 class='py-1 text-2xl'>Теория</h2>
        <div class='flex flex-col flex-wrap justify-center gap-4 px-10 py-2 sm:flex-row sm:justify-start sm:px-0'>
          <LandingCard link={links.graphTheory}>Теория графов</LandingCard>
          <LandingCard link={links.setTheory}>Теория множеств</LandingCard>
        </div>
      </section>

      <section class='pb-5'>
        <h2 class='py-1 text-2xl'>Рабочие пространства</h2>
        <div class='flex flex-col flex-wrap justify-center gap-4 px-10 py-2 sm:flex-row sm:justify-start sm:px-0'>
          {navigation.spaces.map(space => (
            <LandingCard link={space.addr} click={e => (e.stopPropagation(), navigation.openSpace(space.addr))}>
              {space.name}
            </LandingCard>
          ))}
          <LandingCard new click={() => navigation.createSpace()} />
        </div>
      </section>

      <section class='pb-5'>
        <h2 class='py-1 text-2xl'>Справка</h2>
        <div class='flex flex-col flex-wrap justify-center gap-4 px-10 py-2 sm:flex-row sm:justify-start sm:px-0'>
          <LandingCard link={links.documentationGraphTheory}>Документация</LandingCard>
        </div>
      </section>
    </div>
  )
}
