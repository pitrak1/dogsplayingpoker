import './errorBanner.scss'

export function ErrorBanner({ message }: { message: string | null }) {
  const showBanner = !!message

  return (
    <div className={`error-banner ${showBanner && 'visible'}`}>
      {message}
    </div>
  )
}
