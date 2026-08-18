import { createGoogleCalendarCallbackRoutes } from '@/lib/actions/controllers/google-calendar';

const routes = () => {
  return createGoogleCalendarCallbackRoutes();
};
export const { GET } = routes();
