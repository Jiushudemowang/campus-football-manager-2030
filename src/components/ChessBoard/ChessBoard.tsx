import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FootballBoard,
  Position,
  BoardPiece,
  GameAction,
  AIDifficulty,
  getValidMovePositions,
  getValidPassTargets,
  getValidShootTargets,
  getValidTackleTargets,
  initializeBoard3v3,
  initializeBoard9v9,
  initializeBoard11v11,
  initializeBoardWithAIOpponent,
  isWhiteGoal,
  isBlackGoal,
  getPieceTypeName,
  getRoleName,
  getMovementRange,
  getShootingRange,
  getPassingRange,
  executeRound,
  switchPlayerControl
} from '../../data/chessRules';
import { decideAIAction } from '../../data/aiEngine';
import { campusPlayers, getCampusPlayerById } from '../../data/campusPlayers';
import { starPlayers, findBestMatchingStar } from '../../data/starPlayers';
import { aiOpponentTeams, getAIOpponentTeamById, getAIOpponentStats } from '../../data/aiOpponents';
import { RadarChart } from '../RadarChart';
import { useGameStore } from '../../stores/gameStore';
import { MatchRecord, PlayerStatsSlice, applyBoosts } from '../../data/playerTypes';
import {
  Trophy,
  RotateCcw,
  Shield,
  Swords,
  Bot,
  Home,
  History,
  UserCog,
  Move,
  Target,
  Footprints,
  CircleOff,
  Zap,
  Heart,
  Users,
  Clock
} from 'lucide-react';

interface ChessBoardProps {
  onBack?: () => void;
  activeSquadIds?: string[];
  aiTeamId?: string;
  gameMode?: '3v3' | '9v9' | '11v11';
}

type UIMode = 'idle' | 'selectingMove' | 'selectingPass' | 'selectingShoot' | 'selectingTackle' | 'selectingSkill';

export const ChessBoard = ({ onBack, activeSquadIds, aiTeamId, gameMode = '3v3' }: ChessBoardProps) => {
  const aiTeam = useMemo(() => {
    if (aiTeamId) {
      return getAIOpponentTeamById(aiTeamId);
    }
    return aiOpponentTeams[0];
  }, [aiTeamId]);

  const createBoard = (): FootballBoard => {
    if (aiTeam && activeSquadIds && activeSquadIds.length >= 3) {
      return initializeBoardWithAIOpponent(activeSquadIds, aiTeam, gameMode);
    }
    switch (gameMode) {
      case '9v9':
        return initializeBoard9v9(activeSquadIds);
      case '11v11':
        return initializeBoard11v11(activeSquadIds);
      default:
        return initializeBoard3v3(activeSquadIds);
    }
  };

  const [board, setBoard] = useState<FootballBoard>(createBoard);
  const [uiMode, setUiMode] = useState<UIMode>('idle');
  const [validMoves, setValidMoves] = useState<Position[]>([]);
  const [validPassTargets, setValidPassTargets] = useState<BoardPiece[]>([]);
  const [validShootTargets, setValidShootTargets] = useState<Position[]>([]);
  const [validTackleTargets, setValidTackleTargets] = useState<BoardPiece[]>([]);
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>(aiTeam?.difficulty === 'legendary' ? 'hard' : aiTeam?.difficulty === 'hard' ? 'normal' : 'normal');
  const [matchEnded, setMatchEnded] = useState(false);
  const [lastMatchRecord, setLastMatchRecord] = useState<MatchRecord | null>(null);

  const navigate = useNavigate();
  const getPlayerGrowthState = useGameStore((s) => s.getPlayerGrowthState);
  const updatePlayerGrowthState = useGameStore((s) => s.updatePlayerGrowthState);
  const addMatchRecord = useGameStore((s) => s.addMatchRecord);
  const activeSquad = useGameStore((s) => s.activeSquad);

  const playerStats = useMemo(() => {
    const stats: Record<string, PlayerStatsSlice> = { ...getAIOpponentStats(aiTeam) };
    [...campusPlayers, ...starPlayers].forEach((p) => {
      const growth = getPlayerGrowthState(p.id);
      stats[p.id] = applyBoosts(p.stats, growth.statBoosts);
    });
    return stats;
  }, [getPlayerGrowthState, aiTeam]);

  const controlledPiece = useMemo(() => {
    if (!board.playerControlledId) return null;
    return board.pieces.find((p) => p.id === board.playerControlledId) || null;
  }, [board.pieces, board.playerControlledId]);

  useEffect(() => {
    if (matchEnded) return;
    const ended = board.whiteScore >= 3 || board.blackScore >= 3 || board.turnCount >= 120;
    if (!ended) return;

    let result: 'win' | 'lose' | 'draw';
    if (board.whiteScore > board.blackScore) result = 'win';
    else if (board.whiteScore < board.blackScore) result = 'lose';
    else result = 'draw';

    const goalScorerIds: string[] = [];
    board.moveHistory.forEach((log) => {
      const match = log.match(/⚽\s+(.+?)\s+进球/);
      if (match) {
        const scorerIdOrName = match[1];
        const player = campusPlayers.find(
          (p) => p.id === scorerIdOrName || p.name === scorerIdOrName
        );
        if (player) goalScorerIds.push(player.id);
      }
    });

    const squadIds = activeSquadIds?.length >= (gameMode === '3v3' ? 3 : 8) ? activeSquadIds : (activeSquad?.playerIds || []);
    const rewards: string[] = [];
    if (result === 'win') rewards.push('胜利奖励: 50 成长点');
    else if (result === 'draw') rewards.push('平局奖励: 20 成长点');
    else rewards.push('参与奖励: 10 成长点');

    squadIds.forEach((id) => {
      const growth = getPlayerGrowthState(id);
      const goals = goalScorerIds.filter((sid) => sid === id).length;
      const gpReward = result === 'win' ? 50 : result === 'draw' ? 20 : 10;
      updatePlayerGrowthState(id, {
        matchesPlayed: growth.matchesPlayed + 1,
        goalsScored: growth.goalsScored + goals,
        growthPoints: growth.growthPoints + gpReward
      });
    });

    const record: MatchRecord = {
      id: `match_${Date.now()}`,
      timestamp: Date.now(),
      opponent: 'AI 传奇队',
      whiteScore: board.whiteScore,
      blackScore: board.blackScore,
      result,
      activeSquadIds: squadIds,
      goalScorerIds,
      turnCount: board.turnCount,
      rewards
    };

    addMatchRecord(record);
    setLastMatchRecord(record);
    setMatchEnded(true);
  }, [board, matchEnded, activeSquadIds, activeSquad, getPlayerGrowthState, updatePlayerGrowthState, addMatchRecord, gameMode]);

  const getPieceAt = (pos: Position): BoardPiece | undefined =>
    board.pieces.find((p) => p.position.row === pos.row && p.position.col === pos.col);

  const clearHighlights = () => {
    setValidMoves([]);
    setValidPassTargets([]);
    setValidShootTargets([]);
    setValidTackleTargets([]);
  };

  const clearHighlightsExcept = (mode: 'move' | 'pass' | 'shoot' | 'tackle') => {
    if (mode !== 'move') setValidMoves([]);
    if (mode !== 'pass') setValidPassTargets([]);
    if (mode !== 'shoot') setValidShootTargets([]);
    if (mode !== 'tackle') setValidTackleTargets([]);
  };

  const isPlayerInput = board.roundState === 'playerInput';
  const isExecuting = board.roundState === 'executing' || board.roundState === 'aiThinking';

  const submitPlayerAction = (action: GameAction | null) => {
    if (!isPlayerInput || isExecuting) return;

    setUiMode('idle');
    clearHighlights();

    const thinkingBoard = { ...board, roundState: 'aiThinking' as const };
    setBoard(thinkingBoard);

    setTimeout(() => {
      setBoard((currentBoard) =>
        executeRound(currentBoard, action, playerStats, aiDifficulty, decideAIAction)
      );
    }, 500);
  };

  const handleCellClick = (pos: Position) => {
    if (!isPlayerInput || isExecuting) return;

    const clickedPiece = getPieceAt(pos);

    if (
      uiMode === 'idle' &&
      clickedPiece &&
      clickedPiece.team === 'white' &&
      !clickedPiece.hasActed &&
      clickedPiece.id !== board.playerControlledId
    ) {
      const newBoard = switchPlayerControl(board, clickedPiece.id);
      setBoard(newBoard);
      return;
    }

    if (
      uiMode === 'idle' &&
      clickedPiece &&
      clickedPiece.id === board.playerControlledId
    ) {
      const moves = getValidMovePositions(clickedPiece, board.pieces, playerStats);
      setValidMoves(moves);
      setUiMode('selectingMove');
      return;
    }

    if (uiMode === 'selectingMove' && controlledPiece) {
      const isValidMove = validMoves.some((m) => m.row === pos.row && m.col === pos.col);
      if (isValidMove) {
        submitPlayerAction({
          type: 'move',
          pieceId: controlledPiece.id,
          targetPosition: pos
        });
      }
      return;
    }

    if (uiMode === 'selectingPass' && controlledPiece) {
      const target = validPassTargets.find(
        (p) => p.position.row === pos.row && p.position.col === pos.col
      );
      if (target) {
        submitPlayerAction({
          type: 'pass',
          pieceId: controlledPiece.id,
          targetPieceId: target.id
        });
      }
      return;
    }

    if (uiMode === 'selectingShoot' && controlledPiece) {
      const isValidShoot = validShootTargets.some(
        (t) => t.row === pos.row && t.col === pos.col
      );
      if (isValidShoot) {
        submitPlayerAction({
          type: 'shoot',
          pieceId: controlledPiece.id,
          targetPosition: pos
        });
      }
      return;
    }

    if (uiMode === 'selectingTackle' && controlledPiece) {
      const target = validTackleTargets.find(
        (p) => p.position.row === pos.row && p.position.col === pos.col
      );
      if (target) {
        submitPlayerAction({
          type: 'tackle',
          pieceId: controlledPiece.id,
          targetPieceId: target.id
        });
      }
      return;
    }
  };

  const startSelectAction = (actionType: 'pass' | 'shoot' | 'tackle') => {
    if (!controlledPiece || !isPlayerInput) return;

    clearHighlights();
    if (actionType === 'pass') {
      const targets = getValidPassTargets(controlledPiece, board.pieces, playerStats);
      setValidPassTargets(targets);
      setUiMode('selectingPass');
    } else if (actionType === 'shoot') {
      const targets = getValidShootTargets(controlledPiece, board.pieces, playerStats);
      setValidShootTargets(targets);
      setUiMode('selectingShoot');
    } else if (actionType === 'tackle') {
      const targets = getValidTackleTargets(controlledPiece, board.pieces, board.ballCarrierId);
      setValidTackleTargets(targets);
      setUiMode('selectingTackle');
    }
  };

  const handleUseSkill = () => {
    if (!controlledPiece || !isPlayerInput) return;

    const player = getCampusPlayerById(controlledPiece.playerId);
    if (!player?.uniqueSkill) return;

    if (controlledPiece.skillCooldown > 0) return;
    if (controlledPiece.stamina.currentStamina < player.uniqueSkill.staminaCost) return;

    submitPlayerAction({
      type: 'skill',
      pieceId: controlledPiece.id,
      skillId: player.uniqueSkill.id
    });
  };

  const handleEndTurn = () => {
    if (!controlledPiece) return;
    // 标记当前球员已行动，然后结束己方回合
    const markedBoard = {
      ...board,
      pieces: board.pieces.map((p) =>
        p.id === controlledPiece.id ? { ...p, hasActed: true } : p
      )
    };
    setBoard(markedBoard);
    submitPlayerAction({ type: 'end', pieceId: controlledPiece.id });
  };

  const handleSwitchControl = (pieceId: string) => {
    if (!isPlayerInput || isExecuting) return;
    const piece = board.pieces.find((p) => p.id === pieceId);
    if (!piece || piece.hasActed) return;
    const newBoard = switchPlayerControl(board, pieceId);
    setBoard(newBoard);
    setUiMode('idle');
    clearHighlights();
  };

  const handleReset = () => {
    setBoard(createBoard());
    clearHighlights();
    setUiMode('idle');
    setMatchEnded(false);
    setLastMatchRecord(null);
  };

  const getCellColor = (row: number, col: number): string => {
    if (isWhiteGoal({ row, col })) return 'bg-red-900/60 border-red-500';
    if (isBlackGoal({ row, col })) return 'bg-blue-900/60 border-blue-500';
    return (row + col) % 2 === 0 ? 'bg-green-700/40' : 'bg-green-800/50';
  };

  const getPiecePlayer = (piece: BoardPiece) => {
    return getCampusPlayerById(piece.playerId) || starPlayers.find((s) => s.id === piece.playerId);
  };

  const getStaminaColor = (staminaPercent: number): string => {
    if (staminaPercent > 0.6) return 'bg-green-500';
    if (staminaPercent > 0.3) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStateText = () => {
    const remainingWhite = board.pieces.filter((p) => p.team === 'white' && !p.hasActed).length;
    switch (board.roundState) {
      case 'playerInput':
        if (uiMode === 'idle') return `还可操作 ${remainingWhite} 名己方球员，点击未行动球员或动作按钮`;
        if (uiMode === 'selectingMove') return '选择移动位置';
        if (uiMode === 'selectingPass') return '选择传球目标';
        if (uiMode === 'selectingShoot') return '选择射门目标';
        if (uiMode === 'selectingTackle') return '选择抢断目标';
        if (uiMode === 'selectingSkill') return '选择技能';
        return '等待玩家指令';
      case 'aiThinking':
        return 'AI 思考中...';
      case 'executing':
        return '执行中...';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900 text-white p-4">
      <header className="max-w-4xl mx-auto mb-4 flex flex-wrap items-center justify-between gap-4 bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="text-sm text-gray-400 hover:text-green-400 transition-colors"
            >
              ← 返回
            </button>
          )}
          <Trophy className="w-6 h-6 text-yellow-400" />
          <span className="font-bold pixel-text">校园足球棋盘战</span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <div className="text-xs text-gray-400">白队（校园）</div>
            <div className="text-2xl font-bold text-white">{board.whiteScore}</div>
          </div>
          <div className="text-xl font-bold text-gray-500">:</div>
          <div className="text-center">
            <div className="text-xs text-gray-400">黑队（AI 传奇）</div>
            <div className="text-2xl font-bold text-white">{board.blackScore}</div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-xs text-green-400 font-bold">{gameMode}</span>
          </div>
          <Bot className="w-4 h-4 text-green-400" />
          <select
            value={aiDifficulty}
            onChange={(e) => setAiDifficulty(e.target.value as AIDifficulty)}
            className="text-xs bg-slate-700 border border-slate-600 rounded px-2 py-1.5 text-white focus:border-green-500 focus:outline-none"
            disabled={isExecuting}
          >
            <option value="easy">简单</option>
            <option value="normal">普通</option>
            <option value="hard">困难</option>
          </select>
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-bold transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            重开
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="relative bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="grid grid-cols-8 gap-1 aspect-square max-w-2xl mx-auto">
              {Array.from({ length: 64 }, (_, i) => {
                const row = Math.floor(i / 8);
                const col = i % 8;
                const pos = { row, col };
                const piece = getPieceAt(pos);
                const isBallOnGround = board.ballCarrierId === null && 
                  board.ballPosition.row === row && board.ballPosition.col === col;
                const isControlled = piece?.id === board.playerControlledId;

                const isValidMove =
                  uiMode === 'selectingMove' &&
                  validMoves.some((m) => m.row === row && m.col === col);
                const isPassTarget =
                  uiMode === 'selectingPass' &&
                  validPassTargets.some((p) => p.position.row === row && p.position.col === col);
                const isShootTarget =
                  uiMode === 'selectingShoot' &&
                  validShootTargets.some((t) => t.row === row && t.col === col);
                const isTackleTarget =
                  uiMode === 'selectingTackle' &&
                  validTackleTargets.some((p) => p.position.row === row && p.position.col === col);

                return (
                  <button
                    key={i}
                    onClick={() => handleCellClick(pos)}
                    disabled={isExecuting}
                    className={`
                      relative aspect-square rounded-md border-2 transition-all duration-150 flex items-center justify-center
                      ${getCellColor(row, col)}
                      ${isValidMove ? 'ring-2 ring-green-400 ring-offset-1 ring-offset-slate-900 animate-pulse' : ''}
                      ${isPassTarget ? 'ring-2 ring-blue-400 ring-offset-1 ring-offset-slate-900 animate-pulse' : ''}
                      ${isShootTarget ? 'ring-2 ring-red-400 ring-offset-1 ring-offset-slate-900 animate-pulse' : ''}
                      ${isTackleTarget ? 'ring-2 ring-orange-400 ring-offset-1 ring-offset-slate-900 animate-pulse' : ''}
                      ${isControlled ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-slate-900' : ''}
                      ${isExecuting ? 'cursor-not-allowed opacity-80' : 'hover:brightness-110'}
                    `}
                  >
                    {isBallOnGround && (
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <div className="relative">
                          <div className="absolute inset-0 bg-green-400 rounded-full blur-md opacity-50 animate-pulse" />
                          <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-white via-green-50 to-white border-2 border-black shadow-xl flex items-center justify-center transform transition-transform duration-150 hover:scale-110">
                            <div className="absolute inset-0 rounded-full border-2 border-green-600/30" />
                            <div className="absolute top-1 left-1 w-2 h-2 rounded-full bg-green-600/40" />
                            <div className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-green-600/40" />
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                              <span className="text-sm md:text-base">⚽</span>
                            </div>
                          </div>
                          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-2 bg-black/30 rounded-full blur-sm" />
                        </div>
                      </div>
                    )}

                    {piece && (
                      <div className="relative z-10 flex flex-col items-center">
                        <div
                          className={`
                            w-9 h-9 md:w-11 md:h-11 rounded-full border-2 flex flex-col items-center justify-center text-xs font-bold shadow-lg relative
                            ${piece.hasActed ? 'opacity-50' : ''}
                            ${piece.team === 'white'
                              ? 'bg-white text-slate-900 border-green-500'
                              : 'bg-slate-900 text-white border-orange-500'
                            }
                            ${piece.hasBall ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-slate-800' : ''}
                          `}
                        >
                          <span className="text-[9px] md:text-[11px]">{getPieceTypeName(piece.pieceType)[0]}</span>
                          {piece.hasBall && (
                            <div className="absolute -top-2 -right-2 w-5 h-5 md:w-6 md:h-6 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white shadow-lg flex items-center justify-center animate-bounce">
                              <span className="text-[10px] md:text-xs">⚽</span>
                            </div>
                          )}
                        </div>
                        {piece.team === 'white' && (
                          <div className="w-7 h-1 mt-0.5 bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getStaminaColor(piece.stamina.currentStamina / piece.stamina.maxStamina)} transition-all duration-300`}
                              style={{ width: `${(piece.stamina.currentStamina / piece.stamina.maxStamina) * 100}%` }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {isExecuting && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/30 rounded-xl">
                <div className="bg-slate-900/90 border border-green-500/50 rounded-xl px-6 py-4 text-center">
                  <Bot className="w-8 h-8 mx-auto mb-2 text-green-400 animate-bounce" />
                  <div className="font-bold text-white">{getStateText()}</div>
                </div>
              </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-white border-2 border-yellow-400"></div>
                <span>当前控制</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-white border border-green-500"></div>
                <span>白队</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-900 border border-orange-500"></div>
                <span>黑队</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-400"></div>
                <span>移动</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-400"></div>
                <span>传球</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-400"></div>
                <span>射门</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-400"></div>
                <span>抢断</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span>体力条</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-sm text-gray-400 mb-2">当前状态</div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  board.roundState === 'playerInput' ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
                }`}
              />
              <span className="font-bold">
                {board.roundState === 'playerInput' ? '轮到你行动' : 'AI 思考中...'}
              </span>
            </div>
            <div className="text-xs text-gray-500">第 {board.turnCount + 1} 回合</div>
            <div className="mt-2 text-xs text-yellow-400 font-bold">
              {board.roundState === 'playerInput'
                ? `💡 本回合剩余 ${board.pieces.filter((p) => p.team === 'white' && !p.hasActed).length} 名己方球员可操作，点球员切换，点动作按钮执行`
                : getStateText()}
            </div>
          </div>

          {controlledPiece && (
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm text-gray-400">当前控制</div>
                <div className="text-xs px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                  {getRoleName(controlledPiece.role)}
                </div>
              </div>
              {(() => {
                const player = getPiecePlayer(controlledPiece);
                if (!player) return null;
                const match = findBestMatchingStar(player);
                const campusPlayer = getCampusPlayerById(controlledPiece.playerId);
                const staminaPercent = controlledPiece.stamina.currentStamina / controlledPiece.stamina.maxStamina;
                return (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold">
                        {player.name[0]}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold">{player.name}</div>
                        <div className="text-xs text-gray-400">{player.positionCN} · {getPieceTypeName(controlledPiece.pieceType)}</div>
                      </div>
                    </div>

                    <div className="bg-slate-700/50 rounded p-2">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-400">体力</span>
                        <span className={`font-bold ${staminaPercent > 0.6 ? 'text-green-400' : staminaPercent > 0.3 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {controlledPiece.stamina.currentStamina} / {controlledPiece.stamina.maxStamina}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getStaminaColor(staminaPercent)} transition-all duration-300`}
                          style={{ width: `${staminaPercent * 100}%` }}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-700/50 rounded p-2">
                        <div className="text-gray-400">速度 / 移动力</div>
                        <div className="font-bold text-green-400">{player.stats.speed} / {getMovementRange(controlledPiece, playerStats)}格</div>
                      </div>
                      <div className="bg-slate-700/50 rounded p-2">
                        <div className="text-gray-400">射门 / 射程</div>
                        <div className="font-bold text-yellow-400">{player.stats.shooting} / {getShootingRange(controlledPiece, playerStats)}格</div>
                      </div>
                      <div className="bg-slate-700/50 rounded p-2">
                        <div className="text-gray-400">传球 / 射程</div>
                        <div className="font-bold text-blue-400">{player.stats.passing} / {getPassingRange(controlledPiece, playerStats)}格</div>
                      </div>
                      <div className="bg-slate-700/50 rounded p-2">
                        <div className="text-gray-400">防守</div>
                        <div className="font-bold text-red-400">{player.stats.defense}</div>
                      </div>
                    </div>

                    {campusPlayer?.uniqueSkill && (
                      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded p-2 border border-purple-500/30">
                        <div className="flex items-center gap-2 mb-1">
                          <Zap className="w-4 h-4 text-purple-400" />
                          <span className="text-xs font-bold text-purple-400">专属技能</span>
                          {controlledPiece.skillCooldown > 0 && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {controlledPiece.skillCooldown} 回合冷却
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-sm">{campusPlayer.uniqueSkill.name}</div>
                        <div className="text-xs text-gray-400">{campusPlayer.uniqueSkill.description}</div>
                        <div className="text-xs text-gray-500 mt-1">消耗: {campusPlayer.uniqueSkill.staminaCost} 体力</div>
                      </div>
                    )}

                    {'rarity' in player && (
                      <div className="bg-slate-700/50 rounded p-2">
                        <div className="text-xs text-gray-400 mb-1">AI 球星对标</div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-bold text-yellow-400">{match.star.name}</span>
                          <span className="text-xs text-green-400">{match.similarity}% 相似</span>
                        </div>
                        <RadarChart
                          campusPlayer={player as import('../../data/playerTypes').CampusPlayer}
                          starPlayer={match.star}
                          height={160}
                        />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}

          {controlledPiece && isPlayerInput && (
            <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="text-sm text-gray-400 mb-2">选择动作</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    clearHighlightsExcept('move');
                    const moves = getValidMovePositions(controlledPiece, board.pieces, playerStats);
                    setValidMoves(moves);
                    setUiMode('selectingMove');
                  }}
                  disabled={uiMode === 'selectingMove'}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-bold transition-colors ${
                    uiMode === 'selectingMove'
                      ? 'bg-green-500 text-white'
                      : 'bg-green-600/80 hover:bg-green-500 text-white'
                  }`}
                >
                  <Move className="w-3 h-3" /> 移动
                </button>
                <button
                  onClick={() => startSelectAction('pass')}
                  disabled={!controlledPiece.hasBall || uiMode === 'selectingPass'}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-bold transition-colors ${
                    uiMode === 'selectingPass'
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-600/80 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-gray-500 text-white'
                  }`}
                >
                  <Footprints className="w-3 h-3" /> 传球
                </button>
                <button
                  onClick={() => startSelectAction('shoot')}
                  disabled={!controlledPiece.hasBall || uiMode === 'selectingShoot'}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-bold transition-colors ${
                    uiMode === 'selectingShoot'
                      ? 'bg-red-500 text-white'
                      : 'bg-red-600/80 hover:bg-red-500 disabled:bg-slate-700 disabled:text-gray-500 text-white'
                  }`}
                >
                  <Target className="w-3 h-3" /> 射门
                </button>
                <button
                  onClick={() => startSelectAction('tackle')}
                  disabled={uiMode === 'selectingTackle'}
                  className={`flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-bold transition-colors ${
                    uiMode === 'selectingTackle'
                      ? 'bg-orange-500 text-white'
                      : 'bg-orange-600/80 hover:bg-orange-500 disabled:bg-slate-700 disabled:text-gray-500 text-white'
                  }`}
                >
                  <Shield className="w-3 h-3" /> 抢断
                </button>
              </div>
              {(() => {
                const player = getCampusPlayerById(controlledPiece.playerId);
                const skill = player?.uniqueSkill;
                if (!skill) return null;
                const canUseSkill = controlledPiece.skillCooldown === 0 && controlledPiece.stamina.currentStamina >= skill.staminaCost;
                return (
                  <button
                    onClick={handleUseSkill}
                    disabled={!canUseSkill}
                    className={`mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-xs font-bold transition-colors ${
                      canUseSkill
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white'
                        : 'bg-slate-700 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Zap className="w-3 h-3" /> 激活技能「{skill.name}」
                  </button>
                );
              })()}
              <button
                onClick={handleEndTurn}
                className="mt-2 w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-600 hover:bg-gray-500 rounded text-xs font-bold transition-colors"
              >
                <CircleOff className="w-3 h-3" /> 结束回合（触发黑方 AI）
              </button>
              {uiMode !== 'idle' && (
                <button
                  onClick={() => {
                    setUiMode('idle');
                    clearHighlights();
                  }}
                  className="mt-2 w-full px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-gray-300 transition-colors"
                >
                  取消选择
                </button>
              )}
            </div>
          )}

          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-2">
              <UserCog className="w-4 h-4 text-green-400" />
              <div className="text-sm text-gray-400">切换控制球员</div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {board.pieces
                .filter((p) => p.team === 'white')
                .map((p) => {
                  const player = getPiecePlayer(p);
                  const isControlled = p.id === board.playerControlledId;
                  const staminaPercent = p.stamina.currentStamina / p.stamina.maxStamina;
                  return (
                    <button
                      key={p.id}
                      onClick={() => handleSwitchControl(p.id)}
                      disabled={isControlled || isExecuting || p.hasActed}
                      className={`
                        relative rounded-lg border-2 flex flex-col items-center justify-center text-xs transition-colors
                        ${isControlled
                          ? 'bg-yellow-500/20 border-yellow-400 text-yellow-400'
                          : p.hasActed
                          ? 'bg-slate-800/50 border-slate-700 text-gray-600 opacity-60'
                          : 'bg-slate-700/50 border-slate-600 text-gray-300 hover:bg-slate-700 hover:border-green-500/50'
                        }
                        ${isExecuting || p.hasActed ? 'cursor-not-allowed' : ''}
                      `}
                    >
                      <span className="font-bold">{player?.name[0] || '?'}</span>
                      <span className="text-[9px] scale-90">{getRoleName(p.role)}{p.hasActed ? '·已动' : ''}</span>
                      <div className="w-6 h-0.5 mt-0.5 bg-gray-600 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getStaminaColor(staminaPercent)}`}
                          style={{ width: `${staminaPercent * 100}%` }}
                        />
                      </div>
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
            <div className="text-sm text-gray-400 mb-2 font-bold">🎮 玩法指南</div>
            
            <div className="space-y-3">
              <div className="bg-green-900/20 border border-green-500/30 rounded p-2">
                <div className="text-xs font-bold text-green-400 mb-1">目标</div>
                <div className="text-xs text-gray-400">先打入3球获胜！最多120回合</div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 rounded p-2">
                <div className="text-xs font-bold text-blue-400 mb-1">基本操作</div>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>👆 <span className="text-yellow-400">点击己方未行动球员</span> - 切换控制对象</li>
                  <li>👆 <span className="text-green-400">点击当前球员</span> - 显示可移动范围</li>
                  <li>🎯 选择动作按钮 - 执行移动/传球/射门/抢断</li>
                  <li>✅ 本回合所有己方球员行动后，黑方 AI 开始行动</li>
                </ul>
              </div>

              <div className="bg-purple-900/20 border border-purple-500/30 rounded p-2">
                <div className="text-xs font-bold text-purple-400 mb-1">动作说明</div>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li><Move className="inline w-3 h-3" /> 移动 - 点击绿色格子移动球员</li>
                  <li><Footprints className="inline w-3 h-3" /> 传球 - 传给蓝色高亮的队友</li>
                  <li><Target className="inline w-3 h-3" /> 射门 - 点击红色球门区域射门</li>
                  <li><Shield className="inline w-3 h-3" /> 抢断 - 橙色高亮对手持球时可抢断</li>
                  <li><Zap className="inline w-3 h-3" /> 技能 - 消耗体力激活专属技能</li>
                </ul>
              </div>

              <div className="bg-yellow-900/20 border border-yellow-500/30 rounded p-2">
                <div className="text-xs font-bold text-yellow-400 mb-1">体力系统</div>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>💚 绿色(&gt;60%) - 正常移动力</li>
                  <li>💛 黄色(30-60%) - 移动力下降</li>
                  <li>❤️ 红色(&lt;30%) - 大幅减速</li>
                  <li>🔄 每回合自动恢复体力</li>
                </ul>
              </div>

              <div className="bg-orange-900/20 border border-orange-500/30 rounded p-2">
                <div className="text-xs font-bold text-orange-400 mb-1">Tips</div>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>⚽ 先带球到对方禁区附近再射门</li>
                  <li>👥 合理传球配合队友进攻</li>
                  <li>⏱️ 技能有冷却，关键时刻再用</li>
                  <li>💡 点击下方头像快速切换控制球员</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700 max-h-64 overflow-y-auto">
            <div className="text-sm text-gray-400 mb-2">比赛日志</div>
            <div className="space-y-1">
              {board.moveHistory.length === 0 ? (
                <div className="text-xs text-gray-500">比赛开始...</div>
              ) : (
                board.moveHistory.slice(-10).map((log, index) => (
                  <div
                    key={index}
                    className={`text-xs p-2 rounded ${
                      log.includes('进球')
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                        : log.includes('传球')
                        ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                        : log.includes('射门')
                        ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                        : log.includes('抢断')
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                        : log.includes('技能')
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-slate-700/30 text-gray-400'
                    }`}
                  >
                    {log.includes('抢断') && <Shield className="inline w-3 h-3 mr-1" />}
                    {log.includes('射门') && <Swords className="inline w-3 h-3 mr-1" />}
                    {log.includes('技能') && <Zap className="inline w-3 h-3 mr-1" />}
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {matchEnded && lastMatchRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border-2 border-green-500 rounded-2xl p-6 max-w-md w-full pixel-pop-in text-center">
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${
              lastMatchRecord.result === 'win'
                ? 'text-yellow-400'
                : lastMatchRecord.result === 'draw'
                ? 'text-blue-400'
                : 'text-gray-400'
            }`} />

            <h2 className="text-2xl font-bold mb-2 pixel-text">
              {lastMatchRecord.result === 'win'
                ? '胜利！'
                : lastMatchRecord.result === 'draw'
                ? '平局'
                : '惜败'}
            </h2>

            <div className="text-4xl font-bold text-white mb-4">
              {lastMatchRecord.whiteScore} : {lastMatchRecord.blackScore}
            </div>

            <div className="bg-slate-800/50 rounded-xl p-4 mb-4 text-left">
              {lastMatchRecord.goalScorerIds.length > 0 && (
                <div className="text-sm text-gray-300 mb-2">
                  进球者: {lastMatchRecord.goalScorerIds
                    .map((id) => getCampusPlayerById(id)?.name || id)
                    .join('、')}
                </div>
              )}
              <div className="text-sm text-gray-400 mb-1">回合数: {lastMatchRecord.turnCount}</div>
              <div className="text-sm text-yellow-400">{lastMatchRecord.rewards.join(' / ')}</div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white rounded-xl font-bold transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                再来一局
              </button>
              <button
                onClick={() => navigate('/manager/history')}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl font-bold transition-colors"
              >
                <History className="w-4 h-4" />
                查看战绩
              </button>
              {onBack && (
                <button
                  onClick={onBack}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                >
                  <Home className="w-4 h-4" />
                  返回
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
