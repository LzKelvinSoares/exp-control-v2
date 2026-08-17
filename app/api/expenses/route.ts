import { createBudgetRoutes } from '@/lib/budget-routes'
import { useService } from '@/lib/providers/service-provider';

const routes = () => {
  const { expensesService } = useService();
  return createBudgetRoutes(expensesService);
};
export const { GET, POST, PUT, DELETE } = routes();
