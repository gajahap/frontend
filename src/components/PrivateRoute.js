import { Navigate } from 'react-router-dom';


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // atau nama key token kamu
  return token ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
