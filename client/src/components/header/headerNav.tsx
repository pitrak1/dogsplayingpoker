import { Link } from 'react-router'
import { Burger, Menu } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import './headerNav.scss'

export function HeaderNav() {
  const [opened, { toggle, close }] = useDisclosure(false)

  return (
    <Menu opened={opened} onClose={close}>
      <Menu.Target>
        <div className="header-nav__button">
          <Burger
            size="md"
            opened={opened}
            onClick={toggle}
            aria-label='navigation menu'
          />
        </div>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item fz="lg" py="sm" pr="xl" component={Link} to="/about">About</Menu.Item>
        <Menu.Item fz="md" py="xs" pl="xl" component={Link} to="/about#our-motivation">Our motivation</Menu.Item>
        <Menu.Item fz="md" py="xs" pl="xl" component={Link} to="/about#how-were-different">How we're different</Menu.Item>
        <Menu.Item fz="md" py="xs" pl="xl" component={Link} to="/about#faq">FAQ</Menu.Item>
        <Menu.Item fz="lg" py="sm" pr="xl" component={Link} to="/privacy">Privacy and security</Menu.Item>
        <Menu.Item fz="md" py="xs" pl="xl" component={Link} to="/privacy#limiting-data-visibility">Limiting data visibility</Menu.Item>
        <Menu.Item fz="md" py="xs" pl="xl" component={Link} to="/privacy#tiered-access">Tiered access controls</Menu.Item>
        <Menu.Item fz="md" py="xs" pl="xl" component={Link} to="/privacy#location-protection">Location protection</Menu.Item>
        <Menu.Item fz="md" py="xs" pl="xl" component={Link} to="/privacy#safety-in-messaging">Safety in messaging</Menu.Item>
        <Menu.Item fz="md" py="xs" pl="xl" component={Link} to="/privacy#reporting-and-moderation">Reporting and moderation</Menu.Item>
        <Menu.Item fz="md" py="xs" pl="xl" component={Link} to="/privacy#community-empowerment">Community empowerment</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
