import { HashRouter as Router, Routes, Route } from "react-router-dom"; // Changed BrowserRouter to HashRouter
import { Toaster } from "@/components/ui/toaster";
import Dashboard from "./pages/Dashboard";
import NotFound from '@/pages/NotFound';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;