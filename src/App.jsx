import React from 'react'
import useWeddingStore from './store/useWeddingStore.js'
import GuestPanel from './components/GuestPanel.jsx'
import TableDetail from './components/TableDetail.jsx'
import FloorPlan2D from './components/FloorPlan2D.jsx'
import FloorPlan3D from './components/FloorPlan3D.jsx'
import ListView from './components/ListView.jsx'

export default function App() {
  const view = useWeddingStore(s => s.ui.view)
  const setView = useWeddingStore(s => s.setView)
  const guests = useWeddingStore(s => s.guests)
  const tables = useWeddingStore(s => s.tables)
  const room = useWeddingStore(s => s.room)
  const updateRoom = useWeddingStore(s => s.updateRoom)

  const assigned = guests.filter(g => g.tableId).length
  const unassigned = guests.length - assigned

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-icon">💍</span>
          <h1>Seating Planner</h1>
        </div>
        <div className="hdr-div" />
        <input
          className="event-name-input"
          value={room.name}
          onChange={e => updateRoom({ name: e.target.value })}
          placeholder="Nombre del evento..."
        />
        <div className="hdr-stats">
          <div className="stat-pill">
            <span>Invitados</span>
            <strong>{guests.length}</strong>
          </div>
          <div className="stat-pill">
            <span>Mesas</span>
            <strong>{tables.length}</strong>
          </div>
          {unassigned > 0 && (
            <div className="stat-pill warn">
              <span>Sin mesa</span>
              <strong>{unassigned}</strong>
            </div>
          )}
        </div>
        <div className="view-tabs">
          <button className={`view-tab${view === '2d' ? ' active' : ''}`} onClick={() => setView('2d')}>
            Plano
          </button>
          <button className={`view-tab${view === '3d' ? ' active' : ''}`} onClick={() => setView('3d')}>
            3D
          </button>
          <button className={`view-tab${view === 'list' ? ' active' : ''}`} onClick={() => setView('list')}>
            Lista
          </button>
        </div>
      </header>

      <div className="app-body">
        <aside className="panel-left">
          <GuestPanel />
        </aside>
        <main className="canvas-area">
          {view === '2d' && <FloorPlan2D />}
          {view === '3d' && <FloorPlan3D />}
          {view === 'list' && <ListView />}
        </main>
        <aside className="panel-right">
          <TableDetail />
        </aside>
      </div>
    </div>
  )
}
