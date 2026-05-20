import React, { useState } from 'react'
import useWeddingStore from '../store/useWeddingStore.js'

// Dimensions in meters — converted to pixels on apply using current scale
const PRESETS = [
  { name: 'Sala Grande',  icon: '🏛️', wM: 40, hM: 25 },
  { name: 'Sala Mediana', icon: '🏠', wM: 30, hM: 20 },
  { name: 'Jardín',       icon: '🌳', wM: 35, hM: 22 },
  { name: 'Íntima',       icon: '🕯️', wM: 22, hM: 17 },
  { name: 'Palacio',      icon: '✨', wM: 50, hM: 30 },
  { name: 'Terraza',      icon: '🌅', wM: 27, hM: 18 },
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
        {(() => {
          const ppm = room.pixelsPerMeter || 40
          const wM = +(room.width / ppm).toFixed(1)
          const hM = +(room.height / ppm).toFixed(1)
          return (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 10 }}>
                <div>
                  <label style={lbl}>Ancho (m)</label>
                  <input className="fi" type="number" min="5" max="100" step="0.5"
                    value={wM}
                    onChange={e => {
                      const m = Math.max(5, parseFloat(e.target.value) || 10)
                      updateRoom({ width: Math.round(m * ppm) })
                    }} />
                </div>
                <div>
                  <label style={lbl}>Alto (m)</label>
                  <input className="fi" type="number" min="3" max="80" step="0.5"
                    value={hM}
                    onChange={e => {
                      const m = Math.max(3, parseFloat(e.target.value) || 8)
                      updateRoom({ height: Math.round(m * ppm) })
                    }} />
                </div>
              </div>
              <div style={{ marginBottom: 10 }}>
                <label style={lbl}>Escala (px por metro)</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input className="fi" type="number" min="20" max="100" step="5"
                    value={ppm}
                    onChange={e => updateRoom({ pixelsPerMeter: Math.max(20, parseInt(e.target.value) || 40) })}
                    style={{ maxWidth: 80 }} />
                  <span style={{ fontSize: 11, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                    Sala: {wM} × {hM} m
                  </span>
                </div>
              </div>
            </>
          )
        })()}
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
          {PRESETS.map(p => {
            const ppm = room.pixelsPerMeter || 40
            return (
              <button key={p.name} className="preset-card"
                onClick={() => applyPreset({ width: Math.round(p.wM * ppm), height: Math.round(p.hM * ppm) })}
                title={`${p.wM} × ${p.hM} m`}>
                <span style={{ fontSize: 16 }}>{p.icon}</span>
                <span>{p.name}</span>
                <span style={{ fontSize: 10, color: 'var(--text-4)' }}>{p.wM}×{p.hM} m</span>
              </button>
            )
          })}
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
