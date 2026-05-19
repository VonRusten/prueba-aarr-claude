import React from 'react'
import useWeddingStore from '../store/useWeddingStore.js'

const DECORATION_TYPES = [
  { type: 'flowers', emoji: '🌸', name: 'Flores' },
  { type: 'bar', emoji: '🍸', name: 'Bar' },
  { type: 'dj', emoji: '🎵', name: 'DJ' },
  { type: 'dancefloor', emoji: '💃', name: 'Pista' },
  { type: 'photobooth', emoji: '📷', name: 'Fotomatón' },
  { type: 'arch', emoji: '🌿', name: 'Arco' },
]

export default function DecorationPanel() {
  const decorations = useWeddingStore((s) => s.decorations)
  const addDecoration = useWeddingStore((s) => s.addDecoration)
  const deleteDecoration = useWeddingStore((s) => s.deleteDecoration)
  const setView = useWeddingStore((s) => s.setView)

  const getEmoji = (type) => {
    const d = DECORATION_TYPES.find((d) => d.type === type)
    return d ? d.emoji : '⭐'
  }

  const getName = (type) => {
    const d = DECORATION_TYPES.find((d) => d.type === type)
    return d ? d.name : type
  }

  const handleAdd = (type) => {
    const deco = DECORATION_TYPES.find((d) => d.type === type)
    addDecoration({ type, label: deco ? deco.name : type })
    setView('2d')
  }

  return (
    <>
      <div className="panel-section">
        <div className="panel-title">Añadir decoración</div>
        <p style={{ fontSize: 12, color: 'var(--text-light)', marginBottom: 10 }}>
          Haz clic para añadir al centro del plano 2D
        </p>
        <div className="decoration-grid">
          {DECORATION_TYPES.map((d) => (
            <button
              key={d.type}
              className="decoration-card"
              onClick={() => handleAdd(d.type)}
              title={`Añadir ${d.name}`}
            >
              <span className="deco-emoji">{d.emoji}</span>
              <span className="deco-name">{d.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel-section">
        <div className="panel-title">
          Decoraciones colocadas
          <span className="count-badge">{decorations.length}</span>
        </div>

        {decorations.length === 0 && (
          <div className="empty-state">No hay decoraciones colocadas</div>
        )}

        {decorations.map((d) => (
          <div key={d.id} className="decoration-list-item">
            <span>{getEmoji(d.type)}</span>
            <span>{d.label || getName(d.type)}</span>
            <button
              className="btn btn-icon btn-ghost"
              onClick={() => deleteDecoration(d.id)}
              title="Eliminar"
            >🗑️</button>
          </div>
        ))}
      </div>
    </>
  )
}
