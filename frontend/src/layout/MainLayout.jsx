import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import MainWrapper from './MainWrapper';

export function MainLayout() {
  return (
    <>
      <Navbar />
      <MainWrapper>
        <Outlet />
      </MainWrapper>
    </>
  );
}
