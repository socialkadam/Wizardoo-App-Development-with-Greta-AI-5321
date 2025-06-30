import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import SeekerQuiz from './pages/SeekerQuiz';
import WizardQuiz from './pages/WizardQuiz';
import WizardDirectory from './pages/WizardDirectory';
import WizardProfile from './pages/WizardProfile';
import Academy from './pages/Academy';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Navbar />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz/seeker" element={<SeekerQuiz />} />
            <Route path="/quiz/wizard" element={<WizardQuiz />} />
            <Route path="/wizards" element={<WizardDirectory />} />
            <Route path="/wizards/:wizardId" element={<WizardProfile />} />
            <Route path="/academy" element={<Academy />} />
          </Routes>
        </motion.main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;