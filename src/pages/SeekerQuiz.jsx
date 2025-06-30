import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import { db } from '../config/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiArrowRight, FiCheck, FiTarget } = FiIcons;

const SeekerQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState(null);

  const questions = [
    {
      id: 1,
      question: "When facing a challenge, what's your first instinct?",
      options: [
        { text: "Break it down into actionable steps", archetype: "coach" },
        { text: "Seek advice from experienced people", archetype: "mentor" },
        { text: "Talk through your feelings about it", archetype: "counselor" },
        { text: "Research and analyze all options", archetype: "consultant" }
      ]
    },
    {
      id: 2,
      question: "How do you prefer to receive feedback?",
      options: [
        { text: "Direct, goal-oriented suggestions", archetype: "coach" },
        { text: "Stories and experiences from others", archetype: "mentor" },
        { text: "Supportive, empathetic dialogue", archetype: "counselor" },
        { text: "Data-driven insights and analysis", archetype: "consultant" }
      ]
    },
    {
      id: 3,
      question: "What motivates you most?",
      options: [
        { text: "Achieving specific, measurable results", archetype: "coach" },
        { text: "Learning from others' wisdom", archetype: "mentor" },
        { text: "Personal growth and self-understanding", archetype: "counselor" },
        { text: "Solving complex problems strategically", archetype: "consultant" }
      ]
    },
    {
      id: 4,
      question: "When making decisions, you tend to:",
      options: [
        { text: "Focus on what will get you to your goal fastest", archetype: "coach" },
        { text: "Consider long-term implications and wisdom", archetype: "mentor" },
        { text: "Think about how it aligns with your values", archetype: "counselor" },
        { text: "Analyze all data and potential outcomes", archetype: "consultant" }
      ]
    },
    {
      id: 5,
      question: "Your ideal learning environment is:",
      options: [
        { text: "Structured with clear milestones", archetype: "coach" },
        { text: "Informal conversations with experts", archetype: "mentor" },
        { text: "Safe space for open reflection", archetype: "counselor" },
        { text: "Workshop with frameworks and tools", archetype: "consultant" }
      ]
    },
    {
      id: 6,
      question: "When you're stuck, you prefer someone who:",
      options: [
        { text: "Pushes you to take action", archetype: "coach" },
        { text: "Shares their journey and lessons learned", archetype: "mentor" },
        { text: "Listens deeply and helps you process", archetype: "counselor" },
        { text: "Provides frameworks and methodologies", archetype: "consultant" }
      ]
    }
  ];

  const handleAnswer = (option) => {
    const newAnswers = [...answers, { questionId: currentQuestion + 1, ...option }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = async (finalAnswers) => {
    const archetypeCounts = {
      coach: 0,
      mentor: 0,
      counselor: 0,
      consultant: 0
    };

    finalAnswers.forEach(answer => {
      archetypeCounts[answer.archetype]++;
    });

    const recommendedArchetype = Object.keys(archetypeCounts).reduce((a, b) => 
      archetypeCounts[a] > archetypeCounts[b] ? a : b
    );

    const resultData = {
      recommended_archetype: recommendedArchetype,
      answers: finalAnswers,
      completed_at: new Date().toISOString()
    };

    try {
      await db.saveSeekerProfile(resultData);
    } catch (error) {
      console.error('Error saving seeker profile:', error);
    }

    setResult({
      archetype: recommendedArchetype,
      counts: archetypeCounts
    });
    setIsComplete(true);
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const getArchetypeInfo = (archetype) => {
    const info = {
      coach: {
        title: 'The Achiever',
        description: 'You thrive with performance-focused guidance and clear action steps.',
        color: 'from-green-500 to-emerald-600',
        icon: FiTarget
      },
      mentor: {
        title: 'The Seeker',
        description: 'You value wisdom from experienced professionals who\'ve walked the path.',
        color: 'from-yellow-500 to-orange-600',
        icon: FiCheck
      },
      counselor: {
        title: 'The Reflector',
        description: 'You benefit from supportive, empathetic guidance for personal growth.',
        color: 'from-pink-500 to-rose-600',
        icon: FiCheck
      },
      consultant: {
        title: 'The Strategist',
        description: 'You prefer data-driven insights and systematic problem-solving approaches.',
        color: 'from-blue-500 to-indigo-600',
        icon: FiCheck
      }
    };
    return info[archetype] || info.coach;
  };

  if (isComplete && result) {
    const archetypeInfo = getArchetypeInfo(result.archetype);
    
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${archetypeInfo.color} flex items-center justify-center mx-auto mb-8`}>
              <SafeIcon icon={archetypeInfo.icon} className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              You're {archetypeInfo.title}!
            </h1>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 capitalize">
                Your Archetype: {result.archetype}
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                {archetypeInfo.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {Object.entries(result.counts).map(([type, count]) => (
                  <div key={type} className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{count}</div>
                    <div className="text-sm text-gray-600 capitalize">{type}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(`/wizards?archetype=${result.archetype}`)}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center justify-center space-x-2"
              >
                <span>Find Your Wizards</span>
                <SafeIcon icon={FiArrowRight} className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/wizards')}
                className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-600 hover:text-white transition-all"
              >
                Browse All Wizards
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={goBack}
              disabled={currentQuestion === 0}
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SafeIcon icon={FiArrowLeft} className="w-5 h-5" />
              <span>Back</span>
            </button>
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              {questions[currentQuestion].question}
            </h2>

            <div className="space-y-4">
              {questions[currentQuestion].options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full p-6 text-left border-2 border-gray-200 rounded-xl hover:border-purple-600 hover:bg-purple-50 transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-lg text-gray-700 group-hover:text-purple-700">
                      {option.text}
                    </span>
                    <SafeIcon icon={FiArrowRight} className="w-5 h-5 text-gray-400 group-hover:text-purple-600 opacity-0 group-hover:opacity-100 transition-all" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SeekerQuiz;