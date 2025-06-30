import React from 'react';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiMail, FiTwitter, FiLinkedin, FiGithub } = FiIcons;

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🧙‍♂️</span>
              <span className="text-xl font-bold">Wizardoo</span>
            </div>
            <p className="text-gray-300 mb-4">
              Connect with expert wizards for coaching, mentoring, consulting, and counseling. 
              Find your perfect match through our intelligent archetype system.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <SafeIcon icon={FiTwitter} className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <SafeIcon icon={FiLinkedin} className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <SafeIcon icon={FiGithub} className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <SafeIcon icon={FiMail} className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Seekers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/quiz/seeker" className="text-gray-300 hover:text-white transition-colors">
                  Take the Quiz
                </Link>
              </li>
              <li>
                <Link to="/wizards" className="text-gray-300 hover:text-white transition-colors">
                  Browse Wizards
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  How it Works
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Wizards</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/quiz/wizard" className="text-gray-300 hover:text-white transition-colors">
                  Apply Now
                </Link>
              </li>
              <li>
                <Link to="/academy" className="text-gray-300 hover:text-white transition-colors">
                  Wizardoo Academy
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-white transition-colors">
                  Resources
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 Wizardoo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;