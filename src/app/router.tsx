import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { RequireAuth } from '../features/auth/RequireAuth';
import { VerifyEmailPage } from '../features/auth/VerifyEmailPage';
import { JournalPage } from '../features/journal/JournalPage';
import { ProgressPage } from '../features/progress/ProgressPage';
import { QuranPage } from '../features/quran/QuranPage';
import { RoutinePage } from '../features/routines/RoutinePage';
import { SalahPage } from '../features/salah/SalahPage';
import { SelfControlPage } from '../features/selfControl/SelfControlPage';

function Placeholder({ title, text }: { title: string; text: string }) {
  return <main className="page"><div className="page-heading"><div><span className="eyebrow">Climb to Jannah</span><h1>{title}</h1><p>{text}</p></div></div></main>;
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/verify-email', element: <VerifyEmailPage /> },
  {
    element: <RequireAuth />,
    children: [{
      element: <AppShell />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: 'routine', element: <RoutinePage /> },
        { path: 'salah', element: <SalahPage /> },
        { path: 'quran', element: <QuranPage /> },
        { path: 'self-control', element: <SelfControlPage /> },
        { path: 'journal', element: <JournalPage /> },
        { path: 'progress', element: <ProgressPage /> },
        { path: 'settings', element: <Placeholder title="Settings" text="Privacy, reminders and account preferences." /> },
        { path: 'support', element: <Placeholder title="Help & Support" text="Guidance for using Climb to Jannah safely." /> },
      ],
    }],
  },
]);
