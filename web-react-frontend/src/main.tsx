import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { UserProvider } from './context/UserContext.tsx';
import { AdminAllQuizzesPage } from './pages/Admin/AdminAllQuizzesPage.tsx';
import { UserAllQuizzesPage } from './pages/User/UserAllQuizzesPage.tsx';
import { UserQuizResults } from './pages/User/UserQuizResultsPage.tsx';
import { StartQuizPage } from './pages/User/StartQuizPage.tsx';
import { QuizProvider } from './context/QuizContext.tsx';
import { GlobalRanglist } from './pages/GlobalRanglistPage.tsx';

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
  {
    path: "/GlobalRanglist",
    element: <GlobalRanglist />
  },
  {
    path: "*",
    element: <Navigate to="/" replace />
  },
]);

createRoot(document.getElementById('root')!).render(
  <UserProvider>
    <QuizProvider>
    <RouterProvider router={router} />
    </QuizProvider>
  </UserProvider>
)

/*
  <StrictMode>
    <App />
  </StrictMode>,
*/