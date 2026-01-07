import { useAuthStore } from '../store/auth';

const MainWrapper = ({ children }) => {
  const loading = useAuthStore(state => state.loading);

  if (loading) return null;

  return <>{children}</>;
};

export default MainWrapper;
