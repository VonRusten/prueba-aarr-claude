import React from 'react'
import useWeddingStore from '../store/useWeddingStore.js'

export default function Header() {
  const guests = useWeddingStore((s) => s.guests)
  const tables = useWeddingStore((s) => s.tables)
  const view = useWeddingStore((s) => s.ui.view)
  const setView = useWeddingStore((s) => s.setView)

  const assigned = guests.filter((g) => g.tableId).length
  const unassigned = guests.length - assigned

  return (
    <header className="header">
      <div className="header-brand">
        <span className="brand-icon">💍</span>
        <h1>Wedding Seating Manager</h1>
      </div>

      <div className="header-stats">
        <div className="stat-chip">
          <span>Invitados:</span>
          <strong>{guests.length}</strong>
        </div>
        <div className="stat-chip">
          <span>Asignados:</span>
          <strong>{assigned}</strong>
        </div>
        {unassigned > 0 && (
          <div className="stat-chip" style={{ background: 'rgba(220,38,38,0.25)' }}>
            <span>Sin asignar:</span>
            <strong style={{ color: '#fca5a5' }}>{unassigned}</strong>
          </div>
        )}
        <div className="stat-chip">
          <span>Mesas:</span>
          <strong>{tables.length}</strong>
        </div>
      </div>

      <div className="view-switcher">
        <button
          className={`view-btn${view === 'list' ? ' active' : ''}`}
          onClick={() => setView('list')}
        >
          ☰ Lista
        </button>
        <button
          className={`view-btn${view === '2d' ? ' active' : ''}`}
          onClick={() => setView('2d')}
        >
          ⬛ Plano 2D
        </button>
        <button
          className={`view-btn${view === '3d' ? ' active' : ''}`}
          onClick={() => setView('3d')}
        >
          ◈ Vista 3D
        </button>
      </div>
    </header>
  )
}
