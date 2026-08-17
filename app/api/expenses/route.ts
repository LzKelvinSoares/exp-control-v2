import { useService } from '@/hooks/api';
import { createBudgetRoutes } from '@/lib/budget-routes'

const routes = () => {
  const { expensesService } = useService();
  return createBudgetRoutes(expensesService);
};
export const { GET, POST, PUT, DELETE } = routes();
