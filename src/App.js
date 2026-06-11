import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";
import ForgotPassword from "./pages/ForgotPassword";
import Analyzer from "./pages/Analyzer";
import History from "./pages/History";
import Chat from "./pages/Chat";
import Practice from "./pages/Practice";
import ProblemList from "./pages/ProblemList";
import Test from "./pages/Test";
import RunCode from "./pages/RunCode";
import Profile from "./pages/Profile";
import ResetPassword from "./pages/ResetPassword";

// 🔥 Separate component (important for useLocation)
function Layout() {
  const isAuth = localStorage.getItem("token");
  const location = useLocation();

 
  const hideNavbarRoutes = ["/run-code", "/test"];

  return (
    <>
      {/* ✅ Navbar conditionally show */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
  path="/dashboard"
  element={isAuth ? <Dashboard /> : <Navigate to="/login" />}
/>
        <Route path="/analyze" element={isAuth ? <Analyzer /> : <Login />} />
        <Route path="/chat" element={isAuth ? <Chat /> : <Login />} />
        <Route path="/history" element={isAuth ? <History /> : <Login />} />

        <Route path="/practice" element={isAuth ? <Practice /> : <Login />} />
        <Route path="/test" element={<Test />} />
        <Route path="/problems" element={<ProblemList />} />
        <Route path="/run-code" element={<RunCode />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
       

        <Route path="/profile" element={<Profile />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;