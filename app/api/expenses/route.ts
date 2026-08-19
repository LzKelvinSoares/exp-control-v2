import { createExpensesRoutes } from '@/lib/actions/controllers';

const routes = () => {
  return createExpensesRoutes();
};
export const { GET, POST, PUT, DELETE } = routes();
