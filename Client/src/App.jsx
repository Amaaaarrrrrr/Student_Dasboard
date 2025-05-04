import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/lecturer/Dashboard';
import Announcements from './pages/lecturer/Announcements';
import Courses from './pages/lecturer/Courses';
import StudentsInCourse from './pages/lecturer/StudentsInCourse';
import GradeSubmission from './pages/lecturer/GradeSubmission';
import Navbar from './components/Layout/Navbar';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />

      <div className="flex flex-col min-h-screen bg-gray-100">
        {/* Header Section */}
        <header className="bg-indigo-600 text-white py-6">
          <div className="max-w-7xl mx-auto px-4 text-center">
            {/* <h2 className="text-3xl font-semibold">🎓 Student Portal Sevice</h2> */}
            {/* <p className="mt-2 text-lg">Welcome to your one-stop academic dashboard.</p> */}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 py-8 px-4">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/announcements" element={<Announcements />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/students" element={<StudentsInCourse />} />
              <Route path="/grades" element={<GradeSubmission />} />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-gray-800 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p>© 2025 Student Portal. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
