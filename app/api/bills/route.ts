import { useServices } from '@/hooks/api';
import { createBillsRoutes } from '@/lib/actions/controllers';

const routes = () => {
  const { billsService } = useServices();
  return createBillsRoutes(billsService);
};
export const { GET, POST, PUT, DELETE } = routes();
