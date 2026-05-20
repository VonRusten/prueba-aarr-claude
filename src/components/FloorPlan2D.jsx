import { useRef, useState, useCallback, useEffect } from 'react'
import useWeddingStore from '../store/useWeddingStore.js'

// ─── Table sizing ─────────────────────────────────────────────
const SEAT_R = 17

function getTableSize(table) {
  const cap = Math.max(table.capacity || 1, 1)
  switch (table.shape) {
    case 'round': {
      const r = Math.max(36, (cap * SEAT_R * 1.15) / Math.PI)
      return { type: 'ellipse', rx: r, ry: r }
    }
    case 'oval': {
      const rx = Math.max(50, (cap * SEAT_R * 0.85) / Math.PI)
      return { type: 'ellipse', rx, ry: Math.max(32, rx * 0.58) }
    }
    case 'square': {
      const s = Math.max(70, cap * 12)
      return { type: 'rect', w: s, h: s }
    }
    case 'rect': default: {
      const w = Math.max(100, cap * 18)
      const h = Math.max(56, cap * 8)
      return { type: 'rect', w, h }
    }
  }
}

function getSeatPositions(table) {
  const sz = getTableSize(table)
  const cap = table.capacity || 1
  const GAP = SEAT_R + 5

  if (sz.type === 'ellipse') {
    return Array.from({ length: cap }, (_, i) => {
      const angle = (i / cap) * Math.PI * 2 - Math.PI / 2
      return { cx: (sz.rx + GAP) * Math.cos(angle), cy: (sz.ry + GAP) * Math.sin(angle) }
    })
  }

  const { w, h } = sz
  const perimeter = 2 * (w + h)
  return Array.from({ length: cap }, (_, i) => {
    let d = (i / cap) * perimeter
    if (d < w)    return { cx: -w / 2 + d,        cy: -h / 2 - GAP }
    d -= w
    if (d < h)    return { cx:  w / 2 + GAP,       cy: -h / 2 + d  }
    d -= h
    if (d < w)    return { cx:  w / 2 - d,          cy:  h / 2 + GAP }
    d -= w
                  return { cx: -w / 2 - GAP,        cy:  h / 2 - d  }
  })
}

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

function shortName(name) {
  const first = (name || '').split(' ')[0]
  return first.length > 7 ? first.slice(0, 6) + '…' : first
}

// ─── Decoration SVG ───────────────────────────────────────────
function DecoBody({ type, w, h }) {
  const hw = w / 2, hh = h / 2
  switch (type) {
    case 'flowers': {
      const r = Math.min(hw, hh) - 4
      return (
        <g>
          <circle r={r} fill="#fce7f3" stroke="#f9a8d4" strokeWidth={1.5} />
          {[0,1,2,3,4,5].map(i => {
            const a = (i/6)*Math.PI*2, pr = r*0.55
            return <ellipse key={i} cx={Math.cos(a)*pr} cy={Math.sin(a)*pr}
              rx={r*0.35} ry={r*0.2} transform={`rotate(${i*60},${Math.cos(a)*pr},${Math.sin(a)*pr})`}
              fill="#ffadd2" stroke="#ff85c2" strokeWidth={0.7} />
          })}
          <circle r={r*0.22} fill="#ffd666" stroke="#d4a520" strokeWidth={1} />
        </g>
      )
    }
    case 'bar':
      return (
        <g>
          <rect x={-hw} y={-hh} width={w} height={h} rx={5} fill="#dbeafe" stroke="#93c5fd" strokeWidth={1.5} />
          <rect x={-hw+4} y={-hh+4} width={w-8} height={12} fill="#bfdbfe" stroke="#60a5fa" strokeWidth={1} rx={2} />
          {[-hw*0.5, 0, hw*0.5].map((bx, i) => (
            <g key={i} transform={`translate(${bx},${-hh+20})`}>
              <rect x={-4} y={0} width={8} height={hh*1.2} rx={2} fill="#ddd6fe" stroke="#8b5cf6" strokeWidth={0.8} />
              <rect x={-3} y={-7} width={6} height={7} rx={1.5} fill="#c4b5fd" stroke="#7c3aed" strokeWidth={0.8} />
            </g>
          ))}
        </g>
      )
    case 'dj':
      return (
        <g>
          <rect x={-hw} y={-hh} width={w} height={h} rx={6} fill="#1e1b4b" stroke="#4338ca" strokeWidth={1.5} />
          <circle cx={-hw*0.4} cy={0} r={hh*0.62} fill="#312e81" stroke="#6366f1" strokeWidth={1.5} />
          <circle cx={-hw*0.4} cy={0} r={hh*0.28} fill="#4338ca" stroke="#818cf8" strokeWidth={1} />
          <circle cx={-hw*0.4} cy={0} r={4} fill="#c7d2fe" />
          <rect x={hw*0.08} y={-hh*0.65} width={hw*0.78} height={h*0.6} rx={3} fill="#312e81" stroke="#6366f1" strokeWidth={1} />
        </g>
      )
    case 'dancefloor': {
      const cols = Math.max(2, Math.floor(w/20)), rows = Math.max(2, Math.floor(h/20))
      return (
        <g>
          {Array.from({length: cols}, (_, c) => Array.from({length: rows}, (_, r) => (
            <rect key={`${c}-${r}`} x={-hw+c*20} y={-hh+r*20} width={20} height={20}
              fill={(c+r)%2===0 ? '#e879f9' : '#f0abfc'} stroke="#d946ef" strokeWidth={0.3} />
          )))}
          <rect x={-hw} y={-hh} width={w} height={h} fill="none" stroke="#a21caf" strokeWidth={2} />
        </g>
      )
    }
    case 'photobooth':
      return (
        <g>
          <rect x={-hw} y={-hh} width={w} height={h} rx={7} fill="#f0fdf4" stroke="#86efac" strokeWidth={1.5} />
          <circle cx={0} cy={hh*0.1} r={hh*0.38} fill="#bbf7d0" stroke="#22c55e" strokeWidth={1.5} />
          <circle cx={0} cy={hh*0.1} r={hh*0.18} fill="#86efac" stroke="#16a34a" strokeWidth={1} />
          <rect x={hw*0.35} y={-hh+8} width={hw*0.5} height={8} rx={2} fill="#fef08a" stroke="#facc15" strokeWidth={1} />
        </g>
      )
    case 'arch':
      return (
        <g>
          <rect x={-hw} y={-hh} width={13} height={h} fill="#d1fae5" stroke="#6ee7b7" strokeWidth={1.5} rx={3} />
          <rect x={hw-13} y={-hh} width={13} height={h} fill="#d1fae5" stroke="#6ee7b7" strokeWidth={1.5} rx={3} />
          <path d={`M ${-hw} ${-hh*0.3} Q 0 ${-hh-16} ${hw} ${-hh*0.3}`}
            fill="#d1fae5" stroke="#6ee7b7" strokeWidth={2} />
          {[-hw*0.5, 0, hw*0.5].map((cx, i) => (
            <ellipse key={i} cx={cx} cy={-hh*0.3-9} rx={13} ry={10} fill="#86efac" stroke="#4ade80" strokeWidth={1} />
          ))}
        </g>
      )
    default:
      return <rect x={-hw} y={-hh} width={w} height={h} rx={6} fill="#fce4ec" stroke="#f48fb1" strokeWidth={1.5} />
  }
}

const DECO_SIZE = {
  flowers:    { w: 68, h: 68 },
  bar:        { w: 92, h: 65 },
  dj:         { w: 98, h: 62 },
  dancefloor: { w: 148, h: 108 },
  photobooth: { w: 78, h: 72 },
  arch:       { w: 108, h: 88 },
}

const DECO_PALETTE = [
  { type: 'flowers',    label: 'Flores',  icon: '🌸' },
  { type: 'bar',        label: 'Bar',     icon: '🍹' },
  { type: 'dj',         label: 'DJ',      icon: '🎵' },
  { type: 'dancefloor', label: 'Pista',   icon: '💃' },
  { type: 'photobooth', label: 'Fotos',   icon: '📷' },
  { type: 'arch',       label: 'Arco',    icon: '🌿' },
]

// ─── Door ─────────────────────────────────────────────────────
function DoorShape({ door, roomBg, isSelected, onMouseDown }) {
  const { x, y, rotation = 0, size = 90, label = 'Entrada' } = door
  return (
    <g transform={`translate(${x},${y}) rotate(${rotation})`}
      style={{ cursor: 'grab' }} onMouseDown={onMouseDown}>
      <rect x={-size/2} y={-8} width={size} height={16} fill={roomBg} />
      <path d={`M ${size/2} 0 A ${size} ${size} 0 0 0 ${-size/2} ${-size}`}
        fill="rgba(201,149,108,0.1)" stroke="#C9956C" strokeWidth={1.5} strokeDasharray="5,3" />
      <line x1={-size/2} y1={0} x2={-size/2} y2={-size} stroke="#8b6914" strokeWidth={3} strokeLinecap="round" />
      <circle cx={-size/2} cy={0} r={4} fill="#8b6914" />
      <line x1={-size/2} y1={-7} x2={-size/2} y2={7} stroke="#c4a882" strokeWidth={4} />
      <line x1={size/2}  y1={-7} x2={size/2}  y2={7} stroke="#c4a882" strokeWidth={4} />
      <text x={0} y={-size-10} textAnchor="middle" fontSize={11}
        fill="#8b6914" fontStyle="italic" pointerEvents="none">
        🚪 {label}
      </text>
      {isSelected && (
        <rect x={-size/2-6} y={-size-6} width={size+12} height={size+12}
          fill="none" stroke="#C9956C" strokeWidth={1.5} strokeDasharray="5,3" rx={4} pointerEvents="none" />
      )}
    </g>
  )
}

// ─── Table component ──────────────────────────────────────────
function TableShape({ table, guests, families, isSelected, hasSelection, guestDragId,
  onMouseDown, onClick, onSeatMouseDown, onSeatClick }) {
  const sz = getTableSize(table)
  const seats = getSeatPositions(table)
  const tableGuests = guests.filter(g => g.tableId === table.id)
  const seatedArr = getSeatedGuests(tableGuests, table.capacity)
  const guestCount = tableGuests.length

  const getFamilyColor = (fid) => {
    const f = families.find(x => x.id === fid)
    return f?.color || '#94A3B8'
  }

  const tableStroke = isSelected ? '#C9956C' : table.isSpecial ? '#C9956C' : '#E5E7EB'
  const tableFill = table.isSpecial ? '#FFFBF5' : '#FFFFFF'
  const sw = isSelected ? 2.5 : 1.5

  return (
    <g transform={`translate(${table.x},${table.y}) rotate(${table.rotation || 0})`}>
      {/* Assign-mode ring */}
      {hasSelection && !guestDragId && (sz.type === 'ellipse'
        ? <ellipse rx={sz.rx+14} ry={sz.ry+14} fill="none"
            stroke="#C9956C" strokeWidth={1.5} strokeDasharray="5 3" opacity={0.45} pointerEvents="none" />
        : <rect x={-sz.w/2-14} y={-sz.h/2-14} width={sz.w+28} height={sz.h+28}
            rx={14} fill="none" stroke="#C9956C" strokeWidth={1.5} strokeDasharray="5 3" opacity={0.45} pointerEvents="none" />
      )}

      {/* Drop target highlight when dragging a guest */}
      {guestDragId && (sz.type === 'ellipse'
        ? <ellipse rx={sz.rx} ry={sz.ry} fill="rgba(34,197,94,0.07)" pointerEvents="none" />
        : <rect x={-sz.w/2} y={-sz.h/2} width={sz.w} height={sz.h} rx={8} fill="rgba(34,197,94,0.07)" pointerEvents="none" />
      )}

      {/* Seats */}
      {seats.map((seat, i) => {
        const g = seatedArr[i]
        const isBeingDragged = g && g.id === guestDragId
        const fColor = g?.familyId ? getFamilyColor(g.familyId) : '#C9956C'
        const canAssign = !g && hasSelection && !guestDragId

        return (
          <g key={i} transform={`translate(${seat.cx},${seat.cy})`}
            style={{ cursor: g && !isBeingDragged ? 'grab' : canAssign ? 'pointer' : 'default' }}
            onMouseDown={e => {
              if (g && !isBeingDragged) {
                e.stopPropagation()
                e.preventDefault()
                onSeatMouseDown(g, i, fColor, e)
              }
            }}
            onClick={e => {
              e.stopPropagation()
              if (!g) onSeatClick(null, i)
            }}>
            {isBeingDragged ? (
              // Ghost outline where the dragged guest came from
              <circle r={SEAT_R} fill="none" stroke={fColor}
                strokeWidth={1.5} strokeDasharray="4 2" opacity={0.5} />
            ) : g ? (
              <>
                <circle r={SEAT_R} fill={fColor}
                  stroke="rgba(255,255,255,0.5)" strokeWidth={1.5} />
                <text textAnchor="middle" dominantBaseline="middle"
                  fontSize={8.5} fill="white" fontWeight="700"
                  fontFamily="Inter,sans-serif" pointerEvents="none">
                  {shortName(g.name)}
                </text>
              </>
            ) : (
              <>
                <circle r={SEAT_R} fill="white" stroke={canAssign ? '#C9956C' : '#D1D5DB'}
                  strokeWidth={canAssign ? 2 : 1.5} strokeDasharray="3 2" />
                <text textAnchor="middle" dominantBaseline="middle"
                  fontSize={11} fill={canAssign ? '#C9956C' : '#D1D5DB'} pointerEvents="none">+</text>
              </>
            )}
          </g>
        )
      })}

      {/* Table body */}
      {sz.type === 'ellipse'
        ? <ellipse rx={sz.rx} ry={sz.ry} fill={tableFill} stroke={tableStroke} strokeWidth={sw}
            style={{ cursor: 'grab', filter: isSelected ? 'drop-shadow(0 4px 12px rgba(201,149,108,0.3))' : 'drop-shadow(0 3px 8px rgba(0,0,0,0.1))' }}
            onMouseDown={onMouseDown} onClick={onClick} />
        : <rect x={-sz.w/2} y={-sz.h/2} width={sz.w} height={sz.h} rx={8}
            fill={tableFill} stroke={tableStroke} strokeWidth={sw}
            style={{ cursor: 'grab', filter: isSelected ? 'drop-shadow(0 4px 12px rgba(201,149,108,0.3))' : 'drop-shadow(0 3px 8px rgba(0,0,0,0.1))' }}
            onMouseDown={onMouseDown} onClick={onClick} />
      }

      {/* Inner ring accent */}
      {sz.type === 'ellipse'
        ? <ellipse rx={sz.rx*0.55} ry={sz.ry*0.55} fill="none"
            stroke={tableStroke} strokeWidth={0.5} opacity={0.25} pointerEvents="none" />
        : <rect x={-sz.w/2+8} y={-sz.h/2+8} width={sz.w-16} height={sz.h-16} rx={5}
            fill="none" stroke={tableStroke} strokeWidth={0.5} opacity={0.25} pointerEvents="none" />
      }

      {/* Labels */}
      <text x={0} y={table.isSpecial ? -10 : -6} textAnchor="middle" fontSize={11}
        fill={table.isSpecial ? '#C9956C' : '#374151'} fontWeight="700"
        fontFamily="Cormorant Garamond,Georgia,serif" pointerEvents="none">
        {table.name}
      </text>
      <text x={0} y={table.isSpecial ? 6 : 8} textAnchor="middle" fontSize={9}
        fill="#9CA3AF" pointerEvents="none">
        {guestCount}/{table.capacity}
      </text>
      {table.isSpecial && (
        <text x={0} y={20} textAnchor="middle" fontSize={8} fill="#C9956C" pointerEvents="none">
          ★ {table.specialType || 'Especial'}
        </text>
      )}
    </g>
  )
}

// ─── Decoration component ─────────────────────────────────────
function DecoShape({ deco, isSelected, onMouseDown }) {
  const { w, h } = DECO_SIZE[deco.type] || { w: 80, h: 60 }
  const hh = h / 2
  return (
    <g transform={`translate(${deco.x},${deco.y}) rotate(${deco.rotation || 0})`}
      style={{ cursor: 'grab' }} onMouseDown={onMouseDown}>
      <DecoBody type={deco.type} w={w} h={h} />
      <text x={0} y={hh+13} textAnchor="middle" fontSize={10} fill="#555"
        fontWeight="600" pointerEvents="none">{deco.label}</text>
      {isSelected && (
        <rect x={-w/2-5} y={-hh-5} width={w+10} height={h+10}
          rx={8} fill="none" stroke="#C9956C" strokeWidth={1.5}
          strokeDasharray="5,3" pointerEvents="none" />
      )}
    </g>
  )
}

// ─── Main component ───────────────────────────────────────────
export default function FloorPlan2D() {
  const svgRef = useRef(null)
  const {
    tables, decorations, guests, families, room,
    moveTable, moveDecoration, updateDoor, deleteDecoration,
    assignGuestToSeat, addDecoration,
    setSelectedTable, bulkAssignToTable, clearSelection, ui
  } = useWeddingStore()

  const selectedGuestIds = ui.selectedGuestIds
  const selectedTableId  = ui.selectedTableId

  // Table/deco/door drag state
  const [drag, setDrag] = useState(null)

  // Guest drag-and-drop state (for rendering the ghost)
  const [guestDrag, _setGuestDrag] = useState(null)
  // Refs for stable event handlers (avoid stale closure issues)
  const guestDragRef = useRef(null)
  const tablesRef    = useRef(tables)
  const svgRefStable = useRef(svgRef)

  // Keep refs in sync with latest values
  useEffect(() => { tablesRef.current = tables }, [tables])
  useEffect(() => { svgRefStable.current = svgRef }, [])

  // Stable ref to assignGuestToSeat (changes identity on re-render)
  const assignRef = useRef(assignGuestToSeat)
  useEffect(() => { assignRef.current = assignGuestToSeat }, [assignGuestToSeat])

  const [ghostPos, setGhostPos] = useState(null)
  const [selectedDecoId, setSelectedDecoId] = useState(null)
  const [showDecos, setShowDecos] = useState(false)
  const [zoom, setZoom] = useState(1)

  const startGuestDrag = useCallback((val) => {
    guestDragRef.current = val
    _setGuestDrag(val)
    setGhostPos({ x: val.svgX, y: val.svgY })
  }, [])

  const endGuestDrag = useCallback(() => {
    guestDragRef.current = null
    _setGuestDrag(null)
    setGhostPos(null)
  }, [])

  // ESC cancels
  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') { endGuestDrag(); setShowDecos(false) } }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [endGuestDrag])

  const toSVG = useCallback((e) => {
    const svg = svgRef.current
    if (!svg) return { x: 0, y: 0 }
    const pt = svg.createSVGPoint()
    pt.x = e.clientX; pt.y = e.clientY
    const p = pt.matrixTransform(svg.getScreenCTM().inverse())
    return { x: p.x, y: p.y }
  }, [])

  const startDrag = useCallback((e, type, id, cx, cy) => {
    e.stopPropagation(); e.preventDefault()
    const { x, y } = toSVG(e)
    setDrag({ type, id, offX: x - cx, offY: y - cy })
  }, [toSVG])

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
    }
  }, [drag, room, moveTable, moveDecoration, updateDoor, toSVG])

  // Track ghost position during guest drag (window-level so it works outside SVG)
  const isGuestDragging = !!guestDrag
  useEffect(() => {
    if (!isGuestDragging) return
    const fn = (e) => {
      const svg = svgRef.current
      if (!svg) return
      const pt = svg.createSVGPoint()
      pt.x = e.clientX; pt.y = e.clientY
      const p = pt.matrixTransform(svg.getScreenCTM().inverse())
      setGhostPos({ x: p.x, y: p.y })
    }
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [isGuestDragging])

  // Stable mouseup handler using refs to avoid stale closure
  const handleMouseUp = useCallback((e) => {
    if (guestDragRef.current) {
      const svg = svgRef.current
      if (svg) {
        const pt = svg.createSVGPoint()
        pt.x = e.clientX; pt.y = e.clientY
        const p = pt.matrixTransform(svg.getScreenCTM().inverse())
        const { x, y } = p

        // Find nearest seat within threshold
        let best = null
        let bestDist = SEAT_R * 1.8

        tablesRef.current.forEach(table => {
          const seats = getSeatPositions(table)
          seats.forEach((seat, i) => {
            const sx = table.x + seat.cx
            const sy = table.y + seat.cy
            const dist = Math.hypot(x - sx, y - sy)
            if (dist < bestDist) {
              bestDist = dist
              best = { tableId: table.id, seatIndex: i }
            }
          })
        })

        if (best) {
          assignRef.current(guestDragRef.current.guestId, best.tableId, best.seatIndex)
        }
      }
      guestDragRef.current = null
      _setGuestDrag(null)
      setGhostPos(null)
      return
    }
    setDrag(null)
  }, [])

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)
    return () => window.removeEventListener('mouseup', handleMouseUp)
  }, [handleMouseUp])

  const handleSeatClick = useCallback((guest, seatIndex, tableId) => {
    // Assign first selected guest to empty seat
    if (!guest && selectedGuestIds.length > 0) {
      assignRef.current(selectedGuestIds[0], tableId, seatIndex)
    }
  }, [selectedGuestIds])

  const handleTableClick = useCallback((e, table) => {
    e.stopPropagation()
    setShowDecos(false)

    if (selectedGuestIds.length > 0) {
      bulkAssignToTable(selectedGuestIds, table.id)
      clearSelection()
      setSelectedTable(table.id)
    } else {
      setSelectedTable(table.id)
      setSelectedDecoId(null)
    }
  }, [selectedGuestIds, bulkAssignToTable, clearSelection, setSelectedTable])

  // Grid
  const gridLines = []
  for (let gx = 50; gx < room.width; gx += 50)
    gridLines.push(<line key={`v${gx}`} x1={gx} y1={0} x2={gx} y2={room.height} stroke="rgba(0,0,0,0.06)" strokeWidth={0.5} />)
  for (let gy = 50; gy < room.height; gy += 50)
    gridLines.push(<line key={`h${gy}`} x1={0} y1={gy} x2={room.width} y2={gy} stroke="rgba(0,0,0,0.06)" strokeWidth={0.5} />)

  const vw = room.width, vh = room.height

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div className="canvas-toolbar">
        <button className="tb-btn" onClick={() => setShowDecos(v => !v)}
          style={showDecos ? { background: 'var(--gold-l)', color: 'var(--gold-d)' } : {}}>
          🎨 Decoración
        </button>
        <div className="tb-div" />
        <button className="tb-btn" title="Ajustar vista" onClick={() => setZoom(1)}>
          ⊡ Ajustar
        </button>
      </div>

      {/* Decoration palette */}
      {showDecos && (
        <div className="deco-palette">
          {DECO_PALETTE.map(d => (
            <div key={d.type} className="deco-item"
              onClick={() => { addDecoration({ type: d.type, label: d.label }); setShowDecos(false) }}>
              <span className="deco-icon">{d.icon}</span>
              {d.label}
            </div>
          ))}
        </div>
      )}

      {/* Assign mode hint */}
      {selectedGuestIds.length > 0 && !guestDrag && (
        <div className="assign-hint">
          {selectedGuestIds.length} invitado{selectedGuestIds.length !== 1 ? 's' : ''} seleccionado{selectedGuestIds.length !== 1 ? 's' : ''} · Clic en una mesa para asignar
        </div>
      )}

      {/* Guest drag hint */}
      {guestDrag && (
        <div className="assign-hint" style={{ background: 'rgba(34,197,94,0.1)', borderColor: '#22C55E', color: '#16A34A' }}>
          Arrastrando: <strong>{guestDrag.name}</strong> · Suelta en un asiento
        </div>
      )}

      {/* SVG canvas */}
      <svg
        ref={svgRef}
        className="canvas-svg"
        viewBox={`0 0 ${vw} ${vh}`}
        preserveAspectRatio="xMidYMid meet"
        onMouseMove={handleMouseMove}
        onClick={(e) => {
          if (e.target === svgRef.current || e.target.dataset.room) {
            setSelectedTable(null); setSelectedDecoId(null)
            setShowDecos(false)
          }
        }}
        style={{ userSelect: 'none', cursor: drag ? 'grabbing' : guestDrag ? 'grabbing' : 'default' }}
      >
        {/* Room floor */}
        <rect x={0} y={0} width={vw} height={vh} fill={room.background} data-room="true" />
        {gridLines}

        {/* Room border */}
        <rect x={3} y={3} width={vw-6} height={vh-6}
          fill="none" stroke="rgba(180,155,110,0.6)" strokeWidth={2.5} rx={6} pointerEvents="none" />

        {/* Room name */}
        <text x={vw/2} y={vh-14} textAnchor="middle" fontSize={13} fill="rgba(180,155,110,0.4)"
          fontFamily="Cormorant Garamond,Georgia,serif" fontStyle="italic" pointerEvents="none">
          {room.name}
        </text>

        {/* Door */}
        {room.door && (
          <DoorShape
            door={room.door}
            roomBg={room.background}
            isSelected={selectedDecoId === 'door'}
            onMouseDown={e => {
              e.stopPropagation(); e.preventDefault()
              setSelectedDecoId('door')
              const { x, y } = toSVG(e)
              setDrag({ type: 'door', id: 'door', offX: x - room.door.x, offY: y - room.door.y })
            }}
          />
        )}

        {/* Decorations */}
        {decorations.map(deco => (
          <DecoShape key={deco.id} deco={deco}
            isSelected={selectedDecoId === deco.id}
            onMouseDown={e => {
              e.stopPropagation(); e.preventDefault()
              setSelectedDecoId(deco.id); setSelectedTable(null)
              const pos = toSVG(e)
              setDrag({ type: 'deco', id: deco.id, offX: pos.x - deco.x, offY: pos.y - deco.y })
            }}
          />
        ))}

        {/* Tables */}
        {tables.map(table => (
          <TableShape key={table.id}
            table={table} guests={guests} families={families}
            isSelected={table.id === selectedTableId}
            hasSelection={selectedGuestIds.length > 0}
            guestDragId={guestDrag?.guestId}
            onMouseDown={e => {
              if (guestDrag) return
              e.stopPropagation(); e.preventDefault()
              setSelectedDecoId(null)
              const pos = toSVG(e)
              setDrag({ type: 'table', id: table.id, offX: pos.x - table.x, offY: pos.y - table.y })
            }}
            onClick={e => handleTableClick(e, table)}
            onSeatMouseDown={(guest, seatIndex, familyColor, e) => {
              const { x, y } = toSVG(e)
              startGuestDrag({
                guestId: guest.id,
                name: guest.name,
                familyColor,
                svgX: x,
                svgY: y,
              })
            }}
            onSeatClick={(guest, idx) => handleSeatClick(guest, idx, table.id)}
          />
        ))}

        {/* Dragging guest ghost circle */}
        {guestDrag && ghostPos && (
          <g transform={`translate(${ghostPos.x},${ghostPos.y})`} pointerEvents="none"
            style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.35))' }}>
            <circle r={SEAT_R + 2} fill={guestDrag.familyColor} stroke="white" strokeWidth={2.5} opacity={0.92} />
            <text textAnchor="middle" dominantBaseline="middle"
              fontSize={8.5} fill="white" fontWeight="700"
              fontFamily="Inter,sans-serif">
              {shortName(guestDrag.name)}
            </text>
          </g>
        )}
      </svg>

      {/* Zoom controls */}
      <div className="zoom-ctrls">
        <button className="zoom-btn" title="Acercar" onClick={() => setZoom(z => Math.min(3, z + 0.2))}>+</button>
        <button className="zoom-btn" title="Alejar"  onClick={() => setZoom(z => Math.max(0.3, z - 0.2))}>−</button>
      </div>
    </div>
  )
}
