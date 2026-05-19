import { useRef, useState, useCallback, useEffect } from 'react'
import useWeddingStore from '../store/useWeddingStore.js'

const DECO_CONFIG = {
  flowers:    { emoji: '🌸', bg: '#fce4ec', border: '#f48fb1', w: 70,  h: 60  },
  bar:        { emoji: '🍸', bg: '#e3f2fd', border: '#90caf9', w: 90,  h: 65  },
  dj:         { emoji: '🎵', bg: '#f3e5f5', border: '#ce93d8', w: 80,  h: 60  },
  dancefloor: { emoji: '💃', bg: '#fff8e1', border: '#ffd54f', w: 150, h: 110 },
  photobooth: { emoji: '📷', bg: '#e8f5e9', border: '#a5d6a7', w: 85,  h: 70  },
  arch:       { emoji: '🌿', bg: '#f1f8e9', border: '#c5e1a5', w: 110, h: 85  },
}

// Table sizing: big enough for name badges around perimeter
function getTableSize(table) {
  const cap = Math.max(table.capacity || 8, 1)
  switch (table.shape) {
    case 'round': {
      // radius so badges don't overlap: 2π*R / cap >= 60
      const minR = (60 * cap) / (2 * Math.PI)
      const r = Math.max(50, minR * 0.75)
      return { type: 'ellipse', rx: r, ry: r }
    }
    case 'oval': {
      const minRx = (60 * cap) / (2 * Math.PI)
      const rx = Math.max(65, minRx * 0.85)
      const ry = Math.max(42, rx * 0.55)
      return { type: 'ellipse', rx, ry }
    }
    case 'square': {
      const side = Math.max(80, cap * 13)
      return { type: 'rect', w: side, h: side }
    }
    case 'rect':
    default: {
      const w = Math.max(120, cap * 20)
      const h = Math.max(65, cap * 9)
      return { type: 'rect', w, h }
    }
  }
}

// Generate seat positions around the table
function getSeatPositions(table) {
  const size = getTableSize(table)
  const cap = table.capacity || 8
  const BADGE_DIST = 26  // distance from table edge to badge center

  if (size.type === 'ellipse') {
    return Array.from({ length: cap }, (_, i) => {
      const angle = (i / cap) * Math.PI * 2 - Math.PI / 2
      return {
        cx: (size.rx + BADGE_DIST) * Math.cos(angle),
        cy: (size.ry + BADGE_DIST) * Math.sin(angle),
        angle,
      }
    })
  }

  // Rect / square: distribute on all 4 sides
  const { w, h } = size
  const perimeter = 2 * (w + h)
  const seats = []
  const step = perimeter / cap

  for (let i = 0; i < cap; i++) {
    let d = i * step
    let cx, cy, angle

    if (d < w) {                               // top
      cx = -w / 2 + d; cy = -h / 2 - BADGE_DIST; angle = -Math.PI / 2
    } else if (d < w + h) {                    // right
      d -= w; cx = w / 2 + BADGE_DIST; cy = -h / 2 + d; angle = 0
    } else if (d < 2 * w + h) {               // bottom
      d -= w + h; cx = w / 2 - d; cy = h / 2 + BADGE_DIST; angle = Math.PI / 2
    } else {                                   // left
      d -= 2 * w + h; cx = -w / 2 - BADGE_DIST; cy = h / 2 - d; angle = Math.PI
    }
    seats.push({ cx, cy, angle })
  }
  return seats
}

// Badge rendering for each seat
function SeatBadge({ seat, guest, isMoving, familyColor, onClick }) {
  const BADGE_RX = 28
  const BADGE_RY = 12
  const occupied = !!guest
  const firstName = guest ? guest.name.split(' ')[0].substring(0, 9) : ''

  const fill = isMoving ? '#fde68a' : (occupied ? '#fff' : '#f0ece4')
  const stroke = isMoving ? '#d97706' : (occupied ? (familyColor || '#c9a96e') : '#d0c8b8')
  const sw = isMoving ? 2 : (occupied ? 1.5 : 1)

  return (
    <g
      style={{ cursor: occupied ? 'pointer' : 'default' }}
      onClick={occupied ? onClick : undefined}
    >
      <ellipse
        cx={seat.cx} cy={seat.cy}
        rx={BADGE_RX} ry={BADGE_RY}
        fill={fill} stroke={stroke} strokeWidth={sw}
      />
      {occupied && (
        <text
          x={seat.cx} y={seat.cy + 4}
          textAnchor="middle" fontSize={9}
          fill={isMoving ? '#92400e' : '#3d2a10'}
          fontWeight="700"
          fontFamily="Inter, system-ui, sans-serif"
          pointerEvents="none"
        >
          {firstName}
        </text>
      )}
    </g>
  )
}

function TableShape({ table, guests, families, isSelected, movingGuestId,
  onMouseDown, onClick, onSeatClick }) {
  const size = getTableSize(table)
  const seats = getSeatPositions(table)
  const tableGuests = guests.filter(g => g.tableId === table.id)
  const guestCount = tableGuests.length

  const isTarget = movingGuestId && !tableGuests.some(g => g.id === movingGuestId)

  const getFamilyColor = (fid) => (families.find(f => f.id === fid) || {}).color || '#c9a96e'

  const fillColor = table.isSpecial ? '#fffbeb' : '#fdf8f0'
  const strokeColor = isTarget
    ? '#16a34a'
    : isSelected
      ? '#c9a96e'
      : table.isSpecial ? '#d4a520' : '#b09050'
  const sw = (isTarget || isSelected) ? 3 : 1.5

  return (
    <g transform={`translate(${table.x},${table.y})`}>
      {/* Seat badges */}
      {seats.map((seat, i) => {
        const guest = tableGuests[i] || null
        return (
          <SeatBadge
            key={i}
            seat={seat}
            guest={guest}
            isMoving={guest && guest.id === movingGuestId}
            familyColor={guest ? getFamilyColor(guest.familyId) : null}
            onClick={(e) => { e.stopPropagation(); onSeatClick(guest) }}
          />
        )
      })}

      {/* Selection / target ring */}
      {(isSelected || isTarget) && (
        size.type === 'ellipse'
          ? <ellipse cx={0} cy={0} rx={size.rx + 8} ry={size.ry + 8}
              fill="none"
              stroke={isTarget ? '#16a34a' : '#c9a96e'}
              strokeWidth={2} strokeDasharray="6,3" pointerEvents="none" />
          : <rect x={-size.w / 2 - 8} y={-size.h / 2 - 8} width={size.w + 16} height={size.h + 16}
              rx={10} fill="none"
              stroke={isTarget ? '#16a34a' : '#c9a96e'}
              strokeWidth={2} strokeDasharray="6,3" pointerEvents="none" />
      )}

      {/* Table body */}
      {size.type === 'ellipse'
        ? <ellipse cx={0} cy={0} rx={size.rx} ry={size.ry}
            fill={fillColor} stroke={strokeColor} strokeWidth={sw}
            style={{ cursor: 'grab' }} onMouseDown={onMouseDown} onClick={onClick} />
        : <rect x={-size.w / 2} y={-size.h / 2} width={size.w} height={size.h} rx={6}
            fill={fillColor} stroke={strokeColor} strokeWidth={sw}
            style={{ cursor: 'grab' }} onMouseDown={onMouseDown} onClick={onClick} />
      }

      {/* Inner ring (decorative) */}
      {size.type === 'ellipse'
        ? <ellipse cx={0} cy={0} rx={size.rx * 0.55} ry={size.ry * 0.55}
            fill="none" stroke={strokeColor} strokeWidth={0.5}
            strokeDasharray="3,3" opacity={0.3} pointerEvents="none" />
        : <rect x={-size.w / 2 + 7} y={-size.h / 2 + 7} width={size.w - 14} height={size.h - 14}
            rx={4} fill="none" stroke={strokeColor} strokeWidth={0.5}
            strokeDasharray="3,3" opacity={0.3} pointerEvents="none" />
      }

      {/* Table name */}
      <text x={0} y={-9} textAnchor="middle" fontSize={12} fill="#5a3d20"
        fontWeight="700" fontFamily="Playfair Display, Georgia, serif" pointerEvents="none">
        {table.name}
      </text>

      {/* Guest count / capacity */}
      <text x={0} y={8} textAnchor="middle" fontSize={10} fill="#8b6914" pointerEvents="none">
        {guestCount}/{table.capacity}
      </text>

      {/* Special label */}
      {table.isSpecial && (
        <text x={0} y={24} textAnchor="middle" fontSize={9} fill="#c9a96e" pointerEvents="none">
          ★ {table.specialType || 'Especial'}
        </text>
      )}

      {/* Target indicator overlay */}
      {isTarget && (
        size.type === 'ellipse'
          ? <ellipse cx={0} cy={0} rx={size.rx} ry={size.ry}
              fill="rgba(22,163,74,0.08)" pointerEvents="none" />
          : <rect x={-size.w / 2} y={-size.h / 2} width={size.w} height={size.h} rx={6}
              fill="rgba(22,163,74,0.08)" pointerEvents="none" />
      )}
    </g>
  )
}

function DecoShape({ deco, onMouseDown, onDoubleClick }) {
  const cfg = DECO_CONFIG[deco.type] || DECO_CONFIG.flowers
  const { w, h, bg, border, emoji } = cfg
  return (
    <g transform={`translate(${deco.x},${deco.y})`}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={10}
        fill={bg} stroke={border} strokeWidth={1.5}
        style={{ cursor: 'grab' }} onMouseDown={onMouseDown} onDoubleClick={onDoubleClick} />
      <text x={0} y={6} textAnchor="middle" fontSize={22} pointerEvents="none">{emoji}</text>
      <text x={0} y={h / 2 - 7} textAnchor="middle" fontSize={9} fill="#555"
        fontWeight="600" pointerEvents="none">{deco.label}</text>
    </g>
  )
}

// Popover for adding unassigned guests to a selected table
function TablePopover({ table, guests, families, onClose, onAssign, onRemove }) {
  const tableGuests = guests.filter(g => g.tableId === table.id)
  const unassigned = guests.filter(g => !g.tableId)
  const isFull = tableGuests.length >= table.capacity
  const getFamilyColor = (fid) => (families.find(f => f.id === fid) || {}).color || '#ccc'

  return (
    <div className="table-popover">
      <div className="popover-header">
        <h3>{table.name}</h3>
        <span className="capacity-badge">{tableGuests.length}/{table.capacity}</span>
        <button className="popover-close btn" onClick={onClose}>×</button>
      </div>
      <div className="popover-capacity-info">
        <span style={{ fontSize: 12, color: 'var(--text-mid)' }}>
          {table.isSpecial ? `⭐ ${table.specialType}` : `Mesa ${table.shape}`}
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ color: isFull ? '#dc2626' : 'inherit', fontSize: 12 }}>
          {isFull ? '🔴 Llena' : `${table.capacity - tableGuests.length} libre${table.capacity - tableGuests.length !== 1 ? 's' : ''}`}
        </span>
      </div>
      <div className="popover-body">
        <div className="popover-section-title">
          En esta mesa — haz clic en un nombre del plano para mover
        </div>
        {tableGuests.length === 0
          ? <div style={{ padding: '6px 14px', fontSize: 12, color: 'var(--text-light)', fontStyle: 'italic' }}>Ninguno</div>
          : tableGuests.map(g => (
            <div key={g.id} className="popover-guest-row">
              <div className="family-dot" style={{ background: getFamilyColor(g.familyId) }} />
              <span className="popover-guest-name">{g.name}</span>
              {g.dietary && <span className="dietary-tag" style={{ fontSize: 9 }}>{g.dietary}</span>}
              <button className="popover-action-btn remove" title="Quitar" onClick={() => onRemove(g.id)}>×</button>
            </div>
          ))
        }

        {!isFull && unassigned.length > 0 && (
          <>
            <div className="popover-section-title" style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
              Sin asignar ({unassigned.length})
            </div>
            {unassigned.map(g => (
              <div key={g.id} className="popover-guest-row">
                <div className="family-dot" style={{ background: getFamilyColor(g.familyId) }} />
                <span className="popover-guest-name">{g.name}</span>
                <button className="popover-action-btn add" title="Asignar" onClick={() => onAssign(g.id)}>+</button>
              </div>
            ))}
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
  const [movingGuestId, setMovingGuestId] = useState(null)
  const [showGrid, setShowGrid] = useState(true)

  const selectedTableId = ui.selectedTableId
  const selectedTable = tables.find(t => t.id === selectedTableId)
  const movingGuest = movingGuestId ? guests.find(g => g.id === movingGuestId) : null

  // ESC to cancel move
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setMovingGuestId(null) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const toSVG = useCallback((e) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const pt = svg.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const p = pt.matrixTransform(svg.getScreenCTM().inverse())
    return { x: p.x, y: p.y }
  }, [])

  const handleTableMouseDown = useCallback((e, table) => {
    e.stopPropagation(); e.preventDefault()
    if (movingGuestId) return   // let click handler manage this
    setSelectedTable(table.id)
    const { x, y } = toSVG(e)
    setDrag({ type: 'table', id: table.id, offX: x - table.x, offY: y - table.y })
  }, [toSVG, setSelectedTable, movingGuestId])

  const handleTableClick = useCallback((e, table) => {
    e.stopPropagation()
    if (movingGuestId) {
      // Move the guest to this table
      const tableGuestCount = guests.filter(g => g.tableId === table.id).length
      if (tableGuestCount < table.capacity) {
        assignGuestToTable(movingGuestId, table.id)
        setMovingGuestId(null)
      }
    } else {
      setSelectedTable(table.id)
    }
  }, [movingGuestId, guests, assignGuestToTable, setSelectedTable])

  const handleSeatClick = useCallback((guest) => {
    if (!guest) return
    if (movingGuestId === guest.id) {
      setMovingGuestId(null)  // cancel move
    } else {
      setMovingGuestId(guest.id)
    }
  }, [movingGuestId])

  const handleDecoDown = useCallback((e, deco) => {
    e.stopPropagation(); e.preventDefault()
    const { x, y } = toSVG(e)
    setDrag({ type: 'deco', id: deco.id, offX: x - deco.x, offY: y - deco.y })
  }, [toSVG])

  const handleMouseMove = useCallback((e) => {
    if (!drag) return
    const { x, y } = toSVG(e)
    const nx = Math.max(0, Math.min(room.width, x - drag.offX))
    const ny = Math.max(0, Math.min(room.height, y - drag.offY))
    if (drag.type === 'table') moveTable(drag.id, nx, ny)
    else moveDecoration(drag.id, nx, ny)
  }, [drag, room, moveTable, moveDecoration, toSVG])

  const handleMouseUp = useCallback(() => setDrag(null), [])

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseUp])

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
        onMouseMove={handleMouseMove}
        onClick={(e) => {
          if (e.target === svgRef.current || e.target.dataset.room) {
            setSelectedTable(null)
            setMovingGuestId(null)
          }
        }}
        style={{ userSelect: 'none', cursor: drag ? 'grabbing' : (movingGuestId ? 'crosshair' : 'default') }}
      >
        <rect x={0} y={0} width={room.width} height={room.height}
          fill={room.background} data-room="true" />
        {gridLines}
        <rect x={3} y={3} width={room.width - 6} height={room.height - 6}
          fill="none" stroke="#c4a882" strokeWidth={3} rx={6} pointerEvents="none" />
        <text x={room.width / 2} y={room.height - 12} textAnchor="middle"
          fontSize={14} fill="#c4a882" opacity={0.45}
          fontFamily="Playfair Display, Georgia, serif" fontStyle="italic" pointerEvents="none">
          {room.name}
        </text>

        {decorations.map(deco => (
          <DecoShape key={deco.id} deco={deco}
            onMouseDown={(e) => handleDecoDown(e, deco)}
            onDoubleClick={() => { if (confirm(`¿Eliminar "${deco.label}"?`)) deleteDecoration(deco.id) }}
          />
        ))}

        {tables.map(table => (
          <TableShape key={table.id}
            table={table} guests={guests} families={families}
            isSelected={table.id === selectedTableId}
            movingGuestId={movingGuestId}
            onMouseDown={(e) => handleTableMouseDown(e, table)}
            onClick={(e) => handleTableClick(e, table)}
            onSeatClick={handleSeatClick}
          />
        ))}
      </svg>

      {/* Toolbar */}
      <div className="floorplan-tools">
        <button className="tool-btn" onClick={() => setShowGrid(v => !v)} title="Cuadrícula">
          {showGrid ? '⊞' : '⬚'}
        </button>
      </div>

      {/* Moving guest banner */}
      {movingGuestId && movingGuest && (
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          background: '#fffbeb', border: '2px solid #f59e0b',
          borderRadius: 10, padding: '10px 20px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)', zIndex: 50, whiteSpace: 'nowrap'
        }}>
          <span style={{ fontSize: 16 }}>🏃</span>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>
              Moviendo: {movingGuest.name}
            </span>
            <span style={{ fontSize: 12, color: '#b45309', marginLeft: 8 }}>
              Haz clic en una mesa para asignar · ESC para cancelar
            </span>
          </div>
          <button
            onClick={() => setMovingGuestId(null)}
            style={{
              background: '#fde68a', border: 'none', borderRadius: 6,
              padding: '4px 10px', fontWeight: 700, cursor: 'pointer', fontSize: 13
            }}
          >✕ Cancelar</button>
        </div>
      )}

      {/* Table popover */}
      {selectedTable && !movingGuestId && (
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
