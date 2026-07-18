import { useEffect, useState, useRef } from 'react';
import { Dialog } from '../../data/stories';

interface DialogBoxProps {
  dialog: Dialog;
  onComplete: () => void;
  skipMode?: boolean;
  textSpeed?: number;
  onTypingChange?: (typing: boolean) => void;
}

// 角色像素风格配置 - 每个角色都有独特的配色和样式
const avatarConfigs: Record<string, { 
  bgFrom: string; 
  bgTo: string; 
  text: string; 
  borderColor: string;
  pattern: string;
}> = {
  '吾尔肯': { 
    bgFrom: 'from-green-500', 
    bgTo: 'to-green-700', 
    text: '吾', 
    borderColor: 'border-green-400',
    pattern: 'football'
  },
  '吴志鸣': { 
    bgFrom: 'from-blue-500', 
    bgTo: 'to-blue-700', 
    text: '吴', 
    borderColor: 'border-blue-400',
    pattern: 'crown'
  },
  '肖潇': { 
    bgFrom: 'from-red-500', 
    bgTo: 'to-red-700', 
    text: '肖', 
    borderColor: 'border-red-400',
    pattern: 'ball'
  },
  '欧翔': { 
    bgFrom: 'from-yellow-500', 
    bgTo: 'to-yellow-700', 
    text: '欧', 
    borderColor: 'border-yellow-400',
    pattern: 'shield'
  },
  '吴杨楚涵': { 
    bgFrom: 'from-purple-500', 
    bgTo: 'to-purple-700', 
    text: '吴', 
    borderColor: 'border-purple-400',
    pattern: 'book'
  },
  '阿负': { 
    bgFrom: 'from-orange-500', 
    bgTo: 'to-orange-700', 
    text: '阿', 
    borderColor: 'border-orange-400',
    pattern: 'heart'
  },
  '王楷硕': { 
    bgFrom: 'from-orange-500', 
    bgTo: 'to-orange-700', 
    text: '王', 
    borderColor: 'border-orange-400',
    pattern: 'star'
  },
  '伍彦名': { 
    bgFrom: 'from-teal-500', 
    bgTo: 'to-teal-700', 
    text: '伍', 
    borderColor: 'border-teal-400',
    pattern: 'glove'
  },
  '谭琦': { 
    bgFrom: 'from-cyan-500', 
    bgTo: 'to-cyan-700', 
    text: '谭', 
    borderColor: 'border-cyan-400',
    pattern: 'lightning'
  },
  '钱文伟': { 
    bgFrom: 'from-gray-600', 
    bgTo: 'to-gray-800', 
    text: '钱', 
    borderColor: 'border-gray-400',
    pattern: 'muscle'
  },
  '洛桑罗布': { 
    bgFrom: 'from-gray-300', 
    bgTo: 'to-gray-500', 
    text: '洛', 
    borderColor: 'border-gray-300',
    pattern: 'foot'
  },
  '戴红焰': { 
    bgFrom: 'from-red-600', 
    bgTo: 'to-red-800', 
    text: '戴', 
    borderColor: 'border-red-600',
    pattern: 'whistle'
  },
  '赵凌冬': { 
    bgFrom: 'from-blue-600', 
    bgTo: 'to-blue-800', 
    text: '赵', 
    borderColor: 'border-blue-600',
    pattern: 'board'
  },
  '刘俊哲': { 
    bgFrom: 'from-indigo-500', 
    bgTo: 'to-indigo-700', 
    text: '刘', 
    borderColor: 'border-indigo-400',
    pattern: 'midfield'
  },
  '队长': { 
    bgFrom: 'from-red-500', 
    bgTo: 'to-red-700', 
    text: '队', 
    borderColor: 'border-red-400',
    pattern: 'armband'
  },
  '教练': { 
    bgFrom: 'from-gray-600', 
    bgTo: 'to-gray-800', 
    text: '教', 
    borderColor: 'border-gray-500',
    pattern: 'coach'
  },
  '队友': { 
    bgFrom: 'from-green-500', 
    bgTo: 'to-green-700', 
    text: '队', 
    borderColor: 'border-green-400',
    pattern: 'team'
  },
  '解说': { 
    bgFrom: 'from-yellow-500', 
    bgTo: 'to-yellow-700', 
    text: '解', 
    borderColor: 'border-yellow-400',
    pattern: 'mic'
  },
  '全队': { 
    bgFrom: 'from-green-500', 
    bgTo: 'to-green-700', 
    text: '全', 
    borderColor: 'border-green-400',
    pattern: 'trophy'
  },
  '旁白': { 
    bgFrom: 'from-gray-500', 
    bgTo: 'to-gray-700', 
    text: '旁', 
    borderColor: 'border-gray-400',
    pattern: 'scroll'
  },
  'default': { 
    bgFrom: 'from-green-500', 
    bgTo: 'to-green-700', 
    text: '?', 
    borderColor: 'border-green-400',
    pattern: 'question'
  }
};

// 像素图案组件
const PixelPattern = ({ pattern, color }: { pattern: string; color: string }) => {
  const patterns: Record<string, JSX.Element> = {
    football: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <circle cx="16" cy="16" r="14" fill={color} />
        <path d="M16 2 L16 30 M2 16 L30 16 M5 5 L27 27 M27 5 L5 27" stroke="white" strokeWidth="1" />
      </svg>
    ),
    crown: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <path d="M4 24 L4 12 L10 18 L16 8 L22 18 L28 12 L28 24 Z" fill={color} />
        <rect x="4" y="24" width="24" height="4" fill={color} />
      </svg>
    ),
    ball: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <circle cx="16" cy="16" r="12" fill={color} />
        <path d="M8 12 Q16 8 24 12 Q20 16 24 20 Q16 24 8 20 Q12 16 8 12" fill="white" />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <path d="M16 2 L28 8 L28 18 Q28 28 16 30 Q4 28 4 18 L4 8 Z" fill={color} />
      </svg>
    ),
    book: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <rect x="6" y="4" width="20" height="24" fill={color} />
        <line x1="16" y1="4" x2="16" y2="28" stroke="white" strokeWidth="2" />
      </svg>
    ),
    heart: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <path d="M16 28 Q4 18 4 10 Q4 4 10 4 Q14 4 16 8 Q18 4 22 4 Q28 4 28 10 Q28 18 16 28" fill={color} />
      </svg>
    ),
    star: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <path d="M16 2 L19 12 L30 12 L21 19 L24 30 L16 23 L8 30 L11 19 L2 12 L13 12 Z" fill={color} />
      </svg>
    ),
    glove: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <path d="M8 28 L8 12 Q8 6 14 6 L14 8 L18 8 L18 6 Q24 6 24 12 L24 28 Z" fill={color} />
      </svg>
    ),
    lightning: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <path d="M20 2 L8 18 L14 18 L12 30 L24 14 L18 14 L20 2" fill={color} />
      </svg>
    ),
    muscle: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <path d="M6 20 Q2 14 6 10 Q10 6 16 10 Q22 6 26 10 Q30 14 26 20 Q22 26 16 22 Q10 26 6 20" fill={color} />
      </svg>
    ),
    foot: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <ellipse cx="14" cy="20" rx="10" ry="8" fill={color} />
        <circle cx="8" cy="10" r="4" fill={color} />
      </svg>
    ),
    whistle: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <ellipse cx="14" cy="16" rx="10" ry="8" fill={color} />
        <rect x="24" y="12" width="6" height="8" fill={color} />
      </svg>
    ),
    board: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <rect x="4" y="4" width="24" height="24" fill={color} />
        <line x1="16" y1="4" x2="16" y2="28" stroke="white" strokeWidth="1" />
        <line x1="4" y1="14" x2="28" y2="14" stroke="white" strokeWidth="1" />
      </svg>
    ),
    midfield: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <circle cx="16" cy="16" r="12" fill="none" stroke={color} strokeWidth="2" />
        <circle cx="16" cy="16" r="4" fill={color} />
      </svg>
    ),
    armband: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <rect x="10" y="8" width="12" height="16" fill={color} />
        <text x="16" y="18" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">C</text>
      </svg>
    ),
    coach: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <rect x="12" y="20" width="8" height="10" fill={color} />
        <rect x="8" y="4" width="16" height="12" fill={color} />
      </svg>
    ),
    team: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <circle cx="10" cy="10" r="4" fill={color} />
        <circle cx="22" cy="10" r="4" fill={color} />
        <circle cx="16" cy="6" r="4" fill={color} />
        <rect x="6" y="16" width="8" height="12" fill={color} />
        <rect x="18" y="16" width="8" height="12" fill={color} />
        <rect x="12" y="12" width="8" height="16" fill={color} />
      </svg>
    ),
    mic: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <rect x="10" y="4" width="12" height="18" rx="6" fill={color} />
        <path d="M6 16 Q6 26 16 26 Q26 26 26 16" fill="none" stroke={color} strokeWidth="2" />
        <line x1="16" y1="26" x2="16" y2="30" stroke={color} strokeWidth="2" />
      </svg>
    ),
    trophy: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <rect x="10" y="20" width="12" height="8" fill={color} />
        <path d="M8 4 L8 14 Q8 20 16 20 Q24 20 24 14 L24 4 Z" fill={color} />
        <path d="M8 8 L4 8 L4 12 Q4 16 8 16" fill={color} />
        <path d="M24 8 L28 8 L28 12 Q28 16 24 16" fill={color} />
      </svg>
    ),
    scroll: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <rect x="6" y="4" width="20" height="24" fill={color} />
        <circle cx="6" cy="4" r="2" fill={color} />
        <circle cx="26" cy="4" r="2" fill={color} />
        <circle cx="6" cy="28" r="2" fill={color} />
        <circle cx="26" cy="28" r="2" fill={color} />
      </svg>
    ),
    question: (
      <svg viewBox="0 0 32 32" className="w-full h-full opacity-30">
        <text x="16" y="24" textAnchor="middle" fill={color} fontSize="24" fontWeight="bold">?</text>
      </svg>
    )
  };

  return patterns[pattern] || patterns.question;
};

const emotionColors: Record<string, string> = {
  'happy': 'text-yellow-400',
  'sad': 'text-blue-400',
  'angry': 'text-red-400',
  'excited': 'text-green-400',
  'confident': 'text-cyan-400',
  'determined': 'text-cyan-400',
  'serious': 'text-orange-400',
  'tense': 'text-orange-400',
  'encouraging': 'text-purple-400',
  'nostalgic': 'text-blue-400',
  'kind': 'text-purple-400',
  'wise': 'text-purple-400',
  'grateful': 'text-yellow-400',
  'hopeful': 'text-yellow-400',
  'significant': 'text-green-400',
  'respectful': 'text-purple-400',
  'discouraged': 'text-red-400',
  'nervous': 'text-pink-400',
  'neutral': 'text-white',
  'surprised': 'text-yellow-400',
  'emotional': 'text-pink-400',
  'passionate': 'text-red-400',
  'calm': 'text-blue-400',
  'focused': 'text-cyan-400',
  'curious': 'text-purple-400',
};

const emotionEmojis: Record<string, string> = {
  'happy': '✨',
  'sad': '💧',
  'angry': '💢',
  'excited': '🔥',
  'confident': '💪',
  'determined': '⚡',
  'serious': '🎯',
  'tense': '⚠️',
  'encouraging': '💚',
  'nostalgic': '📼',
  'kind': '💚',
  'wise': '📚',
  'grateful': '✨',
  'hopeful': '✨',
  'significant': '⭐',
  'respectful': '🙏',
  'discouraged': '😔',
  'nervous': '😰',
  'neutral': '💬',
  'surprised': '😲',
  'emotional': '🥺',
  'passionate': '🔥',
  'calm': '😌',
  'focused': '🧐',
  'curious': '🤔',
};

export const DialogBox = ({ dialog, onComplete, skipMode = false, textSpeed = 50, onTypingChange }: DialogBoxProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const completedRef = useRef(false);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    completedRef.current = false;

    // If skip mode, immediately show full text
    if (skipMode) {
      setDisplayedText(dialog.text);
      setIsTyping(false);
      onTypingChange?.(false);
      return;
    }

    onTypingChange?.(true);
    let index = 0;
    const timer = setInterval(() => {
      if (index < dialog.text.length) {
        setDisplayedText(dialog.text.slice(0, index + 1));
        index++;
      } else {
        setIsTyping(false);
        onTypingChange?.(false);
        clearInterval(timer);
      }
    }, textSpeed);

    return () => clearInterval(timer);
  }, [dialog.text, skipMode]); // eslint-disable-line react-hooks/exhaustive-deps

  // If skipMode turns on while typing, complete immediately
  useEffect(() => {
    if (skipMode && isTyping) {
      setDisplayedText(dialog.text);
      setIsTyping(false);
      onTypingChange?.(false);
    }
  }, [skipMode]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const cursorTimer = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 600);
    return () => clearInterval(cursorTimer);
  }, []);

  const handleClick = () => {
    if (isTyping) {
      setDisplayedText(dialog.text);
      setIsTyping(false);
      onTypingChange?.(false);
    } else if (!completedRef.current) {
      completedRef.current = true;
      onComplete();
    }
  };

  const getAvatarConfig = () => {
    return avatarConfigs[dialog.speaker] || avatarConfigs['default'];
  };

  const isNarrator = dialog.speaker === '旁白';
  const emotion = dialog.emotion || 'neutral';
  const colorClass = emotionColors[emotion] || emotionColors['neutral'];
  const emoji = emotionEmojis[emotion] || emotionEmojis['neutral'];
  const avatarConfig = getAvatarConfig();

  return (
    <div
      onClick={handleClick}
      className="pixel-dialog w-full rounded-xl p-6 cursor-pointer relative overflow-hidden pixel-pop-in"
    >
      <div className="pixel-corner pixel-corner-tl"></div>
      <div className="pixel-corner pixel-corner-tr"></div>
      <div className="pixel-corner pixel-corner-bl"></div>
      <div className="pixel-corner pixel-corner-br"></div>

      <div className="flex items-start gap-6">
        {!isNarrator && (
          <div className="relative flex-shrink-0">
            {/* 像素风格头像容器 */}
            <div className="w-32 h-32 rounded-lg relative shadow-2xl overflow-hidden">
              {/* 背景渐变 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${avatarConfig.bgFrom} ${avatarConfig.bgTo}`}>
                {/* 像素网格背景 */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-16 grid-rows-16 w-full h-full">
                    {Array.from({ length: 256 }).map((_, i) => (
                      <div 
                        key={i} 
                        className={`border border-white/10 ${(Math.floor(i / 16) + i % 16) % 3 === 0 ? 'bg-white/20' : ''}`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* 像素图案装饰 */}
                <div className="absolute inset-2">
                  <PixelPattern pattern={avatarConfig.pattern} color="white" />
                </div>
              </div>
              
              {/* 角色首字母 */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <span className="text-5xl font-black text-white pixel-text drop-shadow-2xl animate-pulse tracking-wider"
                      style={{
                        textShadow: '2px 2px 0 rgba(0,0,0,0.5), -2px -2px 0 rgba(0,0,0,0.5)',
                        transform: 'scale(1)'
                      }}>
                  {avatarConfig.text}
                </span>
              </div>
              
              {/* 外边框 */}
              <div className={`absolute inset-0 border-4 ${avatarConfig.borderColor} rounded-lg`}></div>
              <div className="absolute inset-0 border-2 border-black/50 rounded-lg pointer-events-none"></div>
              
              {/* 像素角落装饰 */}
              <div className="absolute -top-0.5 -left-0.5 w-3 h-3 bg-yellow-400 border border-black"></div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-400 border border-black"></div>
              <div className="absolute -bottom-0.5 -left-0.5 w-3 h-3 bg-yellow-400 border border-black"></div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-yellow-400 border border-black"></div>
            </div>
            
            {/* 表情徽章 */}
            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-2xl border-4 border-white shadow-2xl pixel-bounce animate-bounce z-20">
              {emoji}
            </div>
            
            {/* 角色名标签 */}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-green-600 to-green-800 rounded-lg text-xs text-white font-bold whitespace-nowrap border-2 border-green-400 shadow-xl z-20">
              <span className="pixel-text tracking-wider text-xs">
                {dialog.speaker.length > 6 ? dialog.speaker.slice(0, 6) + '..' : dialog.speaker}
              </span>
            </div>
          </div>
        )}
        
        <div className={`flex-1 ${!isNarrator ? 'mt-2' : ''}`}>
          {!isNarrator && (
            <div className="flex items-center gap-3 mb-4">
              <span className={`text-sm font-bold ${colorClass} pixel-text`} style={{ fontSize: '12px' }}>
                {dialog.speaker}
              </span>
              <div className="flex-1 h-1 bg-gradient-to-r from-green-500/50 via-yellow-500/30 to-transparent rounded-full"></div>
              <span className="text-xs text-gray-500 pixel-text">
                {emoji}
              </span>
            </div>
          )}
          
          <div className={`relative ${isNarrator ? 'bg-gray-800/50 rounded-lg p-4 border-2 border-gray-700' : ''}`}>
            {isNarrator && (
              <div className="absolute -top-3 left-4 px-3 bg-gray-800 text-gray-400 text-xs pixel-text">
                📖 旁白
              </div>
            )}
            <p className={`text-sm leading-relaxed pixel-text ${isNarrator ? 'text-gray-300 italic' : 'text-white'}`} style={{ fontSize: '10px', lineHeight: '2' }}>
              {displayedText}
              {isTyping && (
                <span className={`inline-block w-3 h-5 bg-green-400 ml-1 ${showCursor ? 'opacity-100' : 'opacity-0'}`}>
                </span>
              )}
            </p>
          </div>
        </div>
        
        {!isTyping && (
          <div className="flex flex-col items-center gap-1 animate-pulse flex-shrink-0">
            <span className="text-yellow-400 text-2xl">▶</span>
            <span className="text-xs text-gray-500 pixel-text" style={{ fontSize: '8px' }}>点击继续</span>
          </div>
        )}
      </div>

      {isTyping && (
        <div className="mt-4 flex items-center gap-2">
          <div className="flex-1 h-3 pixel-progress rounded-full overflow-hidden">
            <div 
              className="h-full pixel-progress-bar transition-all duration-100"
              style={{ width: `${(displayedText.length / dialog.text.length) * 100}%` }}
            />
          </div>
          <span className="text-xs text-gray-500 pixel-text font-mono" style={{ fontSize: '8px' }}>
            {Math.round((displayedText.length / dialog.text.length) * 100)}%
          </span>
        </div>
      )}
    </div>
  );
};
