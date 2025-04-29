import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Dashboard from "./pages/Dashboard";
import JobForm from "./components/JobForm";
import JobList from "./components/JobList";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        {/* Toast Notifications */}
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />

        {/* App Routes */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<JobForm />} />
          <Route path="/jobs" element={<JobList />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
