import React, { useState } from 'react'
import useWeddingStore from '../store/useWeddingStore.js'

const PRESETS = [
  { name: 'Sala Grande', icon: '🏛️', width: 1600, height: 1000 },
  { name: 'Sala Mediana', icon: '🏠', width: 1200, height: 800 },
  { name: 'Jardín', icon: '🌳', width: 1400, height: 900 },
  { name: 'Íntima', icon: '🕯️', width: 900, height: 700 },
  { name: 'Palacio', icon: '✨', width: 2000, height: 1200 },
  { name: 'Terraza', icon: '🌅', width: 1100, height: 750 },
]

export default function RoomSettings() {
  const room        = useWeddingStore(s => s.room)
  const savedRooms  = useWeddingStore(s => s.savedRooms)
  const updateRoom  = useWeddingStore(s => s.updateRoom)
  const updateDoor  = useWeddingStore(s => s.updateDoor)
  const saveRoom    = useWeddingStore(s => s.saveRoom)
  const loadRoom    = useWeddingStore(s => s.loadRoom)
  const deleteRoom  = useWeddingStore(s => s.deleteRoom)
  const applyPreset = useWeddingStore(s => s.applyPreset)

  const [saveName, setSaveName]       = useState('')
  const [showSaveForm, setShowSaveForm] = useState(false)

  const handleSave = () => {
    if (!saveName.trim()) return
    saveRoom(saveName.trim())
    setSaveName('')
    setShowSaveForm(false)
  }

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
    } catch { return '' }
  }

  const lbl = { display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-3)', marginBottom: 4 }

  return (
    <div className="room-settings">
      {/* Dimensions */}
      <div className="rs-section">
        <div className="rs-title">Dimensiones</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
          <div>
            <label style={lbl}>Ancho (px)</label>
            <input className="fi" type="number" min="400" max="3000" step="50"
              value={room.width}
              onChange={e => updateRoom({ width: Math.max(400, parseInt(e.target.value) || 1200) })} />
          </div>
          <div>
            <label style={lbl}>Alto (px)</label>
            <input className="fi" type="number" min="300" max="2000" step="50"
              value={room.height}
              onChange={e => updateRoom({ height: Math.max(300, parseInt(e.target.value) || 800) })} />
          </div>
        </div>
        <div>
          <label style={lbl}>Color de fondo</label>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input type="color" value={room.background}
              onChange={e => updateRoom({ background: e.target.value })}
              style={{ width: 36, height: 32, border: '1px solid var(--border)', borderRadius: 6, padding: 2, cursor: 'pointer' }} />
            <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{room.background}</span>
          </div>
        </div>
      </div>

      {/* Door */}
      {room.door && (
        <div className="rs-section">
          <div className="rs-title">🚪 Puerta</div>
          <p style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 8 }}>
            Arrastra la puerta en el plano 2D
          </p>
          <div style={{ marginBottom: 8 }}>
            <label style={lbl}>Etiqueta</label>
            <input className="fi" value={room.door.label || 'Entrada'}
              onChange={e => updateDoor({ label: e.target.value })} />
          </div>
          <div style={{ marginBottom: 8 }}>
            <label style={lbl}>Ancho de abertura (px)</label>
            <input className="fi" type="number" min="40" max="200"
              value={room.door.size || 90}
              onChange={e => updateDoor({ size: Math.max(40, parseInt(e.target.value) || 90) })} />
          </div>
          <div>
            <label style={lbl}>Rotación</label>
            <div className="rot-row">
              {[0, 90, 180, 270].map(deg => (
                <button key={deg}
                  className={`rot-btn${(room.door.rotation || 0) === deg ? ' active' : ''}`}
                  onClick={() => updateDoor({ rotation: deg })}>
                  {deg}°
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Presets */}
      <div className="rs-section">
        <div className="rs-title">Plantillas</div>
        <div className="preset-grid">
          {PRESETS.map(p => (
            <button key={p.name} className="preset-card"
              onClick={() => applyPreset({ width: p.width, height: p.height })}
              title={`${p.width}×${p.height}`}>
              <span style={{ fontSize: 16 }}>{p.icon}</span>
              <span>{p.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Saved rooms */}
      <div className="rs-section">
        <div className="rs-title">
          Salas guardadas
          {savedRooms.length > 0 && (
            <span style={{ marginLeft: 6, fontSize: 10, background: 'var(--border)', color: 'var(--text-3)', padding: '1px 6px', borderRadius: 999 }}>
              {savedRooms.length}
            </span>
          )}
        </div>

        {!showSaveForm ? (
          <button className="btn btn-secondary btn-sm btn-full" style={{ marginBottom: 8 }}
            onClick={() => setShowSaveForm(true)}>
            💾 Guardar configuración
          </button>
        ) : (
          <div style={{ marginBottom: 8 }}>
            <input className="fi" placeholder="Nombre del guardado..."
              value={saveName} onChange={e => setSaveName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus style={{ marginBottom: 6 }} />
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowSaveForm(false)}>Cancelar</button>
              <button className="btn btn-primary btn-sm" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        )}

        {savedRooms.length === 0 && (
          <div style={{ fontSize: 12, color: 'var(--text-4)', textAlign: 'center', padding: '6px 0' }}>
            No hay configuraciones guardadas
          </div>
        )}

        {savedRooms.map(saved => (
          <div key={saved.id} className="saved-room">
            <div className="saved-room-info">
              <div className="saved-room-name">{saved.name}</div>
              <div className="saved-room-date">{formatDate(saved.savedAt)} · {saved.room.width}×{saved.room.height}</div>
            </div>
            <button className="btn btn-ghost btn-xs"
              onClick={() => { if (confirm('¿Cargar esta configuración?')) loadRoom(saved.id) }}
              title="Cargar">📂</button>
            <button className="btn btn-ghost btn-xs" style={{ color: 'var(--red)' }}
              onClick={() => { if (confirm('¿Eliminar este guardado?')) deleteRoom(saved.id) }}
              title="Eliminar">🗑️</button>
          </div>
        ))}
      </div>
    </div>
  )
}
