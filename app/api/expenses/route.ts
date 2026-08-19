import { useServices } from '@/hooks/api';
import { createBudgetRoutes } from '@/lib/actions/controllers';

const routes = () => {
  const { expensesService } = useServices();
  return createBudgetRoutes(expensesService);
};
export const { GET, POST, PUT, DELETE } = routes();
