import React, { useState, useMemo } from 'react'
import useWeddingStore from '../store/useWeddingStore.js'

const SHAPE_ICONS = {
  round: '⭕',
  rect: '⬛',
  oval: '🥚',
  square: '🟥',
}

export default function TablePopover({ tableId, onClose }) {
  const tables = useWeddingStore((s) => s.tables)
  const guests = useWeddingStore((s) => s.guests)
  const families = useWeddingStore((s) => s.families)
  const assignGuestToTable = useWeddingStore((s) => s.assignGuestToTable)
  const removeGuestFromTable = useWeddingStore((s) => s.removeGuestFromTable)

  const [filterFamily, setFilterFamily] = useState('all')

  const table = tables.find((t) => t.id === tableId)
  if (!table) return null

  const assignedGuests = guests.filter((g) => g.tableId === tableId)
  const unassignedGuests = guests.filter((g) => !g.tableId)

  const filteredUnassigned = useMemo(() => {
    if (filterFamily === 'all') return unassignedGuests
    if (filterFamily === 'none') return unassignedGuests.filter((g) => !g.familyId)
    return unassignedGuests.filter((g) => g.familyId === filterFamily)
  }, [unassignedGuests, filterFamily])

  const getFamilyColor = (familyId) => {
    const f = families.find((f) => f.id === familyId)
    return f ? f.color : '#ccc'
  }

  const getFamilyName = (familyId) => {
    const f = families.find((f) => f.id === familyId)
    return f ? f.name : ''
  }

  const isFull = assignedGuests.length >= table.capacity

  return (
    <div className="table-popover">
      <div className="popover-header">
        <span style={{ fontSize: 18 }}>{SHAPE_ICONS[table.shape]}</span>
        <h3>{table.name}</h3>
        {table.isSpecial && (
          <span style={{
            fontSize: 10, background: 'rgba(201,169,110,0.3)', color: '#f0e0c0',
            padding: '2px 8px', borderRadius: 8, fontWeight: 700
          }}>
            {table.specialType || 'Especial'}
          </span>
        )}
        <button className="popover-close btn" onClick={onClose}>✕</button>
      </div>

      <div className="popover-capacity-info">
        <span>Ocupación:</span>
        <span className="capacity-badge">{assignedGuests.length} / {table.capacity}</span>
        {isFull && <span style={{ color: '#dc2626', fontSize: 11, fontWeight: 600 }}>COMPLETA</span>}
      </div>

      <div className="popover-body">
        <div className="popover-section-title">Invitados asignados ({assignedGuests.length})</div>
        {assignedGuests.length === 0 && (
          <p style={{ padding: '6px 14px', fontSize: 12, color: 'var(--text-light)', fontStyle: 'italic' }}>
            Sin invitados asignados
          </p>
        )}
        {assignedGuests.map((guest) => (
          <div key={guest.id} className="popover-guest-row">
            <div className="family-dot" style={{ background: getFamilyColor(guest.familyId) }} />
            <span className="popover-guest-name">{guest.name}</span>
            {guest.dietary && (
              <span style={{ fontSize: 10, color: 'var(--text-light)' }}>🍃</span>
            )}
            <button
              className="popover-action-btn remove"
              onClick={() => removeGuestFromTable(guest.id)}
              title="Quitar de la mesa"
            >×</button>
          </div>
        ))}

        <div style={{ height: 1, background: 'var(--border)', margin: '6px 0' }} />

        <div className="popover-section-title">Sin asignar ({unassignedGuests.length})</div>

        {unassignedGuests.length > 0 && (
          <div className="popover-filter">
            <select value={filterFamily} onChange={(e) => setFilterFamily(e.target.value)}>
              <option value="all">Todas las familias</option>
              {families.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
              <option value="none">Sin familia</option>
            </select>
          </div>
        )}

        {filteredUnassigned.length === 0 && (
          <p style={{ padding: '6px 14px', fontSize: 12, color: 'var(--text-light)', fontStyle: 'italic' }}>
            {unassignedGuests.length === 0 ? 'Todos los invitados están asignados' : 'No hay invitados con este filtro'}
          </p>
        )}
        {filteredUnassigned.map((guest) => (
          <div key={guest.id} className="popover-guest-row">
            <div className="family-dot" style={{ background: getFamilyColor(guest.familyId) }} />
            <span className="popover-guest-name">
              {guest.name}
              {guest.familyId && (
                <span style={{ fontSize: 10, color: 'var(--text-light)', marginLeft: 4 }}>
                  ({getFamilyName(guest.familyId)})
                </span>
              )}
            </span>
            <button
              className="popover-action-btn add"
              onClick={() => !isFull && assignGuestToTable(guest.id, tableId)}
              title={isFull ? 'Mesa completa' : 'Asignar a esta mesa'}
              disabled={isFull}
              style={{ opacity: isFull ? 0.4 : 1, cursor: isFull ? 'not-allowed' : 'pointer' }}
            >+</button>
          </div>
        ))}
      </div>
    </div>
  )
}
