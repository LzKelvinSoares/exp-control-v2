import { createGoogleCalendarStatusRoutes } from '@/lib/actions/controllers/google-calendar';

const routes = () => {
  return createGoogleCalendarStatusRoutes();
};
export const { GET } = routes();
