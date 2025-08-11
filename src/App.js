import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './components/pages/Register/Register';
import Login from './components/pages/Login/Login';
import Dashboard from './components/pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import Notification from './components/childs/Notification';
import { NotificationProvider, useNotification } from './context/NotificationContext';
import Outstanding from './components/pages/OutstandingTiga';
import Layout from './components/Layout';

const AppContent = () => {

  const { notification, hideNotification } = useNotification();
  return (
    <div className="d-flex flex-column min-vh-100">
      <Notification
        show={notification.show}
        onHide={hideNotification}
        message={notification.message}
        variant={notification.variant}
      />

      <Routes>
        {/* Routes tanpa layout (misalnya login dan register) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Routes dengan layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/outstanding" element={<PrivateRoute><Outstanding /></PrivateRoute>} />
        </Route>
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </Router>
  );
}

export default App;
