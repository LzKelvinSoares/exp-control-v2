import { useRepository } from '@/hooks/api';
import { createBudgetRoutes } from '@/lib/actions/controllers/budget.controller'

const routes = () => {
  const { revenuesRepository } = useRepository();
  return createBudgetRoutes(revenuesRepository);
};
export const { GET, POST, PUT, DELETE } = routes();