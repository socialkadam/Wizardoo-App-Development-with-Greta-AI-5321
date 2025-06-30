import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const {
  FiStar,
  FiMapPin,
  FiClock,
  FiExternalLink,
  FiZap,
  FiTrendingUp,
  FiHeart,
  FiBrain,
  FiAward,
  FiTarget
} = FiIcons;

const SearchResults = ({ searchResults, query, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">AI is analyzing your request...</p>
        </div>
      </div>
    );
  }

  if (!searchResults || searchResults.totalResults === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No wizards found</h3>
        <p className="text-gray-600 mb-6">
          Try adjusting your search terms or browse our directory.
        </p>
        <Link
          to="/wizards"
          className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
        >
          Browse All Wizards
        </Link>
      </div>
    );
  }

  const getArchetypeInfo = (archetype) => {
    const archetypes = {
      coach: {
        icon: FiTrendingUp,
        color: 'from-green-500 to-emerald-600',
        label: 'Coach'
      },
      mentor: {
        icon: FiStar,
        color: 'from-yellow-500 to-orange-600',
        label: 'Mentor'
      },
      counselor: {
        icon: FiHeart,
        color: 'from-pink-500 to-rose-600',
        label: 'Counselor'
      },
      consultant: {
        icon: FiBrain,
        color: 'from-blue-500 to-indigo-600',
        label: 'Consultant'
      }
    };
    return archetypes[archetype] || archetypes.coach;
  };

  const getRelevanceColor = (score) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    return 'text-orange-600 bg-orange-100';
  };

  const getRelevanceLabel = (score) => {
    if (score >= 8) return 'Excellent Match';
    if (score >= 6) return 'Good Match';
    return 'Partial Match';
  };

  return (
    <div className="space-y-6">
      {/* Search Summary */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <SafeIcon icon={FiZap} className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              AI Analysis: {searchResults.searchIntent}
            </h3>
            <p className="text-gray-600 mb-4">
              Found {searchResults.totalResults} wizard{searchResults.totalResults !== 1 ? 's' : ''} matching your needs
            </p>
            {searchResults.suggestedFilters && searchResults.suggestedFilters.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <span className="text-sm font-medium text-gray-700">Suggested filters:</span>
                {searchResults.suggestedFilters.map((filter, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
                  >
                    {filter}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.wizards.map((wizard, index) => {
          const archetypeInfo = getArchetypeInfo(wizard.archetype);
          const relevanceScore = wizard.searchMetadata?.relevanceScore || 0;
          
          return (
            <motion.div
              key={wizard.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 overflow-hidden"
            >
              {/* Relevance Badge */}
              <div className="relative">
                <img
                  src={wizard.imageUrl}
                  alt={wizard.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  <div className={`px-3 py-1 rounded-full text-white text-sm font-medium bg-gradient-to-r ${archetypeInfo.color}`}>
                    {archetypeInfo.label}
                  </div>
                  {wizard.searchMetadata && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getRelevanceColor(relevanceScore)}`}>
                      <div className="flex items-center space-x-1">
                        <SafeIcon icon={FiTarget} className="w-3 h-3" />
                        <span>{getRelevanceLabel(relevanceScore)}</span>
                      </div>
                    </div>
                  )}
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

                {/* AI Match Reasoning */}
                {wizard.searchMetadata?.reasoning && (
                  <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <SafeIcon icon={FiZap} className="w-4 h-4 text-purple-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-purple-800 mb-1">AI Match Insight:</p>
                        <p className="text-sm text-purple-700">{wizard.searchMetadata.reasoning}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Matched Keywords */}
                {wizard.searchMetadata?.matchedKeywords && wizard.searchMetadata.matchedKeywords.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {wizard.searchMetadata.matchedKeywords.map((keyword, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Specialties */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {wizard.specialties?.slice(0, 2).map((specialty) => (
                    <span
                      key={specialty}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                  {wizard.specialties?.length > 2 && (
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
    </div>
  );
};

export default SearchResults;