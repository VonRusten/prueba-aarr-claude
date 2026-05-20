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
  { id: 'g1', name: 'Carlos García', familyId: 'f1', tableId: 't1', seatIndex: null, dietary: '', notes: 'Padrino' },
  { id: 'g2', name: 'María García', familyId: 'f1', tableId: 't1', seatIndex: null, dietary: 'Vegetariano', notes: 'Madrina' },
  { id: 'g3', name: 'Luis Martínez', familyId: 'f2', tableId: 't2', seatIndex: null, dietary: '', notes: '' },
  { id: 'g4', name: 'Ana Martínez', familyId: 'f2', tableId: 't2', seatIndex: null, dietary: 'Sin gluten', notes: '' },
  { id: 'g5', name: 'Pedro López', familyId: 'f3', tableId: 't3', seatIndex: null, dietary: '', notes: '' },
  { id: 'g6', name: 'Sofía López', familyId: 'f3', tableId: 't3', seatIndex: null, dietary: 'Vegano', notes: '' },
  { id: 'g7', name: 'Roberto García', familyId: 'f1', tableId: 't4', seatIndex: null, dietary: '', notes: '' },
  { id: 'g8', name: 'Elena Martínez', familyId: 'f2', tableId: null, seatIndex: null, dietary: '', notes: 'Pendiente confirmar' },
]

const sampleDecorations = [
  { id: 'd1', type: 'flowers', x: 600, y: 150, rotation: 0, label: 'Centro Flores' },
  { id: 'd2', type: 'dj', x: 900, y: 600, rotation: 0, label: 'DJ' },
  { id: 'd3', type: 'dancefloor', x: 650, y: 550, rotation: 0, label: 'Pista de Baile' },
]

const useWeddingStore = create(
  persist(
    (set) => ({
      guests: sampleGuests,
      families: sampleFamilies,
      tables: sampleTables,
      decorations: sampleDecorations,
      room: {
        width: 1100, height: 750, name: 'Salón Principal', background: '#f5f0e8',
        door: { x: 550, y: 747, rotation: 0, size: 90, label: 'Entrada' }
      },
      savedRooms: [],
      ui: { view: '2d', selectedTableId: null, selectedGuestIds: [] },

      // Guest CRUD
      addGuest: (guest) => set((s) => ({
        guests: [...s.guests, { id: generateId(), tableId: null, seatIndex: null, dietary: '', notes: '', ...guest }]
      })),
      updateGuest: (id, updates) => set((s) => ({
        guests: s.guests.map(g => g.id === id ? { ...g, ...updates } : g)
      })),
      deleteGuest: (id) => set((s) => ({ guests: s.guests.filter(g => g.id !== id) })),

      // Family CRUD
      addFamily: (family) => set((s) => ({
        families: [...s.families, { id: generateId(), ...family }]
      })),
      updateFamily: (id, updates) => set((s) => ({
        families: s.families.map(f => f.id === id ? { ...f, ...updates } : f)
      })),
      deleteFamily: (id) => set((s) => ({
        families: s.families.filter(f => f.id !== id),
        guests: s.guests.map(g => g.familyId === id ? { ...g, familyId: null } : g)
      })),

      // Bulk import from Excel
      bulkAddGuests: (guestList) => set((s) => {
        const COLORS = [
          '#e8a4c9','#a4c8e8','#a4e8b8','#f0c89e','#c9a4e8',
          '#e8e0a4','#a4e8e0','#e8b4a4','#b4a4e8','#a4b4e8',
          '#f0a4a4','#a4f0c8','#f0d4a4','#a4c4f0','#d4a4f0',
        ]
        const newFamilies = [...s.families]
        const getOrCreateFamily = (name) => {
          if (!name?.trim()) return null
          const norm = name.trim().toLowerCase()
          const existing = newFamilies.find(f => f.name.toLowerCase() === norm)
          if (existing) return existing.id
          const newF = { id: generateId(), name: name.trim(), color: COLORS[newFamilies.length % COLORS.length] }
          newFamilies.push(newF)
          return newF.id
        }
        const newGuests = guestList
          .filter(g => g.name?.trim())
          .map(g => ({
            id: generateId(), name: g.name.trim(),
            familyId: getOrCreateFamily(g.familyName),
            dietary: g.dietary || '', notes: g.notes || '',
            tableId: null, seatIndex: null,
          }))
        return { families: newFamilies, guests: [...s.guests, ...newGuests] }
      }),

      // Table CRUD
      addTable: (table) => set((s) => ({
        tables: [...s.tables, {
          id: generateId(),
          x: Math.round(s.room.width / 2), y: Math.round(s.room.height / 2),
          rotation: 0, isSpecial: false, specialType: '', ...table
        }]
      })),
      updateTable: (id, updates) => set((s) => ({
        tables: s.tables.map(t => t.id === id ? { ...t, ...updates } : t)
      })),
      deleteTable: (id) => set((s) => ({
        tables: s.tables.filter(t => t.id !== id),
        guests: s.guests.map(g => g.tableId === id ? { ...g, tableId: null, seatIndex: null } : g),
        ui: s.ui.selectedTableId === id ? { ...s.ui, selectedTableId: null } : s.ui
      })),
      moveTable: (id, x, y) => set((s) => ({
        tables: s.tables.map(t => t.id === id ? { ...t, x, y } : t)
      })),

      // Decoration CRUD
      addDecoration: (decoration) => set((s) => ({
        decorations: [...s.decorations, {
          id: generateId(), x: s.room.width / 2, y: s.room.height / 2, rotation: 0, ...decoration
        }]
      })),
      moveDecoration: (id, x, y) => set((s) => ({
        decorations: s.decorations.map(d => d.id === id ? { ...d, x, y } : d)
      })),
      updateDecoration: (id, updates) => set((s) => ({
        decorations: s.decorations.map(d => d.id === id ? { ...d, ...updates } : d)
      })),
      deleteDecoration: (id) => set((s) => ({
        decorations: s.decorations.filter(d => d.id !== id)
      })),

      // Seating assignment
      assignGuestToTable: (guestId, tableId) => set((s) => ({
        guests: s.guests.map(g => g.id === guestId ? { ...g, tableId, seatIndex: null } : g)
      })),
      removeGuestFromTable: (guestId) => set((s) => ({
        guests: s.guests.map(g => g.id === guestId ? { ...g, tableId: null, seatIndex: null } : g)
      })),
      assignGuestToSeat: (guestId, tableId, seatIndex) => set((s) => {
        const displaced = s.guests.find(g => g.tableId === tableId && g.seatIndex === seatIndex && g.id !== guestId)
        const sourceGuest = s.guests.find(g => g.id === guestId)
        return {
          guests: s.guests.map(g => {
            if (g.id === guestId) return { ...g, tableId, seatIndex }
            if (displaced && g.id === displaced.id) {
              return sourceGuest?.tableId
                ? { ...g, tableId: sourceGuest.tableId, seatIndex: sourceGuest.seatIndex }
                : { ...g, seatIndex: null }
            }
            return g
          })
        }
      }),

      // Bulk assign selected guests to a table (fills available seats)
      bulkAssignToTable: (guestIds, tableId) => set((s) => {
        const table = s.tables.find(t => t.id === tableId)
        if (!table) return s
        const currentCount = s.guests.filter(g => g.tableId === tableId).length
        const available = table.capacity - currentCount
        const toAssign = guestIds
          .filter(id => { const g = s.guests.find(x => x.id === id); return g && g.tableId !== tableId })
          .slice(0, Math.max(0, available))
        return { guests: s.guests.map(g => toAssign.includes(g.id) ? { ...g, tableId, seatIndex: null } : g) }
      }),

      // Guest selection for bulk operations
      toggleGuestSelection: (id) => set((s) => {
        const ids = s.ui.selectedGuestIds
        return { ui: { ...s.ui, selectedGuestIds: ids.includes(id) ? ids.filter(x => x !== id) : [...ids, id] } }
      }),
      selectFamily: (familyId) => set((s) => {
        const familyGuestIds = s.guests.filter(g => g.familyId === familyId).map(g => g.id)
        const allSelected = familyGuestIds.every(id => s.ui.selectedGuestIds.includes(id))
        return {
          ui: {
            ...s.ui,
            selectedGuestIds: allSelected
              ? s.ui.selectedGuestIds.filter(id => !familyGuestIds.includes(id))
              : [...new Set([...s.ui.selectedGuestIds, ...familyGuestIds])]
          }
        }
      }),
      clearSelection: () => set((s) => ({ ui: { ...s.ui, selectedGuestIds: [] } })),

      // Door
      updateDoor: (updates) => set((s) => ({
        room: { ...s.room, door: { ...s.room.door, ...updates } }
      })),

      // UI
      setView: (view) => set((s) => ({ ui: { ...s.ui, view } })),
      setSelectedTable: (id) => set((s) => ({ ui: { ...s.ui, selectedTableId: id } })),

      // Room
      updateRoom: (updates) => set((s) => ({ room: { ...s.room, ...updates } })),
      saveRoom: (name) => set((s) => {
        const saved = {
          id: generateId(), name, room: { ...s.room },
          tables: JSON.parse(JSON.stringify(s.tables)),
          decorations: JSON.parse(JSON.stringify(s.decorations)),
          savedAt: new Date().toISOString()
        }
        return { savedRooms: [...s.savedRooms, saved] }
      }),
      loadRoom: (id) => set((s) => {
        const saved = s.savedRooms.find(r => r.id === id)
        if (!saved) return s
        return {
          room: { ...saved.room },
          tables: JSON.parse(JSON.stringify(saved.tables)),
          decorations: JSON.parse(JSON.stringify(saved.decorations)),
          ui: { ...s.ui, selectedTableId: null }
        }
      }),
      deleteRoom: (id) => set((s) => ({ savedRooms: s.savedRooms.filter(r => r.id !== id) })),
      applyPreset: (preset) => set((s) => ({
        room: { ...s.room, ...preset },
        ui: { ...s.ui, selectedTableId: null }
      })),
    }),
    { name: 'wedding-seating-v2', version: 2 }
  )
)

export default useWeddingStore
