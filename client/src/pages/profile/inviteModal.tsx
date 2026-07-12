import { forwardRef, useState } from 'react'
import { User } from 'dogsplayingpoker-shared/schemas/user'
import { X, Send } from 'lucide-react'
import './inviteModal.scss'

type Props = {
  user: User | null
  onClose: () => void
  onSend: (message: string) => void
  isSendDisabled: boolean
}

export const InviteModal = forwardRef<HTMLDialogElement, Props>(({ user, onClose, onSend, isSendDisabled }, ref) => {
  const [message, setMessage] = useState('')

  return (
    <dialog ref={ref} className="invite-modal">
      <div className="invite-modal__header">
        <h3 className="invite-modal__title">Send a chat invite to {user?.username}?</h3>
        <button aria-label="close chat invite modal" className="invite-modal__close-button" onClick={onClose}><X size={24} /></button>
      </div>
      <label htmlFor="message" className="invite-modal__label">You may optionally include a nice message with your invite.</label>
      <textarea className="invite-modal__input" id="message" name="message" rows={3} onChange={(e) => setMessage(e.target.value)}></textarea>
      <div className="invite-modal__send-button-container">
        <button className="invite-modal__send-button" onClick={() => onSend(message)} disabled={isSendDisabled}><Send size={24}/>Send</button>
      </div>
    </dialog>
  )
})
