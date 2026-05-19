import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const generateId = () => Math.random().toString(36).substr(2, 9)

const sampleFamilies = [
  { id: 'f1', name: 'García', color: '#e8a4c9' },
  { id: 'f2', name: 'Martínez', color: '#a4c8e8' },
  { id: 'f3', name: 'López', color: '#a4e8b8' },
]

const sampleTables = [
  { id: 't1', name: 'Mesa Novios', shape: 'rect', capacity: 10, x: 400, y: 150, rotation: 0, isSpecial: true, specialType: 'Mesa Principal' },
  { id: 't2', name: 'Mesa 1', shape: 'round', capacity: 8, x: 200, y: 350, rotation: 0, isSpecial: false, specialType: '' },
  { id: 't3', name: 'Mesa 2', shape: 'round', capacity: 8, x: 450, y: 400, rotation: 0, isSpecial: false, specialType: '' },
  { id: 't4', name: 'Mesa VIP', shape: 'oval', capacity: 6, x: 700, y: 300, rotation: 0, isSpecial: true, specialType: 'VIP' },
]

const sampleGuests = [
  { id: 'g1', name: 'Carlos García', familyId: 'f1', tableId: 't1', dietary: '', notes: 'Padrino' },
  { id: 'g2', name: 'María García', familyId: 'f1', tableId: 't1', dietary: 'Vegetariano', notes: 'Madrina' },
  { id: 'g3', name: 'Luis Martínez', familyId: 'f2', tableId: 't2', dietary: '', notes: '' },
  { id: 'g4', name: 'Ana Martínez', familyId: 'f2', tableId: 't2', dietary: 'Sin gluten', notes: '' },
  { id: 'g5', name: 'Pedro López', familyId: 'f3', tableId: 't3', dietary: '', notes: '' },
  { id: 'g6', name: 'Sofía López', familyId: 'f3', tableId: 't3', dietary: 'Vegano', notes: '' },
  { id: 'g7', name: 'Roberto García', familyId: 'f1', tableId: 't4', dietary: '', notes: '' },
  { id: 'g8', name: 'Elena Martínez', familyId: 'f2', tableId: null, dietary: '', notes: 'Pendiente confirmar' },
]

const sampleDecorations = [
  { id: 'd1', type: 'flowers', x: 600, y: 150, rotation: 0, label: 'Centro Flores' },
  { id: 'd2', type: 'dj', x: 900, y: 600, rotation: 0, label: 'DJ' },
  { id: 'd3', type: 'dancefloor', x: 650, y: 550, rotation: 0, label: 'Pista de Baile' },
]

const useWeddingStore = create(
  persist(
    (set, get) => ({
      guests: sampleGuests,
      families: sampleFamilies,
      tables: sampleTables,
      decorations: sampleDecorations,
      room: { width: 1100, height: 750, name: 'Salón Principal', background: '#f5f0e8',
        door: { x: 550, y: 747, rotation: 0, size: 90, label: 'Entrada' } },
      savedRooms: [],
      ui: { view: 'list', selectedTableId: null, sidebarTab: 'guests' },

      // Guest actions
      addGuest: (guest) => set((state) => ({
        guests: [...state.guests, { id: generateId(), tableId: null, seatIndex: null, dietary: '', notes: '', ...guest }]
      })),
      updateGuest: (id, updates) => set((state) => ({
        guests: state.guests.map(g => g.id === id ? { ...g, ...updates } : g)
      })),
      deleteGuest: (id) => set((state) => ({
        guests: state.guests.filter(g => g.id !== id)
      })),

      // Family actions
      addFamily: (family) => set((state) => ({
        families: [...state.families, { id: generateId(), ...family }]
      })),
      updateFamily: (id, updates) => set((state) => ({
        families: state.families.map(f => f.id === id ? { ...f, ...updates } : f)
      })),
      deleteFamily: (id) => set((state) => ({
        families: state.families.filter(f => f.id !== id),
        guests: state.guests.map(g => g.familyId === id ? { ...g, familyId: null } : g)
      })),

      // Bulk import from Excel
      bulkAddGuests: (guestList) => set((state) => {
        const COLORS = [
          '#e8a4c9','#a4c8e8','#a4e8b8','#f0c89e','#c9a4e8',
          '#e8e0a4','#a4e8e0','#e8b4a4','#b4a4e8','#a4b4e8',
          '#f0a4a4','#a4f0c8','#f0d4a4','#a4c4f0','#d4a4f0',
        ]
        const newFamilies = [...state.families]

        const getOrCreateFamily = (name) => {
          if (!name || !name.trim()) return null
          const norm = name.trim().toLowerCase()
          const existing = newFamilies.find(f => f.name.toLowerCase() === norm)
          if (existing) return existing.id
          const newF = { id: generateId(), name: name.trim(), color: COLORS[newFamilies.length % COLORS.length] }
          newFamilies.push(newF)
          return newF.id
        }

        const newGuests = guestList
          .filter(g => g.name && g.name.trim())
          .map(g => ({
            id: generateId(),
            name: g.name.trim(),
            familyId: getOrCreateFamily(g.familyName),
            dietary: g.dietary || '',
            notes: g.notes || '',
            tableId: null,
          }))

        return { families: newFamilies, guests: [...state.guests, ...newGuests] }
      }),

      // Table actions
      addTable: (table) => set((state) => ({
        tables: [...state.tables, { id: generateId(), x: 200, y: 200, rotation: 0, isSpecial: false, specialType: '', ...table }]
      })),
      updateTable: (id, updates) => set((state) => ({
        tables: state.tables.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTable: (id) => set((state) => ({
        tables: state.tables.filter(t => t.id !== id),
        guests: state.guests.map(g => g.tableId === id ? { ...g, tableId: null } : g),
        ui: state.ui.selectedTableId === id ? { ...state.ui, selectedTableId: null } : state.ui
      })),
      moveTable: (id, x, y) => set((state) => ({
        tables: state.tables.map(t => t.id === id ? { ...t, x, y } : t)
      })),

      // Decoration actions
      addDecoration: (decoration) => set((state) => ({
        decorations: [...state.decorations, {
          id: generateId(),
          x: state.room.width / 2,
          y: state.room.height / 2,
          rotation: 0,
          ...decoration
        }]
      })),
      moveDecoration: (id, x, y) => set((state) => ({
        decorations: state.decorations.map(d => d.id === id ? { ...d, x, y } : d)
      })),
      updateDecoration: (id, updates) => set((state) => ({
        decorations: state.decorations.map(d => d.id === id ? { ...d, ...updates } : d)
      })),
      deleteDecoration: (id) => set((state) => ({
        decorations: state.decorations.filter(d => d.id !== id)
      })),

      // Guest-Table assignment
      assignGuestToTable: (guestId, tableId) => set((state) => ({
        guests: state.guests.map(g => g.id === guestId ? { ...g, tableId, seatIndex: null } : g)
      })),
      removeGuestFromTable: (guestId) => set((state) => ({
        guests: state.guests.map(g => g.id === guestId ? { ...g, tableId: null, seatIndex: null } : g)
      })),
      // Assign to a specific seat (swaps if target seat is occupied)
      assignGuestToSeat: (guestId, tableId, seatIndex) => set((state) => {
        const displaced = state.guests.find(
          g => g.tableId === tableId && g.seatIndex === seatIndex && g.id !== guestId
        )
        const sourceGuest = state.guests.find(g => g.id === guestId)
        return {
          guests: state.guests.map(g => {
            if (g.id === guestId) return { ...g, tableId, seatIndex }
            // Swap: displaced guest takes source seat (same table) or becomes unassigned
            if (displaced && g.id === displaced.id) {
              if (sourceGuest && sourceGuest.tableId) {
                return { ...g, tableId: sourceGuest.tableId, seatIndex: sourceGuest.seatIndex }
              }
              return { ...g, seatIndex: null }
            }
            return g
          })
        }
      }),

      // Door actions
      updateDoor: (updates) => set((state) => ({
        room: { ...state.room, door: { ...state.room.door, ...updates } }
      })),

      // UI actions
      setView: (view) => set((state) => ({ ui: { ...state.ui, view } })),
      setSelectedTable: (id) => set((state) => ({ ui: { ...state.ui, selectedTableId: id } })),
      setSidebarTab: (tab) => set((state) => ({ ui: { ...state.ui, sidebarTab: tab } })),

      // Room actions
      updateRoom: (updates) => set((state) => ({ room: { ...state.room, ...updates } })),
      saveRoom: (name) => set((state) => {
        const { tables, decorations, room } = state
        const saved = {
          id: generateId(),
          name,
          room: { ...room },
          tables: JSON.parse(JSON.stringify(tables)),
          decorations: JSON.parse(JSON.stringify(decorations)),
          savedAt: new Date().toISOString()
        }
        return { savedRooms: [...state.savedRooms, saved] }
      }),
      loadRoom: (id) => set((state) => {
        const saved = state.savedRooms.find(r => r.id === id)
        if (!saved) return state
        return {
          room: { ...saved.room },
          tables: JSON.parse(JSON.stringify(saved.tables)),
          decorations: JSON.parse(JSON.stringify(saved.decorations)),
          ui: { ...state.ui, selectedTableId: null }
        }
      }),
      deleteRoom: (id) => set((state) => ({
        savedRooms: state.savedRooms.filter(r => r.id !== id)
      })),

      applyPreset: (preset) => set((state) => ({
        room: { ...state.room, ...preset },
        ui: { ...state.ui, selectedTableId: null }
      })),
    }),
    {
      name: 'wedding-seating-storage',
      version: 1,
    }
  )
)

export default useWeddingStore
