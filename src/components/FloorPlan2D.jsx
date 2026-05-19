import { useRef, useState, useCallback, useEffect } from 'react'
import useWeddingStore from '../store/useWeddingStore.js'

// ─── Table sizing ─────────────────────────────────────────────
// Returns SVG dimensions big enough for name badges to fit without overlap
function getTableSize(table) {
  const cap = Math.max(table.capacity || 8, 1)
  const BADGE_W = 58  // approximate badge width
  switch (table.shape) {
    case 'round': {
      const minR = (BADGE_W * cap) / (2 * Math.PI)
      const r = Math.max(48, minR * 0.72)
      return { type: 'ellipse', rx: r, ry: r }
    }
    case 'oval': {
      const minRx = (BADGE_W * cap) / (2 * Math.PI)
      const rx = Math.max(62, minRx * 0.85)
      return { type: 'ellipse', rx, ry: Math.max(38, rx * 0.55) }
    }
    case 'square': {
      const s = Math.max(80, cap * 13)
      return { type: 'rect', w: s, h: s }
    }
    case 'rect': default: {
      const w = Math.max(120, cap * 21)
      const h = Math.max(62, cap * 9)
      return { type: 'rect', w, h }
    }
  }
}

// ─── Seat positions ───────────────────────────────────────────
function getSeatPositions(table) {
  const size = getTableSize(table)
  const cap  = table.capacity || 8
  const GAP  = 27

  if (size.type === 'ellipse') {
    return Array.from({ length: cap }, (_, i) => {
      const angle = (i / cap) * Math.PI * 2 - Math.PI / 2
      return { cx: (size.rx + GAP) * Math.cos(angle), cy: (size.ry + GAP) * Math.sin(angle) }
    })
  }

  const { w, h } = size
  const perimeter = 2 * (w + h)
  return Array.from({ length: cap }, (_, i) => {
    let d = (i / cap) * perimeter
    if (d < w)            return { cx: -w/2 + d,           cy: -h/2 - GAP }
    d -= w
    if (d < h)            return { cx:  w/2 + GAP,          cy: -h/2 + d  }
    d -= h
    if (d < w)            return { cx:  w/2 - d,            cy:  h/2 + GAP }
    d -= w
                          return { cx: -w/2 - GAP,          cy:  h/2 - d  }
  })
}

// ─── Seated guests mapping ────────────────────────────────────
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

// ─── Decoration SVG bodies ────────────────────────────────────
function DecoBody({ type, w, h }) {
  const hw = w / 2, hh = h / 2
  switch (type) {
    case 'flowers': {
      const r = Math.min(hw, hh) - 3
      return (
        <g>
          <circle cx={0} cy={0} r={r} fill="#fce7f3" stroke="#f9a8d4" strokeWidth={1.5} />
          {[0,1,2,3,4,5].map(i => {
            const a = (i/6)*Math.PI*2, pr = r * 0.55
            return <ellipse key={i} cx={Math.cos(a)*pr} cy={Math.sin(a)*pr}
              rx={r*0.35} ry={r*0.2}
              transform={`rotate(${i*60}, ${Math.cos(a)*pr}, ${Math.sin(a)*pr})`}
              fill="#ffadd2" stroke="#ff85c2" strokeWidth={0.7} />
          })}
          <circle cx={0} cy={0} r={r*0.22} fill="#ffd666" stroke="#d4a520" strokeWidth={1} />
        </g>
      )
    }
    case 'bar':
      return (
        <g>
          <rect x={-hw} y={-hh} width={w} height={h} rx={5} fill="#dbeafe" stroke="#93c5fd" strokeWidth={1.5} />
          <rect x={-hw+4} y={-hh+4} width={w-8} height={14} fill="#bfdbfe" stroke="#60a5fa" strokeWidth={1} rx={3} />
          {[-hw*0.5, 0, hw*0.5].map((bx, i) => (
            <g key={i} transform={`translate(${bx}, ${-hh+24})`}>
              <rect x={-5} y={0} width={10} height={hh*1.2} rx={3} fill="#ddd6fe" stroke="#8b5cf6" strokeWidth={0.8} />
              <rect x={-4} y={-9} width={8} height={9} rx={2} fill="#c4b5fd" stroke="#7c3aed" strokeWidth={0.8} />
            </g>
          ))}
        </g>
      )
    case 'dj':
      return (
        <g>
          <rect x={-hw} y={-hh} width={w} height={h} rx={6} fill="#1e1b4b" stroke="#4338ca" strokeWidth={1.5} />
          <circle cx={-hw*0.4} cy={0} r={hh*0.62} fill="#312e81" stroke="#6366f1" strokeWidth={1.5} />
          <circle cx={-hw*0.4} cy={0} r={hh*0.3} fill="#4338ca" stroke="#818cf8" strokeWidth={1} />
          <circle cx={-hw*0.4} cy={0} r={5} fill="#c7d2fe" />
          <rect x={hw*0.1} y={-hh*0.7} width={hw*0.75} height={h*0.65} rx={4} fill="#312e81" stroke="#6366f1" strokeWidth={1} />
          {[0,1,2].map(i => <circle key={i} cx={hw*0.47} cy={-hh*0.5 + i*(hh*0.45)} r={4} fill="#a5b4fc" stroke="#6366f1" strokeWidth={0.5} />)}
        </g>
      )
    case 'dancefloor': {
      const cols = Math.floor(w / 20), rows = Math.floor(h / 20)
      return (
        <g>
          {Array.from({length: cols}, (_, c) => Array.from({length: rows}, (_, r) => (
            <rect key={`${c}-${r}`}
              x={-hw + c*20} y={-hh + r*20} width={20} height={20}
              fill={(c+r)%2===0 ? '#e879f9' : '#f0abfc'}
              stroke="#d946ef" strokeWidth={0.3} />
          )))}
          <rect x={-hw} y={-hh} width={w} height={h} fill="none" stroke="#a21caf" strokeWidth={2} />
        </g>
      )
    }
    case 'photobooth':
      return (
        <g>
          <rect x={-hw} y={-hh} width={w} height={h} rx={8} fill="#f0fdf4" stroke="#86efac" strokeWidth={1.5} />
          <rect x={-hw+6} y={-hh+8} width={w-12} height={h-16} rx={6} fill="#4ade80" stroke="#22c55e" strokeWidth={1} />
          <circle cx={0} cy={hh*0.1} r={hh*0.38} fill="#bbf7d0" stroke="#22c55e" strokeWidth={1.5} />
          <circle cx={0} cy={hh*0.1} r={hh*0.18} fill="#86efac" stroke="#16a34a" strokeWidth={1} />
          <rect x={hw*0.4} y={-hh+10} width={hw*0.45} height={9} rx={2} fill="#fef08a" stroke="#facc15" strokeWidth={1} />
        </g>
      )
    case 'arch':
      return (
        <g>
          <rect x={-hw} y={-hh} width={14} height={h} fill="#d1fae5" stroke="#6ee7b7" strokeWidth={1.5} rx={3} />
          <rect x={hw-14} y={-hh} width={14} height={h} fill="#d1fae5" stroke="#6ee7b7" strokeWidth={1.5} rx={3} />
          <path d={`M ${-hw} ${-hh*0.3} Q 0 ${-hh-18} ${hw} ${-hh*0.3}`}
            fill="#d1fae5" stroke="#6ee7b7" strokeWidth={2} />
          {[-hw*0.5, 0, hw*0.5].map((cx, i) => (
            <ellipse key={i} cx={cx} cy={-hh*0.3 - 10} rx={14} ry={12}
              fill="#86efac" stroke="#4ade80" strokeWidth={1} />
          ))}
        </g>
      )
    default:
      return <rect x={-hw} y={-hh} width={w} height={h} rx={6} fill="#fce4ec" stroke="#f48fb1" strokeWidth={1.5} />
  }
}

// ─── Door ─────────────────────────────────────────────────────
function DoorShape({ door, roomBg, isSelected, onMouseDown, onDoubleClick }) {
  const { x, y, rotation = 0, size = 90, label = 'Entrada' } = door
  return (
    <g
      transform={`translate(${x},${y}) rotate(${rotation})`}
      style={{ cursor: 'grab' }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    >
      {/* Erase wall border at opening */}
      <rect x={-size/2} y={-7} width={size} height={14} fill={roomBg} />
      {/* Door swing arc */}
      <path
        d={`M ${size/2} 0 A ${size} ${size} 0 0 0 ${-size/2} ${-size}`}
        fill="rgba(201,169,110,0.12)" stroke="#c9a96e" strokeWidth={1.5} strokeDasharray="5,3}"/>
      {/* Door panel */}
      <line x1={-size/2} y1={0} x2={-size/2} y2={-size}
        stroke="#8b6914" strokeWidth={3} strokeLinecap="round" />
      {/* Hinge dot */}
      <circle cx={-size/2} cy={0} r={4} fill="#8b6914" />
      {/* Door stop lines */}
      <line x1={-size/2} y1={-6} x2={-size/2} y2={6} stroke="#c4a882" strokeWidth={3.5} />
      <line x1={size/2} y1={-6} x2={size/2} y2={6} stroke="#c4a882" strokeWidth={3.5} />
      {/* Label */}
      <text x={0} y={-size - 10} textAnchor="middle" fontSize={11}
        fill="#8b6914" fontStyle="italic" pointerEvents="none">🚪 {label}</text>
      {isSelected && (
        <rect x={-size/2 - 6} y={-size - 6} width={size + 12} height={size + 12}
          fill="none" stroke="#c9a96e" strokeWidth={1.5} strokeDasharray="5,3"
          rx={4} pointerEvents="none" />
      )}
    </g>
  )
}

// ─── Decoration shape ─────────────────────────────────────────
const DECO_SIZE = {
  flowers:    { w: 70,  h: 70  },
  bar:        { w: 95,  h: 70  },
  dj:         { w: 100, h: 65  },
  dancefloor: { w: 150, h: 110 },
  photobooth: { w: 80,  h: 75  },
  arch:       { w: 110, h: 90  },
}

function DecoShape({ deco, isSelected, onMouseDown, onDoubleClick, onRotateDown }) {
  const { w, h } = DECO_SIZE[deco.type] || { w: 80, h: 60 }
  const rotation = deco.rotation || 0
  const hw = w / 2, hh = h / 2
  const handleY = -(hh + 22)

  return (
    <g transform={`translate(${deco.x},${deco.y}) rotate(${rotation})`}
      style={{ cursor: 'grab' }}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}>
      <DecoBody type={deco.type} w={w} h={h} />
      <text x={0} y={hh + 13} textAnchor="middle" fontSize={10} fill="#555"
        fontWeight="600" pointerEvents="none">{deco.label}</text>
      {isSelected && (
        <>
          <rect x={-hw - 5} y={-hh - 5} width={w + 10} height={h + 10}
            rx={10} fill="none" stroke="#c9a96e" strokeWidth={1.5}
            strokeDasharray="5,3" pointerEvents="none" />
          {/* Rotation handle */}
          <line x1={0} y1={-hh} x2={0} y2={handleY}
            stroke="#c9a96e" strokeWidth={1} strokeDasharray="3,2" pointerEvents="none" />
          <circle cx={0} cy={handleY} r={9}
            fill="#c9a96e" stroke="white" strokeWidth={2}
            style={{ cursor: 'crosshair' }}
            onMouseDown={(e) => { e.stopPropagation(); onRotateDown(e) }} />
          <text x={0} y={handleY + 4} textAnchor="middle" fontSize={11}
            fill="white" pointerEvents="none">↻</text>
        </>
      )}
    </g>
  )
}

// ─── Seat badge ───────────────────────────────────────────────
function SeatBadge({ seat, guest, isMoving, familyColor, onClick }) {
  const occupied  = !!guest
  const firstName = guest ? guest.name.split(' ')[0].substring(0, 9) : ''
  const fill   = isMoving ? '#fde68a' : (occupied ? '#fff' : '#f0ece4')
  const stroke = isMoving ? '#d97706' : (occupied ? (familyColor || '#c9a96e') : '#d0c8b8')
  const sw     = isMoving ? 2 : (occupied ? 1.5 : 0.8)

  return (
    <g style={{ cursor: occupied ? 'pointer' : (isMoving ? 'default' : 'pointer') }}
      onClick={onClick}>
      <ellipse cx={seat.cx} cy={seat.cy} rx={27} ry={11}
        fill={fill} stroke={stroke} strokeWidth={sw} />
      <text x={seat.cx} y={seat.cy + 4} textAnchor="middle" fontSize={9}
        fill={isMoving ? '#92400e' : (occupied ? '#3d2a10' : '#b0a898')}
        fontWeight={occupied ? '700' : '400'}
        fontFamily="Inter, system-ui, sans-serif"
        pointerEvents="none">
        {occupied ? firstName : '·'}
      </text>
    </g>
  )
}

// ─── Rotation handle ─────────────────────────────────────────
function RotationHandle({ size, onMouseDown }) {
  const ry = size.type === 'ellipse' ? size.ry : size.h / 2
  const handleY = -(ry + 25)
  return (
    <g>
      <line x1={0} y1={-(ry + 8)} x2={0} y2={handleY}
        stroke="#c9a96e" strokeWidth={1} strokeDasharray="3,2" pointerEvents="none" />
      <circle cx={0} cy={handleY} r={9}
        fill="#c9a96e" stroke="white" strokeWidth={2}
        style={{ cursor: 'crosshair' }}
        onMouseDown={onMouseDown} />
      <text x={0} y={handleY + 4} textAnchor="middle" fontSize={11}
        fill="white" pointerEvents="none">↻</text>
    </g>
  )
}

// ─── Table shape ──────────────────────────────────────────────
function TableShape({ table, guests, families, isSelected, movingGuestId,
  onMouseDown, onClick, onRotateDown, onSeatClick }) {
  const size       = getTableSize(table)
  const seats      = getSeatPositions(table)
  const tableGuests = guests.filter(g => g.tableId === table.id)
  const seatedArr  = getSeatedGuests(tableGuests, table.capacity)
  const guestCount = tableGuests.length
  const isTarget   = movingGuestId && !tableGuests.some(g => g.id === movingGuestId)

  const getFamilyColor = (fid) => (families.find(f => f.id === fid) || {}).color || '#c9a96e'

  const tableFill   = table.isSpecial ? '#fffbeb' : '#fdf8f0'
  const tableStroke = isTarget ? '#16a34a' : isSelected ? '#c9a96e' : table.isSpecial ? '#d4a520' : '#b09050'
  const sw          = (isTarget || isSelected) ? 3 : 1.5

  return (
    <g transform={`translate(${table.x},${table.y}) rotate(${table.rotation || 0})`}>
      {/* Seat badges */}
      {seats.map((seat, i) => {
        const g = seatedArr[i]
        return (
          <SeatBadge key={i} seat={seat} guest={g}
            isMoving={g && g.id === movingGuestId}
            familyColor={g ? getFamilyColor(g.familyId) : null}
            onClick={(e) => { e.stopPropagation(); onSeatClick(g, i) }} />
        )
      })}

      {/* Selection / target ring */}
      {(isSelected || isTarget) && (size.type === 'ellipse'
        ? <ellipse cx={0} cy={0} rx={size.rx + 8} ry={size.ry + 8}
            fill="none" stroke={isTarget ? '#16a34a' : '#c9a96e'}
            strokeWidth={2} strokeDasharray="6,3" pointerEvents="none" />
        : <rect x={-size.w/2 - 8} y={-size.h/2 - 8} width={size.w+16} height={size.h+16}
            rx={10} fill="none" stroke={isTarget ? '#16a34a' : '#c9a96e'}
            strokeWidth={2} strokeDasharray="6,3" pointerEvents="none" />
      )}

      {/* Table body */}
      {size.type === 'ellipse'
        ? <ellipse cx={0} cy={0} rx={size.rx} ry={size.ry}
            fill={tableFill} stroke={tableStroke} strokeWidth={sw}
            style={{ cursor: 'grab' }} onMouseDown={onMouseDown} onClick={onClick} />
        : <rect x={-size.w/2} y={-size.h/2} width={size.w} height={size.h} rx={6}
            fill={tableFill} stroke={tableStroke} strokeWidth={sw}
            style={{ cursor: 'grab' }} onMouseDown={onMouseDown} onClick={onClick} />
      }

      {/* Inner ring */}
      {size.type === 'ellipse'
        ? <ellipse cx={0} cy={0} rx={size.rx*0.55} ry={size.ry*0.55}
            fill="none" stroke={tableStroke} strokeWidth={0.5} strokeDasharray="3,3" opacity={0.3} pointerEvents="none" />
        : <rect x={-size.w/2+7} y={-size.h/2+7} width={size.w-14} height={size.h-14}
            rx={4} fill="none" stroke={tableStroke} strokeWidth={0.5} strokeDasharray="3,3" opacity={0.3} pointerEvents="none" />
      }

      {/* Labels */}
      <text x={0} y={-8} textAnchor="middle" fontSize={12} fill="#5a3d20"
        fontWeight="700" fontFamily="Playfair Display, Georgia, serif" pointerEvents="none">
        {table.name}
      </text>
      <text x={0} y={8} textAnchor="middle" fontSize={10} fill="#8b6914" pointerEvents="none">
        {guestCount}/{table.capacity}
      </text>
      {table.isSpecial && (
        <text x={0} y={24} textAnchor="middle" fontSize={9} fill="#c9a96e" pointerEvents="none">
          ★ {table.specialType || 'Especial'}
        </text>
      )}

      {/* Target overlay */}
      {isTarget && (size.type === 'ellipse'
        ? <ellipse cx={0} cy={0} rx={size.rx} ry={size.ry} fill="rgba(22,163,74,0.08)" pointerEvents="none" />
        : <rect x={-size.w/2} y={-size.h/2} width={size.w} height={size.h} rx={6} fill="rgba(22,163,74,0.08)" pointerEvents="none" />
      )}

      {/* Rotation handle (only when selected) */}
      {isSelected && <RotationHandle size={size} onMouseDown={(e) => { e.stopPropagation(); onRotateDown(e) }} />}
    </g>
  )
}

// ─── Table popover ────────────────────────────────────────────
function TablePopover({ table, guests, families, onClose, onAssign, onRemove }) {
  const tableGuests = guests.filter(g => g.tableId === table.id)
  const unassigned  = guests.filter(g => !g.tableId)
  const isFull      = tableGuests.length >= table.capacity
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
          · <em style={{ fontSize: 11 }}>Clic en asiento para mover</em>
        </span>
        <div style={{ flex: 1 }} />
        <span style={{ color: isFull ? '#dc2626' : 'inherit', fontSize: 12 }}>
          {isFull ? '🔴 Llena' : `${table.capacity - tableGuests.length} libre${table.capacity - tableGuests.length !== 1 ? 's' : ''}`}
        </span>
      </div>
      <div className="popover-body">
        <div className="popover-section-title">En esta mesa ({tableGuests.length})</div>
        {tableGuests.length === 0
          ? <div style={{ padding: '6px 14px', fontSize: 12, color: 'var(--text-light)', fontStyle: 'italic' }}>Ninguno</div>
          : tableGuests.map(g => (
            <div key={g.id} className="popover-guest-row">
              <div className="family-dot" style={{ background: getFamilyColor(g.familyId) }} />
              <span className="popover-guest-name">{g.name}</span>
              {g.dietary && <span className="dietary-tag" style={{ fontSize: 9 }}>{g.dietary}</span>}
              <button className="popover-action-btn remove" onClick={() => onRemove(g.id)}>×</button>
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
                <button className="popover-action-btn add" onClick={() => onAssign(g.id)}>+</button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────
export default function FloorPlan2D() {
  const svgRef = useRef(null)
  const { tables, decorations, guests, families, room,
    moveTable, moveDecoration, deleteDecoration,
    updateTable, updateDecoration, updateDoor,
    assignGuestToTable, assignGuestToSeat, removeGuestFromTable,
    setSelectedTable, ui } = useWeddingStore()

  const [drag, setDrag]               = useState(null)
  const [movingGuestId, setMovingGuestId] = useState(null)
  const [movingFromSeat, setMovingFromSeat] = useState(null) // { tableId, seatIndex }
  const [selectedDecoId, setSelectedDecoId] = useState(null)
  const [showGrid, setShowGrid]       = useState(true)

  const selectedTableId = ui.selectedTableId
  const selectedTable   = tables.find(t => t.id === selectedTableId)
  const movingGuest     = movingGuestId ? guests.find(g => g.id === movingGuestId) : null

  // ESC cancels move
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') { setMovingGuestId(null); setMovingFromSeat(null) } }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  // ── Coordinate helper ──────────────────────────────────────
  const toSVG = useCallback((e) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const pt = svg.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const p = pt.matrixTransform(svg.getScreenCTM().inverse())
    return { x: p.x, y: p.y }
  }, [])

  // ── Drag handlers ──────────────────────────────────────────
  const startDrag = useCallback((e, type, id, cx, cy) => {
    e.stopPropagation(); e.preventDefault()
    const { x, y } = toSVG(e)
    setDrag({ type, id, offX: x - cx, offY: y - cy, cx, cy })
  }, [toSVG])

  const startRotate = useCallback((e, type, id, cx, cy) => {
    e.stopPropagation(); e.preventDefault()
    const { x, y } = toSVG(e)
    const item = type === 'rotate-table'
      ? tables.find(t => t.id === id)
      : decorations.find(d => d.id === id)
    const currentRot = (item?.rotation || 0) * Math.PI / 180
    const startAngle = Math.atan2(y - cy, x - cx)
    setDrag({ type, id, cx, cy, startAngle, baseRot: currentRot })
  }, [toSVG, tables, decorations])

  const handleMouseMove = useCallback((e) => {
    if (!drag) return
    const { x, y } = toSVG(e)

    if (drag.type === 'table') {
      moveTable(drag.id,
        Math.max(0, Math.min(room.width,  x - drag.offX)),
        Math.max(0, Math.min(room.height, y - drag.offY)))
    } else if (drag.type === 'deco') {
      moveDecoration(drag.id,
        Math.max(0, Math.min(room.width,  x - drag.offX)),
        Math.max(0, Math.min(room.height, y - drag.offY)))
    } else if (drag.type === 'door') {
      updateDoor({
        x: Math.max(0, Math.min(room.width,  x - drag.offX)),
        y: Math.max(0, Math.min(room.height, y - drag.offY)),
      })
    } else if (drag.type === 'rotate-table') {
      const angle = Math.atan2(y - drag.cy, x - drag.cx)
      const delta = angle - drag.startAngle
      const newRot = ((drag.baseRot + delta) * 180 / Math.PI + 360) % 360
      updateTable(drag.id, { rotation: Math.round(newRot) })
    } else if (drag.type === 'rotate-deco') {
      const angle = Math.atan2(y - drag.cy, x - drag.cx)
      const delta = angle - drag.startAngle
      const newRot = ((drag.baseRot + delta) * 180 / Math.PI + 360) % 360
      updateDecoration(drag.id, { rotation: Math.round(newRot) })
    }
  }, [drag, room, moveTable, moveDecoration, updateTable, updateDecoration, updateDoor, toSVG])

  const handleMouseUp = useCallback(() => setDrag(null), [])
  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseUp])

  // ── Seat click: move/assign specific seat ──────────────────
  const handleSeatClick = useCallback((guest, seatIndex, tableId) => {
    if (movingGuestId) {
      if (guest && guest.id === movingGuestId) {
        setMovingGuestId(null); setMovingFromSeat(null)  // cancel
      } else {
        assignGuestToSeat(movingGuestId, tableId, seatIndex)
        setMovingGuestId(null); setMovingFromSeat(null)
      }
    } else if (guest) {
      setMovingGuestId(guest.id)
      setMovingFromSeat({ tableId, seatIndex })
    }
  }, [movingGuestId, assignGuestToSeat])

  // ── Table body click ───────────────────────────────────────
  const handleTableClick = useCallback((e, table) => {
    e.stopPropagation()
    if (movingGuestId) {
      // Assign to first free seat
      const occupied = guests.filter(g => g.tableId === table.id)
      if (occupied.length < table.capacity) {
        assignGuestToTable(movingGuestId, table.id)
        setMovingGuestId(null); setMovingFromSeat(null)
      }
    } else {
      setSelectedTable(table.id)
      setSelectedDecoId(null)
    }
  }, [movingGuestId, guests, assignGuestToTable, setSelectedTable])

  // ── Grid ───────────────────────────────────────────────────
  const gridLines = []
  if (showGrid) {
    for (let x = 50; x < room.width; x += 50)
      gridLines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={room.height} stroke="#ddd5c4" strokeWidth={0.5} />)
    for (let y = 50; y < room.height; y += 50)
      gridLines.push(<line key={`h${y}`} x1={0} y1={y} x2={room.width} y2={y} stroke="#ddd5c4" strokeWidth={0.5} />)
  }

  const cursor = drag ? 'grabbing' : movingGuestId ? 'crosshair' : 'default'

  return (
    <div className="floorplan-container">
      <svg
        ref={svgRef}
        className="floorplan-svg"
        viewBox={`0 0 ${room.width} ${room.height}`}
        onMouseMove={handleMouseMove}
        onClick={(e) => {
          if (e.target === svgRef.current || e.target.dataset.room) {
            setSelectedTable(null); setSelectedDecoId(null); setMovingGuestId(null)
          }
        }}
        style={{ userSelect: 'none', cursor }}
      >
        {/* Room floor */}
        <rect x={0} y={0} width={room.width} height={room.height} fill={room.background} data-room="true" />
        {gridLines}

        {/* Room border */}
        <rect x={3} y={3} width={room.width-6} height={room.height-6}
          fill="none" stroke="#c4a882" strokeWidth={3} rx={6} pointerEvents="none" />

        {/* Room name */}
        <text x={room.width/2} y={room.height - 12} textAnchor="middle"
          fontSize={14} fill="#c4a882" opacity={0.45}
          fontFamily="Playfair Display, Georgia, serif" fontStyle="italic" pointerEvents="none">
          {room.name}
        </text>

        {/* Door */}
        {room.door && (
          <DoorShape
            door={room.door}
            roomBg={room.background}
            isSelected={selectedDecoId === 'door'}
            onMouseDown={(e) => {
              e.stopPropagation(); e.preventDefault()
              setSelectedDecoId('door')
              const { x, y } = toSVG(e)
              setDrag({ type: 'door', id: 'door', offX: x - room.door.x, offY: y - room.door.y })
            }}
            onDoubleClick={(e) => {
              e.stopPropagation()
              const label = prompt('Nombre de la entrada:', room.door.label || 'Entrada')
              if (label !== null) updateDoor({ label })
            }}
          />
        )}

        {/* Decorations */}
        {decorations.map(deco => (
          <DecoShape key={deco.id} deco={deco}
            isSelected={selectedDecoId === deco.id}
            onMouseDown={(e) => {
              e.stopPropagation(); e.preventDefault()
              setSelectedDecoId(deco.id); setSelectedTable(null)
              startDrag(e, 'deco', deco.id, deco.x, deco.y)
            }}
            onDoubleClick={(e) => { e.stopPropagation(); if (confirm(`¿Eliminar "${deco.label}"?`)) deleteDecoration(deco.id) }}
            onRotateDown={(e) => startRotate(e, 'rotate-deco', deco.id, deco.x, deco.y)}
          />
        ))}

        {/* Tables */}
        {tables.map(table => (
          <TableShape key={table.id}
            table={table} guests={guests} families={families}
            isSelected={table.id === selectedTableId}
            movingGuestId={movingGuestId}
            onMouseDown={(e) => {
              if (movingGuestId) return
              e.stopPropagation(); e.preventDefault()
              setSelectedDecoId(null)
              setSelectedTable(table.id)
              startDrag(e, 'table', table.id, table.x, table.y)
            }}
            onClick={(e) => handleTableClick(e, table)}
            onRotateDown={(e) => startRotate(e, 'rotate-table', table.id, table.x, table.y)}
            onSeatClick={(guest, seatIdx) => handleSeatClick(guest, seatIdx, table.id)}
          />
        ))}
      </svg>

      {/* Toolbar */}
      <div className="floorplan-tools">
        <button className="tool-btn" onClick={() => setShowGrid(v => !v)} title="Cuadrícula">
          {showGrid ? '⊞' : '⬚'}
        </button>
        {selectedDecoId === 'door' && room.door && (
          <button className="tool-btn" title="Girar puerta"
            onClick={() => updateDoor({ rotation: ((room.door.rotation || 0) + 90) % 360 })}>
            ↻
          </button>
        )}
      </div>

      {/* Moving guest banner */}
      {movingGuestId && movingGuest && (
        <div style={{
          position: 'absolute', bottom: 16, left: '50%', transform: 'translateX(-50%)',
          background: '#fffbeb', border: '2px solid #f59e0b',
          borderRadius: 10, padding: '10px 20px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: '0 4px 16px rgba(0,0,0,0.18)', zIndex: 50, whiteSpace: 'nowrap',
        }}>
          <span style={{ fontSize: 16 }}>🏃</span>
          <div>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>
              Moviendo: {movingGuest.name}
            </span>
            <span style={{ fontSize: 12, color: '#b45309', marginLeft: 8 }}>
              Clic en un asiento para colocar · ESC para cancelar
            </span>
          </div>
          <button onClick={() => { setMovingGuestId(null); setMovingFromSeat(null) }}
            style={{ background: '#fde68a', border: 'none', borderRadius: 6,
              padding: '4px 10px', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>
            ✕
          </button>
        </div>
      )}

      {/* Table popover */}
      {selectedTable && !movingGuestId && (
        <TablePopover
          table={selectedTable} guests={guests} families={families}
          onClose={() => setSelectedTable(null)}
          onAssign={(gid) => assignGuestToTable(gid, selectedTableId)}
          onRemove={removeGuestFromTable}
        />
      )}
    </div>
  )
}
