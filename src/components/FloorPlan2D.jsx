import { useRef, useState, useCallback, useEffect } from 'react'
import useWeddingStore from '../store/useWeddingStore.js'

const DECO_CONFIG = {
  flowers: { emoji: '🌸', bg: '#fce4ec', border: '#f48fb1', w: 70, h: 60 },
  bar:     { emoji: '🍸', bg: '#e3f2fd', border: '#90caf9', w: 90, h: 65 },
  dj:      { emoji: '🎵', bg: '#f3e5f5', border: '#ce93d8', w: 80, h: 60 },
  dancefloor: { emoji: '💃', bg: '#fff8e1', border: '#ffd54f', w: 150, h: 110 },
  photobooth: { emoji: '📷', bg: '#e8f5e9', border: '#a5d6a7', w: 85, h: 70 },
  arch:    { emoji: '🌿', bg: '#f1f8e9', border: '#c5e1a5', w: 110, h: 85 },
}

function getTableSize(table) {
  const cap = table.capacity || 8
  switch (table.shape) {
    case 'round': {
      const r = Math.max(35, cap * 5)
      return { type: 'ellipse', rx: r, ry: r }
    }
    case 'oval': {
      const rx = Math.max(55, cap * 9)
      return { type: 'ellipse', rx, ry: 40 }
    }
    case 'square': {
      return { type: 'rect', w: 75, h: 75 }
    }
    case 'rect':
    default: {
      return { type: 'rect', w: Math.max(100, cap * 18), h: 60 }
    }
  }
}

function getChairPositions(table) {
  const size = getTableSize(table)
  const cap = table.capacity || 8

  if (size.type === 'ellipse') {
    return Array.from({ length: cap }, (_, i) => {
      const angle = (i / cap) * Math.PI * 2 - Math.PI / 2
      return { cx: (size.rx + 16) * Math.cos(angle), cy: (size.ry + 16) * Math.sin(angle) }
    })
  }

  const { w, h } = size
  const chairs = []
  const topCount = Math.round(cap * 0.35)
  const bottomCount = Math.round(cap * 0.35)
  const sideTotal = cap - topCount - bottomCount
  const leftCount = Math.ceil(sideTotal / 2)
  const rightCount = sideTotal - leftCount

  for (let i = 0; i < topCount; i++)
    chairs.push({ cx: -w / 2 + w * (i + 1) / (topCount + 1), cy: -h / 2 - 15 })
  for (let i = 0; i < bottomCount; i++)
    chairs.push({ cx: -w / 2 + w * (i + 1) / (bottomCount + 1), cy: h / 2 + 15 })
  for (let i = 0; i < leftCount; i++)
    chairs.push({ cx: -w / 2 - 15, cy: -h / 2 + h * (i + 1) / (leftCount + 1) })
  for (let i = 0; i < rightCount; i++)
    chairs.push({ cx: w / 2 + 15, cy: -h / 2 + h * (i + 1) / (rightCount + 1) })

  return chairs.slice(0, cap)
}

function TableShape({ table, guests, isSelected, onMouseDown, onClick }) {
  const size = getTableSize(table)
  const chairs = getChairPositions(table)
  const guestCount = guests.filter(g => g.tableId === table.id).length
  const fillColor = table.isSpecial ? '#fffbeb' : '#fdf6e3'
  const strokeColor = isSelected ? '#c9a96e' : (table.isSpecial ? '#d4a520' : '#a08030')
  const sw = isSelected ? 3 : 1.5

  return (
    <g transform={`translate(${table.x},${table.y})`}>
      {chairs.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={9}
          fill={i < guestCount ? '#e8a4a4' : '#e8ddd0'}
          stroke="#a08030" strokeWidth={0.8} pointerEvents="none" />
      ))}

      {isSelected && (size.type === 'ellipse'
        ? <ellipse cx={0} cy={0} rx={size.rx + 9} ry={size.ry + 9}
            fill="rgba(201,169,110,0.12)" stroke="#c9a96e" strokeWidth={2}
            strokeDasharray="6,3" pointerEvents="none" />
        : <rect x={-size.w/2 - 9} y={-size.h/2 - 9} width={size.w + 18} height={size.h + 18}
            rx={12} fill="rgba(201,169,110,0.12)" stroke="#c9a96e" strokeWidth={2}
            strokeDasharray="6,3" pointerEvents="none" />
      )}

      {size.type === 'ellipse'
        ? <ellipse cx={0} cy={0} rx={size.rx} ry={size.ry}
            fill={fillColor} stroke={strokeColor} strokeWidth={sw}
            style={{ cursor: 'grab' }} onMouseDown={onMouseDown} onClick={onClick} />
        : <rect x={-size.w/2} y={-size.h/2} width={size.w} height={size.h} rx={6}
            fill={fillColor} stroke={strokeColor} strokeWidth={sw}
            style={{ cursor: 'grab' }} onMouseDown={onMouseDown} onClick={onClick} />
      }

      {size.type === 'ellipse'
        ? <ellipse cx={0} cy={0} rx={size.rx * 0.55} ry={size.ry * 0.55}
            fill="none" stroke={strokeColor} strokeWidth={0.5} strokeDasharray="3,3"
            opacity={0.35} pointerEvents="none" />
        : <rect x={-size.w/2 + 6} y={-size.h/2 + 6} width={size.w - 12} height={size.h - 12}
            rx={4} fill="none" stroke={strokeColor} strokeWidth={0.5} strokeDasharray="3,3"
            opacity={0.35} pointerEvents="none" />
      }

      <text x={0} y={-7} textAnchor="middle" fontSize={11} fill="#5a3d20"
        fontWeight="700" fontFamily="Georgia, serif" pointerEvents="none">
        {table.name}
      </text>
      <text x={0} y={8} textAnchor="middle" fontSize={10} fill="#8b6914" pointerEvents="none">
        {guestCount}/{table.capacity}
      </text>
      {table.isSpecial && (
        <text x={0} y={23} textAnchor="middle" fontSize={9} fill="#c9a96e" pointerEvents="none">
          ★ {table.specialType || 'Especial'}
        </text>
      )}
    </g>
  )
}

function DecoShape({ deco, onMouseDown, onDoubleClick }) {
  const cfg = DECO_CONFIG[deco.type] || DECO_CONFIG.flowers
  const { w, h, bg, border, emoji } = cfg
  return (
    <g transform={`translate(${deco.x},${deco.y})`}>
      <rect x={-w/2} y={-h/2} width={w} height={h} rx={10}
        fill={bg} stroke={border} strokeWidth={1.5}
        style={{ cursor: 'grab' }} onMouseDown={onMouseDown} onDoubleClick={onDoubleClick} />
      <text x={0} y={6} textAnchor="middle" fontSize={22} pointerEvents="none">{emoji}</text>
      <text x={0} y={h/2 - 7} textAnchor="middle" fontSize={9} fill="#555"
        fontWeight="600" pointerEvents="none">{deco.label}</text>
    </g>
  )
}

function TablePopover({ table, guests, families, onClose, onAssign, onRemove }) {
  const assigned = guests.filter(g => g.tableId === table.id)
  const unassigned = guests.filter(g => !g.tableId)
  const isFull = assigned.length >= table.capacity
  const getFamilyColor = (fid) => (families.find(f => f.id === fid) || {}).color || '#ccc'

  return (
    <div className="table-popover">
      <div className="popover-header">
        <h3>{table.name}</h3>
        <span className="capacity-badge">{assigned.length}/{table.capacity}</span>
        <button className="popover-close btn" onClick={onClose}>×</button>
      </div>
      <div className="popover-capacity-info">
        <span>{table.isSpecial ? `⭐ ${table.specialType || 'Especial'}` : `Mesa ${table.shape}`}</span>
        <div style={{ flex: 1 }} />
        <span style={{ color: isFull ? '#dc2626' : 'inherit' }}>
          {isFull ? '🔴 Llena' : `${table.capacity - assigned.length} libre${table.capacity - assigned.length !== 1 ? 's' : ''}`}
        </span>
      </div>
      <div className="popover-body">
        <div className="popover-section-title">Asignados ({assigned.length})</div>
        {assigned.length === 0
          ? <div style={{ padding: '6px 14px', fontSize: 12, color: 'var(--text-light)', fontStyle: 'italic' }}>Ninguno</div>
          : assigned.map(g => (
            <div key={g.id} className="popover-guest-row">
              <div className="family-dot" style={{ background: getFamilyColor(g.familyId) }} />
              <span className="popover-guest-name">{g.name}</span>
              {g.dietary && <span className="dietary-tag" style={{ fontSize: 9 }}>{g.dietary}</span>}
              <button className="popover-action-btn remove" onClick={() => onRemove(g.id)}>×</button>
            </div>
          ))
        }

        {!isFull && (
          <>
            <div className="popover-section-title" style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
              Sin asignar ({unassigned.length})
            </div>
            {unassigned.length === 0
              ? <div style={{ padding: '6px 14px', fontSize: 12, color: 'var(--text-light)', fontStyle: 'italic' }}>Todos asignados</div>
              : unassigned.map(g => (
                <div key={g.id} className="popover-guest-row">
                  <div className="family-dot" style={{ background: getFamilyColor(g.familyId) }} />
                  <span className="popover-guest-name">{g.name}</span>
                  <button className="popover-action-btn add" onClick={() => onAssign(g.id)}>+</button>
                </div>
              ))
            }
          </>
        )}
      </div>
    </div>
  )
}

export default function FloorPlan2D() {
  const svgRef = useRef(null)
  const { tables, decorations, guests, families, room,
    moveTable, moveDecoration, deleteDecoration,
    assignGuestToTable, removeGuestFromTable,
    setSelectedTable, ui } = useWeddingStore()

  const [drag, setDrag] = useState(null)
  const [showGrid, setShowGrid] = useState(true)
  const selectedTableId = ui.selectedTableId
  const selectedTable = tables.find(t => t.id === selectedTableId)

  const toSVG = useCallback((e) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const pt = svg.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const p = pt.matrixTransform(svg.getScreenCTM().inverse())
    return { x: p.x, y: p.y }
  }, [])

  const handleTableDown = useCallback((e, table) => {
    e.stopPropagation(); e.preventDefault()
    setSelectedTable(table.id)
    const { x, y } = toSVG(e)
    setDrag({ type: 'table', id: table.id, offX: x - table.x, offY: y - table.y })
  }, [toSVG, setSelectedTable])

  const handleDecoDown = useCallback((e, deco) => {
    e.stopPropagation(); e.preventDefault()
    const { x, y } = toSVG(e)
    setDrag({ type: 'deco', id: deco.id, offX: x - deco.x, offY: y - deco.y })
  }, [toSVG])

  const handleMove = useCallback((e) => {
    if (!drag) return
    const { x, y } = toSVG(e)
    const nx = Math.max(0, Math.min(room.width, x - drag.offX))
    const ny = Math.max(0, Math.min(room.height, y - drag.offY))
    if (drag.type === 'table') moveTable(drag.id, nx, ny)
    else moveDecoration(drag.id, nx, ny)
  }, [drag, room, moveTable, moveDecoration, toSVG])

  const handleUp = useCallback(() => setDrag(null), [])

  useEffect(() => {
    window.addEventListener('mouseup', handleUp)
    return () => window.removeEventListener('mouseup', handleUp)
  }, [handleUp])

  const gridLines = []
  if (showGrid) {
    for (let x = 50; x < room.width; x += 50)
      gridLines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={room.height} stroke="#ddd5c4" strokeWidth={0.5} />)
    for (let y = 50; y < room.height; y += 50)
      gridLines.push(<line key={`h${y}`} x1={0} y1={y} x2={room.width} y2={y} stroke="#ddd5c4" strokeWidth={0.5} />)
  }

  return (
    <div className="floorplan-container">
      <svg
        ref={svgRef}
        className="floorplan-svg"
        viewBox={`0 0 ${room.width} ${room.height}`}
        onMouseMove={handleMove}
        onClick={(e) => { if (e.target === svgRef.current || e.target.dataset.room) setSelectedTable(null) }}
        style={{ userSelect: 'none', cursor: drag ? 'grabbing' : 'default' }}
      >
        <rect x={0} y={0} width={room.width} height={room.height} fill={room.background} data-room="true" />
        {gridLines}
        <rect x={3} y={3} width={room.width - 6} height={room.height - 6}
          fill="none" stroke="#c4a882" strokeWidth={3} rx={6} pointerEvents="none" />
        <text x={room.width / 2} y={room.height - 12} textAnchor="middle"
          fontSize={14} fill="#c4a882" opacity={0.5}
          fontFamily="Georgia, serif" fontStyle="italic" pointerEvents="none">
          {room.name}
        </text>

        {decorations.map(deco => (
          <DecoShape key={deco.id} deco={deco}
            onMouseDown={(e) => handleDecoDown(e, deco)}
            onDoubleClick={() => { if (confirm(`¿Eliminar "${deco.label}"?`)) deleteDecoration(deco.id) }}
          />
        ))}

        {tables.map(table => (
          <TableShape key={table.id} table={table} guests={guests}
            isSelected={table.id === selectedTableId}
            onMouseDown={(e) => handleTableDown(e, table)}
            onClick={(e) => { e.stopPropagation(); setSelectedTable(table.id) }}
          />
        ))}
      </svg>

      <div className="floorplan-tools">
        <button className="tool-btn" onClick={() => setShowGrid(v => !v)} title="Cuadrícula">
          {showGrid ? '⊞' : '⬚'}
        </button>
      </div>

      {selectedTable && (
        <TablePopover
          table={selectedTable}
          guests={guests}
          families={families}
          onClose={() => setSelectedTable(null)}
          onAssign={(gid) => assignGuestToTable(gid, selectedTableId)}
          onRemove={removeGuestFromTable}
        />
      )}
    </div>
  )
}
