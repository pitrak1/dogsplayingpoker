import type { FullMessage, MessageGroup } from "dogsplayingpoker-shared/message"

export function groupMessages(messages: FullMessage[]): MessageGroup[] {
  return messages.reduce((acc: MessageGroup[], message: FullMessage) => {
    const lastGroup = acc.length > 0 ? acc[acc.length - 1] : null
    if (lastGroup?.user.id === message.createdBy) {
      lastGroup.messages.push(message)
    } else if (message.creator) {
      acc.push({ user: message.creator, createdAt: message.createdAt, messages: [message] })
    }
    return acc
  }, [])
}