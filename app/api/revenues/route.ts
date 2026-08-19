import { useServices } from '@/hooks/api';
import { createBudgetRoutes } from '@/lib/actions/controllers';

const routes = () => {
  const { revenuesService } = useServices();
  return createBudgetRoutes(revenuesService);
};
export const { GET, POST, PUT, DELETE } = routes();