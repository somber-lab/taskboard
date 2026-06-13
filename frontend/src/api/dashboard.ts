import type { DashboardMetrics } from '@/types'
import { apiFetch } from './client'

export const getDashboardMetrics = () => apiFetch<DashboardMetrics>('/dashboard')
