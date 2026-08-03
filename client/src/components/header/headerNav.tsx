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
        <Menu.Item fz="lg" py="md" component={Link} to="/about">About</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
