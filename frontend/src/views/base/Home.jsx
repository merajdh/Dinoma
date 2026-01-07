import { useAuthStore } from '../../store/auth';
import Products from '../Store/Products';

function Home() {
  const isLoggedIn = useAuthStore(state => state.isLoggedIn);
  const user = useAuthStore(state => state.user);

  return (
    <div>{isLoggedIn ? <LoggedInView user={user} /> : <LoggedOutView />}</div>
  );
}

const LoggedInView = ({ user }) => {
  return (
    <div>
      <Products />
    </div>
  );
};

const LoggedOutView = () => {
  return (
    <div>
      <Products />
    </div>
  );
};

export default Home;
