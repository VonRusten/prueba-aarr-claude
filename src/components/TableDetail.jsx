import React, { useState, useMemo } from 'react'
import useWeddingStore from '../store/useWeddingStore.js'
import RoomSettings from './RoomSettings.jsx'

const SHAPE_ICONS  = { round: '⭕', rect: '⬛', oval: '🥚', square: '🟥' }
const SHAPE_LABELS = { round: 'Redonda', rect: 'Rect.', oval: 'Ovalada', square: 'Cuadrada' }
const SPECIAL_TYPES = ['Mesa Principal', 'VIP', 'Padrinos', 'Familia', 'Cabecera', 'Honor']

function getSeatedGuests(tableGuests, capacity) {
  const seated = new Array(capacity).fill(null)
  const fixed  = tableGuests.filter(g => g.seatIndex != null && g.seatIndex >= 0 && g.seatIndex < capacity)
  const free   = tableGuests.filter(g => g.seatIndex == null || g.seatIndex < 0 || g.seatIndex >= capacity)
  fixed.forEach(g => { seated[g.seatIndex] = g })
  let next = 0
  free.forEach(g => {
    while (next < capacity && seated[next] !== null) next++
    if (next < capacity) seated[next] = g
    next++
  })
  return seated
}

export default function TableDetail() {
  const tables             = useWeddingStore(s => s.tables)
  const guests             = useWeddingStore(s => s.guests)
  const families           = useWeddingStore(s => s.families)
  const selectedTableId    = useWeddingStore(s => s.ui.selectedTableId)
  const selectedGuestIds   = useWeddingStore(s => s.ui.selectedGuestIds)
  const setSelectedTable   = useWeddingStore(s => s.setSelectedTable)
  const addTable           = useWeddingStore(s => s.addTable)
  const updateTable        = useWeddingStore(s => s.updateTable)
  const deleteTable        = useWeddingStore(s => s.deleteTable)
  const removeGuestFromTable = useWeddingStore(s => s.removeGuestFromTable)
  const assignGuestToSeat  = useWeddingStore(s => s.assignGuestToSeat)
  const toggleGuestSelection = useWeddingStore(s => s.toggleGuestSelection)

  const [showAdd, setShowAdd] = useState(false)
  const [showRoom, setShowRoom] = useState(false)
  const [addForm, setAddForm] = useState({ name: '', shape: 'round', capacity: 8, isSpecial: false, specialType: '' })

  const selectedTable = tables.find(t => t.id === selectedTableId)

  const familyMap = useMemo(() => {
    const m = {}
    families.forEach(f => { m[f.id] = f })
    return m
  }, [families])

  const guestCount = useMemo(() => {
    const m = {}
    tables.forEach(t => { m[t.id] = guests.filter(g => g.tableId === t.id).length })
    return m
  }, [tables, guests])

  const handleAddTable = () => {
    if (!addForm.name.trim()) return
    addTable({ ...addForm, name: addForm.name.trim() })
    setAddForm({ name: '', shape: 'round', capacity: 8, isSpecial: false, specialType: '' })
    setShowAdd(false)
  }

  if (showRoom) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
        <div className="pr-header">
          <button className="td-back" onClick={() => setShowRoom(false)}>← Volver</button>
          <div className="pr-title">Configurar sala</div>
        </div>
        <div className="pr-body">
          <RoomSettings />
        </div>
      </div>
    )
  }

  if (selectedTable) {
    return <TableDetailView
      table={selectedTable}
      guests={guests}
      familyMap={familyMap}
      selectedGuestIds={selectedGuestIds}
      onBack={() => setSelectedTable(null)}
      onUpdate={(updates) => updateTable(selectedTable.id, updates)}
      onDelete={() => { if (confirm(`¿Eliminar mesa "${selectedTable.name}"?`)) { deleteTable(selectedTable.id) } }}
      onRemoveGuest={removeGuestFromTable}
      onAssignToSeat={(seatIndex) => {
        if (selectedGuestIds.length > 0) {
          assignGuestToSeat(selectedGuestIds[0], selectedTable.id, seatIndex)
          toggleGuestSelection(selectedGuestIds[0])
        }
      }}
    />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="pr-header">
        <div className="pr-title">
          Mesas
          <span style={{ fontFamily: 'Inter', fontSize: 11, fontWeight: 600, background: '#F3F4F6', color: '#6B7280', padding: '1px 7px', borderRadius: 999 }}>
            {tables.length}
          </span>
        </div>
      </div>
      <div className="pr-body">
        {/* Add table button / form */}
        {!showAdd ? (
          <button className="btn btn-primary btn-full btn-sm" style={{ marginBottom: 10 }} onClick={() => setShowAdd(true)}>
            + Nueva mesa
          </button>
        ) : (
          <AddTableForm
            form={addForm}
            onChange={setAddForm}
            onSubmit={handleAddTable}
            onCancel={() => setShowAdd(false)}
          />
        )}

        {/* Table list */}
        {tables.length === 0 && !showAdd && (
          <div className="empty-state">
            <div className="empty-icon">🪑</div>
            Aún no hay mesas.<br />Crea la primera mesa.
          </div>
        )}

        {tables.map(table => {
          const count = guestCount[table.id] || 0
          const pct = Math.min(100, (count / table.capacity) * 100)
          return (
            <div
              key={table.id}
              className={`tbl-item${selectedTableId === table.id ? ' active' : ''}`}
              onClick={() => setSelectedTable(table.id)}
            >
              <div className="tbl-shape-ico">{SHAPE_ICONS[table.shape]}</div>
              <div className="tbl-info">
                <div className="tbl-name">{table.name}</div>
                <div className="tbl-cap-row">
                  <div className="cap-bar">
                    <div className={`cap-fill${pct >= 100 ? ' full' : pct >= 80 ? ' near' : ''}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                  <span className="cap-text">{count}/{table.capacity}</span>
                  {table.isSpecial && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#C9956C', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      ★ {table.specialType || 'Especial'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {/* Room settings link */}
        <div className="pr-sep" style={{ marginTop: 16 }} />
        <button className="btn btn-ghost btn-sm btn-full" style={{ justifyContent: 'flex-start', gap: 8 }}
          onClick={() => setShowRoom(true)}>
          ⚙️ Configurar sala
        </button>
      </div>
    </div>
  )
}

function TableDetailView({ table, guests, familyMap, selectedGuestIds, onBack, onUpdate, onDelete, onRemoveGuest, onAssignToSeat }) {
  const tableGuests = guests.filter(g => g.tableId === table.id)
  const seated = getSeatedGuests(tableGuests, table.capacity)
  const count = tableGuests.length
  const pct = Math.min(100, (count / table.capacity) * 100)
  const [editingName, setEditingName] = useState(false)
  const [nameVal, setNameVal] = useState(table.name)

  const handleNameBlur = () => {
    setEditingName(false)
    if (nameVal.trim() && nameVal.trim() !== table.name) onUpdate({ name: nameVal.trim() })
    else setNameVal(table.name)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="pr-header">
        <button className="td-back" onClick={onBack}>← Todas las mesas</button>
        <div className="td-name-row">
          <input
            className="td-name"
            value={editingName ? nameVal : table.name}
            onFocus={() => { setEditingName(true); setNameVal(table.name) }}
            onChange={e => setNameVal(e.target.value)}
            onBlur={handleNameBlur}
            onKeyDown={e => e.key === 'Enter' && e.target.blur()}
          />
          <span className="shape-pill">{SHAPE_LABELS[table.shape] || table.shape}</span>
        </div>
        <div className="td-cap-bar">
          <div className={`td-cap-fill${pct >= 100 ? ' full' : pct >= 80 ? ' near' : ''}`}
            style={{ width: `${pct}%` }} />
        </div>
        <div className="td-cap-nums">
          <span>{count} de {table.capacity} asientos</span>
          <span>{table.capacity - count} libres</span>
        </div>
      </div>

      <div className="pr-body">
        {/* Seat list */}
        <div className="seat-sec-lbl">Asientos</div>
        {seated.map((guest, i) => {
          const family = guest?.familyId ? familyMap[guest.familyId] : null
          const fColor = family?.color || '#9CA3AF'
          const canAssign = !guest && selectedGuestIds.length > 0

          return (
            <div key={i} className="seat-item">
              <span className="seat-num">{i + 1}</span>
              <div
                className={`seat-dot${guest ? '' : ' empty'}`}
                style={guest ? { background: fColor } : {}}
              >
                {guest ? (guest.name[0] || '?') : '+'}
              </div>
              <span className={`seat-name${guest ? '' : ' empty'}`}>
                {guest ? guest.name : canAssign ? 'Clic para asignar' : 'Vacío'}
              </span>
              {guest ? (
                <button className="seat-act rm" title="Quitar de esta mesa"
                  onClick={() => onRemoveGuest(guest.id)}>×</button>
              ) : (
                <button
                  className={`seat-act add${!selectedGuestIds.length ? '' : ''}`}
                  title={selectedGuestIds.length ? 'Asignar invitado seleccionado' : 'Selecciona un invitado primero'}
                  style={{ opacity: selectedGuestIds.length ? 1 : 0.35 }}
                  onClick={() => canAssign && onAssignToSeat(i)}
                >+</button>
              )}
            </div>
          )
        })}

        {selectedGuestIds.length > 0 && (
          <div style={{ marginTop: 8, padding: '7px 10px', background: 'rgba(201,149,108,0.1)', border: '1px solid rgba(201,149,108,0.3)', borderRadius: 8, fontSize: 12, color: '#A67A52' }}>
            💡 Clic en + para asignar el invitado seleccionado a un asiento
          </div>
        )}

        <div className="pr-sep" />

        {/* Shape selector */}
        <div className="pr-sec-lbl">Forma de mesa</div>
        <div className="radio-row" style={{ marginBottom: 12 }}>
          {Object.entries(SHAPE_LABELS).map(([shape, label]) => (
            <label key={shape} className={`ro${table.shape === shape ? ' sel' : ''}`}>
              <input type="radio" checked={table.shape === shape} onChange={() => onUpdate({ shape })} />
              {SHAPE_ICONS[shape]} {label}
            </label>
          ))}
        </div>

        {/* Capacity */}
        <div className="pr-sec-lbl">Capacidad</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <button className="btn btn-secondary btn-xs"
            onClick={() => onUpdate({ capacity: Math.max(1, table.capacity - 1) })}>−</button>
          <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Cormorant Garamond', minWidth: 32, textAlign: 'center' }}>
            {table.capacity}
          </span>
          <button className="btn btn-secondary btn-xs"
            onClick={() => onUpdate({ capacity: Math.min(30, table.capacity + 1) })}>+</button>
          <span style={{ fontSize: 12, color: '#6B7280' }}>comensales</span>
        </div>

        {/* Rotation */}
        <div className="pr-sec-lbl">Rotación</div>
        <div className="rot-row" style={{ marginBottom: 14 }}>
          {[0, 90, 180, 270].map(deg => (
            <button key={deg}
              className={`rot-btn${(table.rotation || 0) === deg ? ' active' : ''}`}
              onClick={() => onUpdate({ rotation: deg })}>
              {deg}°
            </button>
          ))}
        </div>

        {/* Special type */}
        <div className="pr-sec-lbl">Tipo especial</div>
        <div style={{ marginBottom: 14 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, cursor: 'pointer', marginBottom: 6 }}>
            <input type="checkbox" checked={table.isSpecial}
              onChange={e => onUpdate({ isSpecial: e.target.checked })} />
            Mesa especial
          </label>
          {table.isSpecial && (
            <select className="fi" value={table.specialType}
              onChange={e => onUpdate({ specialType: e.target.value })}>
              <option value="">Sin tipo específico</option>
              {SPECIAL_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          )}
        </div>

        <div className="pr-sep" />
        <button className="btn btn-danger btn-full btn-sm" onClick={onDelete}>
          🗑️ Eliminar mesa
        </button>
      </div>
    </div>
  )
}

function AddTableForm({ form, onChange, onSubmit, onCancel }) {
  return (
    <div className="add-tbl-form">
      <div className="fg">
        <label>Nombre *</label>
        <input className="fi" placeholder="Mesa 1, Mesa VIP..." value={form.name}
          onChange={e => onChange({ ...form, name: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && onSubmit()}
          autoFocus />
      </div>
      <div className="fg">
        <label>Forma</label>
        <div className="radio-row">
          {Object.entries(SHAPE_LABELS).map(([shape, label]) => (
            <label key={shape} className={`ro${form.shape === shape ? ' sel' : ''}`}>
              <input type="radio" checked={form.shape === shape} onChange={() => onChange({ ...form, shape })} />
              {SHAPE_ICONS[shape]} {label}
            </label>
          ))}
        </div>
      </div>
      <div className="fg">
        <label>Capacidad</label>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button className="btn btn-secondary btn-xs" onClick={() => onChange({ ...form, capacity: Math.max(1, form.capacity - 1) })}>−</button>
          <span style={{ fontWeight: 700, minWidth: 28, textAlign: 'center' }}>{form.capacity}</span>
          <button className="btn btn-secondary btn-xs" onClick={() => onChange({ ...form, capacity: Math.min(30, form.capacity + 1) })}>+</button>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={onCancel}>Cancelar</button>
        <button className="btn btn-primary btn-sm" style={{ flex: 2 }} onClick={onSubmit}>Crear mesa</button>
      </div>
    </div>
  )
}
