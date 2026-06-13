import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getDashboardMetrics } from '@/api/dashboard'
import type { DashboardMetrics } from '@/types'

const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899']

function StatCard({ label, value, sub }: { label: string; value: number; sub?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
    </div>
  )
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)
  const [error, setError]     = useState('')

  useEffect(() => {
    getDashboardMetrics()
      .then(setMetrics)
      .catch(err => setError(err instanceof Error ? err.message : 'Failed to load metrics'))
  }, [])

  if (error) return <div className="text-sm text-red-500 p-4">{error}</div>
  if (!metrics) return <div className="text-sm text-gray-400 p-4">Loading…</div>

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Overdue"              value={metrics.overdue}             sub="past due date" />
        <StatCard label="Unplanned"            value={metrics.unplanned}           sub="no dates set" />
        <StatCard label="Completed (7 days)"   value={metrics.completedLast7Days}  sub="last week" />
        <StatCard label="Completed (30 days)"  value={metrics.completedLast30Days} sub="last month" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">Tasks by status</h2>
        {metrics.byStatus.length === 0 ? (
          <p className="text-sm text-gray-400">No tasks yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={metrics.byStatus} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="columnName" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e5e7eb' }}
                cursor={{ fill: '#f9fafb' }}
              />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {metrics.byStatus.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
