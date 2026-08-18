import { useRepository } from '@/hooks/api';
import { createBudgetRoutes } from '@/lib/actions/controllers'

const routes = () => {
  const { expensesRepository } = useRepository();
  return createBudgetRoutes(expensesRepository);
};
export const { GET, POST, PUT, DELETE } = routes();
