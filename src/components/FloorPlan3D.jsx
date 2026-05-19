import React, { useMemo, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import useWeddingStore from '../store/useWeddingStore.js'

const ROOM_SCALE = 0.015 // scale from SVG px to 3D units

function Floor({ width, depth, color }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[width, depth]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  )
}

function RoomWalls({ width, depth }) {
  const wallH = 3
  const wallThick = 0.1
  const wallColor = '#e8d5c0'
  const wallOpacity = 0.35

  return (
    <group>
      {/* North wall */}
      <mesh position={[0, wallH / 2, -depth / 2]}>
        <boxGeometry args={[width, wallH, wallThick]} />
        <meshStandardMaterial color={wallColor} transparent opacity={wallOpacity} />
      </mesh>
      {/* South wall */}
      <mesh position={[0, wallH / 2, depth / 2]}>
        <boxGeometry args={[width, wallH, wallThick]} />
        <meshStandardMaterial color={wallColor} transparent opacity={wallOpacity} />
      </mesh>
      {/* West wall */}
      <mesh position={[-width / 2, wallH / 2, 0]}>
        <boxGeometry args={[wallThick, wallH, depth]} />
        <meshStandardMaterial color={wallColor} transparent opacity={wallOpacity} />
      </mesh>
      {/* East wall */}
      <mesh position={[width / 2, wallH / 2, 0]}>
        <boxGeometry args={[wallThick, wallH, depth]} />
        <meshStandardMaterial color={wallColor} transparent opacity={wallOpacity} />
      </mesh>
    </group>
  )
}

function Chair({ position, occupied }) {
  const color = occupied ? '#e8c5a0' : '#f5f0eb'
  return (
    <group position={position}>
      {/* Seat */}
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.18, 0.06, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Back */}
      <mesh position={[0, 0.5, -0.12]}>
        <boxGeometry args={[0.32, 0.4, 0.05]} />
        <meshStandardMaterial color={color} roughness={0.7} />
      </mesh>
      {/* Legs */}
      {[[-0.1, -0.1], [0.1, -0.1], [-0.1, 0.08], [0.1, 0.08]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, 0.1, lz]}>
          <cylinderGeometry args={[0.02, 0.02, 0.2, 6]} />
          <meshStandardMaterial color="#8b6914" roughness={0.6} />
        </mesh>
      ))}
    </group>
  )
}

function RoundTable3D({ table, assignedCount, position }) {
  const radius = 0.55
  const tableH = 0.75
  const numChairs = table.capacity
  const chairs = []
  for (let i = 0; i < numChairs; i++) {
    const angle = (i / numChairs) * Math.PI * 2
    const dist = radius + 0.35
    const cx = Math.cos(angle) * dist
    const cz = Math.sin(angle) * dist
    const occupied = i < assignedCount
    chairs.push(
      <Chair
        key={i}
        position={[cx, 0, cz]}
        occupied={occupied}
      />
    )
  }

  return (
    <group position={position}>
      {/* Tabletop */}
      <mesh position={[0, tableH, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[radius, radius, 0.08, 24]} />
        <meshStandardMaterial color={table.isSpecial ? '#f5e6aa' : '#f5deb3'} roughness={0.5} />
      </mesh>
      {/* Pedestal */}
      <mesh position={[0, tableH / 2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.15, tableH, 8]} />
        <meshStandardMaterial color="#8b6914" roughness={0.7} />
      </mesh>
      {/* Base */}
      <mesh position={[0, 0.03, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 12]} />
        <meshStandardMaterial color="#6b4c3b" roughness={0.8} />
      </mesh>
      {chairs}
    </group>
  )
}

function RectTable3D({ table, assignedCount, position }) {
  const tw = 1.4
  const td = 0.8
  const tableH = 0.75
  const numChairs = table.capacity
  const chairs = []

  // Distribute chairs around the rect table
  const topCount = Math.ceil(numChairs / 2)
  const bottomCount = numChairs - topCount
  let chairIdx = 0

  for (let i = 0; i < topCount; i++) {
    const cx = -tw / 2 + (tw / (topCount)) * (i + 0.5)
    chairs.push(
      <Chair
        key={`top-${i}`}
        position={[cx, 0, -(td / 2 + 0.35)]}
        occupied={chairIdx < assignedCount}
      />
    )
    chairIdx++
  }
  for (let i = 0; i < bottomCount; i++) {
    const cx = -tw / 2 + (tw / (bottomCount)) * (i + 0.5)
    chairs.push(
      <Chair
        key={`bot-${i}`}
        position={[cx, 0, td / 2 + 0.35]}
        occupied={chairIdx < assignedCount}
      />
    )
    chairIdx++
  }

  return (
    <group position={position}>
      {/* Tabletop */}
      <mesh position={[0, tableH, 0]} castShadow receiveShadow>
        <boxGeometry args={[tw, 0.08, td]} />
        <meshStandardMaterial color={table.isSpecial ? '#f5e6aa' : '#f5deb3'} roughness={0.5} />
      </mesh>
      {/* Legs */}
      {[[-tw / 2 + 0.1, td / 2 - 0.1], [tw / 2 - 0.1, td / 2 - 0.1],
        [-tw / 2 + 0.1, -(td / 2 - 0.1)], [tw / 2 - 0.1, -(td / 2 - 0.1)]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, tableH / 2, lz]} castShadow>
          <cylinderGeometry args={[0.04, 0.04, tableH, 6]} />
          <meshStandardMaterial color="#6b4c3b" roughness={0.8} />
        </mesh>
      ))}
      {chairs}
    </group>
  )
}

function OvalTable3D({ table, assignedCount, position }) {
  return <RoundTable3D table={{ ...table, shape: 'round' }} assignedCount={assignedCount} position={position} />
}

function SquareTable3D({ table, assignedCount, position }) {
  const size = 0.85
  const tableH = 0.75
  const numChairs = table.capacity
  const chairs = []
  const perSide = Math.ceil(numChairs / 4)
  let idx = 0

  const sides = [
    { axis: 'x', sign: -1, dir: 'z' },
    { axis: 'x', sign: 1, dir: 'z' },
    { axis: 'z', sign: -1, dir: 'x' },
    { axis: 'z', sign: 1, dir: 'x' },
  ]

  sides.forEach(({ axis, sign, dir }) => {
    const count = Math.min(perSide, numChairs - idx)
    for (let i = 0; i < count; i++) {
      const off = -size / 2 + (size / count) * (i + 0.5)
      const pos = axis === 'x'
        ? [sign * (size / 2 + 0.35), 0, off]
        : [off, 0, sign * (size / 2 + 0.35)]
      chairs.push(<Chair key={`${axis}${sign}${i}`} position={pos} occupied={idx < assignedCount} />)
      idx++
    }
  })

  return (
    <group position={position}>
      <mesh position={[0, tableH, 0]} castShadow receiveShadow>
        <boxGeometry args={[size, 0.08, size]} />
        <meshStandardMaterial color={table.isSpecial ? '#f5e6aa' : '#f5deb3'} roughness={0.5} />
      </mesh>
      {[[-size / 2 + 0.06, size / 2 - 0.06], [size / 2 - 0.06, size / 2 - 0.06],
        [-size / 2 + 0.06, -(size / 2 - 0.06)], [size / 2 - 0.06, -(size / 2 - 0.06)]].map(([lx, lz], i) => (
        <mesh key={i} position={[lx, tableH / 2, lz]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, tableH, 6]} />
          <meshStandardMaterial color="#6b4c3b" roughness={0.8} />
        </mesh>
      ))}
      {chairs}
    </group>
  )
}

function Table3D({ table, assignedCount, roomWidth, roomHeight }) {
  // Convert 2D SVG coords to 3D coords
  const x = (table.x - roomWidth / 2) * ROOM_SCALE
  const z = (table.y - roomHeight / 2) * ROOM_SCALE
  const position = [x, 0, z]

  switch (table.shape) {
    case 'round': return <RoundTable3D table={table} assignedCount={assignedCount} position={position} />
    case 'rect': return <RectTable3D table={table} assignedCount={assignedCount} position={position} />
    case 'oval': return <OvalTable3D table={table} assignedCount={assignedCount} position={position} />
    case 'square': return <SquareTable3D table={table} assignedCount={assignedCount} position={position} />
    default: return <RoundTable3D table={table} assignedCount={assignedCount} position={position} />
  }
}

function DecorationMesh({ deco, roomWidth, roomHeight }) {
  const x = (deco.x - roomWidth / 2) * ROOM_SCALE
  const z = (deco.y - roomHeight / 2) * ROOM_SCALE

  switch (deco.type) {
    case 'flowers':
      return (
        <group position={[x, 0, z]}>
          {[0, 1, 2, 3, 4].map((i) => (
            <mesh key={i} position={[Math.cos(i * 1.26) * 0.15, 0.3 + Math.random() * 0.2, Math.sin(i * 1.26) * 0.15]} castShadow>
              <sphereGeometry args={[0.08, 8, 8]} />
              <meshStandardMaterial color={i % 2 === 0 ? '#e8a4c9' : '#f5c6d0'} roughness={0.8} />
            </mesh>
          ))}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.04, 0.06, 0.16, 6]} />
            <meshStandardMaterial color="#5a8c3a" roughness={0.9} />
          </mesh>
        </group>
      )
    case 'bar':
      return (
        <group position={[x, 0, z]}>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[1.2, 1.1, 0.5]} />
            <meshStandardMaterial color="#8b5e4a" roughness={0.7} />
          </mesh>
          <mesh position={[0, 1.15, 0]}>
            <boxGeometry args={[1.3, 0.08, 0.6]} />
            <meshStandardMaterial color="#6b4c3b" roughness={0.5} metalness={0.1} />
          </mesh>
        </group>
      )
    case 'dj':
      return (
        <group position={[x, 0, z]}>
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.9, 0.8, 0.5]} />
            <meshStandardMaterial color="#2d2d3a" roughness={0.4} metalness={0.3} />
          </mesh>
          <mesh position={[0, 0.85, 0]}>
            <boxGeometry args={[0.85, 0.06, 0.45]} />
            <meshStandardMaterial color="#1a1a28" roughness={0.3} metalness={0.5} />
          </mesh>
        </group>
      )
    case 'dancefloor':
      return (
        <mesh position={[x, 0.01, z]} receiveShadow>
          <boxGeometry args={[1.5, 0.02, 1.5]} />
          <meshStandardMaterial color="#c8a0f0" roughness={0.3} metalness={0.2} />
        </mesh>
      )
    case 'photobooth':
      return (
        <group position={[x, 0, z]}>
          <mesh position={[0, 1.0, 0]} castShadow>
            <boxGeometry args={[0.8, 2.0, 0.5]} />
            <meshStandardMaterial color="#4a4a5a" roughness={0.5} />
          </mesh>
          <mesh position={[0, 1.2, 0.26]}>
            <boxGeometry args={[0.5, 0.35, 0.04]} />
            <meshStandardMaterial color="#1a1a2a" roughness={0.2} />
          </mesh>
        </group>
      )
    case 'arch':
      return (
        <group position={[x, 0, z]}>
          {/* Left pillar */}
          <mesh position={[-0.5, 1.0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 2.0, 8]} />
            <meshStandardMaterial color="#5a8c3a" roughness={0.8} />
          </mesh>
          {/* Right pillar */}
          <mesh position={[0.5, 1.0, 0]} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 2.0, 8]} />
            <meshStandardMaterial color="#5a8c3a" roughness={0.8} />
          </mesh>
          {/* Top arch */}
          <mesh position={[0, 2.1, 0]}>
            <torusGeometry args={[0.5, 0.04, 8, 20, Math.PI]} />
            <meshStandardMaterial color="#5a8c3a" roughness={0.8} />
          </mesh>
        </group>
      )
    default:
      return null
  }
}

function Scene() {
  const tables = useWeddingStore((s) => s.tables)
  const decorations = useWeddingStore((s) => s.decorations)
  const guests = useWeddingStore((s) => s.guests)
  const room = useWeddingStore((s) => s.room)

  const guestsByTable = useMemo(() => {
    const map = {}
    guests.forEach((g) => {
      if (g.tableId) map[g.tableId] = (map[g.tableId] || 0) + 1
    })
    return map
  }, [guests])

  const sceneWidth = room.width * ROOM_SCALE
  const sceneDepth = room.height * ROOM_SCALE

  // Parse room background color for floor
  const floorColor = room.background || '#f5f0e8'

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[sceneWidth * 0.5, 8, sceneDepth * 0.3]}
        intensity={1.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={[-sceneWidth * 0.3, 5, -sceneDepth * 0.3]} intensity={0.4} />
      <pointLight position={[0, 5, 0]} intensity={0.3} color="#ffe4b5" />

      <Floor width={sceneWidth} depth={sceneDepth} color={floorColor} />
      <RoomWalls width={sceneWidth} depth={sceneDepth} />

      {tables.map((table) => (
        <Table3D
          key={table.id}
          table={table}
          assignedCount={guestsByTable[table.id] || 0}
          roomWidth={room.width}
          roomHeight={room.height}
        />
      ))}

      {decorations.map((deco) => (
        <DecorationMesh
          key={deco.id}
          deco={deco}
          roomWidth={room.width}
          roomHeight={room.height}
        />
      ))}
    </>
  )
}

export default function FloorPlan3D() {
  const room = useWeddingStore((s) => s.room)
  const sceneWidth = room.width * ROOM_SCALE
  const sceneDepth = room.height * ROOM_SCALE
  const camDist = Math.max(sceneWidth, sceneDepth) * 1.1

  return (
    <div className="view-3d-container">
      <Canvas shadows>
        <PerspectiveCamera
          makeDefault
          position={[0, camDist * 0.85, camDist * 0.85]}
          fov={45}
        />
        <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={camDist * 2.5}
          maxPolarAngle={Math.PI / 2.1}
          target={[0, 0.5, 0]}
        />
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
