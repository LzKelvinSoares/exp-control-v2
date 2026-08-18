import { createBillsRoutes } from '@/lib/actions/controllers';

const routes = () => {
  return createBillsRoutes();
};
export const { GET, POST, PUT, DELETE } = routes();
