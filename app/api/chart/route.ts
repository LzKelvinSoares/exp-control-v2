import { createChartRoutes } from '@/lib/actions/controllers';

const routes = () => {
  return createChartRoutes();
};
export const { GET } = routes();
