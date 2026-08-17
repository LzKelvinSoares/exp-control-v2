import { useService } from '@/hooks/api';
import { createBudgetRoutes } from '@/lib/budget-routes'

const routes = () => {
  const { revenuesService } = useService();
  return createBudgetRoutes(revenuesService);
};
export const { GET, POST, PUT, DELETE } = routes();