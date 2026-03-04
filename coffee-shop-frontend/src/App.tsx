import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PosPage from './pages/PosPage';
import KitchenPage from './pages/KitchenPage';
import ProductListPage from './pages/ProductListPage';
import ProductFormPage from './pages/ProductFormPage';
import CategoryListPage from './pages/CategoryListPage';
import CategoryFormPage from './pages/CategoryFormPage';
import DashboardPage from './pages/DashboardPage';
import PaymentPage from './pages/PaymentPage';
import PrivateRoute from './layouts/PrivateRoute';
import MainLayout from './layouts/MainLayout';
import LandingPortfolioPage from './pages/LandingPortfolioPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPortfolioPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/admin" element={<HomePage />} />
            <Route path="/admin/products" element={<ProductListPage />} />
            <Route path="/admin/products/new" element={<ProductFormPage />} />
            <Route path="/admin/products/:id/edit" element={<ProductFormPage />} />
            
            <Route path="/admin/categories" element={<CategoryListPage />} />
            <Route path="/admin/categories/new" element={<CategoryFormPage />} />
            <Route path="/admin/categories/:id/edit" element={<CategoryFormPage />} />

            <Route path="/admin/dashboard" element={<DashboardPage />} />
            <Route path="/pos" element={<PosPage />} />
            <Route path="/payment/:id" element={<PaymentPage />} />
            <Route path="/kitchen" element={<KitchenPage />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
