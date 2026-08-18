import { createGoogleCalendarConnectRoutes } from '@/lib/actions/controllers/google-calendar';

const routes = () => {
  return createGoogleCalendarConnectRoutes();
};
export const { GET } = routes();
