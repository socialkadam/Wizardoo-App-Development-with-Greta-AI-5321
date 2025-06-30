import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import { db } from '../config/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiStar, FiMapPin, FiClock, FiExternalLink, FiArrowLeft, FiMail, FiHeart, FiBrain, FiTrendingUp, FiCalendar } = FiIcons;

const WizardProfile = () => {
  const { wizardId } = useParams();
  const [wizard, setWizard] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual Supabase call
  const mockWizard = {
    id: 1,
    name: 'Sarah Johnson',
    archetype: 'coach',
    bio: 'Performance coach specializing in career acceleration and goal achievement. With over 8 years of experience helping professionals reach their peak potential, I combine proven methodologies with personalized strategies to create lasting transformation.',
    longDescription: `I believe that everyone has untapped potential waiting to be unleashed. My coaching approach focuses on identifying your unique strengths, removing mental barriers, and creating actionable roadmaps to your biggest goals.

My background includes:
• 8+ years in executive coaching
• Former Fortune 500 corporate trainer
• Certified in multiple coaching methodologies
• MBA in Organizational Psychology

I specialize in helping ambitious professionals who feel stuck in their careers, overwhelmed by their goals, or unsure about their next steps. Together, we'll create clarity, build momentum, and achieve breakthrough results.`,
    rating: 4.9,
    totalReviews: 87,
    sessions: 150,
    location: 'San Francisco, CA',
    hourlyRate: 120,
    availability: 'Available Today',
    bookingUrl: 'https://calendly.com/sarah-johnson',
    imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b332c1fd?w=400&h=400&fit=crop&crop=face',
    specialties: ['Career Development', 'Leadership', 'Goal Setting', 'Performance Optimization', 'Executive Presence'],
    education: [
      'MBA, Organizational Psychology - Stanford University',
      'BS, Business Administration - UC Berkeley',
      'Certified Professional Coach (CPC) - International Coach Federation'
    ],
    experience: [
      'Executive Coach - Self-Employed (2016-Present)',
      'Senior Training Manager - Google (2014-2016)',
      'Corporate Trainer - Microsoft (2012-2014)'
    ],
    reviews: [
      {
        id: 1,
        name: 'Jennifer M.',
        rating: 5,
        date: '2 weeks ago',
        comment: 'Sarah completely transformed my approach to career development. Her insights were game-changing!'
      },
      {
        id: 2,
        name: 'Michael R.',
        rating: 5,
        date: '1 month ago',
        comment: 'Professional, insightful, and incredibly supportive. Highly recommend!'
      },
      {
        id: 3,
        name: 'Lisa K.',
        rating: 4,
        date: '2 months ago',
        comment: 'Great coach with practical strategies. Helped me land my dream job!'
      }
    ]
  };

  useEffect(() => {
    // Simulate loading and set mock data
    setTimeout(() => {
      setWizard(mockWizard);
      setLoading(false);
    }, 1000);
  }, [wizardId]);

  const getArchetypeInfo = (archetype) => {
    const info = {
      coach: {
        title: 'Performance Coach',
        description: 'Focused on achieving specific goals and breakthrough results',
        color: 'from-green-500 to-emerald-600',
        icon: FiTrendingUp
      },
      mentor: {
        title: 'Wisdom Mentor',
        description: 'Sharing experience and guidance for long-term growth',
        color: 'from-yellow-500 to-orange-600',
        icon: FiStar
      },
      counselor: {
        title: 'Supportive Counselor',
        description: 'Providing empathetic guidance for personal challenges',
        color: 'from-pink-500 to-rose-600',
        icon: FiHeart
      },
      consultant: {
        title: 'Strategic Consultant',
        description: 'Expert problem-solving and strategic advice',
        color: 'from-blue-500 to-indigo-600',
        icon: FiBrain
      }
    };
    return info[archetype] || info.coach;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wizard profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!wizard) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Wizard Not Found</h1>
          <p className="text-gray-600 mb-8">The wizard you're looking for doesn't exist.</p>
          <Link
            to="/wizards"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            Browse All Wizards
          </Link>
        </div>
      </div>
    );
  }

  const archetypeInfo = getArchetypeInfo(wizard.archetype);

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/wizards"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-purple-600 mb-8 transition-colors"
        >
          <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
          <span>Back to Wizards</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative">
                  <img
                    src={wizard.imageUrl}
                    alt={wizard.name}
                    className="w-32 h-32 rounded-2xl object-cover"
                  />
                  <div className={`absolute -bottom-2 -right-2 px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${archetypeInfo.color}`}>
                    <SafeIcon icon={archetypeInfo.icon} className="w-4 h-4 inline mr-1" />
                    {wizard.archetype.charAt(0).toUpperCase() + wizard.archetype.slice(1)}
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    {wizard.name}
                  </h1>
                  <p className="text-xl text-purple-600 font-semibold mb-4">
                    {archetypeInfo.title}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-500" />
                      <span className="font-medium">{wizard.rating}</span>
                      <span>({wizard.totalReviews} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                      <span>{wizard.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <SafeIcon icon={FiClock} className="w-4 h-4" />
                      <span>{wizard.sessions} sessions completed</span>
                    </div>
                  </div>

                  <p className="text-gray-700">
                    {wizard.bio}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* About */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">About</h2>
              <div className="prose prose-gray max-w-none">
                {wizard.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>

            {/* Specialties */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Specialties</h2>
              <div className="flex flex-wrap gap-3">
                {wizard.specialties.map((specialty) => (
                  <span
                    key={specialty}
                    className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-medium"
                  >
                    {specialty}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Experience & Education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Experience</h3>
                  <ul className="space-y-3">
                    {wizard.experience.map((exp, index) => (
                      <li key={index} className="text-gray-700">
                        {exp}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Education</h3>
                  <ul className="space-y-3">
                    {wizard.education.map((edu, index) => (
                      <li key={index} className="text-gray-700">
                        {edu}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Reviews */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-lg"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Reviews</h2>
              <div className="space-y-6">
                {wizard.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{review.name}</span>
                        <div className="flex items-center">
                          {[...Array(review.rating)].map((_, i) => (
                            <SafeIcon key={i} icon={FiStar} className="w-4 h-4 text-yellow-500" />
                          ))}
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Booking Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-6 shadow-lg sticky top-24"
            >
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ${wizard.hourlyRate}/hour
                </div>
                <div className="text-green-600 font-medium mb-4">
                  {wizard.availability}
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <a
                  href={wizard.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
                >
                  <SafeIcon icon={FiCalendar} className="w-5 h-5" />
                  <span>Book Session</span>
                </a>
                
                <button className="w-full border-2 border-purple-600 text-purple-600 py-3 px-6 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition-all flex items-center justify-center space-x-2">
                  <SafeIcon icon={FiMail} className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p className="mb-2">💡 Free 15-minute consultation available</p>
                <p>🔒 Secure payment through Lapsula</p>
              </div>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg"
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-medium">&lt; 2 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-medium">95%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Repeat Clients</span>
                  <span className="font-medium">80%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Languages</span>
                  <span className="font-medium">English, Spanish</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WizardProfile;