import { createUserRoutes } from '@/lib/actions/controllers';

const routes = () => {
  return createUserRoutes();
};
export const { GET } = routes();
