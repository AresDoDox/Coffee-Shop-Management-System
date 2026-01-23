import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PosPage from './pages/PosPage';
import KitchenPage from './pages/KitchenPage';
import PrivateRoute from './layouts/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/pos" element={<PosPage />} />
          <Route path="/kitchen" element={<KitchenPage />} />
        </Route>

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
