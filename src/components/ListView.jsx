import { useState, useMemo } from 'react'
import useWeddingStore from '../store/useWeddingStore.js'

const SHAPE_LABELS = { round: 'Redonda', rect: 'Rectangular', oval: 'Ovalada', square: 'Cuadrada' }
const SHAPE_ICONS  = { round: '⭕', rect: '⬛', oval: '🥚', square: '🟥' }

export default function ListView() {
  const tables  = useWeddingStore(s => s.tables)
  const guests  = useWeddingStore(s => s.guests)
  const families = useWeddingStore(s => s.families)
  const [expanded, setExpanded] = useState({})

  const totalGuests   = guests.length
  const assigned      = guests.filter(g => g.tableId).length
  const unassigned    = totalGuests - assigned
  const emptyTables   = tables.filter(t => !guests.some(g => g.tableId === t.id)).length

  const guestsByTable = useMemo(() => {
    const map = {}
    tables.forEach(t => { map[t.id] = [] })
    guests.forEach(g => { if (g.tableId && map[g.tableId]) map[g.tableId].push(g) })
    return map
  }, [tables, guests])

  const getFamilyColor = (fid) => (families.find(f => f.id === fid) || {}).color || '#ccc'
  const getFamilyName  = (fid) => (families.find(f => f.id === fid) || {}).name || '—'

  const guestsWithNoTable = guests.filter(g => !g.tableId)

  const toggle = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="list-view">
      {/* Stats */}
      <div className="list-stats-row">
        <div className="list-stat-card">
          <div className="stat-value">{totalGuests}</div>
          <div className="stat-label">Invitados totales</div>
        </div>
        <div className="list-stat-card">
          <div className="stat-value" style={{ color: '#16a34a' }}>{assigned}</div>
          <div className="stat-label">Asignados</div>
        </div>
        <div className="list-stat-card">
          <div className="stat-value" style={{ color: unassigned > 0 ? '#dc2626' : '#16a34a' }}>{unassigned}</div>
          <div className="stat-label">Sin asignar</div>
        </div>
        <div className="list-stat-card">
          <div className="stat-value">{tables.length}</div>
          <div className="stat-label">Mesas</div>
        </div>
        {emptyTables > 0 && (
          <div className="list-stat-card">
            <div className="stat-value" style={{ color: '#f59e0b' }}>{emptyTables}</div>
            <div className="stat-label">Mesas vacías</div>
          </div>
        )}
      </div>

      {/* Tables grid */}
      <div className="table-cards-grid">
        {tables.map(table => {
          const tableGuests = guestsByTable[table.id] || []
          const isOpen = expanded[table.id]
          const fillPct = Math.min(100, (tableGuests.length / table.capacity) * 100)

          const byFamily = {}
          tableGuests.forEach(g => {
            const key = g.familyId || '__none__'
            if (!byFamily[key]) byFamily[key] = []
            byFamily[key].push(g)
          })

          return (
            <div key={table.id} className={`table-card${table.isSpecial ? ' is-special' : ''}`}>
              <div className="table-card-header" onClick={() => toggle(table.id)}>
                <span style={{ fontSize: 20 }}>{SHAPE_ICONS[table.shape]}</span>
                <span className="table-card-title">{table.name}</span>
                <div className="table-card-meta">
                  {table.isSpecial && <span className="special-badge">{table.specialType || 'Especial'}</span>}
                  <span className="shape-badge">{SHAPE_LABELS[table.shape]}</span>
                  <span>{tableGuests.length}/{table.capacity}</span>
                  <span className="expand-toggle">{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              <div style={{ padding: '0 16px 4px' }}>
                <div className="capacity-track" style={{ height: 5, marginTop: 8, marginBottom: 6 }}>
                  <div className="capacity-fill" style={{ width: `${fillPct}%`,
                    background: fillPct >= 100 ? '#dc2626' : fillPct >= 75 ? '#f59e0b' : 'var(--gold)' }} />
                </div>
              </div>

              {isOpen && (
                <div className="table-card-body">
                  {tableGuests.length === 0 ? (
                    <div className="empty-table-msg">Sin invitados asignados</div>
                  ) : (
                    Object.entries(byFamily).map(([fid, fGuests]) => (
                      <div key={fid}>
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '6px 0 3px', borderBottom: '1px solid var(--cream-dark)',
                          fontSize: 11, fontWeight: 700, color: 'var(--text-mid)',
                          textTransform: 'uppercase', letterSpacing: '0.4px'
                        }}>
                          {fid !== '__none__' && (
                            <div className="family-dot" style={{ background: getFamilyColor(fid), width: 8, height: 8 }} />
                          )}
                          {fid !== '__none__' ? getFamilyName(fid) : 'Sin familia'}
                          <span style={{ fontWeight: 400, color: 'var(--text-light)' }}>({fGuests.length})</span>
                        </div>
                        {fGuests.map(g => (
                          <div key={g.id} className="guest-in-table">
                            <div className="family-dot" style={{ background: getFamilyColor(g.familyId) }} />
                            <span className="guest-in-table-name">{g.name}</span>
                            {g.dietary && <span className="dietary-tag">{g.dietary}</span>}
                            {g.notes && (
                              <span style={{ fontSize: 10, color: 'var(--text-light)', fontStyle: 'italic' }}>
                                {g.notes}
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Unassigned guests */}
      {guestsWithNoTable.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h2 style={{ fontSize: 16, color: '#dc2626', marginBottom: 12,
            fontFamily: 'Playfair Display, Georgia, serif', display: 'flex', alignItems: 'center', gap: 8 }}>
            ⚠️ Sin asignar ({guestsWithNoTable.length})
          </h2>
          <div style={{ background: '#fff5f5', border: '1px dashed #fca5a5', borderRadius: 10, padding: 12 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {guestsWithNoTable.map(g => (
                <div key={g.id} style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  background: 'white', border: '1px solid #fecaca',
                  borderRadius: 20, padding: '4px 12px', fontSize: 13
                }}>
                  <div className="family-dot" style={{ background: getFamilyColor(g.familyId) }} />
                  {g.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tables.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-light)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🪑</div>
          <div style={{ fontSize: 18, fontFamily: 'Playfair Display, Georgia, serif', marginBottom: 8 }}>
            No hay mesas configuradas
          </div>
          <div style={{ fontSize: 13 }}>Añade mesas desde el panel lateral</div>
        </div>
      )}
    </div>
  )
}
