import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../stores/gameStore';
import { ArrowLeft, Trophy, BookOpen, CheckCircle, XCircle, Clock, Target, Zap } from 'lucide-react';
import { QUIZ_QUESTIONS, QUIZ_CATEGORIES, QuizQuestion, QuizCategory, getQuizRewards, calculateQuizScore } from '../data/quizData';

type QuizState = 'select' | 'playing' | 'result';

interface AnswerRecord {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}

export const QuizPage = () => {
  const navigate = useNavigate();
  const { playerGrowthStates, activeSquad, updatePlayerGrowthState, saveGame } = useGameStore();
  
  const [quizState, setQuizState] = useState<QuizState>('select');
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | 'all'>('all');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [score, setScore] = useState(0);
  const [rewards, setRewards] = useState<{ growthPoints: number; trainingChance: boolean } | null>(null);

  const startQuiz = useCallback((category: QuizCategory | 'all') => {
    const pool = category === 'all' ? QUIZ_QUESTIONS : QUIZ_QUESTIONS.filter(q => q.category === category);
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 5);
    setQuestions(selected);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setRewards(null);
    setSelectedCategory(category);
    setQuizState('playing');
  }, []);

  const handleTimeout = useCallback(() => {
    if (selectedAnswer === null) {
      const currentQuestion = questions[currentIndex];
      const record: AnswerRecord = {
        questionId: currentQuestion.id,
        selectedIndex: -1,
        isCorrect: false
      };
      setAnswers(prev => [...prev, record]);
    }
    nextQuestion();
  }, [selectedAnswer, questions, currentIndex]);

  useEffect(() => {
    if (quizState !== 'playing') return;
    setTimeLeft(30);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [quizState, currentIndex, handleTimeout]);

  const selectAnswer = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const submitAnswer = () => {
    if (selectedAnswer === null) return;
    const currentQuestion = questions[currentIndex];
    const isCorrect = selectedAnswer === currentQuestion.correctIndex;
    const record: AnswerRecord = {
      questionId: currentQuestion.id,
      selectedIndex: selectedAnswer,
      isCorrect
    };
    setAnswers(prev => [...prev, record]);
    setShowResult(true);
    setScore(prev => isCorrect ? prev + 20 : prev);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    const finalScore = calculateQuizScore(answers.filter(a => a.isCorrect).length, questions.length);
    const quizRewards = getQuizRewards(finalScore);
    setScore(finalScore);
    setRewards(quizRewards);
    
    if (quizRewards.growthPoints > 0) {
      const targetIds = activeSquad?.playerIds.length ? activeSquad.playerIds : Object.keys(playerGrowthStates);
      if (targetIds.length > 0) {
        const perPlayer = Math.floor(quizRewards.growthPoints / targetIds.length);
        targetIds.forEach(pid => {
          updatePlayerGrowthState(pid, {
            growthPoints: (playerGrowthStates[pid]?.growthPoints || 0) + perPlayer
          });
        });
      }
    }
    saveGame();
    setQuizState('result');
  };

  const restartQuiz = () => {
    setQuizState('select');
  };

  const currentQuestion = questions[currentIndex];
  const correctCount = answers.filter(a => a.isCorrect).length;

  if (quizState === 'select') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/10 to-slate-900 text-white">
        <header className="sticky top-0 z-30 flex items-center p-4 bg-slate-900/95 backdrop-blur-sm border-b-4 border-yellow-500">
          <button
            onClick={() => navigate('/manager')}
            className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-yellow-500/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="pixel-text text-sm">返回经理中枢</span>
          </button>
          <h1 className="text-xl font-bold text-white pixel-text mx-auto">知识问答</h1>
          <div className="w-20"></div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-8 h-8 text-yellow-400" />
                <h2 className="text-xl font-bold">挑战你的足球知识</h2>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                通过答题测试你的足球知识和对新闻男足历史的了解。答对题目可以获得成长点数，高分还能获得额外训练机会！
              </p>
            </div>

            <div className="grid gap-4">
              <button
                onClick={() => startQuiz('all')}
                className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 p-6 rounded-2xl border border-green-400/30 transition-all transform hover:scale-[1.02] hover:shadow-lg hover:shadow-green-500/20"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
                      <Zap className="w-8 h-8 text-yellow-300" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-bold">全部题目</h3>
                      <p className="text-sm text-green-200">混合足球知识、新闻男足历史和体育文化</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{QUIZ_QUESTIONS.length} 题</div>
                    <div className="text-xs text-green-200">共 5 题随机抽取</div>
                  </div>
                </div>
              </button>

              {QUIZ_CATEGORIES.map(category => (
                <button
                  key={category.key}
                  onClick={() => startQuiz(category.key)}
                  className="w-full bg-slate-800/60 hover:bg-slate-700/60 p-6 rounded-2xl border border-slate-600 transition-all transform hover:scale-[1.02]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">{category.icon}</span>
                      </div>
                      <div className="text-left">
                        <h3 className="text-lg font-bold">{category.label}</h3>
                        <p className="text-sm text-gray-400">
                          {category.key === 'football' && '测试你的足球基础知识'}
                          {category.key === 'campus_history' && '回顾新闻男足的光辉历程'}
                          {category.key === 'sports_culture' && '了解体育文化与精神'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-gray-300">
                        {QUIZ_QUESTIONS.filter(q => q.category === category.key).length} 题
                      </div>
                      <div className="text-xs text-gray-500">共 5 题随机抽取</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-8 bg-slate-800/40 rounded-xl p-4 border border-slate-700">
              <h4 className="font-bold mb-2 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-yellow-400" />
                答题奖励
              </h4>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>• 90分以上：50成长点数 + 额外训练机会</li>
                <li>• 70-89分：30成长点数 + 额外训练机会</li>
                <li>• 50-69分：15成长点数</li>
                <li>• 50分以下：5成长点数</li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (quizState === 'result') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/10 to-slate-900 text-white">
        <header className="sticky top-0 z-30 flex items-center p-4 bg-slate-900/95 backdrop-blur-sm border-b-4 border-yellow-500">
          <button
            onClick={() => navigate('/manager')}
            className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-yellow-500/20"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="pixel-text text-sm">返回经理中枢</span>
          </button>
          <h1 className="text-xl font-bold text-white pixel-text mx-auto">答题结果</h1>
          <div className="w-20"></div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className={`relative rounded-3xl p-8 mb-8 ${score >= 90 ? 'bg-gradient-to-br from-yellow-600/30 to-yellow-500/10 border-2 border-yellow-500/50' : score >= 70 ? 'bg-gradient-to-br from-green-600/30 to-green-500/10 border-2 border-green-500/50' : score >= 50 ? 'bg-gradient-to-br from-blue-600/30 to-blue-500/10 border-2 border-blue-500/50' : 'bg-gradient-to-br from-slate-700/50 to-slate-600/30 border-2 border-slate-600/50'}`}>
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${score >= 90 ? 'bg-yellow-500' : score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-blue-500' : 'bg-slate-500'}`}>
                  {score >= 90 && <Trophy className="w-8 h-8 text-white" />}
                  {score >= 70 && score < 90 && <CheckCircle className="w-8 h-8 text-white" />}
                  {score >= 50 && score < 70 && <Target className="w-8 h-8 text-white" />}
                  {score < 50 && <XCircle className="w-8 h-8 text-white" />}
                </div>
              </div>

              <div className="text-center mt-6">
                <div className="text-6xl font-bold mb-2">
                  {score}
                  <span className="text-3xl text-gray-400">分</span>
                </div>
                <p className={`text-lg font-bold mb-4 ${score >= 90 ? 'text-yellow-400' : score >= 70 ? 'text-green-400' : score >= 50 ? 'text-blue-400' : 'text-gray-400'}`}>
                  {score >= 90 && '太厉害了！你是足球百科全书！'}
                  {score >= 70 && score < 90 && '不错！继续加油！'}
                  {score >= 50 && score < 70 && '还可以，再接再厉！'}
                  {score < 50 && '别灰心，多了解一些足球知识吧！'}
                </p>
                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{correctCount}</div>
                    <div className="text-xs text-gray-400">答对</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-400">{questions.length - correctCount}</div>
                    <div className="text-xs text-gray-400">答错</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{rewards?.growthPoints || 0}</div>
                    <div className="text-xs text-gray-400">成长点数</div>
                  </div>
                </div>
              </div>
            </div>

            {rewards?.trainingChance && (
              <div className="bg-gradient-to-r from-yellow-600/20 to-yellow-500/10 rounded-2xl p-6 border border-yellow-500/30 mb-6">
                <div className="flex items-center gap-3">
                  <Zap className="w-6 h-6 text-yellow-400" />
                  <div>
                    <h3 className="font-bold text-yellow-400">获得额外训练机会！</h3>
                    <p className="text-sm text-gray-300">本周你可以为一名球员额外安排一次训练</p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-slate-800/60 rounded-2xl p-6 border border-slate-700 mb-6">
              <h3 className="font-bold mb-4">答题详情</h3>
              <div className="space-y-4">
                {questions.map((q, index) => {
                  const answer = answers[index];
                  const isCorrect = answer?.isCorrect;
                  return (
                    <div key={q.id} className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-900/30 border-green-500/30' : 'bg-red-900/30 border-red-500/30'}`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isCorrect ? 'bg-green-500' : 'bg-red-500'}`}>
                          {isCorrect ? <CheckCircle className="w-4 h-4 text-white" /> : <XCircle className="w-4 h-4 text-white" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium mb-2">{index + 1}. {q.question}</p>
                          <div className="text-sm">
                            <p className="text-gray-400">正确答案：{q.options[q.correctIndex]}</p>
                            {!isCorrect && answer?.selectedIndex !== -1 && (
                              <p className="text-red-400">你的答案：{q.options[answer.selectedIndex]}</p>
                            )}
                            {answer?.selectedIndex === -1 && (
                              <p className="text-red-400">你的答案：超时未作答</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={restartQuiz}
                className="flex-1 bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-bold transition-colors"
              >
                再答一次
              </button>
              <button
                onClick={() => navigate('/manager')}
                className="flex-1 bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-bold transition-colors"
              >
                返回经理中枢
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/10 to-slate-900 text-white">
      <header className="sticky top-0 z-30 flex items-center p-4 bg-slate-900/95 backdrop-blur-sm border-b-4 border-yellow-500">
        <button
          onClick={() => {
            if (confirm('确定要退出答题吗？')) navigate('/manager');
          }}
          className="flex items-center gap-2 text-gray-300 hover:text-yellow-400 transition-colors px-4 py-2 rounded-lg hover:bg-yellow-500/20"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="pixel-text text-sm">退出</span>
        </button>
        <div className="flex-1 text-center">
          <div className="text-sm text-gray-400">
            {selectedCategory === 'all' ? '全部题目' : QUIZ_CATEGORIES.find(c => c.key === selectedCategory)?.label}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${timeLeft <= 10 ? 'bg-red-600/50 text-red-300' : 'bg-slate-800 text-gray-300'}`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">{timeLeft}s</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">第 {currentIndex + 1} / {questions.length} 题</span>
              <span className="text-sm text-green-400">答对 {correctCount} 题</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-6 border border-slate-700 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-2 py-1 bg-gray-700 rounded text-xs uppercase">
                {currentQuestion?.difficulty === 'easy' && '简单'}
                {currentQuestion?.difficulty === 'medium' && '中等'}
                {currentQuestion?.difficulty === 'hard' && '困难'}
              </span>
              <span className="text-sm text-gray-400">
                {QUIZ_CATEGORIES.find(c => c.key === currentQuestion?.category)?.label}
              </span>
            </div>
            <h2 className="text-xl font-bold mb-6">{currentQuestion?.question}</h2>

            <div className="space-y-3">
              {currentQuestion?.options.map((option, index) => {
                let optionClass = 'bg-slate-700/50 hover:bg-slate-700 border-slate-600';
                if (showResult) {
                  if (index === currentQuestion.correctIndex) {
                    optionClass = 'bg-green-600/50 border-green-500';
                  } else if (index === selectedAnswer && !answers[answers.length - 1]?.isCorrect) {
                    optionClass = 'bg-red-600/50 border-red-500';
                  } else {
                    optionClass = 'bg-slate-700/30 border-slate-700 opacity-50';
                  }
                } else if (selectedAnswer === index) {
                  optionClass = 'bg-blue-600/50 border-blue-500';
                }

                return (
                  <button
                    key={index}
                    onClick={() => selectAnswer(index)}
                    disabled={showResult}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${optionClass}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                        showResult && index === currentQuestion.correctIndex ? 'bg-green-500' :
                        showResult && index === selectedAnswer && !answers[answers.length - 1]?.isCorrect ? 'bg-red-500' :
                        selectedAnswer === index ? 'bg-blue-500' : 'bg-slate-600'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1">{option}</span>
                      {showResult && index === currentQuestion.correctIndex && (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      )}
                      {showResult && index === selectedAnswer && !answers[answers.length - 1]?.isCorrect && (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showResult && (
              <div className="mt-6 p-4 bg-slate-700/50 rounded-xl">
                <p className="text-sm text-gray-300">
                  <span className="font-bold text-blue-400">解析：</span>
                  {currentQuestion?.explanation}
                </p>
              </div>
            )}
          </div>

          <button
            onClick={showResult ? nextQuestion : submitAnswer}
            disabled={!showResult && selectedAnswer === null}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
              !showResult && selectedAnswer === null 
                ? 'bg-slate-700 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400'
            }`}
          >
            {showResult ? (currentIndex < questions.length - 1 ? '下一题' : '查看结果') : '确认答案'}
          </button>
        </div>
      </main>
    </div>
  );
};