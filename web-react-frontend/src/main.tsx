import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { UserProvider } from './context/UserContext.tsx';
import { AdminAllQuizzesPage } from './pages/Admin/AdminAllQuizzesPage.tsx';
import { UserAllQuizzesPage } from './pages/User/UserAllQuizzesPage.tsx';

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
    path: "/AdminAllQuizzesPage",
    element: <AdminAllQuizzesPage />
  },
  {
    path: "/UserAllQuizzesPage",
    element: <UserAllQuizzesPage />
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  },
]);

createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <RouterProvider router={router} />
  </UserProvider>
)

/*
  <StrictMode>
    <App />
  </StrictMode>,
*/