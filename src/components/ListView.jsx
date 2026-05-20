import { useState, useMemo } from 'react'
import useWeddingStore from '../store/useWeddingStore.js'

const SHAPE_LABELS = { round: 'Redonda', rect: 'Rectangular', oval: 'Ovalada', square: 'Cuadrada' }
const SHAPE_ICONS  = { round: '⭕', rect: '⬛', oval: '🥚', square: '🟥' }

export default function ListView() {
  const tables   = useWeddingStore(s => s.tables)
  const guests   = useWeddingStore(s => s.guests)
  const families = useWeddingStore(s => s.families)
  const [expanded, setExpanded] = useState({})

  const totalGuests = guests.length
  const assigned    = guests.filter(g => g.tableId).length
  const unassigned  = totalGuests - assigned

  const guestsByTable = useMemo(() => {
    const map = {}
    tables.forEach(t => { map[t.id] = [] })
    guests.forEach(g => { if (g.tableId && map[g.tableId]) map[g.tableId].push(g) })
    return map
  }, [tables, guests])

  const getFamilyColor = (fid) => families.find(f => f.id === fid)?.color || '#9CA3AF'
  const getFamilyName  = (fid) => families.find(f => f.id === fid)?.name || '—'

  const noTableGuests = guests.filter(g => !g.tableId)
  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }))

  return (
    <div className="list-view">
      <div className="lv-title">Resumen de mesas</div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-val">{totalGuests}</div>
          <div className="stat-card-lbl">Invitados totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-val" style={{ color: '#16A34A' }}>{assigned}</div>
          <div className="stat-card-lbl">Asignados</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-val" style={{ color: unassigned > 0 ? '#DC2626' : '#16A34A' }}>{unassigned}</div>
          <div className="stat-card-lbl">Sin mesa</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-val">{tables.length}</div>
          <div className="stat-card-lbl">Mesas</div>
        </div>
      </div>

      <div className="table-cards">
        {tables.map(table => {
          const tGuests = guestsByTable[table.id] || []
          const isOpen = expanded[table.id]
          const pct = Math.min(100, (tGuests.length / table.capacity) * 100)

          return (
            <div key={table.id} className="table-card">
              <div className="tc-header" onClick={() => toggle(table.id)}>
                <span>{SHAPE_ICONS[table.shape]}</span>
                <span className="tc-name">{table.name}</span>
                <span className="tc-meta">{tGuests.length}/{table.capacity}</span>
                <span style={{ color: '#9CA3AF', fontSize: 11 }}>{isOpen ? '▲' : '▼'}</span>
              </div>
              <div className="tc-bar">
                <div className={`tc-fill${pct >= 100 ? ' full' : pct >= 80 ? ' near' : ''}`}
                  style={{ width: `${pct}%` }} />
              </div>
              {isOpen && (
                <div className="tc-guests">
                  {tGuests.length === 0 ? (
                    <span style={{ fontSize: 12, color: '#9CA3AF', fontStyle: 'italic' }}>Sin invitados</span>
                  ) : (
                    tGuests.map(g => (
                      <div key={g.id} className="guest-tag">
                        <div style={{ width: 7, height: 7, borderRadius: '50%', background: getFamilyColor(g.familyId), flexShrink: 0 }} />
                        {g.name}
                        {g.dietary && (
                          <span style={{ fontSize: 10, color: '#C9956C', borderLeft: '1px solid #E5E7EB', paddingLeft: 5 }}>
                            {g.dietary}
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {noTableGuests.length > 0 && (
        <div className="unassigned-section" style={{ marginTop: 20 }}>
          <div className="unassigned-title">⚠️ Sin asignar ({noTableGuests.length})</div>
          <div className="guest-chips">
            {noTableGuests.map(g => (
              <div key={g.id} className="guest-chip">
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: getFamilyColor(g.familyId), flexShrink: 0 }} />
                {g.name}
              </div>
            ))}
          </div>
        </div>
      )}

      {tables.length === 0 && (
        <div className="empty-state" style={{ marginTop: 40 }}>
          <div className="empty-icon">🪑</div>
          No hay mesas configuradas.<br />
          Crea mesas desde el panel derecho.
        </div>
      )}
    </div>
  )
}
