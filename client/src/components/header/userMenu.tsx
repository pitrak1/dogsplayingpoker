import { Link } from 'react-router'
import { useAuth } from '@/context/auth'
import { ChevronRight } from 'lucide-react'
import { Menu, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { AvatarDisplay } from '@/components/avatarDisplay'
import './userMenu.scss'

export function UserMenu() {
  const { user, clearAuth } = useAuth()
  const [opened, { toggle, close }] = useDisclosure(false)

  if (!user) return

  const logout = () => {
    clearAuth()
  }

  return (
    <Menu opened={opened} onClose={close}>
      <Menu.Target>
        <UnstyledButton fz="lg" py="md"  className="user-menu__button" onClick={toggle}>
          <AvatarDisplay imageUrl={user.profileImageUrl ?? null} name={user.username} size={40} />
          {user.username}
          <ChevronRight className="user-menu__chevron" data-opened={opened}/>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item fz="lg" py="md" component={Link} to={`/profile/${user.username}`}>Your profile</Menu.Item>
        <Menu.Item fz="lg" py="md" component={Link} to="/profile/edit">Edit profile</Menu.Item>
        <Menu.Item fz="lg" py="md" component={Link} to="/chats">Your chats</Menu.Item>
        <Menu.Item fz="lg" py="md" component={Link} to="/invites">Your invites</Menu.Item>
        <Menu.Item fz="lg" py="md" component={Link} to="/" onClick={logout}>Log out</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  )
}
