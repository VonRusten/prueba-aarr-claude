import React from 'react'
import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import FloorPlan2D from './components/FloorPlan2D.jsx'
import FloorPlan3D from './components/FloorPlan3D.jsx'
import ListView from './components/ListView.jsx'
import useWeddingStore from './store/useWeddingStore.js'

export default function App() {
  const view = useWeddingStore((s) => s.ui.view)

  return (
    <div className="app">
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          {view === 'list' && <ListView />}
          {view === '2d' && <FloorPlan2D />}
          {view === '3d' && <FloorPlan3D />}
        </main>
      </div>
    </div>
  )
}
