import { createBudgetRoutes } from '@/lib/budget-routes'
import { getRevenues, createRevenue, updateRevenue, deleteRevenue } from '@/lib/db'

export const { GET, POST, PUT, DELETE } = createBudgetRoutes({
  getMany: getRevenues,
  create:  createRevenue,
  update:  updateRevenue,
  remove:  deleteRevenue,
})
