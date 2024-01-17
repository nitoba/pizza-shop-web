import { Home, Pizza, UtensilsCrossed } from 'lucide-react'

import { AccountMenu } from './account-menu'
import { NavLink } from './nav-link'
import { ToggleTheme } from './theme/toggle-theme'
import { Separator } from './ui/separator'

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center gap-6 px-6">
        <Pizza className="size-6" />

        <Separator className="h-6" orientation="vertical" />

        <nav className="flex items-center space-x-4 lg:space-x-3">
          <NavLink to="/">
            <Home className="mr-1 size-4" />
            Início
          </NavLink>

          <NavLink to="/orders">
            <UtensilsCrossed className="mr-1 size-4" />
            Pedidos
          </NavLink>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <ToggleTheme />
        </div>
        <AccountMenu />
      </div>
    </header>
  )
}
