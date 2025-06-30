import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SafeIcon from '../components/common/SafeIcon';
import { db } from '../config/supabase';
import * as FiIcons from 'react-icons/fi';

const { FiArrowLeft, FiArrowRight, FiCheck, FiX, FiBookOpen, FiRefreshCw } = FiIcons;

const WizardQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [result, setResult] = useState(null);

  const questions = [
    {
      id: 1,
      question: "How do you typically approach helping someone solve a problem?",
      options: [
        { text: "Create a structured action plan with clear milestones", points: 4, archetype: "coach" },
        { text: "Share relevant experiences and lessons learned", points: 3, archetype: "mentor" },
        { text: "Listen deeply and help them explore their feelings", points: 2, archetype: "counselor" },
        { text: "Analyze the situation and provide strategic frameworks", points: 4, archetype: "consultant" }
      ]
    },
    {
      id: 2,
      question: "What's your communication style when giving advice?",
      options: [
        { text: "Direct, actionable, and goal-focused", points: 4, archetype: "coach" },
        { text: "Story-driven with real-world examples", points: 3, archetype: "mentor" },
        { text: "Empathetic, supportive, and non-judgmental", points: 4, archetype: "counselor" },
        { text: "Analytical, data-driven, and systematic", points: 3, archetype: "consultant" }
      ]
    },
    {
      id: 3,
      question: "How do you measure success in helping others?",
      options: [
        { text: "Achievement of specific, measurable goals", points: 4, archetype: "coach" },
        { text: "Long-term growth and career advancement", points: 3, archetype: "mentor" },
        { text: "Personal healing and emotional well-being", points: 4, archetype: "counselor" },
        { text: "Problem resolution and strategic outcomes", points: 3, archetype: "consultant" }
      ]
    },
    {
      id: 4,
      question: "What's your approach to accountability?",
      options: [
        { text: "Regular check-ins with progress tracking", points: 4, archetype: "coach" },
        { text: "Gentle guidance with wisdom sharing", points: 2, archetype: "mentor" },
        { text: "Supportive encouragement without pressure", points: 3, archetype: "counselor" },
        { text: "Milestone reviews with data analysis", points: 4, archetype: "consultant" }
      ]
    },
    {
      id: 5,
      question: "How do you handle resistance or pushback?",
      options: [
        { text: "Address it directly and refocus on goals", points: 3, archetype: "coach" },
        { text: "Share stories of overcoming similar challenges", points: 4, archetype: "mentor" },
        { text: "Explore underlying emotions and concerns", points: 4, archetype: "counselor" },
        { text: "Analyze root causes and adjust strategy", points: 3, archetype: "consultant" }
      ]
    },
    // Additional questions to reach 25
    {
      id: 6,
      question: "What motivates you most as a helper?",
      options: [
        { text: "Seeing people achieve breakthrough results", points: 4, archetype: "coach" },
        { text: "Watching someone grow into their potential", points: 4, archetype: "mentor" },
        { text: "Helping people heal and find peace", points: 4, archetype: "counselor" },
        { text: "Solving complex challenges efficiently", points: 3, archetype: "consultant" }
      ]
    },
    {
      id: 7,
      question: "How do you structure your sessions?",
      options: [
        { text: "Goal-setting, action planning, progress review", points: 4, archetype: "coach" },
        { text: "Open conversation with wisdom sharing", points: 3, archetype: "mentor" },
        { text: "Safe space for exploration and reflection", points: 4, archetype: "counselor" },
        { text: "Problem analysis, solution design, implementation", points: 4, archetype: "consultant" }
      ]
    },
    {
      id: 8,
      question: "What's your preferred timeline for helping someone?",
      options: [
        { text: "Short-term intensive with quick wins", points: 3, archetype: "coach" },
        { text: "Long-term relationship building", points: 4, archetype: "mentor" },
        { text: "As long as needed for healing", points: 3, archetype: "counselor" },
        { text: "Project-based with clear endpoints", points: 4, archetype: "consultant" }
      ]
    },
    {
      id: 9,
      question: "How do you handle emotional situations?",
      options: [
        { text: "Acknowledge emotions, then focus on action", points: 3, archetype: "coach" },
        { text: "Share how I navigated similar emotions", points: 3, archetype: "mentor" },
        { text: "Create space to fully process emotions", points: 4, archetype: "counselor" },
        { text: "Analyze emotional patterns objectively", points: 2, archetype: "consultant" }
      ]
    },
    {
      id: 10,
      question: "What's your approach to giving feedback?",
      options: [
        { text: "Direct, specific, action-oriented", points: 4, archetype: "coach" },
        { text: "Contextual with personal anecdotes", points: 3, archetype: "mentor" },
        { text: "Gentle, supportive, affirming", points: 4, archetype: "counselor" },
        { text: "Comprehensive with detailed analysis", points: 3, archetype: "consultant" }
      ]
    },
    // Questions 11-20
    {
      id: 11,
      question: "How do you prepare for helping someone?",
      options: [
        { text: "Review goals and create action frameworks", points: 4, archetype: "coach" },
        { text: "Reflect on relevant experiences to share", points: 3, archetype: "mentor" },
        { text: "Center myself emotionally and mentally", points: 4, archetype: "counselor" },
        { text: "Research and analyze their specific situation", points: 4, archetype: "consultant" }
      ]
    },
    {
      id: 12,
      question: "What role does intuition play in your approach?",
      options: [
        { text: "Some, but I focus on proven methods", points: 3, archetype: "coach" },
        { text: "Significant - I trust my accumulated wisdom", points: 4, archetype: "mentor" },
        { text: "Essential - I tune into emotional undercurrents", points: 4, archetype: "counselor" },
        { text: "Limited - I prefer data-driven decisions", points: 2, archetype: "consultant" }
      ]
    },
    {
      id: 13,
      question: "How do you handle setbacks or failures?",
      options: [
        { text: "Analyze what went wrong and adjust the plan", points: 4, archetype: "coach" },
        { text: "Share stories of resilience and perseverance", points: 4, archetype: "mentor" },
        { text: "Process the emotions and rebuild confidence", points: 4, archetype: "counselor" },
        { text: "Conduct root cause analysis and pivot strategy", points: 3, archetype: "consultant" }
      ]
    },
    {
      id: 14,
      question: "What's your philosophy on change?",
      options: [
        { text: "Change happens through consistent action", points: 4, archetype: "coach" },
        { text: "Change comes with time and wisdom", points: 3, archetype: "mentor" },
        { text: "Change requires inner healing first", points: 4, archetype: "counselor" },
        { text: "Change needs systematic approach", points: 4, archetype: "consultant" }
      ]
    },
    {
      id: 15,
      question: "How do you establish trust?",
      options: [
        { text: "Through proven results and expertise", points: 3, archetype: "coach" },
        { text: "By sharing my journey and vulnerabilities", points: 4, archetype: "mentor" },
        { text: "Through deep listening and empathy", points: 4, archetype: "counselor" },
        { text: "By demonstrating competence and reliability", points: 3, archetype: "consultant" }
      ]
    },
    {
      id: 16,
      question: "What's your approach to goal-setting?",
      options: [
        { text: "SMART goals with clear metrics", points: 4, archetype: "coach" },
        { text: "Vision-based with flexible pathways", points: 3, archetype: "mentor" },
        { text: "Values-aligned with emotional resonance", points: 4, archetype: "counselor" },
        { text: "Strategic objectives with measurable outcomes", points: 4, archetype: "consultant" }
      ]
    },
    {
      id: 17,
      question: "How do you handle difficult conversations?",
      options: [
        { text: "Address issues directly and constructively", points: 4, archetype: "coach" },
        { text: "Use stories to illustrate points gently", points: 3, archetype: "mentor" },
        { text: "Create safe space for honest dialogue", points: 4, archetype: "counselor" },
        { text: "Present facts objectively and logically", points: 3, archetype: "consultant" }
      ]
    },
    {
      id: 18,
      question: "What's your relationship to boundaries?",
      options: [
        { text: "Clear professional boundaries with flexibility", points: 3, archetype: "coach" },
        { text: "Warm but respectful relationship boundaries", points: 4, archetype: "mentor" },
        { text: "Therapeutic boundaries with deep care", points: 4, archetype: "counselor" },
        { text: "Professional boundaries with clear scope", points: 4, archetype: "consultant" }
      ]
    },
    {
      id: 19,
      question: "How do you celebrate success?",
      options: [
        { text: "Acknowledge achievement and set next goal", points: 4, archetype: "coach" },
        { text: "Reflect on growth and share pride", points: 4, archetype: "mentor" },
        { text: "Honor the journey and transformation", points: 4, archetype: "counselor" },
        { text: "Analyze what worked for future application", points: 3, archetype: "consultant" }
      ]
    },
    {
      id: 20,
      question: "What's your approach to learning and development?",
      options: [
        { text: "Continuous skill building and certification", points: 3, archetype: "coach" },
        { text: "Learning through experience and reflection", points: 4, archetype: "mentor" },
        { text: "Deep personal work and healing", points: 4, archetype: "counselor" },
        { text: "Research, frameworks, and methodology", points: 4, archetype: "consultant" }
      ]
    },
    // Questions 21-25
    {
      id: 21,
      question: "How do you handle your own stress while helping others?",
      options: [
        { text: "Maintain focus on goals and outcomes", points: 3, archetype: "coach" },
        { text: "Draw on past experiences of overcoming stress", points: 3, archetype: "mentor" },
        { text: "Practice self-care and emotional regulation", points: 4, archetype: "counselor" },
        { text: "Use systematic stress management techniques", points: 3, archetype: "consultant" }
      ]
    },
    {
      id: 22,
      question: "What's your view on the helper-client relationship?",
      options: [
        { text: "Professional partnership focused on results", points: 4, archetype: "coach" },
        { text: "Mentor-mentee with mutual respect", points: 4, archetype: "mentor" },
        { text: "Therapeutic alliance with deep care", points: 4, archetype: "counselor" },
        { text: "Expert-client with clear deliverables", points: 3, archetype: "consultant" }
      ]
    },
    {
      id: 23,
      question: "How do you approach cultural differences?",
      options: [
        { text: "Adapt methods to cultural context", points: 3, archetype: "coach" },
        { text: "Learn from diverse perspectives and wisdom", points: 4, archetype: "mentor" },
        { text: "Honor cultural values in healing process", points: 4, archetype: "counselor" },
        { text: "Research cultural factors affecting solutions", points: 4, archetype: "consultant" }
      ]
    },
    {
      id: 24,
      question: "What's your approach to technology in helping?",
      options: [
        { text: "Use apps and tools for tracking progress", points: 3, archetype: "coach" },
        { text: "Prefer human connection over technology", points: 3, archetype: "mentor" },
        { text: "Use technology to enhance human connection", points: 3, archetype: "counselor" },
        { text: "Leverage technology for analysis and efficiency", points: 4, archetype: "consultant" }
      ]
    },
    {
      id: 25,
      question: "How do you know when your work is complete?",
      options: [
        { text: "When goals are achieved and sustained", points: 4, archetype: "coach" },
        { text: "When they can navigate independently", points: 4, archetype: "mentor" },
        { text: "When healing and growth are integrated", points: 4, archetype: "counselor" },
        { text: "When problems are solved and systems work", points: 4, archetype: "consultant" }
      ]
    }
  ];

  const handleAnswer = (option) => {
    const newAnswers = [...answers, { 
      questionId: currentQuestion + 1, 
      selectedOption: option.text,
      points: option.points,
      archetype: option.archetype
    }];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult(newAnswers);
    }
  };

  const calculateResult = async (finalAnswers) => {
    const totalScore = finalAnswers.reduce((sum, answer) => sum + answer.points, 0);
    const maxPossibleScore = questions.length * 4; // 25 questions × 4 max points
    const percentage = Math.round((totalScore / maxPossibleScore) * 100);

    // Calculate archetype scores
    const archetypeScores = {
      coach: 0,
      mentor: 0,
      counselor: 0,
      consultant: 0
    };

    finalAnswers.forEach(answer => {
      archetypeScores[answer.archetype] += answer.points;
    });

    const primaryArchetype = Object.keys(archetypeScores).reduce((a, b) => 
      archetypeScores[a] > archetypeScores[b] ? a : b
    );

    let status;
    let nextStep;
    
    if (percentage >= 75) {
      status = 'approved';
      nextStep = 'approved';
    } else if (percentage >= 60) {
      status = 'academy_required';
      nextStep = 'academy';
    } else {
      status = 'retry_required';
      nextStep = 'retry';
    }

    const resultData = {
      total_score: totalScore,
      percentage: percentage,
      primary_archetype: primaryArchetype,
      archetype_scores: archetypeScores,
      answers: finalAnswers,
      status: status,
      completed_at: new Date().toISOString()
    };

    try {
      await db.saveQuizAttempt(resultData);
    } catch (error) {
      console.error('Error saving quiz attempt:', error);
    }

    setResult({
      score: totalScore,
      percentage: percentage,
      status: status,
      nextStep: nextStep,
      archetype: primaryArchetype,
      archetypeScores: archetypeScores
    });
    setIsComplete(true);
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  const retakeQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setIsComplete(false);
    setResult(null);
  };

  if (isComplete && result) {
    return (
      <div className="min-h-screen py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 ${
              result.nextStep === 'approved' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                : result.nextStep === 'academy'
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600'
                : 'bg-gradient-to-r from-red-500 to-rose-600'
            }`}>
              <SafeIcon 
                icon={result.nextStep === 'approved' ? FiCheck : result.nextStep === 'academy' ? FiBookOpen : FiX} 
                className="w-12 h-12 text-white" 
              />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {result.nextStep === 'approved' && 'Congratulations! 🎉'}
              {result.nextStep === 'academy' && 'Almost There! 📚'}
              {result.nextStep === 'retry' && 'Keep Growing! 💪'}
            </h1>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg mb-8">
              <div className="mb-6">
                <div className="text-6xl font-bold text-purple-600 mb-2">
                  {result.percentage}%
                </div>
                <div className="text-lg text-gray-600">
                  Your Wizard Score: {result.score}/100
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 capitalize">
                  Primary Archetype: {result.archetype}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(result.archetypeScores).map(([type, score]) => (
                    <div key={type} className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{score}</div>
                      <div className="text-sm text-gray-600 capitalize">{type}</div>
                    </div>
                  ))}
                </div>
              </div>

              {result.nextStep === 'approved' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-green-800 mb-2">Welcome to Wizardoo! 🧙‍♂️</h3>
                  <p className="text-green-700">
                    You've demonstrated excellent wizard potential! Our team will review your application 
                    and contact you within 48 hours to complete your profile setup.
                  </p>
                </div>
              )}

              {result.nextStep === 'academy' && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-yellow-800 mb-2">Continue to Wizardoo Academy</h3>
                  <p className="text-yellow-700 mb-4">
                    You're on the right track! Complete our Academy training to enhance your wizard skills 
                    and unlock full platform access.
                  </p>
                  <button
                    onClick={() => navigate('/academy')}
                    className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-yellow-600 hover:to-orange-700 transition-all flex items-center space-x-2 mx-auto"
                  >
                    <SafeIcon icon={FiBookOpen} className="w-5 h-5" />
                    <span>Start Academy</span>
                  </button>
                </div>
              )}

              {result.nextStep === 'retry' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h3 className="text-lg font-bold text-red-800 mb-2">Keep Learning and Try Again</h3>
                  <p className="text-red-700 mb-4">
                    Don't give up! Consider exploring our Academy resources or gaining more experience 
                    before retaking the assessment.
                  </p>
                  <button
                    onClick={retakeQuiz}
                    className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-red-600 hover:to-rose-700 transition-all flex items-center space-x-2 mx-auto"
                  >
                    <SafeIcon icon={FiRefreshCw} className="w-5 h-5" />
                    <span>Retake Quiz</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => navigate('/')}
              className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-600 hover:text-white transition-all"
            >
              Return Home
            </button>
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

export default WizardQuiz;