// AI 引擎：为"玩家控制1人 + AI控制其余"提供感知、决策与评估
// 设计原则：团队无关、角色特化、行为可预测

import {
  FootballBoard,
  BoardPiece,
  Position,
  GameAction,
  AIState,
  AIDifficulty,
  getValidMovePositions,
  getValidPassTargets,
  getValidShootTargets,
  getValidTackleTargets,
  getBallCarrier,
  getEffectiveStats,
  manhattanDistance,
  isGoal,
  getOpponent,
  movePiece
} from './chessRules';
import { PlayerStatsSlice } from './playerTypes';

export interface PerceptionContext {
  piece: BoardPiece;
  team: 'white' | 'black';
  isFriendlyAI: boolean;
  ballPosition: Position;
  ballCarrier: BoardPiece | undefined;
  nearestTeammate: BoardPiece | undefined;
  nearestOpponent: BoardPiece | undefined;
  distanceToOwnGoal: number;
  distanceToEnemyGoal: number;
  teammatesInPassRange: BoardPiece[];
  opponentsInTackleRange: BoardPiece[];
  playerAction: GameAction | null;
  currentState: AIState;
}

/** 构建 AI 对当前局面的感知上下文 */
export function buildPerception(
  board: FootballBoard,
  pieceId: string,
  playerAction: GameAction | null
): PerceptionContext {
  const piece = board.pieces.find((p) => p.id === pieceId)!;
  const team = piece.team;
  const enemyTeam = getOpponent(team);

  const ballCarrier = getBallCarrier(board.pieces, board.ballCarrierId);
  const teammates = board.pieces.filter((p) => p.team === team && p.id !== pieceId);
  const opponents = board.pieces.filter((p) => p.team === enemyTeam);

  const nearestTeammate = findNearest(piece, teammates);
  const nearestOpponent = findNearest(piece, opponents);

  const ownGoalPositions = team === 'white' ? WHITE_GOAL_POSITIONS : BLACK_GOAL_POSITIONS;
  const enemyGoalPositions = team === 'white' ? BLACK_GOAL_POSITIONS : WHITE_GOAL_POSITIONS;

  return {
    piece,
    team,
    isFriendlyAI: team === 'white',
    ballPosition: board.ballPosition,
    ballCarrier,
    nearestTeammate,
    nearestOpponent,
    distanceToOwnGoal: Math.min(...ownGoalPositions.map((g) => manhattanDistance(piece.position, g))),
    distanceToEnemyGoal: Math.min(...enemyGoalPositions.map((g) => manhattanDistance(piece.position, g))),
    teammatesInPassRange: teammates.filter((t) => manhattanDistance(piece.position, t.position) <= 3),
    opponentsInTackleRange: opponents.filter(
      (o) => manhattanDistance(piece.position, o.position) === 1
    ),
    playerAction: team === 'white' ? playerAction : null,
    currentState: piece.currentState
  };
}

export function decideAIAction(
  board: FootballBoard,
  piece: BoardPiece,
  playerAction: GameAction | null,
  playerStats: Record<string, PlayerStatsSlice>,
  difficulty: AIDifficulty
): GameAction | null {
  if (difficulty === 'easy' && Math.random() < 0.4) {
    return getRandomAction(board, piece, playerStats);
  }

  if (difficulty === 'hard' && piece.hasBall) {
    const skillAction = findBestSkillAction(board, piece, playerStats);
    if (skillAction) return skillAction;
  }

  const context = buildPerception(board, piece.id, playerAction);

  switch (piece.role) {
    case 'GK':
      return decideGKAction(context, board, playerStats, difficulty);
    case 'CB':
    case 'LB':
    case 'RB':
      return decideDefenderAction(context, board, playerStats, difficulty);
    case 'CM':
      return decideMidfielderAction(context, board, playerStats, difficulty);
    case 'LW':
    case 'RW':
    case 'ST':
      return decideForwardAction(context, board, playerStats, difficulty);
    default:
      return decideForwardAction(context, board, playerStats, difficulty);
  }
}

function findBestSkillAction(
  board: FootballBoard,
  piece: BoardPiece,
  playerStats: Record<string, PlayerStatsSlice>
): GameAction | null {
  if (!piece.activeSkill || piece.skillCooldown > 0) return null;
  if (piece.stamina.currentStamina < piece.activeSkill.staminaCost) return null;

  const skill = piece.activeSkill;
  
  if (skill.effectType === 'goalkeeper_save' && !piece.hasBall) {
    return { type: 'skill', pieceId: piece.id, skillId: skill.id };
  }

  if (skill.effectType === 'shoot_power' || skill.effectType === 'shoot_range') {
    const enemyGoalPositions = piece.team === 'white' ? BLACK_GOAL_POSITIONS : WHITE_GOAL_POSITIONS;
    const distToGoal = Math.min(...enemyGoalPositions.map((g) => manhattanDistance(piece.position, g)));
    
    if (distToGoal <= 4) {
      return { type: 'skill', pieceId: piece.id, skillId: skill.id };
    }
  }

  if (skill.effectType === 'pass_power' || skill.effectType === 'pass_range') {
    const targets = getValidPassTargets(piece, board.pieces, playerStats);
    if (targets.length > 0) {
      return { type: 'skill', pieceId: piece.id, skillId: skill.id };
    }
  }

  if (skill.effectType === 'defense_boost') {
    const opponentsInRange = board.pieces.filter(
      (p) => p.team !== piece.team && manhattanDistance(p.position, piece.position) <= 2
    );
    if (opponentsInRange.length > 0) {
      return { type: 'skill', pieceId: piece.id, skillId: skill.id };
    }
  }

  return null;
}

/** 门将：优先守门，偶尔出击 */
function decideGKAction(
  context: PerceptionContext,
  board: FootballBoard,
  playerStats: Record<string, PlayerStatsSlice>,
  difficulty: AIDifficulty
): GameAction | null {
  const { piece } = context;

  if (piece.hasBall) {
    const passAction = findBestPass(context, board, playerStats);
    if (passAction) return passAction;
    
    if (difficulty === 'hard') {
      const bestForward = findBestForwardTarget(board, piece, playerStats);
      if (bestForward) {
        return { type: 'pass', pieceId: piece.id, targetPieceId: bestForward.id };
      }
    }
    
    const forwardMate = findForwardTeammate(board, piece);
    if (forwardMate) {
      return { type: 'pass', pieceId: piece.id, targetPieceId: forwardMate.id };
    }
  }

  if (!piece.hasBall) {
    const ballDistToGoal = distanceToOwnGoalFromBall(board, piece.team);
    const selfDistToGoal = context.distanceToOwnGoal;
    
    const proactiveRange = difficulty === 'hard' ? 3 : difficulty === 'normal' ? 2 : 1;
    
    if (ballDistToGoal < selfDistToGoal && ballDistToGoal <= proactiveRange) {
      const move = moveToward(board, piece, board.ballPosition, playerStats);
      if (move) return move;
    }
  }

  const home = piece.homePosition;
  if (manhattanDistance(piece.position, home) > 0) {
    const move = moveToward(board, piece, home, playerStats);
    if (move) return move;
  }

  return endAction(piece);
}

function findBestForwardTarget(
  board: FootballBoard,
  piece: BoardPiece,
  playerStats: Record<string, PlayerStatsSlice>
): BoardPiece | undefined {
  const teammates = board.pieces.filter((p) => p.team === piece.team && p.id !== piece.id);
  if (teammates.length === 0) return undefined;

  const enemyGoalPositions = piece.team === 'white' ? BLACK_GOAL_POSITIONS : WHITE_GOAL_POSITIONS;
  const distToEnemyGoal = (pos: Position) =>
    Math.min(...enemyGoalPositions.map((g) => manhattanDistance(pos, g)));

  return teammates.reduce((best, curr) => {
    const bestDist = distToEnemyGoal(best.position);
    const currDist = distToEnemyGoal(curr.position);
    const bestStats = getEffectiveStats(best, playerStats);
    const currStats = getEffectiveStats(curr, playerStats);

    const bestScore = -bestDist + (bestStats.speed > 80 ? 2 : 0) + (bestStats.shooting > 70 ? 2 : 0);
    const currScore = -currDist + (currStats.speed > 80 ? 2 : 0) + (currStats.shooting > 70 ? 2 : 0);

    return currScore > bestScore ? curr : best;
  });
}

/** 后卫：防守第一，抢断/盯人/回位 */
function decideDefenderAction(
  context: PerceptionContext,
  board: FootballBoard,
  playerStats: Record<string, PlayerStatsSlice>,
  difficulty: AIDifficulty
): GameAction | null {
  const { piece, team } = context;

  if (piece.hasBall) {
    const passAction = findBestPass(context, board, playerStats);
    if (passAction) return passAction;
    
    if (difficulty === 'hard') {
      const forwardMove = findBestForwardMove(context, board, playerStats);
      if (forwardMove) return forwardMove;
    }
    
    const safeMove = findSafeMove(context, board, playerStats);
    if (safeMove) return safeMove;
  }

  const tackleAction = findBestTackle(context, board, playerStats);
  if (tackleAction) {
    const stats = getEffectiveStats(piece, playerStats);
    const carrier = context.ballCarrier;
    if (carrier) {
      const carrierStats = getEffectiveStats(carrier, playerStats);
      const tackleChance = (stats.defense + stats.physical) / (stats.defense + stats.physical + carrierStats.dribbling);
      
      const tackleThreshold = difficulty === 'hard' ? 0.2 : difficulty === 'normal' ? 0.25 : 0.35;
      
      if (tackleChance > tackleThreshold || context.distanceToOwnGoal <= 3) {
        return tackleAction;
      }
    }
  }

  if (context.ballCarrier && context.ballCarrier.team !== piece.team) {
    const distToBall = manhattanDistance(piece.position, board.ballPosition);
    const distToOwnGoal = context.distanceToOwnGoal;
    
    const defenseRange = difficulty === 'hard' ? 4 : difficulty === 'normal' ? 3 : 2;
    
    if (distToOwnGoal <= defenseRange) {
      const interception = interceptBall(context, board, playerStats);
      if (interception) return interception;
    }
    
    const chaseRange = difficulty === 'hard' ? 3 : difficulty === 'normal' ? 2 : 1;
    if (distToBall <= chaseRange) {
      const move = moveToward(board, piece, board.ballPosition, playerStats);
      if (move) return move;
    }
  }

  const dangerousOpponents = board.pieces.filter(
    (p) => p.team !== team && (p.role === 'ST' || p.role === 'LW' || p.role === 'RW')
  );
  
  let markTarget: BoardPiece | undefined;
  if (dangerousOpponents.length > 0) {
    markTarget = dangerousOpponents.reduce((best, curr) => {
      const bestDist = manhattanDistance(piece.position, best.position);
      const currDist = manhattanDistance(piece.position, curr.position);
      const bestScore = getEffectiveStats(best, playerStats).shooting;
      const currScore = getEffectiveStats(curr, playerStats).shooting;
      
      if (difficulty === 'hard') {
        if (currDist <= 4 && currScore > bestScore) return curr;
        if (currDist < bestDist) return curr;
      } else {
        if (currDist <= 3 && currScore > bestScore) return curr;
        if (currDist < bestDist) return curr;
      }
      return best;
    });
  } else {
    markTarget = context.nearestOpponent;
  }
  
  if (markTarget && manhattanDistance(piece.position, markTarget.position) > 1) {
    const move = moveToward(board, piece, markTarget.position, playerStats, difficulty === 'hard' ? 0 : 1);
    if (move) return move;
  }

  const homeMove = moveToward(board, piece, piece.homePosition, playerStats);
  if (homeMove) return homeMove;

  const chaseMove = moveToward(board, piece, board.ballPosition, playerStats);
  if (chaseMove) return chaseMove;

  return endAction(piece);
}

/** 中场：攻防转换，支援持球者 */
function decideMidfielderAction(
  context: PerceptionContext,
  board: FootballBoard,
  playerStats: Record<string, PlayerStatsSlice>,
  difficulty: AIDifficulty
): GameAction | null {
  const { piece } = context;

  if (piece.hasBall) {
    const passAction = findBestPass(context, board, playerStats);
    if (passAction) return passAction;
    
    if (difficulty === 'hard') {
      const forwardMove = findBestForwardMove(context, board, playerStats);
      if (forwardMove) return forwardMove;
    }
    
    const shootAction = findBestShoot(context, board, playerStats, difficulty);
    if (shootAction) return shootAction;
    
    const forwardMove = findBestForwardMove(context, board, playerStats);
    if (forwardMove) return forwardMove;
  }

  const tackleAction = findBestTackle(context, board, playerStats);
  if (tackleAction) {
    if (difficulty === 'hard') {
      return tackleAction;
    }
    const stats = getEffectiveStats(piece, playerStats);
    const carrier = context.ballCarrier;
    if (carrier) {
      const carrierStats = getEffectiveStats(carrier, playerStats);
      const tackleChance = (stats.defense + stats.physical) / (stats.defense + stats.physical + carrierStats.dribbling);
      if (tackleChance > 0.3) return tackleAction;
    }
  }

  const carrier = context.ballCarrier;
  if (carrier && carrier.id !== piece.id) {
    if (carrier.team === piece.team) {
      const supportPos = findSupportPosition(board, piece, carrier, playerStats);
      if (supportPos) {
        const move = moveToward(board, piece, supportPos, playerStats);
        if (move) return move;
      }
    } else {
      const interception = interceptBall(context, board, playerStats);
      if (interception) return interception;
    }
  }

  const chaseMove = moveToward(board, piece, board.ballPosition, playerStats);
  if (chaseMove) return chaseMove;

  return endAction(piece);
}

/** 前锋：进攻优先，射门/前插/接应 */
function decideForwardAction(
  context: PerceptionContext,
  board: FootballBoard,
  playerStats: Record<string, PlayerStatsSlice>,
  difficulty: AIDifficulty
): GameAction | null {
  const { piece } = context;

  if (piece.hasBall) {
    const shootAction = findBestShoot(context, board, playerStats, difficulty);
    if (shootAction) return shootAction;
    
    const passAction = findBestPass(context, board, playerStats);
    if (passAction) return passAction;
    
    if (difficulty === 'hard') {
      const forwardRun = findForwardRun(context, board, playerStats);
      if (forwardRun) return forwardRun;
    }
    
    const forwardMove = findBestForwardMove(context, board, playerStats);
    if (forwardMove) return forwardMove;
    
    if (difficulty !== 'easy') {
      const randomMove = getRandomMove(context, board, playerStats);
      if (randomMove) return randomMove;
    }
  }

  const tackleAction = findBestTackle(context, board, playerStats);
  if (tackleAction) {
    if (difficulty === 'hard') {
      return tackleAction;
    }
    const distToBall = manhattanDistance(piece.position, board.ballPosition);
    if (distToBall <= 2) return tackleAction;
  }

  const carrier = context.ballCarrier;
  if (carrier && carrier.team === piece.team && carrier.id !== piece.id) {
    const target = findSupportPosition(board, piece, carrier, playerStats);
    if (target) {
      const move = moveToward(board, piece, target, playerStats);
      if (move) return move;
    }
  }

  const chaseMove = moveToward(board, piece, board.ballPosition, playerStats);
  if (chaseMove) return chaseMove;

  if (difficulty === 'hard') {
    const forwardRun = findForwardRun(context, board, playerStats);
    if (forwardRun) return forwardRun;
  }

  return endAction(piece);
}

// ========== 动作选择辅助函数 ==========

function getRandomMove(
  context: PerceptionContext,
  board: FootballBoard,
  playerStats: Record<string, PlayerStatsSlice>
): GameAction | null {
  const { piece, team } = context;
  const moves = getValidMovePositions(piece, board.pieces, playerStats);
  if (moves.length === 0) return null;

  const enemyGoalPositions = team === 'white' ? BLACK_GOAL_POSITIONS : WHITE_GOAL_POSITIONS;
  const distToEnemyGoal = (pos: Position) =>
    Math.min(...enemyGoalPositions.map((g) => manhattanDistance(pos, g)));

  const forwardMoves = moves.filter((m) => distToEnemyGoal(m) < distToEnemyGoal(piece.position));
  if (forwardMoves.length > 0) {
    const chosen = forwardMoves[Math.floor(Math.random() * forwardMoves.length)];
    return { type: 'move', pieceId: piece.id, targetPosition: chosen };
  }

  return null;
}

function findSafeMove(
  context: PerceptionContext,
  board: FootballBoard,
  playerStats: Record<string, PlayerStatsSlice>
): GameAction | null {
  const { piece, team } = context;
  const moves = getValidMovePositions(piece, board.pieces, playerStats);
  if (moves.length === 0) return null;

  const ownGoalPositions = team === 'white' ? WHITE_GOAL_POSITIONS : BLACK_GOAL_POSITIONS;
  const distToOwnGoal = (pos: Position) =>
    Math.min(...ownGoalPositions.map((g) => manhattanDistance(pos, g)));

  let bestMove: Position | null = null;
  let bestSafety = -Infinity;

  for (const move of moves) {
    const safety = distToOwnGoal(move);
    const nearbyOpponents = board.pieces.filter(
      (p) => p.team !== team && manhattanDistance(p.position, move) <= 1
    ).length;
    
    const score = safety * 10 - nearbyOpponents * 20;
    if (score > bestSafety) {
      bestSafety = score;
      bestMove = move;
    }
  }

  if (bestMove) {
    return { type: 'move', pieceId: piece.id, targetPosition: bestMove };
  }
  return null;
}

function interceptBall(
  context: PerceptionContext,
  board: FootballBoard,
  playerStats: Record<string, PlayerStatsSlice>
): GameAction | null {
  const { piece, team } = context;
  const carrier = context.ballCarrier;
  if (!carrier || carrier.team === team) return null;

  const moves = getValidMovePositions(piece, board.pieces, playerStats);
  if (moves.length === 0) return null;

  const ownGoalPositions = team === 'white' ? WHITE_GOAL_POSITIONS : BLACK_GOAL_POSITIONS;
  const distToOwnGoal = (pos: Position) =>
    Math.min(...ownGoalPositions.map((g) => manhattanDistance(pos, g)));

  let bestMove: Position | null = null;
  let bestScore = -Infinity;

  for (const move of moves) {
    const distToCarrier = manhattanDistance(move, carrier.position);
    const distToGoal = distToOwnGoal(move);
    
    let score = -distToCarrier * 15;
    score += distToGoal * 5;
    
    if (distToCarrier === 1) score += 30;
    
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  if (bestMove && bestScore > -20) {
    return { type: 'move', pieceId: piece.id, targetPosition: bestMove };
  }
  return null;
}

function findForwardRun(
  context: PerceptionContext,
  board: FootballBoard,
  playerStats: Record<string, PlayerStatsSlice>
): GameAction | null {
  const { piece, team } = context;
  const moves = getValidMovePositions(piece, board.pieces, playerStats);
  if (moves.length === 0) return null;

  const enemyGoalPositions = team === 'white' ? BLACK_GOAL_POSITIONS : WHITE_GOAL_POSITIONS;
  const distToEnemyGoal = (pos: Position) =>
    Math.min(...enemyGoalPositions.map((g) => manhattanDistance(pos, g)));

  let bestMove: Position | null = null;
  let bestDist = distToEnemyGoal(piece.position);

  for (const move of moves) {
    const dist = distToEnemyGoal(move);
    if (dist < bestDist) {
      bestDist = dist;
      bestMove = move;
    }
  }

  if (bestMove && bestDist < distToEnemyGoal(piece.position)) {
    return { type: 'move', pieceId: piece.id, targetPosition: bestMove };
  }
  return null;
}

function findBestShoot(
  context: PerceptionContext,
  board: FootballBoard,
  playerStats: Record<string, PlayerStatsSlice>,
  difficulty: AIDifficulty = 'normal'
): GameAction | null {
  const { piece, team } = context;
  const targets = getValidShootTargets(piece, board.pieces, playerStats);
  if (targets.length === 0) return null;

  let bestTarget = targets[0];
  let bestScore = -Infinity;
  const stats = getEffectiveStats(piece, playerStats);

  const enemyGoalPositions = team === 'white' ? BLACK_GOAL_POSITIONS : WHITE_GOAL_POSITIONS;
  const distToEnemyGoal = Math.min(...enemyGoalPositions.map((g) => manhattanDistance(piece.position, g)));

  const difficultyMultiplier = difficulty === 'hard' ? 1.3 : difficulty === 'normal' ? 1.0 : 0.7;

  for (const target of targets) {
    const dist = manhattanDistance(piece.position, target);
    const baseChance = Math.max(0.1, stats.shooting / 100 - dist * 0.12);
    const chance = baseChance * difficultyMultiplier;
    
    let score = chance * 100;
    
    if (distToEnemyGoal <= 2) {
      score += 30;
    } else if (distToEnemyGoal <= 3) {
      score += 15;
    } else if (distToEnemyGoal <= 4 && difficulty === 'hard') {
      score += 10;
    }
    
    if (piece.activeSkill) {
      score += 25;
    }
    
    const nearbyTeammates = board.pieces.filter(
      (p) => p.team === team && p.id !== piece.id && manhattanDistance(p.position, target) <= 2
    ).length;
    
    if (nearbyTeammates === 0 && difficulty === 'hard') {
      score += 10;
    }
    
    if (score > bestScore) {
      bestScore = score;
      bestTarget = target;
    }
  }

  const shootThreshold = difficulty === 'hard' ? 15 : difficulty === 'normal' ? 20 : 25;
  
  if (bestScore >= shootThreshold) {
    return { type: 'shoot', pieceId: piece.id, targetPosition: bestTarget };
  }
  return null;
}

function findBestTackle(
  context: PerceptionContext,
  board: FootballBoard,
  playerStats: Record<string, PlayerStatsSlice>
): GameAction | null {
  const { piece } = context;
  const targets = getValidTackleTargets(piece, board.pieces, board.ballCarrierId);
  if (targets.length === 0) return null;

  const target = targets[0];
  const defenderStats = getEffectiveStats(piece, playerStats);
  const attackerStats = getEffectiveStats(target, playerStats);
  const tacklePower = (defenderStats.defense + defenderStats.physical) / 2;
  const chance = Math.min(0.8, Math.max(0.2, tacklePower / (tacklePower + attackerStats.dribbling)));

  if (chance >= 0.35) {
    return { type: 'tackle', pieceId: piece.id, targetPieceId: target.id };
  }
  return null;
}

function findBestPass(
  context: PerceptionContext,
  board: FootballBoard,
  playerStats: Record<string, PlayerStatsSlice>
): GameAction | null {
  const { piece, team } = context;
  if (!piece.hasBall) return null;

  const targets = getValidPassTargets(piece, board.pieces, playerStats);
  if (targets.length === 0) return null;

  const stats = getEffectiveStats(piece, playerStats);
  const enemyGoalPositions = team === 'white' ? BLACK_GOAL_POSITIONS : WHITE_GOAL_POSITIONS;
  const distToEnemyGoal = (pos: Position) =>
    Math.min(...enemyGoalPositions.map((g) => manhattanDistance(pos, g)));

  let bestTarget = targets[0];
  let bestScore = -Infinity;

  for (const target of targets) {
    const dist = manhattanDistance(piece.position, target.position);
    const passChance = Math.max(0.3, stats.passing / 100 - dist * 0.05);
    
    let score = passChance * 100;
    
    const positionalScore = -distToEnemyGoal(target.position) * 25;
    score += positionalScore;
    
    const roleBonus = target.role === 'ST' ? 30 : target.role === 'LW' || target.role === 'RW' ? 20 : 0;
    score += roleBonus;
    
    const targetStats = getEffectiveStats(target, playerStats);
    if (targetStats.shooting > 70) score += 15;
    if (targetStats.speed > 80) score += 10;
    
    const nearbyOpponents = board.pieces.filter(
      (p) => p.team !== team && manhattanDistance(p.position, target.position) <= 1
    ).length;
    score -= nearbyOpponents * 25;
    
    if (score > bestScore) {
      bestScore = score;
      bestTarget = target;
    }
  }

  if (bestScore >= 25) {
    return { type: 'pass', pieceId: piece.id, targetPieceId: bestTarget.id };
  }
  
  if (distToEnemyGoal(bestTarget.position) < distToEnemyGoal(piece.position)) {
    return { type: 'pass', pieceId: piece.id, targetPieceId: bestTarget.id };
  }

  return null;
}

function findBestForwardMove(
  context: PerceptionContext,
  board: FootballBoard,
  playerStats: Record<string, PlayerStatsSlice>
): GameAction | null {
  const { piece, team } = context;
  const moves = getValidMovePositions(piece, board.pieces, playerStats);
  if (moves.length === 0) return null;

  const enemyGoalPositions = team === 'white' ? BLACK_GOAL_POSITIONS : WHITE_GOAL_POSITIONS;
  const distToEnemyGoal = (pos: Position) =>
    Math.min(...enemyGoalPositions.map((g) => manhattanDistance(pos, g)));

  let bestMove = moves[0];
  let bestScore = -Infinity;

  for (const move of moves) {
    let score = 0;
    if (piece.hasBall) {
      score -= distToEnemyGoal(move) * 30;
      if (isGoal(move, team)) score += 200;
    } else {
      score -= manhattanDistance(move, board.ballPosition) * 15;
      score -= distToEnemyGoal(move) * 5;
    }
    const simulated = movePiece(board, piece.id, move, playerStats);
    score += evaluateBoard(simulated, team) * 0.5;
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  // 阈值放低：只要不前功尽弃就移动
  const currentEval = evaluateBoard(board, team);
  const simulatedEval = evaluateBoard(movePiece(board, piece.id, bestMove, playerStats), team);
  if (simulatedEval > currentEval - 5) {
    return { type: 'move', pieceId: piece.id, targetPosition: bestMove };
  }
  return null;
}

/** 向目标移动；stopDistance 表示保持在目标几格之外（用于盯人） */
function moveToward(
  board: FootballBoard,
  piece: BoardPiece,
  target: Position,
  playerStats: Record<string, PlayerStatsSlice>,
  stopDistance = 0
): GameAction | null {
  const moves = getValidMovePositions(piece, board.pieces, playerStats);
  if (moves.length === 0) return null;

  let bestMove: Position | null = null;
  let bestDist = Infinity;

  for (const move of moves) {
    const dist = Math.max(0, manhattanDistance(move, target) - stopDistance);
    if (dist < bestDist) {
      bestDist = dist;
      bestMove = move;
    }
  }

  if (bestMove && (bestMove.row !== piece.position.row || bestMove.col !== piece.position.col)) {
    return { type: 'move', pieceId: piece.id, targetPosition: bestMove };
  }
  return null;
}

/** 找前场队友（用于门将开球） */
function findForwardTeammate(board: FootballBoard, piece: BoardPiece): BoardPiece | undefined {
  const teammates = board.pieces.filter((p) => p.team === piece.team && p.id !== piece.id);
  const enemyGoalPositions = piece.team === 'white' ? BLACK_GOAL_POSITIONS : WHITE_GOAL_POSITIONS;
  const distToEnemyGoal = (pos: Position) =>
    Math.min(...enemyGoalPositions.map((g) => manhattanDistance(pos, g)));

  return teammates.sort(
    (a, b) => distToEnemyGoal(a.position) - distToEnemyGoal(b.position)
  )[0];
}

/** 找接应位置：持球者前方、远离对手的格子 */
function findSupportPosition(
  board: FootballBoard,
  piece: BoardPiece,
  carrier: BoardPiece,
  playerStats: Record<string, PlayerStatsSlice>
): Position | null {
  const moves = getValidMovePositions(piece, board.pieces, playerStats);
  if (moves.length === 0) return null;

  const team = piece.team;
  const enemyGoalPositions = team === 'white' ? BLACK_GOAL_POSITIONS : WHITE_GOAL_POSITIONS;
  const distToEnemyGoal = (pos: Position) =>
    Math.min(...enemyGoalPositions.map((g) => manhattanDistance(pos, g)));

  let best: Position | null = null;
  let bestScore = -Infinity;

  for (const move of moves) {
    // 希望更靠近敌方球门，同时离持球者不太远
    const distToCarrier = manhattanDistance(move, carrier.position);
    const distToGoal = distToEnemyGoal(move);
    // 附近对手越少越好
    const nearbyOpponents = board.pieces.filter(
      (p) => p.team !== team && manhattanDistance(p.position, move) <= 1
    ).length;
    const score = -distToGoal * 20 - distToCarrier * 5 - nearbyOpponents * 30;
    if (score > bestScore) {
      bestScore = score;
      best = move;
    }
  }

  return best;
}

function endAction(piece: BoardPiece): GameAction {
  return { type: 'end', pieceId: piece.id };
}

function findNearest(piece: BoardPiece, others: BoardPiece[]): BoardPiece | undefined {
  let nearest: BoardPiece | undefined;
  let minDist = Infinity;
  for (const other of others) {
    const dist = manhattanDistance(piece.position, other.position);
    if (dist < minDist) {
      minDist = dist;
      nearest = other;
    }
  }
  return nearest;
}

// ========== 局面评估 ==========

/** 团队无关评估：从 perspectiveTeam 视角，分数越高越好 */
export function evaluateBoard(board: FootballBoard, perspectiveTeam: 'white' | 'black'): number {
  let score = 0;
  const opponent = getOpponent(perspectiveTeam);

  // 比分差
  score +=
    (perspectiveTeam === 'white'
      ? board.whiteScore - board.blackScore
      : board.blackScore - board.whiteScore) * 1000;

  const ballCarrier = getBallCarrier(board.pieces, board.ballCarrierId);
  const ball = board.ballPosition;

  // 球到敌方球门越近越好
  const enemyGoalPositions = perspectiveTeam === 'white' ? BLACK_GOAL_POSITIONS : WHITE_GOAL_POSITIONS;
  const distToEnemyGoal = Math.min(...enemyGoalPositions.map((g) => manhattanDistance(ball, g)));
  score -= distToEnemyGoal * 10;

  // 球到己方球门越远越好
  const ownGoalPositions = perspectiveTeam === 'white' ? WHITE_GOAL_POSITIONS : BLACK_GOAL_POSITIONS;
  const distToOwnGoal = Math.min(...ownGoalPositions.map((g) => manhattanDistance(ball, g)));
  score += distToOwnGoal * 5;

  // 球权
  if (ballCarrier) {
    if (ballCarrier.team === perspectiveTeam) {
      score += 80;
      const carrierDistToEnemyGoal = Math.min(
        ...enemyGoalPositions.map((g) => manhattanDistance(ballCarrier.position, g))
      );
      score -= carrierDistToEnemyGoal * 15;
    } else {
      score -= 80;
      const carrierDistToOwnGoal = Math.min(
        ...ownGoalPositions.map((g) => manhattanDistance(ballCarrier.position, g))
      );
      score += carrierDistToOwnGoal * 10;
    }
  }

  // 整体压上程度
  const myPieces = board.pieces.filter((p) => p.team === perspectiveTeam);
  const theirPieces = board.pieces.filter((p) => p.team === opponent);

  for (const piece of myPieces) {
    // 越靠近敌方底线越好（white  row 越大越好；black row 越小越好）
    score += (perspectiveTeam === 'white' ? piece.position.row : BOARD_SIZE - 1 - piece.position.row) * 3;
  }
  for (const piece of theirPieces) {
    score -= (perspectiveTeam === 'white' ? BOARD_SIZE - 1 - piece.position.row : piece.position.row) * 2;
  }

  return score;
}

// ========== 随机动作（简单难度）==========

export function getRandomAction(
  board: FootballBoard,
  piece: BoardPiece,
  playerStats: Record<string, PlayerStatsSlice>
): GameAction | null {
  const actions: GameAction[] = [];

  const moves = getValidMovePositions(piece, board.pieces, playerStats);
  for (const m of moves) {
    actions.push({ type: 'move', pieceId: piece.id, targetPosition: m });
  }

  if (piece.hasBall) {
    const passes = getValidPassTargets(piece, board.pieces, playerStats);
    for (const p of passes) {
      actions.push({ type: 'pass', pieceId: piece.id, targetPieceId: p.id });
    }
    const shoots = getValidShootTargets(piece, board.pieces, playerStats);
    for (const s of shoots) {
      actions.push({ type: 'shoot', pieceId: piece.id, targetPosition: s });
    }
  }

  const tackles = getValidTackleTargets(piece, board.pieces, board.ballCarrierId);
  for (const t of tackles) {
    actions.push({ type: 'tackle', pieceId: piece.id, targetPieceId: t.id });
  }

  actions.push({ type: 'end', pieceId: piece.id });
  if (actions.length === 0) return { type: 'end', pieceId: piece.id };
  return actions[Math.floor(Math.random() * actions.length)];
}

// ========== FSM 状态更新 ==========

/** 根据当前感知为棋子选择下一个 AI 状态 */
export function determineNextState(context: PerceptionContext): AIState {
  const { piece, ballCarrier } = context;

  if (piece.hasBall) {
    return 'supportAttack';
  }

  if (ballCarrier) {
    if (ballCarrier.team === piece.team) {
      // 己方持球：进攻支援
      return context.distanceToEnemyGoal <= 4 ? 'supportAttack' : 'supportAttack';
    } else {
      // 对方持球：防守
      if (context.distanceToOwnGoal <= 4) return 'supportDefend';
      if (context.opponentsInTackleRange.length > 0) return 'chaseBall';
      return 'markOpponent';
    }
  }

  // 无人持球：追球
  const distToBall = manhattanDistance(piece.position, context.ballPosition);
  if (distToBall <= 2) return 'chaseBall';
  return 'returnHome';
}

// ========== 内部常量 ==========

const BOARD_SIZE = 8;

const BLACK_GOAL_POSITIONS: Position[] = [{ row: 0, col: 3 }, { row: 0, col: 4 }];
const WHITE_GOAL_POSITIONS: Position[] = [{ row: 7, col: 3 }, { row: 7, col: 4 }];

function distanceToOwnGoalFromBall(board: FootballBoard, team: 'white' | 'black'): number {
  const ownGoalPositions = team === 'white' ? WHITE_GOAL_POSITIONS : BLACK_GOAL_POSITIONS;
  return Math.min(...ownGoalPositions.map((g) => manhattanDistance(board.ballPosition, g)));
}
