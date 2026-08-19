import { createRevenuesRoutes } from '@/lib/actions/controllers';

const routes = () => {
  return createRevenuesRoutes();
};
export const { GET, POST, PUT, DELETE } = routes();