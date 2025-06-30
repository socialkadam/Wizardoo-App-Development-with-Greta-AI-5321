import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import IntelligentSearch from '../components/search/IntelligentSearch';
import SearchResults from '../components/search/SearchResults';
import { db } from '../config/supabase';
import { wizardSearchService } from '../services/openai';
import * as FiIcons from 'react-icons/fi';

const {
  FiFilter,
  FiStar,
  FiMapPin,
  FiClock,
  FiExternalLink,
  FiHeart,
  FiBrain,
  FiTrendingUp,
  FiRefreshCw
} = FiIcons;

const WizardDirectory = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [wizards, setWizards] = useState([]);
  const [filteredWizards, setFilteredWizards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState(searchParams.get('archetype') || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [isAISearch, setIsAISearch] = useState(false);

  const archetypes = [
    { value: 'all', label: 'All Wizards', icon: FiStar, color: 'from-gray-500 to-gray-600' },
    { value: 'coach', label: 'Coaches', icon: FiTrendingUp, color: 'from-green-500 to-emerald-600' },
    { value: 'mentor', label: 'Mentors', icon: FiStar, color: 'from-yellow-500 to-orange-600' },
    { value: 'counselor', label: 'Counselors', icon: FiHeart, color: 'from-pink-500 to-rose-600' },
    { value: 'consultant', label: 'Consultants', icon: FiBrain, color: 'from-blue-500 to-indigo-600' }
  ];

  // Enhanced mock data with more search-friendly content
  const mockWizards = [
    {
      id: 1,
      name: 'Sarah Johnson',
      archetype: 'coach',
      bio: 'Performance coach specializing in career acceleration and goal achievement.',
      rating: 4.9,
      sessions: 150,
      location: 'San Francisco, CA',
      hourlyRate: 120,
      availability: 'Available Today',
      bookingUrl: 'https://calendly.com/sarah-johnson',
      imageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b332c1fd?w=300&h=300&fit=crop&crop=face',
      specialties: ['Career Development', 'Leadership', 'Goal Setting', 'Performance Optimization', 'Executive Presence']
    },
    {
      id: 2,
      name: 'Michael Chen',
      archetype: 'mentor',
      bio: 'Tech executive turned mentor, helping emerging leaders navigate their journey.',
      rating: 4.8,
      sessions: 200,
      location: 'New York, NY',
      hourlyRate: 150,
      availability: 'Next Available: Tomorrow',
      bookingUrl: 'https://calendly.com/michael-chen',
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      specialties: ['Technology', 'Startups', 'Leadership', 'Career Transition', 'Mentorship']
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      archetype: 'counselor',
      bio: 'Licensed therapist specializing in anxiety, relationships, and personal growth.',
      rating: 5.0,
      sessions: 300,
      location: 'Austin, TX',
      hourlyRate: 100,
      availability: 'Available This Week',
      bookingUrl: 'https://calendly.com/dr-emily-rodriguez',
      imageUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop&crop=face',
      specialties: ['Anxiety', 'Relationships', 'Personal Growth', 'Therapy', 'Mental Health']
    },
    {
      id: 4,
      name: 'David Kim',
      archetype: 'consultant',
      bio: 'Strategy consultant helping businesses solve complex operational challenges.',
      rating: 4.7,
      sessions: 180,
      location: 'Seattle, WA',
      hourlyRate: 200,
      availability: 'Available Next Week',
      bookingUrl: 'https://calendly.com/david-kim',
      imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      specialties: ['Strategy', 'Operations', 'Business Development', 'Consulting', 'Problem Solving']
    },
    {
      id: 5,
      name: 'Lisa Thompson',
      archetype: 'coach',
      bio: 'Executive coach focused on women in leadership and work-life integration.',
      rating: 4.9,
      sessions: 220,
      location: 'Los Angeles, CA',
      hourlyRate: 140,
      availability: 'Available Today',
      bookingUrl: 'https://calendly.com/lisa-thompson',
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      specialties: ['Executive Coaching', 'Women in Leadership', 'Work-Life Balance', 'Career Development', 'Leadership Skills']
    },
    {
      id: 6,
      name: 'James Wilson',
      archetype: 'mentor',
      bio: 'Serial entrepreneur and investor sharing insights from 20+ years in business.',
      rating: 4.8,
      sessions: 175,
      location: 'Boston, MA',
      hourlyRate: 180,
      availability: 'Available Tomorrow',
      bookingUrl: 'https://calendly.com/james-wilson',
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face',
      specialties: ['Entrepreneurship', 'Investing', 'Business Strategy', 'Startup Mentoring', 'Business Development']
    },
    {
      id: 7,
      name: 'Dr. Amanda Foster',
      archetype: 'counselor',
      bio: 'Relationship counselor helping couples and individuals build stronger connections.',
      rating: 4.9,
      sessions: 250,
      location: 'Denver, CO',
      hourlyRate: 110,
      availability: 'Available This Week',
      bookingUrl: 'https://calendly.com/dr-amanda-foster',
      imageUrl: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop&crop=face',
      specialties: ['Relationship Counseling', 'Couples Therapy', 'Communication Skills', 'Conflict Resolution', 'Marriage Counseling']
    },
    {
      id: 8,
      name: 'Robert Martinez',
      archetype: 'consultant',
      bio: 'Digital transformation consultant helping companies adapt to modern technology.',
      rating: 4.6,
      sessions: 140,
      location: 'Chicago, IL',
      hourlyRate: 175,
      availability: 'Available Next Week',
      bookingUrl: 'https://calendly.com/robert-martinez',
      imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face',
      specialties: ['Digital Transformation', 'Technology Strategy', 'Change Management', 'Business Innovation', 'Process Optimization']
    }
  ];

  useEffect(() => {
    // Simulate loading and set mock data
    setTimeout(() => {
      setWizards(mockWizards);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Apply basic filtering when not using AI search
    if (!isAISearch) {
      let filtered = wizards;
      
      if (selectedArchetype !== 'all') {
        filtered = filtered.filter(wizard => wizard.archetype === selectedArchetype);
      }
      
      if (searchTerm) {
        filtered = filtered.filter(wizard =>
          wizard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          wizard.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
          wizard.specialties.some(specialty =>
            specialty.toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }
      
      setFilteredWizards(filtered);
    }
  }, [wizards, selectedArchetype, searchTerm, isAISearch]);

  const handleAISearch = async (query) => {
    setSearchLoading(true);
    setIsAISearch(true);
    
    try {
      const results = await wizardSearchService.searchWizards(query, wizards);
      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
      // Fallback to basic search
      setIsAISearch(false);
      setSearchTerm(query);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleClearSearch = () => {
    setSearchResults(null);
    setIsAISearch(false);
    setSearchTerm('');
    setSelectedArchetype('all');
  };

  const getArchetypeInfo = (archetype) => {
    return archetypes.find(a => a.value === archetype) || archetypes[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-gray-600">Loading amazing wizards...</p>
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
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find Your Perfect Wizard
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Use our AI-powered search to find wizards that match your exact needs, or browse by archetype.
          </p>
        </div>

        {/* AI Search */}
        <div className="mb-8">
          <IntelligentSearch
            onSearch={handleAISearch}
            onClear={handleClearSearch}
            isLoading={searchLoading}
          />
        </div>

        {/* Show AI Search Results */}
        {isAISearch && searchResults ? (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">AI Search Results</h2>
              <button
                onClick={handleClearSearch}
                className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
              >
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                <span>Clear & Browse All</span>
              </button>
            </div>
            <SearchResults
              searchResults={searchResults}
              isLoading={searchLoading}
            />
          </div>
        ) : (
          <>
            {/* Traditional Filters */}
            <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Basic Search */}
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Search by name, specialties, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  />
                </div>

                {/* Archetype Filter */}
                <div className="lg:w-64">
                  <select
                    value={selectedArchetype}
                    onChange={(e) => setSelectedArchetype(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  >
                    {archetypes.map((archetype) => (
                      <option key={archetype.value} value={archetype.value}>
                        {archetype.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Archetype Pills */}
              <div className="flex flex-wrap gap-3 mt-6">
                {archetypes.map((archetype) => (
                  <button
                    key={archetype.value}
                    onClick={() => setSelectedArchetype(archetype.value)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all ${
                      selectedArchetype === archetype.value
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-purple-100'
                    }`}
                  >
                    <SafeIcon icon={archetype.icon} className="w-4 h-4" />
                    <span>{archetype.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredWizards.length} wizard{filteredWizards.length !== 1 ? 's' : ''}
                {selectedArchetype !== 'all' && ` in ${getArchetypeInfo(selectedArchetype).label}`}
              </p>
            </div>

            {/* Wizard Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredWizards.map((wizard, index) => {
                const archetypeInfo = getArchetypeInfo(wizard.archetype);
                return (
                  <motion.div
                    key={wizard.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden"
                  >
                    {/* Wizard Image */}
                    <div className="relative">
                      <img
                        src={wizard.imageUrl}
                        alt={wizard.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${archetypeInfo.color}`}>
                        {wizard.archetype.charAt(0).toUpperCase() + wizard.archetype.slice(1)}
                      </div>
                      <div className="absolute top-4 right-4 flex items-center space-x-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                        <SafeIcon icon={FiStar} className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-medium">{wizard.rating}</span>
                      </div>
                    </div>

                    {/* Wizard Info */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {wizard.name}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {wizard.bio}
                      </p>

                      {/* Specialties */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {wizard.specialties.slice(0, 2).map((specialty) => (
                          <span
                            key={specialty}
                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                        {wizard.specialties.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{wizard.specialties.length - 2} more
                          </span>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiMapPin} className="w-4 h-4" />
                          <span>{wizard.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <SafeIcon icon={FiClock} className="w-4 h-4" />
                          <span>{wizard.sessions} sessions</span>
                        </div>
                      </div>

                      {/* Availability & Rate */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-green-600 font-medium">
                          {wizard.availability}
                        </span>
                        <span className="text-lg font-bold text-gray-900">
                          ${wizard.hourlyRate}/hr
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex space-x-3">
                        <Link
                          to={`/wizards/${wizard.id}`}
                          className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-purple-700 transition-colors"
                        >
                          View Profile
                        </Link>
                        <a
                          href={wizard.bookingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors"
                        >
                          <SafeIcon icon={FiExternalLink} className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredWizards.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No wizards found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search terms to find more wizards.
                </p>
                <button
                  onClick={() => {
                    setSelectedArchetype('all');
                    setSearchTerm('');
                  }}
                  className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default WizardDirectory;