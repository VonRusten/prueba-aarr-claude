import React, { useState, useMemo } from 'react'
import * as XLSX from 'xlsx'
import useWeddingStore from '../store/useWeddingStore.js'

const FAMILY_COLORS = [
  '#e8a4c9','#a4c8e8','#a4e8b8','#f0c89e','#c9a4e8',
  '#e8e0a4','#a4e8e0','#e8b4a4','#b4a4e8','#f0a4a4',
]

const NAME_KEYS     = ['nombre','name','invitado','guest','nombre completo','full name']
const FAMILY_KEYS   = ['familia','family','grupo','group','apellido','surname','apellidos']
const DIETARY_KEYS  = ['menu','menú','dieta','dietary','alimentación','restricción','restriction']
const NOTES_KEYS    = ['nota','notas','notes','comentario','observación','comment']

function findCol(headers, keys) {
  return headers.find(h => keys.some(k => h.toLowerCase().replace(/[^a-záéíóúñ\s]/gi,'').trim().includes(k)))
}

export default function GuestPanel() {
  const guests               = useWeddingStore(s => s.guests)
  const families             = useWeddingStore(s => s.families)
  const tables               = useWeddingStore(s => s.tables)
  const selectedGuestIds     = useWeddingStore(s => s.ui.selectedGuestIds)
  const toggleGuestSelection = useWeddingStore(s => s.toggleGuestSelection)
  const selectFamily         = useWeddingStore(s => s.selectFamily)
  const clearSelection       = useWeddingStore(s => s.clearSelection)
  const addGuest             = useWeddingStore(s => s.addGuest)
  const addFamily            = useWeddingStore(s => s.addFamily)
  const updateFamily         = useWeddingStore(s => s.updateFamily)
  const deleteFamily         = useWeddingStore(s => s.deleteFamily)
  const deleteGuest          = useWeddingStore(s => s.deleteGuest)
  const bulkAddGuests        = useWeddingStore(s => s.bulkAddGuests)

  const [search, setSearch]             = useState('')
  const [showImport, setShowImport]     = useState(false)
  const [showAdd, setShowAdd]           = useState(false)
  const [addForm, setAddForm]           = useState({ name: '', familyName: '', dietary: '', notes: '' })
  const [editingFamilyId, setEditingFamilyId] = useState(null)
  const [editFamilyName, setEditFamilyName]   = useState('')

  const tableMap = useMemo(() => {
    const m = {}
    tables.forEach(t => { m[t.id] = t.name })
    return m
  }, [tables])

  const filtered = useMemo(() => {
    if (!search.trim()) return guests
    const q = search.toLowerCase()
    return guests.filter(g => g.name.toLowerCase().includes(q))
  }, [guests, search])

  const familyGroups = useMemo(() => {
    const groups = []
    const seen = new Set()
    families.forEach(f => {
      const fGuests = filtered.filter(g => g.familyId === f.id)
      if (fGuests.length > 0) {
        groups.push({ family: f, guests: fGuests })
        fGuests.forEach(g => seen.add(g.id))
      }
    })
    const noFamily = filtered.filter(g => !g.familyId && !seen.has(g.id))
    if (noFamily.length > 0) groups.push({ family: null, guests: noFamily })
    return groups
  }, [filtered, families])

  const unassigned = filtered.filter(g => !g.tableId)
  const selCount = selectedGuestIds.length

  const handleAddGuest = () => {
    if (!addForm.name.trim()) return
    let familyId = null
    if (addForm.familyName.trim()) {
      const existing = families.find(f => f.name.toLowerCase() === addForm.familyName.toLowerCase())
      if (existing) {
        familyId = existing.id
      } else {
        const newFamily = { id: Date.now().toString(36), name: addForm.familyName.trim(), color: FAMILY_COLORS[families.length % FAMILY_COLORS.length] }
        addFamily(newFamily)
        familyId = newFamily.id
      }
    }
    addGuest({ name: addForm.name.trim(), familyId, dietary: addForm.dietary, notes: addForm.notes })
    setAddForm({ name: '', familyName: '', dietary: '', notes: '' })
    setShowAdd(false)
  }

  const startEditFamily = (e, family) => {
    e.stopPropagation()
    setEditingFamilyId(family.id)
    setEditFamilyName(family.name)
  }

  const saveEditFamily = (familyId) => {
    const name = editFamilyName.trim()
    if (name) updateFamily(familyId, { name })
    setEditingFamilyId(null)
  }

  const handleDeleteFamily = (e, family, fGuests) => {
    e.stopPropagation()
    const msg = fGuests.length > 0
      ? `¿Eliminar familia "${family.name}" y desasignar sus ${fGuests.length} miembro(s)?`
      : `¿Eliminar familia "${family.name}"?`
    if (confirm(msg)) deleteFamily(family.id)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <div className="pl-header">
        <div className="pl-title">
          Invitados
          <span className="cnt">{guests.length}</span>
          {unassigned.length > 0 && (
            <span style={{ fontSize: 10, background: 'rgba(245,158,11,0.2)', color: '#FBBF24', padding: '1px 6px', borderRadius: 999, marginLeft: 2 }}>
              {unassigned.length} sin mesa
            </span>
          )}
        </div>
        <div className="search-row">
          <div className="search-wrap">
            <span className="search-icon">⌕</span>
            <input
              className="search-inp"
              placeholder="Buscar invitado..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="icon-btn" title="Importar Excel/CSV" onClick={() => setShowImport(true)}>📥</button>
          <button className="icon-btn" title="Añadir invitado" onClick={() => setShowAdd(v => !v)}
            style={showAdd ? { background: 'var(--gold-l)', borderColor: 'var(--gold)', color: 'var(--gold-d)' } : {}}>
            +
          </button>
        </div>
      </div>

      {/* Add guest form */}
      {showAdd && (
        <div className="add-guest-form">
          <div className="fg">
            <label>Nombre *</label>
            <input value={addForm.name} onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nombre completo" autoFocus
              onKeyDown={e => e.key === 'Enter' && handleAddGuest()} />
          </div>
          <div className="fg">
            <label>Familia</label>
            <input value={addForm.familyName} onChange={e => setAddForm(f => ({ ...f, familyName: e.target.value }))}
              placeholder="García, Martínez..." list="family-list" />
            <datalist id="family-list">
              {families.map(f => <option key={f.id} value={f.name} />)}
            </datalist>
          </div>
          <div className="fg">
            <label>Menú especial</label>
            <input value={addForm.dietary} onChange={e => setAddForm(f => ({ ...f, dietary: e.target.value }))}
              placeholder="Vegano, sin gluten..." />
          </div>
          <div className="form-btns">
            <button className="btn btn-dark btn-sm btn-full" style={{ flex: 0, minWidth: 70 }} onClick={() => setShowAdd(false)}>Cancelar</button>
            <button className="btn btn-primary btn-sm btn-full" onClick={handleAddGuest}>Añadir</button>
          </div>
        </div>
      )}

      {/* Guest list */}
      <div className="pl-body">
        {filtered.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            {search ? 'Sin resultados' : 'No hay invitados'}
          </div>
        )}

        {familyGroups.map(({ family, guests: fGuests }) => {
          const allSelected = fGuests.every(g => selectedGuestIds.includes(g.id))
          const isEditing = family && editingFamilyId === family.id

          return (
            <div key={family?.id || '__none__'} className="fam-section">
              {/* Family header */}
              <div className="fam-header" onClick={() => family && !isEditing && selectFamily(family.id)}>
                {family
                  ? <div className="fam-dot" style={{ background: family.color }} />
                  : <div className="fam-dot" style={{ background: '#94A3B8' }} />}

                {isEditing ? (
                  <input
                    className="fam-name-input"
                    value={editFamilyName}
                    autoFocus
                    onChange={e => setEditFamilyName(e.target.value)}
                    onBlur={() => saveEditFamily(family.id)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') saveEditFamily(family.id)
                      if (e.key === 'Escape') setEditingFamilyId(null)
                    }}
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <span className="fam-name">{family ? family.name : 'Sin familia'}</span>
                )}

                <span className="fam-cnt">{fGuests.length}</span>

                {family && !isEditing && (
                  <>
                    <button className="sel-all"
                      onClick={e => { e.stopPropagation(); selectFamily(family.id) }}>
                      {allSelected ? 'Desel.' : 'Todos'}
                    </button>
                    <button className="fam-act-btn" title="Renombrar familia"
                      onClick={e => startEditFamily(e, family)}>✏️</button>
                    <button className="fam-act-btn fam-del-btn" title="Eliminar familia"
                      onClick={e => handleDeleteFamily(e, family, fGuests)}>×</button>
                  </>
                )}
              </div>

              {/* Guests in family */}
              {fGuests.map(g => (
                <GuestItem
                  key={g.id}
                  guest={g}
                  selected={selectedGuestIds.includes(g.id)}
                  tableLabel={g.tableId ? tableMap[g.tableId] : null}
                  onClick={() => toggleGuestSelection(g.id)}
                  onDelete={() => { if (confirm(`¿Eliminar a ${g.name}?`)) deleteGuest(g.id) }}
                />
              ))}
            </div>
          )
        })}
      </div>

      {/* Selection action bar */}
      {selCount > 0 && (
        <div className="sel-bar">
          <div className="sel-hint">
            {selCount} seleccionado{selCount !== 1 ? 's' : ''} · Clic en una mesa para asignar
          </div>
          <div className="sel-actions">
            <button className="btn btn-dark btn-sm btn-full" onClick={clearSelection}>
              Cancelar selección
            </button>
          </div>
        </div>
      )}

      {/* Import modal */}
      {showImport && <ExcelImport onClose={() => setShowImport(false)} onImport={bulkAddGuests} />}
    </div>
  )
}

function GuestItem({ guest, selected, tableLabel, onClick, onDelete }) {
  return (
    <div className={`guest-item${selected ? ' sel' : ''}`} onClick={onClick}>
      <div className="g-check">
        {selected && <span className="g-check-mark">✓</span>}
      </div>
      <span className="g-name">{guest.name}</span>
      <span className={`g-table${!tableLabel ? ' no-table' : ''}`} title={tableLabel || 'Sin mesa'}>
        {tableLabel || '—'}
      </span>
      <button
        className="g-del"
        title="Eliminar invitado"
        onClick={e => { e.stopPropagation(); onDelete() }}
      >×</button>
    </div>
  )
}

function ExcelImport({ onClose, onImport }) {
  const [preview, setPreview] = useState(null)
  const [dragging, setDragging] = useState(false)
  const inputRef = React.useRef()

  const processFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const wb = XLSX.read(e.target.result, { type: 'binary' })
        const ws = wb.Sheets[wb.SheetNames[0]]
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
        if (rows.length < 2) return
        const headers = rows[0].map(String)
        const nameCol    = findCol(headers, NAME_KEYS)
        const familyCol  = findCol(headers, FAMILY_KEYS)
        const dietaryCol = findCol(headers, DIETARY_KEYS)
        const notesCol   = findCol(headers, NOTES_KEYS)
        const parsed = rows.slice(1)
          .filter(r => r.some(c => c !== ''))
          .map(r => ({
            name: nameCol ? String(r[headers.indexOf(nameCol)] || '').trim() : '',
            familyName: familyCol ? String(r[headers.indexOf(familyCol)] || '').trim() : '',
            dietary: dietaryCol ? String(r[headers.indexOf(dietaryCol)] || '').trim() : '',
            notes: notesCol ? String(r[headers.indexOf(notesCol)] || '').trim() : '',
          }))
          .filter(g => g.name)
        setPreview({ guests: parsed, nameCol, familyCol })
      } catch { alert('No se pudo leer el archivo. Verifica que sea un Excel o CSV válido.') }
    }
    reader.readAsBinaryString(file)
  }

  const handleConfirm = () => {
    if (!preview?.guests.length) return
    onImport(preview.guests)
    onClose()
  }

  return (
    <div className="import-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="import-modal">
        <div className="import-title">📥 Importar invitados</div>

        <div
          className={`import-drop${dragging ? ' dragging' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]) }}
        >
          <div style={{ fontSize: 32 }}>📂</div>
          <p>Arrastra un archivo o haz clic para seleccionar</p>
          <p style={{ fontSize: 11, marginTop: 4, color: '#9CA3AF' }}>Excel (.xlsx, .xls) o CSV</p>
        </div>

        <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" style={{ display: 'none' }}
          onChange={e => processFile(e.target.files?.[0])} />

        {preview && (
          <>
            <div style={{ marginBottom: 10, fontSize: 13, color: '#374151' }}>
              <strong>{preview.guests.length} invitados</strong> detectados
              {preview.nameCol && <span style={{ color: '#9CA3AF', marginLeft: 8 }}>· Columna: {preview.nameCol}</span>}
              {preview.familyCol && <span style={{ color: '#9CA3AF', marginLeft: 6 }}>· Familia: {preview.familyCol}</span>}
            </div>
            <div className="import-preview">
              {preview.guests.slice(0, 20).map((g, i) => (
                <div key={i} className="import-preview-item">
                  <span style={{ fontWeight: 500, flex: 1 }}>{g.name}</span>
                  {g.familyName && <span style={{ color: '#9CA3AF', fontSize: 11 }}>{g.familyName}</span>}
                  {g.dietary && <span style={{ fontSize: 11, color: '#C9956C' }}>{g.dietary}</span>}
                </div>
              ))}
              {preview.guests.length > 20 && (
                <div style={{ textAlign: 'center', padding: '8px 0', color: '#9CA3AF', fontSize: 12 }}>
                  ... y {preview.guests.length - 20} más
                </div>
              )}
            </div>
          </>
        )}

        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 'auto', paddingTop: 8 }}>
          <button className="btn btn-secondary btn-sm" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary btn-sm" onClick={handleConfirm} disabled={!preview?.guests.length}>
            Importar {preview?.guests.length ? `(${preview.guests.length})` : ''}
          </button>
        </div>
      </div>
    </div>
  )
}
