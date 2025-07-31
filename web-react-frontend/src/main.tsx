import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { UserProvider } from './context/UserContext.tsx';
import { AdminAllQuizzesPage } from './pages/Admin/AdminAllQuizzesPage.tsx';
import { UserAllQuizzesPage } from './pages/User/UserAllQuizzesPage.tsx';
import { UserQuizResults } from './pages/User/UserQuizResults.tsx';
import { StartQuizPage } from './pages/User/StartQuizPage.tsx';

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
    path: "/StartQuizPage/:quizId",
    element: <StartQuizPage />
  },
  {
    path: "/UserQuizResults",
    element: <UserQuizResults /> /* admin == all quizzes | user == own quizzes */
  },
  /*
  {
    path: "/AdminUsersResults",
    element: <RegisterPage />
  },
  */
  {
    path: "/GlobalRanglist",
    element: <RegisterPage />
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