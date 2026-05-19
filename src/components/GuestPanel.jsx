import React, { useState, useMemo, useRef } from 'react'
import * as XLSX from 'xlsx'
import useWeddingStore from '../store/useWeddingStore.js'

const COLORS = [
  '#e8a4c9', '#a4c8e8', '#a4e8b8', '#f0c89e', '#c9a4e8',
  '#e8e0a4', '#a4e8e0', '#e8b4a4', '#b4a4e8', '#a4b4e8',
]

function FamilySection() {
  const families = useWeddingStore((s) => s.families)
  const guests = useWeddingStore((s) => s.guests)
  const addFamily = useWeddingStore((s) => s.addFamily)
  const updateFamily = useWeddingStore((s) => s.updateFamily)
  const deleteFamily = useWeddingStore((s) => s.deleteFamily)

  const [showForm, setShowForm] = useState(false)
  const [newFamilyName, setNewFamilyName] = useState('')
  const [newFamilyColor, setNewFamilyColor] = useState(COLORS[0])
  const [editingId, setEditingId] = useState(null)
  const [editName, setEditName] = useState('')

  const guestCountByFamily = useMemo(() => {
    const map = {}
    guests.forEach((g) => {
      if (g.familyId) map[g.familyId] = (map[g.familyId] || 0) + 1
    })
    return map
  }, [guests])

  const handleAddFamily = () => {
    if (!newFamilyName.trim()) return
    addFamily({ name: newFamilyName.trim(), color: newFamilyColor })
    setNewFamilyName('')
    setNewFamilyColor(COLORS[Math.floor(Math.random() * COLORS.length)])
    setShowForm(false)
  }

  const handleStartEdit = (family) => {
    setEditingId(family.id)
    setEditName(family.name)
  }

  const handleSaveEdit = (id, currentColor) => {
    if (editName.trim()) updateFamily(id, { name: editName.trim() })
    setEditingId(null)
  }

  return (
    <div className="panel-section">
      <div className="panel-title">
        Familias
        <span className="count-badge">{families.length}</span>
      </div>

      {families.map((family) => (
        <div key={family.id} className="family-item">
          <div
            className="family-color-swatch"
            style={{ background: family.color }}
          />
          {editingId === family.id ? (
            <input
              className="form-input"
              style={{ flex: 1, padding: '3px 6px', fontSize: 13 }}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSaveEdit(family.id, family.color)
                if (e.key === 'Escape') setEditingId(null)
              }}
              autoFocus
            />
          ) : (
            <span className="family-name">{family.name}</span>
          )}
          <span className="family-count">{guestCountByFamily[family.id] || 0}</span>
          {editingId === family.id ? (
            <button className="btn btn-sm btn-primary" onClick={() => handleSaveEdit(family.id, family.color)}>✓</button>
          ) : (
            <>
              <button
                className="btn btn-icon btn-ghost"
                title="Cambiar color"
                style={{ position: 'relative', overflow: 'hidden' }}
              >
                <span>🎨</span>
                <input
                  type="color"
                  value={family.color}
                  onChange={(e) => updateFamily(family.id, { color: e.target.value })}
                  style={{
                    position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%'
                  }}
                />
              </button>
              <button className="btn btn-icon btn-ghost" onClick={() => handleStartEdit(family)}>✏️</button>
              <button
                className="btn btn-icon btn-ghost"
                onClick={() => {
                  if (confirm(`¿Eliminar familia "${family.name}"?`)) deleteFamily(family.id)
                }}
              >🗑️</button>
            </>
          )}
        </div>
      ))}

      {showForm && (
        <div className="inline-form" style={{ marginTop: 8 }}>
          <div className="form-group">
            <label className="form-label">Nombre de familia</label>
            <input
              className="form-input"
              placeholder="Ej: García"
              value={newFamilyName}
              onChange={(e) => setNewFamilyName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleAddFamily() }}
              autoFocus
            />
          </div>
          <div className="form-group">
            <label className="form-label">Color</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {COLORS.map((c) => (
                <div
                  key={c}
                  onClick={() => setNewFamilyColor(c)}
                  style={{
                    width: 24, height: 24, borderRadius: '50%', background: c, cursor: 'pointer',
                    border: newFamilyColor === c ? '2.5px solid #6b4c3b' : '2px solid rgba(0,0,0,0.1)',
                    transition: 'transform 0.1s',
                    transform: newFamilyColor === c ? 'scale(1.2)' : 'scale(1)'
                  }}
                />
              ))}
              <input
                type="color"
                value={newFamilyColor}
                onChange={(e) => setNewFamilyColor(e.target.value)}
                style={{ width: 24, height: 24, border: 'none', padding: 0, cursor: 'pointer', borderRadius: '50%' }}
                title="Color personalizado"
              />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancelar</button>
            <button className="btn btn-primary btn-sm" onClick={handleAddFamily}>Añadir</button>
          </div>
        </div>
      )}

      {!showForm && (
        <button
          className="btn btn-secondary btn-sm btn-full"
          style={{ marginTop: 8 }}
          onClick={() => setShowForm(true)}
        >
          + Nueva familia
        </button>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
// Excel / CSV import helper
// ──────────────────────────────────────────────────────────────
const NAME_KEYS    = ['nombre', 'name', 'invitado', 'guest', 'apellidos']
const FAMILY_KEYS  = ['familia', 'family', 'grupo', 'group']
const DIETARY_KEYS = ['dieta', 'dietary', 'alimentacion', 'alimentación', 'food', 'menu', 'menú']
const NOTES_KEYS   = ['notas', 'notes', 'observaciones', 'obs', 'comentarios']

function matchKey(headers, candidates) {
  for (const cand of candidates) {
    const found = headers.find(h => h.toLowerCase().replace(/\s+/g, '') === cand)
    if (found) return found
  }
  return null
}

function parseExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result)
        const wb = XLSX.read(data, { type: 'array' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(ws, { defval: '' })
        if (!rows.length) { resolve([]); return }

        const headers = Object.keys(rows[0])
        const nameKey    = matchKey(headers, NAME_KEYS)    || headers[0]
        const familyKey  = matchKey(headers, FAMILY_KEYS)  || null
        const dietaryKey = matchKey(headers, DIETARY_KEYS) || null
        const notesKey   = matchKey(headers, NOTES_KEYS)   || null

        const guests = rows
          .map(r => ({
            name:       String(r[nameKey] || '').trim(),
            familyName: familyKey  ? String(r[familyKey]  || '').trim() : '',
            dietary:    dietaryKey ? String(r[dietaryKey] || '').trim() : '',
            notes:      notesKey   ? String(r[notesKey]   || '').trim() : '',
          }))
          .filter(g => g.name)

        resolve(guests)
      } catch (err) {
        reject(err)
      }
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

function ExcelImport() {
  const bulkAddGuests = useWeddingStore((s) => s.bulkAddGuests)
  const fileRef = useRef(null)
  const [preview, setPreview] = useState(null)   // parsed guest list before confirm
  const [error, setError] = useState(null)

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setError(null)
    try {
      const parsed = await parseExcelFile(file)
      if (!parsed.length) { setError('No se encontraron invitados en el archivo.'); return }
      setPreview(parsed)
    } catch {
      setError('Error leyendo el archivo. Asegúrate de que es un Excel (.xlsx) o CSV válido.')
    }
    e.target.value = ''
  }

  const handleConfirm = () => {
    bulkAddGuests(preview)
    setPreview(null)
  }

  return (
    <div className="panel-section">
      <div className="panel-title">📥 Importar invitados</div>
      <p style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 10, lineHeight: 1.5 }}>
        Sube un Excel (.xlsx) o CSV con columnas: <strong>Nombre</strong>, Familia, Dieta, Notas
      </p>

      {error && (
        <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 6,
          padding: '8px 12px', fontSize: 12, color: '#dc2626', marginBottom: 8 }}>
          {error}
        </div>
      )}

      {preview && (
        <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8,
          padding: 12, marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#166534', marginBottom: 8 }}>
            ✅ {preview.length} invitados encontrados
          </div>
          <div style={{ maxHeight: 160, overflowY: 'auto', marginBottom: 10 }}>
            {preview.map((g, i) => (
              <div key={i} style={{ fontSize: 12, padding: '2px 0',
                borderBottom: '1px solid #bbf7d0', display: 'flex', gap: 8 }}>
                <span style={{ fontWeight: 600, flex: 1 }}>{g.name}</span>
                {g.familyName && <span style={{ color: '#15803d' }}>{g.familyName}</span>}
                {g.dietary && <span style={{ color: '#6b7280', fontStyle: 'italic' }}>{g.dietary}</span>}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setPreview(null)}>Cancelar</button>
            <button className="btn btn-primary btn-sm" style={{ flex: 1 }} onClick={handleConfirm}>
              Importar {preview.length} invitados
            </button>
          </div>
        </div>
      )}

      {!preview && (
        <>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            style={{ display: 'none' }}
            onChange={handleFile}
          />
          <button
            className="btn btn-secondary btn-full"
            onClick={() => fileRef.current?.click()}
          >
            📂 Seleccionar archivo Excel / CSV
          </button>
        </>
      )}
    </div>
  )
}

// ──────────────────────────────────────────────────────────────
export default function GuestPanel() {
  const guests = useWeddingStore((s) => s.guests)
  const families = useWeddingStore((s) => s.families)
  const tables = useWeddingStore((s) => s.tables)
  const addGuest = useWeddingStore((s) => s.addGuest)
  const updateGuest = useWeddingStore((s) => s.updateGuest)
  const deleteGuest = useWeddingStore((s) => s.deleteGuest)

  const [showForm, setShowForm] = useState(false)
  const [filterFamily, setFilterFamily] = useState('all')
  const [filterAssigned, setFilterAssigned] = useState('all')
  const [editingId, setEditingId] = useState(null)

  const [form, setForm] = useState({
    name: '', familyId: '', dietary: '', notes: ''
  })

  const [editForm, setEditForm] = useState({
    name: '', familyId: '', dietary: '', notes: ''
  })

  const filteredGuests = useMemo(() => {
    return guests.filter((g) => {
      if (filterFamily !== 'all' && g.familyId !== filterFamily) return false
      if (filterAssigned === 'assigned' && !g.tableId) return false
      if (filterAssigned === 'unassigned' && g.tableId) return false
      return true
    })
  }, [guests, filterFamily, filterAssigned])

  const getFamilyColor = (familyId) => {
    const f = families.find((f) => f.id === familyId)
    return f ? f.color : '#ccc'
  }

  const getTableName = (tableId) => {
    const t = tables.find((t) => t.id === tableId)
    return t ? t.name : null
  }

  const handleAdd = () => {
    if (!form.name.trim()) return
    addGuest({ name: form.name.trim(), familyId: form.familyId || null, dietary: form.dietary, notes: form.notes })
    setForm({ name: '', familyId: '', dietary: '', notes: '' })
    setShowForm(false)
  }

  const handleStartEdit = (guest) => {
    setEditingId(guest.id)
    setEditForm({ name: guest.name, familyId: guest.familyId || '', dietary: guest.dietary, notes: guest.notes })
  }

  const handleSaveEdit = (id) => {
    updateGuest(id, { name: editForm.name.trim(), familyId: editForm.familyId || null, dietary: editForm.dietary, notes: editForm.notes })
    setEditingId(null)
  }

  return (
    <>
      <div className="panel-section">
        <div className="panel-title">
          Invitados
          <span className="count-badge">{guests.length}</span>
        </div>

        <div className="filter-row">
          <select value={filterFamily} onChange={(e) => setFilterFamily(e.target.value)}>
            <option value="all">Todas las familias</option>
            {families.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
            <option value="none">Sin familia</option>
          </select>
          <select value={filterAssigned} onChange={(e) => setFilterAssigned(e.target.value)}>
            <option value="all">Todos</option>
            <option value="assigned">Asignados</option>
            <option value="unassigned">Sin asignar</option>
          </select>
        </div>

        {showForm && (
          <div className="inline-form">
            <div className="form-group">
              <label className="form-label">Nombre *</label>
              <input
                className="form-input"
                placeholder="Nombre completo"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Familia</label>
              <select
                className="form-select"
                value={form.familyId}
                onChange={(e) => setForm({ ...form, familyId: e.target.value })}
              >
                <option value="">Sin familia</option>
                {families.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Dieta</label>
              <input
                className="form-input"
                placeholder="Vegetariano, sin gluten..."
                value={form.dietary}
                onChange={(e) => setForm({ ...form, dietary: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Notas</label>
              <input
                className="form-input"
                placeholder="Observaciones..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>Cancelar</button>
              <button className="btn btn-primary btn-sm" onClick={handleAdd}>Añadir invitado</button>
            </div>
          </div>
        )}

        {!showForm && (
          <button className="btn btn-primary btn-full" onClick={() => setShowForm(true)}>
            + Añadir invitado
          </button>
        )}
      </div>

      <div className="panel-section" style={{ paddingTop: 8 }}>
        {filteredGuests.length === 0 && (
          <div className="empty-state">No hay invitados con estos filtros</div>
        )}
        {filteredGuests.map((guest) => (
          <div key={guest.id}>
            {editingId === guest.id ? (
              <div className="inline-form" style={{ marginBottom: 8 }}>
                <div className="form-group">
                  <label className="form-label">Nombre</label>
                  <input
                    className="form-input"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    autoFocus
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Familia</label>
                  <select
                    className="form-select"
                    value={editForm.familyId}
                    onChange={(e) => setEditForm({ ...editForm, familyId: e.target.value })}
                  >
                    <option value="">Sin familia</option>
                    {families.map((f) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Dieta</label>
                  <input
                    className="form-input"
                    value={editForm.dietary}
                    onChange={(e) => setEditForm({ ...editForm, dietary: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Notas</label>
                  <input
                    className="form-input"
                    value={editForm.notes}
                    onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  />
                </div>
                <div className="form-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => setEditingId(null)}>Cancelar</button>
                  <button className="btn btn-primary btn-sm" onClick={() => handleSaveEdit(guest.id)}>Guardar</button>
                </div>
              </div>
            ) : (
              <div className="guest-item">
                <div className="family-dot" style={{ background: getFamilyColor(guest.familyId) }} />
                <span className="guest-name" title={guest.name}>{guest.name}</span>
                <span className={`guest-table${!guest.tableId ? ' unassigned' : ''}`}>
                  {guest.tableId ? getTableName(guest.tableId) : 'Sin asignar'}
                </span>
                <div className="guest-actions">
                  <button className="btn btn-icon btn-ghost" onClick={() => handleStartEdit(guest)} title="Editar">✏️</button>
                  <button
                    className="btn btn-icon btn-ghost"
                    onClick={() => { if (confirm(`¿Eliminar a "${guest.name}"?`)) deleteGuest(guest.id) }}
                    title="Eliminar"
                  >🗑️</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <ExcelImport />
      <FamilySection />
    </>
  )
}
