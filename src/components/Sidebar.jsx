import React from 'react'
import useWeddingStore from '../store/useWeddingStore.js'
import GuestPanel from './GuestPanel.jsx'
import TablePanel from './TablePanel.jsx'
import DecorationPanel from './DecorationPanel.jsx'
import RoomSettings from './RoomSettings.jsx'

const TABS = [
  { id: 'guests', label: 'Invitados' },
  { id: 'tables', label: 'Mesas' },
  { id: 'decor', label: 'Decoración' },
  { id: 'room', label: 'Sala' },
]

export default function Sidebar() {
  const sidebarTab = useWeddingStore((s) => s.ui.sidebarTab)
  const setSidebarTab = useWeddingStore((s) => s.setSidebarTab)

  return (
    <aside className="sidebar">
      <div className="sidebar-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            className={`sidebar-tab${sidebarTab === tab.id ? ' active' : ''}`}
            onClick={() => setSidebarTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="sidebar-content">
        {sidebarTab === 'guests' && <GuestPanel />}
        {sidebarTab === 'tables' && <TablePanel />}
        {sidebarTab === 'decor' && <DecorationPanel />}
        {sidebarTab === 'room' && <RoomSettings />}
      </div>
    </aside>
  )
}
