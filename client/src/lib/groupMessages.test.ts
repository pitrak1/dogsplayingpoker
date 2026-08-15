import { describe, it, expect } from 'vitest'
import { groupMessages } from '@/lib/groupMessages'
import { makeUser, makeMessage } from '@/test/factories'

describe('groupMessages', () => {
  it('returns an empty array for empty input', () => {
    expect(groupMessages([])).toEqual([])
  })

  it('returns a single group for a single message', () => {
    const user = makeUser({ id: 1 })
    const message = makeMessage({ id: 1, createdBy: 1, creator: user })
    const result = groupMessages([message])

    expect(result).toHaveLength(1)
    expect(result[0].user).toEqual(user)
    expect(result[0].messages).toEqual([message])
    expect(result[0].createdAt).toEqual(message.createdAt)
  })

  it('groups consecutive messages from the same user', () => {
    const user = makeUser({ id: 1 })
    const messages = [
      makeMessage({ id: 1, createdBy: 1, creator: user }),
      makeMessage({ id: 2, createdBy: 1, creator: user }),
      makeMessage({ id: 3, createdBy: 1, creator: user }),
    ]
    const result = groupMessages(messages)

    expect(result).toHaveLength(1)
    expect(result[0].messages).toHaveLength(3)
  })

  it('creates separate groups for different users', () => {
    const userA = makeUser({ id: 1 })
    const userB = makeUser({ id: 2 })
    const messages = [
      makeMessage({ id: 1, createdBy: 1, creator: userA }),
      makeMessage({ id: 2, createdBy: 2, creator: userB }),
    ]
    const result = groupMessages(messages)

    expect(result).toHaveLength(2)
    expect(result[0].user).toEqual(userA)
    expect(result[1].user).toEqual(userB)
  })

  it('starts a new group when the same user sends again after another user', () => {
    const userA = makeUser({ id: 1 })
    const userB = makeUser({ id: 2 })
    const messages = [
      makeMessage({ id: 1, createdBy: 1, creator: userA }),
      makeMessage({ id: 2, createdBy: 2, creator: userB }),
      makeMessage({ id: 3, createdBy: 1, creator: userA }),
    ]
    const result = groupMessages(messages)

    expect(result).toHaveLength(3)
    expect(result[0].user.id).toBe(1)
    expect(result[1].user.id).toBe(2)
    expect(result[2].user.id).toBe(1)
  })

  it('skips messages with no creator', () => {
    const userA = makeUser({ id: 1 })
    const userB = makeUser({ id: 2 })
    const messages = [
      makeMessage({ id: 1, createdBy: 1, creator: userA }),
      makeMessage({ id: 2, createdBy: 2, creator: null }),
      makeMessage({ id: 3, createdBy: 2, creator: userB }),
    ]
    const result = groupMessages(messages)

    expect(result).toHaveLength(2)
    expect(result[0].messages[0].id).toBe(1)
    expect(result[1].messages[0].id).toBe(3)
  })

  it('sets createdAt to the first message in the group', () => {
    const user = makeUser({ id: 1 })
    const messages = [
      makeMessage({ id: 1, createdBy: 1, creator: user, createdAt: new Date('2024-01-01T00:00:01.000Z') }),
      makeMessage({ id: 2, createdBy: 1, creator: user, createdAt: new Date('2024-01-01T00:00:02.000Z') }),
    ]
    const result = groupMessages(messages)

    expect(result[0].createdAt).toEqual(messages[0].createdAt)
  })
})
