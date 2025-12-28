import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Browse from './pages/Browse';
import Login from './pages/Login';
import Register from './pages/Register';
import SubmitInterview from './pages/SubmitInterview';
import InterviewDetail from './pages/InterviewDetail';
import ForgotPassword from './pages/ForgotPassword';
import Resources from './pages/Resources';

function App() {
  return (
    <AuthProvider>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/submit" element={<SubmitInterview />} />
            <Route path="/edit-experience/:id" element={<SubmitInterview />} />
            <Route path="/interviews/:id" element={<InterviewDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}

export default App;
