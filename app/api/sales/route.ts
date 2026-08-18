import { createSalesRoutes } from '@/lib/actions/controllers';

const routes = () => {
  return createSalesRoutes();
};
export const { GET, POST, PUT, DELETE } = routes();
