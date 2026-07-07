import './mapBlocker.scss'

type Props = { children: React.ReactNode }

export function MapBlocker({ children }: Props) {
  return <div className="map-blocker">{children}</div>
}

function Title({ children }: { children: React.ReactNode }) {
  return <h2 className="map-blocker__title">{children}</h2>
}

function Description({ children }: { children: React.ReactNode }) {
  return <p className="map-blocker__description">{children}</p>
}

MapBlocker.Title = Title
MapBlocker.Description = Description