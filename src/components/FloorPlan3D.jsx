import { useMemo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Html } from '@react-three/drei'
import useWeddingStore from '../store/useWeddingStore.js'

// Scale: 1 SVG pixel = SCALE Three.js units
const SCALE = 0.012

// Realistic table dimensions based on capacity
function tableSize3D(table) {
  const cap = table.capacity || 8
  switch (table.shape) {
    case 'round':  return { type: 'round',  r:   Math.max(0.55, cap * 0.085) }
    case 'oval':   return { type: 'oval',   rx:  Math.max(0.70, cap * 0.11),  rz: Math.max(0.45, cap * 0.06) }
    case 'square': return { type: 'square', s:   Math.max(0.65, cap * 0.095) }
    case 'rect':
    default:       return { type: 'rect',   w:   Math.max(1.1,  cap * 0.17), d: 0.80 }
  }
}

// Chair positions around table in 3D space
function chairPositions3D(table, sz) {
  const cap = table.capacity || 8
  const GAP = 0.42 // gap from table edge to chair center

  if (sz.type === 'round' || sz.type === 'oval') {
    const rx = sz.r || sz.rx
    const rz = sz.rz || sz.r || rx
    return Array.from({ length: cap }, (_, i) => {
      const a = (i / cap) * Math.PI * 2
      return { x: Math.cos(a) * (rx + GAP), z: Math.sin(a) * (rz + GAP), ry: -a }
    })
  }

  // Rect / square
  const hw = (sz.w || sz.s) / 2, hd = (sz.d || sz.s) / 2
  const perimeter = 2 * ((sz.w || sz.s) + (sz.d || sz.s))
  return Array.from({ length: cap }, (_, i) => {
    let d = (i / cap) * perimeter
    const W = sz.w || sz.s, D = sz.d || sz.s
    if (d < W)       return { x: -hw + d,      z: -(hd + GAP), ry: 0 }
    d -= W
    if (d < D)       return { x:  hw + GAP,    z: -hd + d,     ry: -Math.PI / 2 }
    d -= D
    if (d < W)       return { x:  hw - d,      z:  hd + GAP,   ry: Math.PI }
    d -= W
                     return { x: -(hw + GAP),  z:  hd - d,     ry: Math.PI / 2 }
  })
}

// ─── Chair mesh ───────────────────────────────────────────────
function Chair3D({ pos, guest, familyColor }) {
  const occupied  = !!guest
  const seatColor = occupied ? (familyColor || '#e8c5a0') : '#f0ece4'
  const firstName = guest ? guest.name.split(' ')[0].substring(0, 9) : null

  return (
    <group position={[pos.x, 0, pos.z]} rotation={[0, pos.ry || 0, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.26, 0]} castShadow>
        <cylinderGeometry args={[0.19, 0.19, 0.07, 10]} />
        <meshStandardMaterial color={seatColor} roughness={0.7} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.52, -0.13]}>
        <boxGeometry args={[0.33, 0.42, 0.05]} />
        <meshStandardMaterial color={seatColor} roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[[-0.1,-0.1],[0.1,-0.1],[-0.1,0.09],[0.1,0.09]].map(([lx,lz],i) => (
        <mesh key={i} position={[lx, 0.1, lz]}>
          <cylinderGeometry args={[0.02,0.02,0.2,5]} />
          <meshStandardMaterial color="#8b6914" roughness={0.6} />
        </mesh>
      ))}
      {/* Name label */}
      {occupied && firstName && (
        <Html position={[0, 1.1, 0]} center distanceFactor={7} zIndexRange={[0,10]}>
          <div style={{
            background: familyColor || '#fff8f0',
            border: '1px solid rgba(0,0,0,0.18)',
            borderRadius: 4, padding: '1px 5px',
            fontSize: 9, fontWeight: 700,
            whiteSpace: 'nowrap', color: '#1a1a1a',
            boxShadow: '0 1px 4px rgba(0,0,0,0.18)',
            pointerEvents: 'none',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>{firstName}</div>
        </Html>
      )}
    </group>
  )
}

// ─── Table meshes ─────────────────────────────────────────────
const TABLE_H  = 0.76
const WOOD_COLOR  = '#c8a96e'
const SPECIAL_COLOR = '#f0d060'
const LEG_COLOR = '#6b4c3b'

function TableTop({ table, sz }) {
  const color = table.isSpecial ? SPECIAL_COLOR : WOOD_COLOR
  if (sz.type === 'round' || sz.type === 'oval') {
    return (
      <mesh position={[0, TABLE_H, 0]} castShadow receiveShadow>
        {sz.type === 'round'
          ? <cylinderGeometry args={[sz.r, sz.r, 0.08, 32]} />
          : <cylinderGeometry args={[sz.rx, sz.rx, 0.08, 32]}
              // scale oval by rz/rx on Z
            />
        }
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.05} />
      </mesh>
    )
  }
  return (
    <mesh position={[0, TABLE_H, 0]} castShadow receiveShadow>
      <boxGeometry args={[sz.w || sz.s, 0.08, sz.d || sz.s]} />
      <meshStandardMaterial color={color} roughness={0.45} metalness={0.05} />
    </mesh>
  )
}

function TableLegs({ sz }) {
  if (sz.type === 'round' || sz.type === 'oval') {
    return (
      <>
        <mesh position={[0, TABLE_H / 2, 0]}>
          <cylinderGeometry args={[0.07, 0.13, TABLE_H, 8]} />
          <meshStandardMaterial color={LEG_COLOR} roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <cylinderGeometry args={[0.28, 0.28, 0.07, 12]} />
          <meshStandardMaterial color={LEG_COLOR} roughness={0.8} />
        </mesh>
      </>
    )
  }
  const hw = ((sz.w || sz.s) / 2) - 0.1
  const hd = ((sz.d || sz.s) / 2) - 0.08
  return (
    <>
      {[[-hw,-hd],[hw,-hd],[-hw,hd],[hw,hd]].map(([lx,lz],i) => (
        <mesh key={i} position={[lx, TABLE_H / 2, lz]} castShadow>
          <cylinderGeometry args={[0.04,0.04,TABLE_H,6]} />
          <meshStandardMaterial color={LEG_COLOR} roughness={0.8} />
        </mesh>
      ))}
    </>
  )
}

function Table3D({ table, tableGuests, families, roomWidth, roomHeight }) {
  const sz     = tableSize3D(table)
  const chairs = chairPositions3D(table, sz)
  const x3d    = (table.x - roomWidth  / 2) * SCALE
  const z3d    = (table.y - roomHeight / 2) * SCALE
  const rotY   = -(table.rotation || 0) * Math.PI / 180
  const getFamilyColor = (fid) => (families.find(f => f.id === fid) || {}).color

  // For oval: scale the group on Z to squish
  const scaleZ = sz.type === 'oval' ? (sz.rz / sz.rx) : 1

  return (
    <group position={[x3d, 0, z3d]} rotation={[0, rotY, 0]}>
      <group scale={[1, 1, scaleZ]}>
        <TableTop table={table} sz={sz} />
        <TableLegs sz={sz} />
      </group>
      {chairs.map((pos, i) => (
        <Chair3D key={i} pos={pos}
          guest={tableGuests[i] || null}
          familyColor={tableGuests[i] ? getFamilyColor(tableGuests[i].familyId) : null}
        />
      ))}
      {/* Table name label */}
      <Html position={[0, TABLE_H + 0.35, 0]} center distanceFactor={8} zIndexRange={[0,5]}>
        <div style={{
          background: table.isSpecial ? '#fffbeb' : 'rgba(255,255,255,0.9)',
          border: `1px solid ${table.isSpecial ? '#d4a520' : '#c9a96e'}`,
          borderRadius: 5, padding: '2px 8px',
          fontSize: 10, fontWeight: 700, color: '#5a3d20',
          whiteSpace: 'nowrap', pointerEvents: 'none',
          fontFamily: 'Georgia, serif',
        }}>
          {table.isSpecial ? `★ ${table.name}` : table.name}
        </div>
      </Html>
    </group>
  )
}

// ─── Decoration meshes ────────────────────────────────────────
function Deco3D({ deco, roomWidth, roomHeight }) {
  const x = (deco.x - roomWidth  / 2) * SCALE
  const z = (deco.y - roomHeight / 2) * SCALE
  const rotY = -(deco.rotation || 0) * Math.PI / 180

  switch (deco.type) {
    case 'flowers':
      return (
        <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.04,0.07,0.18,6]} />
            <meshStandardMaterial color="#5a8c3a" roughness={0.9} />
          </mesh>
          {[0,1,2,3,4,5].map(i => {
            const a = (i/6)*Math.PI*2, r = 0.2
            return (
              <mesh key={i} position={[Math.cos(a)*r, 0.32 + Math.sin(i)*0.05, Math.sin(a)*r]} castShadow>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshStandardMaterial color={i%2===0 ? '#ffadd2' : '#ff85c2'} roughness={0.8} />
              </mesh>
            )
          })}
          <mesh position={[0, 0.42, 0]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshStandardMaterial color="#ffd666" roughness={0.7} />
          </mesh>
        </group>
      )

    case 'bar':
      return (
        <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[1.2, 1.1, 0.5]} />
            <meshStandardMaterial color="#8b5e4a" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.15, 0]}>
            <boxGeometry args={[1.3, 0.07, 0.6]} />
            <meshStandardMaterial color={WOOD_COLOR} roughness={0.4} metalness={0.15} />
          </mesh>
          {[-0.4, 0, 0.4].map((bx, i) => (
            <mesh key={i} position={[bx, 1.38, 0]} castShadow>
              <cylinderGeometry args={[0.04, 0.05, 0.45, 8]} />
              <meshStandardMaterial color={['#ddd6fe','#bbf7d0','#fef08a'][i]} roughness={0.5} />
            </mesh>
          ))}
        </group>
      )

    case 'dj':
      return (
        <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.9, 0.8, 0.5]} />
            <meshStandardMaterial color="#2d2d3a" roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[-0.2, 0.85, 0]}>
            <cylinderGeometry args={[0.18, 0.18, 0.04, 24]} />
            <meshStandardMaterial color="#1a1a28" roughness={0.2} metalness={0.6} />
          </mesh>
          <mesh position={[-0.2, 0.88, 0]}>
            <cylinderGeometry args={[0.07, 0.07, 0.04, 12]} />
            <meshStandardMaterial color="#4338ca" roughness={0.3} metalness={0.5} />
          </mesh>
          <mesh position={[0.25, 0.85, 0]}>
            <boxGeometry args={[0.32, 0.06, 0.4]} />
            <meshStandardMaterial color="#312e81" roughness={0.3} metalness={0.4} />
          </mesh>
        </group>
      )

    case 'dancefloor':
      return (
        <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
          {Array.from({length:4}, (_,r) => Array.from({length:4}, (_,c) => (
            <mesh key={`${r}-${c}`} position={[(c-1.5)*0.42, 0.01, (r-1.5)*0.42]} receiveShadow>
              <boxGeometry args={[0.41, 0.03, 0.41]} />
              <meshStandardMaterial
                color={(r+c)%2===0 ? '#e879f9' : '#f0abfc'}
                roughness={0.25} metalness={0.2} />
            </mesh>
          )))}
        </group>
      )

    case 'photobooth':
      return (
        <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <boxGeometry args={[0.8, 2.0, 0.5]} />
            <meshStandardMaterial color="#4a4a5a" roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.25, 0.26]}>
            <boxGeometry args={[0.5, 0.38, 0.04]} />
            <meshStandardMaterial color="#1a1a2a" roughness={0.2} />
          </mesh>
          <mesh position={[0, 1.25, 0.3]}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 16]} />
            <meshStandardMaterial color="#374151" roughness={0.3} metalness={0.4} />
          </mesh>
          <mesh position={[0.28, 1.72, 0.27]}>
            <boxGeometry args={[0.12, 0.08, 0.04]} />
            <meshStandardMaterial color="#fef08a" emissive="#fef08a" emissiveIntensity={0.3} />
          </mesh>
        </group>
      )

    case 'arch':
      return (
        <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
          <mesh position={[-0.6, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 2.2, 8]} />
            <meshStandardMaterial color="#5a8c3a" roughness={0.8} />
          </mesh>
          <mesh position={[0.6, 1.1, 0]} castShadow>
            <cylinderGeometry args={[0.07, 0.07, 2.2, 8]} />
            <meshStandardMaterial color="#5a8c3a" roughness={0.8} />
          </mesh>
          <mesh position={[0, 2.3, 0]}>
            <torusGeometry args={[0.6, 0.06, 8, 24, Math.PI]} />
            <meshStandardMaterial color="#5a8c3a" roughness={0.8} />
          </mesh>
          {[-0.5, 0, 0.5].map((bx, i) => (
            <mesh key={i} position={[bx, 2.4 - Math.abs(bx)*0.3, 0]}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshStandardMaterial color={i===1?'#86efac':'#4ade80'} roughness={0.8} />
            </mesh>
          ))}
        </group>
      )

    default: return null
  }
}

// ─── Door in 3D ───────────────────────────────────────────────
function Door3D({ door, roomWidth, roomHeight, sceneW, sceneD }) {
  if (!door) return null
  const x = (door.x - roomWidth  / 2) * SCALE
  const z = (door.y - roomHeight / 2) * SCALE
  const rotY = -(door.rotation || 0) * Math.PI / 180
  const doorW = (door.size || 90) * SCALE
  const doorH = 2.2

  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      {/* Door frame */}
      <mesh position={[-(doorW/2 + 0.06), doorH/2, 0]}>
        <boxGeometry args={[0.12, doorH + 0.15, 0.25]} />
        <meshStandardMaterial color={LEG_COLOR} roughness={0.7} />
      </mesh>
      <mesh position={[doorW/2 + 0.06, doorH/2, 0]}>
        <boxGeometry args={[0.12, doorH + 0.15, 0.25]} />
        <meshStandardMaterial color={LEG_COLOR} roughness={0.7} />
      </mesh>
      <mesh position={[0, doorH + 0.06, 0]}>
        <boxGeometry args={[doorW + 0.24, 0.12, 0.25]} />
        <meshStandardMaterial color={LEG_COLOR} roughness={0.7} />
      </mesh>
      {/* Door panel (open, inward) */}
      <mesh position={[-doorW/2 + doorW*0.02, doorH/2, -doorW*0.5]} rotation={[0, Math.PI/2*0.7, 0]}>
        <boxGeometry args={[doorW, doorH, 0.04]} />
        <meshStandardMaterial color="#c8a96e" roughness={0.5} metalness={0.05} />
      </mesh>
      {/* Arrow sign */}
      <Html position={[0, doorH + 0.4, 0]} center distanceFactor={6} zIndexRange={[0,5]}>
        <div style={{
          background: '#fff8f0', border: '1px solid #c9a96e',
          borderRadius: 5, padding: '2px 8px',
          fontSize: 10, fontWeight: 700, color: '#8b6914',
          whiteSpace: 'nowrap', pointerEvents: 'none',
        }}>🚪 {door.label || 'Entrada'}</div>
      </Html>
    </group>
  )
}

// ─── Floor + Walls ────────────────────────────────────────────
function Room3D({ room }) {
  const w = room.width  * SCALE
  const d = room.height * SCALE
  const wallH = 3.2
  const wallT = 0.18
  const wallColor = '#e8d5c0'

  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={room.background || '#f5f0e8'} roughness={0.8} />
      </mesh>
      {/* Walls */}
      {[
        { pos: [0, wallH/2, -d/2], size: [w, wallH, wallT] },
        { pos: [0, wallH/2,  d/2], size: [w, wallH, wallT] },
        { pos: [-w/2, wallH/2, 0], size: [wallT, wallH, d] },
        { pos: [ w/2, wallH/2, 0], size: [wallT, wallH, d] },
      ].map((wall, i) => (
        <mesh key={i} position={wall.pos}>
          <boxGeometry args={wall.size} />
          <meshStandardMaterial color={wallColor} transparent opacity={0.35} />
        </mesh>
      ))}
      {/* Baseboard */}
      {[
        { pos: [0, 0.05, -d/2+wallT/2], size: [w-wallT, 0.1, wallT*1.5] },
        { pos: [0, 0.05,  d/2-wallT/2], size: [w-wallT, 0.1, wallT*1.5] },
        { pos: [-w/2+wallT/2, 0.05, 0], size: [wallT*1.5, 0.1, d] },
        { pos: [ w/2-wallT/2, 0.05, 0], size: [wallT*1.5, 0.1, d] },
      ].map((b, i) => (
        <mesh key={i} position={b.pos}>
          <boxGeometry args={b.size} />
          <meshStandardMaterial color="#c4a882" roughness={0.6} />
        </mesh>
      ))}
    </>
  )
}

// ─── Scene ────────────────────────────────────────────────────
function Scene() {
  const tables      = useWeddingStore(s => s.tables)
  const decorations = useWeddingStore(s => s.decorations)
  const guests      = useWeddingStore(s => s.guests)
  const families    = useWeddingStore(s => s.families)
  const room        = useWeddingStore(s => s.room)

  const guestsByTable = useMemo(() => {
    const map = {}
    guests.forEach(g => {
      if (!g.tableId) return
      if (!map[g.tableId]) map[g.tableId] = []
      map[g.tableId].push(g)
    })
    return map
  }, [guests])

  const sceneW = room.width  * SCALE
  const sceneD = room.height * SCALE
  const camDist = Math.max(sceneW, sceneD)

  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[sceneW*0.5, 8, sceneD*0.3]} intensity={1.1} castShadow
        shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[-sceneW*0.3, 5, -sceneD*0.3]} intensity={0.4} />
      <pointLight position={[0, 4, 0]} intensity={0.25} color="#ffe4b5" />

      <Room3D room={room} />

      {tables.map(table => (
        <Table3D key={table.id} table={table}
          tableGuests={guestsByTable[table.id] || []}
          families={families}
          roomWidth={room.width} roomHeight={room.height} />
      ))}

      {decorations.map(deco => (
        <Deco3D key={deco.id} deco={deco}
          roomWidth={room.width} roomHeight={room.height} />
      ))}

      {room.door && (
        <Door3D door={room.door}
          roomWidth={room.width} roomHeight={room.height}
          sceneW={sceneW} sceneD={sceneD} />
      )}
    </>
  )
}

// ─── Export ───────────────────────────────────────────────────
export default function FloorPlan3D() {
  const room = useWeddingStore(s => s.room)
  const sceneW = room.width  * SCALE
  const sceneD = room.height * SCALE
  const camDist = Math.max(sceneW, sceneD) * 1.1

  return (
    <div className="view-3d-container">
      <Canvas shadows>
        <PerspectiveCamera makeDefault fov={45}
          position={[0, camDist * 0.85, camDist * 0.85]} />
        <OrbitControls enableDamping dampingFactor={0.05}
          minDistance={2} maxDistance={camDist * 2.5}
          maxPolarAngle={Math.PI / 2.1} target={[0, 0.5, 0]} />
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
      <div className="view-3d-hint">
        🖱️ Rotar: clic izquierdo · Zoom: rueda · Desplazar: clic derecho
      </div>
    </div>
  )
}
