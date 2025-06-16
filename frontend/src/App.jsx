import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SignUpPage from './pages/SignUpPage';
import { useAuthStore } from './store/useAuthStore';
import useThemeStore from './store/useThemeStore';

const App = () => {
   const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
   const { theme } = useThemeStore();

   useEffect(() => {
      checkAuth();
   }, [checkAuth]);

   if (isCheckingAuth && !authUser) {
      return (
         <div className="h-screen flex flex-col items-center justify-center">
            <span className="loading loading-spinner loading-xl text-primary"></span>
         </div>
      );
   }

   return (
      <div data-theme={theme} className="scrollbar-thin ">
         <audio id="notif-audio" src="/iphone_notification.mp3" preload="auto"></audio>
         <Toaster
            position="top-center"
            reverseOrder={false}
            toastOptions={{
               duration: 3000,
            }}
         />
         <Navbar />
         <Routes>
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
            <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
            <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
            <Route
               path="/profile"
               element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
            />
            <Route path="/settings" element={<SettingsPage />} />
         </Routes>
      </div>
   );
};

export default App;
