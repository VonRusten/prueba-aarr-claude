import React, { useState } from 'react'
import useWeddingStore from '../store/useWeddingStore.js'

const PRESETS = [
  { name: 'Sala Grande', icon: '🏛️', width: 1600, height: 1000 },
  { name: 'Sala Mediana', icon: '🏠', width: 1200, height: 800 },
  { name: 'Jardín', icon: '🌳', width: 1400, height: 900 },
  { name: 'Íntima', icon: '🕯️', width: 900, height: 700 },
  { name: 'Salón Palacio', icon: '✨', width: 2000, height: 1200 },
  { name: 'Terraza', icon: '🌅', width: 1100, height: 750 },
]

export default function RoomSettings() {
  const room = useWeddingStore((s) => s.room)
  const savedRooms = useWeddingStore((s) => s.savedRooms)
  const updateRoom = useWeddingStore((s) => s.updateRoom)
  const saveRoom = useWeddingStore((s) => s.saveRoom)
  const loadRoom = useWeddingStore((s) => s.loadRoom)
  const deleteRoom = useWeddingStore((s) => s.deleteRoom)
  const applyPreset = useWeddingStore((s) => s.applyPreset)

  const [saveName, setSaveName] = useState('')
  const [showSaveForm, setShowSaveForm] = useState(false)

  const handleSave = () => {
    if (!saveName.trim()) return
    saveRoom(saveName.trim())
    setSaveName('')
    setShowSaveForm(false)
  }

  const handleLoadRoom = (id) => {
    if (confirm('¿Cargar esta configuración? Se reemplazarán las mesas y decoraciones actuales.')) {
      loadRoom(id)
    }
  }

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  return (
    <>
      <div className="panel-section">
        <div className="panel-title">Configuración de la sala</div>
        <div className="form-group">
          <label className="form-label">Nombre de la sala</label>
          <input
            className="form-input"
            value={room.name}
            onChange={(e) => updateRoom({ name: e.target.value })}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Ancho (px)</label>
            <input
              className="form-input"
              type="number"
              min="400"
              max="3000"
              step="50"
              value={room.width}
              onChange={(e) => updateRoom({ width: Math.max(400, parseInt(e.target.value) || 1200) })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Alto (px)</label>
            <input
              className="form-input"
              type="number"
              min="300"
              max="2000"
              step="50"
              value={room.height}
              onChange={(e) => updateRoom({ height: Math.max(300, parseInt(e.target.value) || 800) })}
            />
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Color de fondo</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              type="color"
              value={room.background}
              onChange={(e) => updateRoom({ background: e.target.value })}
              style={{ width: 40, height: 36, border: '1px solid var(--border)', borderRadius: 6, padding: 2, cursor: 'pointer' }}
            />
            <span style={{ fontSize: 12, color: 'var(--text-light)' }}>{room.background}</span>
          </div>
        </div>
      </div>

      <div className="panel-section">
        <div className="panel-title">Plantillas de sala</div>
        <div className="preset-grid">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              className="preset-card"
              onClick={() => applyPreset({ width: preset.width, height: preset.height })}
              title={`${preset.width}x${preset.height}`}
            >
              <span className="preset-icon">{preset.icon}</span>
              {preset.name}
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <div className="panel-title">
          Salas guardadas
          <span className="count-badge">{savedRooms.length}</span>
        </div>

        {!showSaveForm ? (
          <button
            className="btn btn-secondary btn-sm btn-full"
            onClick={() => setShowSaveForm(true)}
          >
            💾 Guardar configuración actual
          </button>
        ) : (
          <div className="inline-form">
            <div className="form-group">
              <label className="form-label">Nombre del guardado</label>
              <input
                className="form-input"
                placeholder="Ej: Configuración boda..."
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSave() }}
                autoFocus
              />
            </div>
            <div className="form-actions">
              <button className="btn btn-secondary btn-sm" onClick={() => setShowSaveForm(false)}>Cancelar</button>
              <button className="btn btn-primary btn-sm" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 10 }}>
          {savedRooms.length === 0 && (
            <div className="empty-state">No hay configuraciones guardadas</div>
          )}
          {savedRooms.map((saved) => (
            <div key={saved.id} className="saved-room-item">
              <div style={{ flex: 1 }}>
                <div className="room-name">{saved.name}</div>
                <div className="room-date">{formatDate(saved.savedAt)} · {saved.room.width}×{saved.room.height}</div>
              </div>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => handleLoadRoom(saved.id)}
                title="Cargar"
              >📂</button>
              <button
                className="btn btn-sm btn-ghost"
                onClick={() => { if (confirm('¿Eliminar este guardado?')) deleteRoom(saved.id) }}
                title="Eliminar"
              >🗑️</button>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
