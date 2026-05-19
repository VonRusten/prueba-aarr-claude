import React, { useState, useMemo } from 'react'
import useWeddingStore from '../store/useWeddingStore.js'

const SHAPE_ICONS = {
  round: '⭕',
  rect: '⬛',
  oval: '🥚',
  square: '🟥',
}

const SHAPE_LABELS = {
  round: 'Redonda',
  rect: 'Rectangular',
  oval: 'Ovalada',
  square: 'Cuadrada',
}

const SPECIAL_TYPES = ['Mesa Principal', 'VIP', 'Padrinos', 'Familia', 'Cabecera', 'Honor']

function TableFormFields({ values, onChange, onSubmit, onCancel, submitLabel }) {
  return (
    <div className="inline-form">
      <div className="form-group">
        <label className="form-label">Nombre *</label>
        <input
          className="form-input"
          placeholder="Ej: Mesa 1"
          value={values.name}
          onChange={(e) => onChange({ ...values, name: e.target.value })}
          autoFocus
        />
      </div>
      <div className="form-group">
        <label className="form-label">Forma</label>
        <div className="radio-group">
          {Object.entries(SHAPE_LABELS).map(([shape, label]) => (
            <label
              key={shape}
              className={`radio-option${values.shape === shape ? ' selected' : ''}`}
            >
              <input
                type="radio"
                value={shape}
                checked={values.shape === shape}
                onChange={() => onChange({ ...values, shape })}
              />
              {SHAPE_ICONS[shape]} {label}
            </label>
          ))}
        </div>
      </div>
      <div className="form-group">
        <label className="form-label">Capacidad</label>
        <input
          className="form-input"
          type="number"
          min="1"
          max="30"
          value={values.capacity}
          onChange={(e) => onChange({ ...values, capacity: Math.max(1, parseInt(e.target.value) || 1) })}
        />
      </div>
      <div className="form-group">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={values.isSpecial}
            onChange={(e) => onChange({ ...values, isSpecial: e.target.checked })}
          />
          Mesa especial
        </label>
      </div>
      {values.isSpecial && (
        <div className="form-group">
          <label className="form-label">Tipo especial</label>
          <select
            className="form-select"
            value={values.specialType}
            onChange={(e) => onChange({ ...values, specialType: e.target.value })}
          >
            <option value="">Seleccionar tipo...</option>
            {SPECIAL_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      )}
      <div className="form-actions">
        <button className="btn btn-secondary btn-sm" onClick={onCancel}>Cancelar</button>
        <button className="btn btn-primary btn-sm" onClick={onSubmit}>{submitLabel}</button>
      </div>
    </div>
  )
}

export default function TablePanel() {
  const tables = useWeddingStore((s) => s.tables)
  const guests = useWeddingStore((s) => s.guests)
  const addTable = useWeddingStore((s) => s.addTable)
  const updateTable = useWeddingStore((s) => s.updateTable)
  const deleteTable = useWeddingStore((s) => s.deleteTable)
  const setSelectedTable = useWeddingStore((s) => s.setSelectedTable)
  const setView = useWeddingStore((s) => s.setView)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)

  const defaultForm = { name: '', shape: 'round', capacity: 8, isSpecial: false, specialType: '' }
  const [form, setForm] = useState(defaultForm)
  const [editForm, setEditForm] = useState(defaultForm)

  const guestsByTable = useMemo(() => {
    const map = {}
    guests.forEach((g) => {
      if (g.tableId) {
        if (!map[g.tableId]) map[g.tableId] = 0
        map[g.tableId]++
      }
    })
    return map
  }, [guests])

  const handleAdd = () => {
    if (!form.name.trim()) return
    addTable({ ...form, name: form.name.trim() })
    setForm(defaultForm)
    setShowForm(false)
  }

  const handleStartEdit = (table) => {
    setEditingId(table.id)
    setEditForm({ name: table.name, shape: table.shape, capacity: table.capacity, isSpecial: table.isSpecial, specialType: table.specialType })
  }

  const handleSaveEdit = (id) => {
    if (!editForm.name.trim()) return
    updateTable(id, { ...editForm, name: editForm.name.trim() })
    setEditingId(null)
  }

  const handleGoTo2D = (tableId) => {
    setSelectedTable(tableId)
    setView('2d')
  }

  return (
    <>
      <div className="panel-section">
        <div className="panel-title">
          Mesas
          <span className="count-badge">{tables.length}</span>
        </div>

        {showForm && (
          <TableFormFields
            values={form}
            onChange={setForm}
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
            submitLabel="Añadir mesa"
          />
        )}

        {!showForm && (
          <button className="btn btn-primary btn-full" onClick={() => setShowForm(true)}>
            + Añadir mesa
          </button>
        )}
      </div>

      <div className="panel-section" style={{ paddingTop: 8 }}>
        {tables.length === 0 && (
          <div className="empty-state">No hay mesas configuradas</div>
        )}
        {tables.map((table) => (
          <div key={table.id}>
            {editingId === table.id ? (
              <TableFormFields
                values={editForm}
                onChange={setEditForm}
                onSubmit={() => handleSaveEdit(table.id)}
                onCancel={() => setEditingId(null)}
                submitLabel="Guardar"
              />
            ) : (
              <div className="table-item">
                <div className="table-shape-icon" title={SHAPE_LABELS[table.shape]}>
                  {SHAPE_ICONS[table.shape]}
                </div>
                <div className="table-info" onClick={() => handleGoTo2D(table.id)} style={{ cursor: 'pointer' }}>
                  <div className="table-item-name">
                    {table.name}
                    {table.isSpecial && (
                      <span className="special-badge">{table.specialType || 'Especial'}</span>
                    )}
                  </div>
                  <div className="table-capacity-bar">
                    <div className="capacity-track">
                      <div
                        className="capacity-fill"
                        style={{ width: `${Math.min(100, ((guestsByTable[table.id] || 0) / table.capacity) * 100)}%` }}
                      />
                    </div>
                    <span className="capacity-text">
                      {guestsByTable[table.id] || 0}/{table.capacity}
                    </span>
                  </div>
                </div>
                <div className="guest-actions" style={{ opacity: 1 }}>
                  <button
                    className="btn btn-icon btn-ghost"
                    onClick={() => handleStartEdit(table)}
                    title="Editar"
                  >✏️</button>
                  <button
                    className="btn btn-icon btn-ghost"
                    onClick={() => { if (confirm(`¿Eliminar mesa "${table.name}"?`)) deleteTable(table.id) }}
                    title="Eliminar"
                  >🗑️</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
