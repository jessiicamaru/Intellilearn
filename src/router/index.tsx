import ExamPage from '@/pages/ExamPage';
import LoginPage from '@/pages/LoginPage';
import ProfilePage from '@/pages/ProfilePage';
import ResultPage from '@/pages/ResultPage';
import { createBrowserRouter } from 'react-router-dom';

const router = createBrowserRouter([
    { path: '/', element: <LoginPage /> },
    { path: '/profile', element: <ProfilePage /> },
    { path: '/exam', element: <ExamPage /> },
    { path: '/result', element: <ResultPage /> },
]);

export default router;
