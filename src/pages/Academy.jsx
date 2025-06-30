import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import { db } from '../config/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiBook, FiPlay, FiCheck, FiLock, FiAward, FiClock, FiUsers, FiTarget } = FiIcons;

const Academy = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId] = useState('demo-user'); // Replace with actual auth

  const modules = [
    {
      id: 1,
      title: 'Communication Fundamentals',
      description: 'Master the core principles of effective communication across all archetypes.',
      duration: '45 minutes',
      lessons: 6,
      content: [
        'Understanding Communication Styles',
        'Active Listening Techniques',
        'Nonverbal Communication',
        'Building Rapport',
        'Handling Difficult Conversations',
        'Cultural Sensitivity'
      ]
    },
    {
      id: 2,
      title: 'Archetype Mastery',
      description: 'Deep dive into each archetype and learn to adapt your approach.',
      duration: '60 minutes',
      lessons: 8,
      content: [
        'The Coach Archetype',
        'The Mentor Archetype',
        'The Counselor Archetype',
        'The Consultant Archetype',
        'Archetype Assessment',
        'Adapting Your Style',
        'Cross-Archetype Communication',
        'Advanced Archetype Strategies'
      ]
    },
    {
      id: 3,
      title: 'Session Management',
      description: 'Learn to structure and manage effective sessions that deliver results.',
      duration: '50 minutes',
      lessons: 7,
      content: [
        'Session Planning',
        'Goal Setting with Clients',
        'Progress Tracking',
        'Handling Resistance',
        'Time Management',
        'Follow-up Strategies',
        'Documentation Best Practices'
      ]
    },
    {
      id: 4,
      title: 'Professional Ethics & Boundaries',
      description: 'Essential guidelines for maintaining professional relationships.',
      duration: '40 minutes',
      lessons: 5,
      content: [
        'Professional Boundaries',
        'Confidentiality',
        'Ethical Decision Making',
        'Managing Dual Relationships',
        'Self-Care for Practitioners'
      ]
    }
  ];

  const mockProgress = {
    module1_complete: true,
    module2_complete: true,
    module3_complete: false,
    module4_complete: false,
    final_quiz_available: false,
    final_quiz_complete: false,
    completion_percentage: 50
  };

  useEffect(() => {
    // Simulate loading progress data
    setTimeout(() => {
      setProgress(mockProgress);
      setLoading(false);
    }, 1000);
  }, []);

  const handleModuleComplete = async (moduleId) => {
    const moduleKey = `module${moduleId}_complete`;
    const newProgress = { ...progress, [moduleKey]: true };
    
    // Calculate new completion percentage
    const completedModules = Object.keys(newProgress).filter(key => 
      key.includes('module') && key.includes('complete') && newProgress[key]
    ).length;
    
    newProgress.completion_percentage = (completedModules / modules.length) * 100;
    
    // Check if final quiz should be available
    if (completedModules === modules.length) {
      newProgress.final_quiz_available = true;
    }

    setProgress(newProgress);

    try {
      await db.updateAcademyProgress(userId, newProgress);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleFinalQuiz = () => {
    // Navigate to final quiz or show quiz modal
    alert('Final quiz functionality would be implemented here!');
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your academy progress...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <SafeIcon icon={FiBook} className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Wizardoo Academy
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Master the art of being an exceptional wizard through our comprehensive training program.
            </p>
          </motion.div>
        </div>

        {/* Progress Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl p-8 shadow-lg mb-8"
        >
          <div className="flex flex-col md:flex-row items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Progress</h2>
              <p className="text-gray-600">Complete all modules to unlock the final certification quiz</p>
            </div>
            <div className="text-center md:text-right mt-4 md:mt-0">
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {progress.completion_percentage}%
              </div>
              <div className="text-sm text-gray-600">Complete</div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-1000"
              style={{ width: `${progress.completion_percentage}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Object.keys(progress).filter(key => key.includes('module') && progress[key]).length}
              </div>
              <div className="text-sm text-gray-600">Modules Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {modules.reduce((sum, module) => sum + module.lessons, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Lessons</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">~3.5</div>
              <div className="text-sm text-gray-600">Hours of Content</div>
            </div>
          </div>
        </motion.div>

        {/* Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {modules.map((module, index) => {
            const isComplete = progress[`module${module.id}_complete`];
            const isAvailable = index === 0 || progress[`module${index}_complete`];

            return (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                className={`bg-white rounded-2xl p-8 shadow-lg ${
                  !isAvailable ? 'opacity-60' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        isComplete 
                          ? 'bg-green-500' 
                          : isAvailable 
                          ? 'bg-purple-600' 
                          : 'bg-gray-400'
                      }`}>
                        <SafeIcon 
                          icon={isComplete ? FiCheck : isAvailable ? FiPlay : FiLock} 
                          className="w-6 h-6 text-white" 
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          Module {module.id}: {module.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <SafeIcon icon={FiClock} className="w-4 h-4" />
                            <span>{module.duration}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <SafeIcon icon={FiBook} className="w-4 h-4" />
                            <span>{module.lessons} lessons</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-6">
                  {module.description}
                </p>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">What you'll learn:</h4>
                  <ul className="space-y-2">
                    {module.content.slice(0, 4).map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center space-x-2 text-sm text-gray-600">
                        <SafeIcon icon={FiTarget} className="w-4 h-4 text-purple-600" />
                        <span>{item}</span>
                      </li>
                    ))}
                    {module.content.length > 4 && (
                      <li className="text-sm text-gray-500">
                        +{module.content.length - 4} more topics
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex space-x-3">
                  {isComplete ? (
                    <div className="flex-1 bg-green-50 border border-green-200 text-green-700 py-3 px-6 rounded-lg text-center font-medium flex items-center justify-center space-x-2">
                      <SafeIcon icon={FiCheck} className="w-5 h-5" />
                      <span>Completed</span>
                    </div>
                  ) : isAvailable ? (
                    <button
                      onClick={() => handleModuleComplete(module.id)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
                    >
                      <SafeIcon icon={FiPlay} className="w-5 h-5" />
                      <span>Start Module</span>
                    </button>
                  ) : (
                    <div className="flex-1 bg-gray-100 text-gray-500 py-3 px-6 rounded-lg text-center font-medium flex items-center justify-center space-x-2">
                      <SafeIcon icon={FiLock} className="w-5 h-5" />
                      <span>Locked</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Final Quiz */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className={`bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-8 text-white ${
            !progress.final_quiz_available ? 'opacity-60' : ''
          }`}
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <SafeIcon 
                icon={progress.final_quiz_complete ? FiAward : progress.final_quiz_available ? FiTarget : FiLock} 
                className="w-8 h-8" 
              />
            </div>
            
            <h2 className="text-3xl font-bold mb-4">
              {progress.final_quiz_complete ? 'Certification Complete!' : 'Final Certification Quiz'}
            </h2>
            
            <p className="text-purple-100 mb-8 max-w-2xl mx-auto">
              {progress.final_quiz_complete 
                ? 'Congratulations! You are now a certified Wizardoo practitioner.'
                : progress.final_quiz_available
                ? 'Complete the final quiz to earn your Wizardoo certification and unlock full platform access.'
                : 'Complete all modules above to unlock the certification quiz.'
              }
            </p>

            {progress.final_quiz_complete ? (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
                <SafeIcon icon={FiAward} className="w-12 h-12 mx-auto mb-4" />
                <p className="font-semibold">Your certification is ready!</p>
              </div>
            ) : progress.final_quiz_available ? (
              <button
                onClick={handleFinalQuiz}
                className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all flex items-center space-x-2 mx-auto"
              >
                <SafeIcon icon={FiTarget} className="w-5 h-5" />
                <span>Take Final Quiz</span>
              </button>
            ) : (
              <div className="text-purple-200">
                Complete all modules to unlock
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Academy;