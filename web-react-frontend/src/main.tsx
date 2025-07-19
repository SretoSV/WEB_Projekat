import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />
  },
  {
    path: "/Login",
    element: <LoginPage />
  },
  {
    path: "/Register",
    element: <RegisterPage />
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  },
]);

createRoot(document.getElementById('root')!).render(
  <RouterProvider router={router} />,
)

/*
  <StrictMode>
    <App />
  </StrictMode>,
*/