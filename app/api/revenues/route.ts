import { createBudgetRoutes } from '@/lib/budget-routes'
import { useService } from '@/lib/providers/service-provider';

const routes = () => {
  const { revenuesService } = useService();
  return createBudgetRoutes(revenuesService);
};
export const { GET, POST, PUT, DELETE } = routes();