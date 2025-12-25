import { Routes, Route, BrowserRouter } from 'react-router-dom';
import './App.css';
import Login from './views/Auth/Login';
import Register from './views/Auth/Register';
import Dashboard from './views/Auth/Dashboard';
import Logout from './views/Auth/Logout';
import ForgotPassword from './views/Auth/ForgotPassword';
import CreatePassword from './views/Auth/CreatePassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/create-new-password" element={<CreatePassword />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
