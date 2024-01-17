import { Link, LinkProps, useLocation } from 'react-router-dom'

import { Button } from './ui/button'

export type NavLinkProps = LinkProps

export function NavLink(props: NavLinkProps) {
  const { pathname } = useLocation()

  const isActive = props.to === pathname

  return (
    <Button
      asChild
      variant="ghost"
      size="sm"
      data-active={isActive}
      className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
    >
      <Link {...props} />
    </Button>
  )
}
