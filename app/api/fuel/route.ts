import { createFuelRoutes } from '@/lib/actions/controllers';

const routes = () => {
  return createFuelRoutes();
};
export const { GET, POST, PUT, DELETE } = routes();
