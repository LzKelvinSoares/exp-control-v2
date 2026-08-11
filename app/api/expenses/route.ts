import { createBudgetRoutes } from '@/lib/budget-routes'
import { getExpenses, createExpense, updateExpense, deleteExpense } from '@/lib/db'

export const { GET, POST, PUT, DELETE } = createBudgetRoutes({
  getMany: getExpenses,
  create:  createExpense,
  update:  updateExpense,
  remove:  deleteExpense,
})
