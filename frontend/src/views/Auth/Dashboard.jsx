import { useAuthStore } from '../../store/auth';
import { Link } from 'react-router-dom';
const Dashboard = () => {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);

  const user = useAuthStore(state => state.user);
  return (
    <>
      {isLoggedIn() ? (
        <div>
          <h1>Dashboard</h1>
          <Link to={'/logout'}>Logout </Link>
        </div>
      ) : (
        <div>
          <h1>Home Page</h1>
          <Link to={'/register'}>Register</Link>
          <Link to={'/login'}>Login</Link>
        </div>
      )}
    </>
  );
};

export default Dashboard;
