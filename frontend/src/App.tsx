import { NavLink, Route, Routes } from 'react-router-dom'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? 'bg-gray-100 text-gray-900'
      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
  }`

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex h-full items-center justify-center text-gray-400 text-lg">
      {title} — coming soon
    </div>
  )
}

export default function App() {
  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="flex w-52 shrink-0 flex-col border-r border-gray-200 bg-white p-4">
        <span className="mb-6 text-lg font-bold tracking-tight text-gray-900">
          Taskboard
        </span>
        <nav className="flex flex-col gap-1">
          <NavLink to="/" end className={linkClass}>List</NavLink>
          <NavLink to="/boards" className={linkClass}>Boards</NavLink>
          <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Routes>
          <Route path="/"           element={<Placeholder title="Task list" />} />
          <Route path="/boards"     element={<Placeholder title="Boards" />} />
          <Route path="/boards/:id" element={<Placeholder title="Board" />} />
          <Route path="/dashboard"  element={<Placeholder title="Dashboard" />} />
        </Routes>
      </main>
    </div>
  )
}
