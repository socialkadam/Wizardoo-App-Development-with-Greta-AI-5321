import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiArrowRight, FiUsers, FiTarget, FiStar, FiHeart, FiBrain, FiTrendingUp } = FiIcons;

const HomePage = () => {
  const archetypes = [
    {
      name: 'Coach',
      icon: FiTrendingUp,
      description: 'Performance-focused guidance for achieving specific goals',
      color: 'from-green-500 to-emerald-600'
    },
    {
      name: 'Mentor',
      icon: FiStar,
      description: 'Wisdom-sharing from experienced professionals',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      name: 'Counselor',
      icon: FiHeart,
      description: 'Supportive guidance for personal challenges',
      color: 'from-pink-500 to-rose-600'
    },
    {
      name: 'Consultant',
      icon: FiBrain,
      description: 'Expert problem-solving and strategic advice',
      color: 'from-blue-500 to-indigo-600'
    }
  ];

  const stats = [
    { number: '500+', label: 'Expert Wizards' },
    { number: '10K+', label: 'Successful Matches' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '24/7', label: 'Support Available' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Find Your Perfect
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent block">
                  Wizard Match
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Connect with expert coaches, mentors, counselors, and consultants through our 
                intelligent archetype matching system. Get personalized guidance that fits your unique needs.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                to="/quiz/seeker"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <span>Take the Quiz</span>
                <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
              </Link>
              <Link
                to="/wizards"
                className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-600 hover:text-white transition-all flex items-center space-x-2"
              >
                <SafeIcon icon={FiUsers} className="w-5 h-5" />
                <span>Browse Wizards</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Archetypes Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Four Types of Wisdom
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our intelligent matching system identifies your communication archetype 
              to connect you with the perfect wizard for your journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {archetypes.map((archetype, index) => (
              <motion.div
                key={archetype.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${archetype.color} flex items-center justify-center mb-6`}>
                  <SafeIcon icon={archetype.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {archetype.name}
                </h3>
                <p className="text-gray-600">
                  {archetype.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Find Your Wizard?
            </h2>
            <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
              Take our 2-minute quiz to discover your archetype and get matched 
              with wizards who speak your language.
            </p>
            <Link
              to="/quiz/seeker"
              className="inline-flex items-center space-x-2 bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-all transform hover:scale-105"
            >
              <SafeIcon icon={FiTarget} className="w-5 h-5" />
              <span>Start Your Journey</span>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;