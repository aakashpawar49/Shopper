import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import store from "./redux/store";
import UserLayout from "./components/Layout/UserLayout";
import Home from "./pages/Home";
import ProtectedRoute from "./components/Common/ProtectedRoute";
import ScrollToTop from "./components/Common/ScrollToTop";
import PageLoader from "./components/Common/PageLoader";

// Every route except the home page is split into its own chunk and loaded on
// demand, so the first visit only downloads what the home page needs.
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const CollectionPage = lazy(() => import("./pages/CollectionPage"));
const ProductPage = lazy(() => import("./pages/ProductPage"));
const Checkout = lazy(() => import("./components/Cart/Checkout"));
const OrderConfirmationPage = lazy(() => import("./pages/OrderConfirmationPage"));
const OrderDetailsPage = lazy(() => import("./pages/OrderDetailsPage"));
const MyOrdersPage = lazy(() => import("./pages/MyOrdersPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));

// Admin pages
const AdminLayout = lazy(() => import("./components/Admin/AdminLayout"));
const AdminHomePage = lazy(() => import("./pages/AdminHomePage"));
const UserManagement = lazy(() => import("./components/Admin/UserManagement"));
const ProductManagement = lazy(() => import("./components/Admin/ProductManagement"));
const EditProductPage = lazy(() => import("./components/Admin/EditProductPage"));
const OrderManagement = lazy(() => import("./components/Admin/OrderManagement"));

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <ScrollToTop />
        <Toaster position="top-right" richColors closeButton />
        <Suspense fallback={<PageLoader fullScreen />}>
          <Routes>
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="profile" element={<Profile />} />
              <Route path="collections/:collection" element={<CollectionPage />} />
              <Route path="product/:id" element={<ProductPage />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="order-confirmation" element={<OrderConfirmationPage />} />
              <Route path="order/:id" element={<OrderDetailsPage />} />
              <Route path="my-orders" element={<MyOrdersPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            <Route
              path="/admin"
              element={
                <ProtectedRoute role="admin">
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminHomePage />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="products" element={<ProductManagement />} />
              <Route path="products/:id/edit" element={<EditProductPage />} />
              <Route path="orders" element={<OrderManagement />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
