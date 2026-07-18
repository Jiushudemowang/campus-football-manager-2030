import { PlayerStatsSlice, PlayerSkill, PlayerStamina } from './playerTypes';
import { getCampusPlayerById, campusPlayers } from './campusPlayers';
import { AIOpponentTeam, AIOpponentPlayer } from './aiOpponents';
import { starPlayers, StarPlayer } from './starPlayers';

export type PieceType = 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
export type Team = 'white' | 'black';
export type ControlType = 'player' | 'ai';
export type PlayerRole = 'GK' | 'CB' | 'ST' | 'LB' | 'RB' | 'CM' | 'LW' | 'RW';
export type AIState =
  | 'idle'
  | 'chaseBall'
  | 'supportAttack'
  | 'supportDefend'
  | 'markOpponent'
  | 'returnHome';
export type RoundState = 'playerInput' | 'aiThinking' | 'executing';

export interface Position {
  row: number;
  col: number;
}

export interface BoardPiece {
  id: string;
  playerId: string;
  team: Team;
  pieceType: PieceType;
  position: Position;
  hasBall: boolean;
  hasActed: boolean;
  controlType: ControlType;
  role: PlayerRole;
  homePosition: Position;
  currentState: AIState;
  stamina: PlayerStamina;
  activeSkill: PlayerSkill | null;
  skillCooldown: number;
}

export interface FootballBoard {
  pieces: BoardPiece[];
  ballPosition: Position;
  ballCarrierId: string | null;
  whiteScore: number;
  blackScore: number;
  turnCount: number;
  selectedPieceId: string | null;
  playerControlledId: string | null;
  roundState: RoundState;
  moveHistory: string[];
  gameMode: '3v3' | '9v9' | '11v11';
}

export type ActionType = 'move' | 'pass' | 'shoot' | 'tackle' | 'skill' | 'end';

export interface GameAction {
  type: ActionType;
  pieceId: string;
  targetPieceId?: string;
  targetPosition?: Position;
  priority?: number;
  skillId?: string;
}

export type AIDifficulty = 'easy' | 'normal' | 'hard';

export type AIDecisionFn = (
  board: FootballBoard,
  piece: BoardPiece,
  playerAction: GameAction | null,
  playerStats: Record<string, PlayerStatsSlice>,
  difficulty: AIDifficulty
) => GameAction | null;

export const BOARD_SIZE = 8;

export const WHITE_GOAL_ROWS = [7];
export const WHITE_GOAL_COLS = [3, 4];
export const BLACK_GOAL_ROWS = [0];
export const BLACK_GOAL_COLS = [3, 4];

export function isInBounds(pos: Position): boolean {
  return pos.row >= 0 && pos.row < BOARD_SIZE && pos.col >= 0 && pos.col < BOARD_SIZE;
}

export function isWhiteGoal(pos: Position): boolean {
  return WHITE_GOAL_ROWS.includes(pos.row) && WHITE_GOAL_COLS.includes(pos.col);
}

export function isBlackGoal(pos: Position): boolean {
  return BLACK_GOAL_ROWS.includes(pos.row) && BLACK_GOAL_COLS.includes(pos.col);
}

export function isGoal(pos: Position, team: Team): boolean {
  return team === 'white' ? isBlackGoal(pos) : isWhiteGoal(pos);
}

export function getOpponent(team: Team): Team {
  return team === 'white' ? 'black' : 'white';
}

export function getPieceTypeName(type: PieceType): string {
  const names: Record<PieceType, string> = {
    king: '门将',
    queen: '核心',
    rook: '后卫',
    bishop: '中场',
    knight: '边锋',
    pawn: '前锋'
  };
  return names[type];
}

export function getRoleName(role: PlayerRole): string {
  const names: Record<PlayerRole, string> = {
    GK: '门将',
    CB: '中卫',
    ST: '前锋',
    LB: '左后卫',
    RB: '右后卫',
    CM: '中场',
    LW: '左边锋',
    RW: '右边锋'
  };
  return names[role] || '球员';
}

export function getEffectiveStats(
  piece: BoardPiece,
  playerStats: Record<string, PlayerStatsSlice>
): PlayerStatsSlice {
  return (
    playerStats[piece.playerId] || {
      speed: 50,
      shooting: 50,
      passing: 50,
      dribbling: 50,
      defense: 50,
      physical: 50
    }
  );
}

export function getStaminaMultiplier(piece: BoardPiece): number {
  const staminaPercent = piece.stamina.currentStamina / piece.stamina.maxStamina;
  if (staminaPercent > 0.6) return 1.0;
  if (staminaPercent > 0.3) return 0.7;
  return 0.4;
}

export function getMovementRange(piece: BoardPiece, playerStats: Record<string, PlayerStatsSlice>): number {
  const stats = getEffectiveStats(piece, playerStats);
  const base = Math.max(1, Math.floor(stats.speed / 35));
  const staminaMult = getStaminaMultiplier(piece);
  return Math.min(3, Math.floor(base * staminaMult));
}

export function getPassingRange(piece: BoardPiece, playerStats: Record<string, PlayerStatsSlice>): number {
  const stats = getEffectiveStats(piece, playerStats);
  return Math.min(5, Math.max(2, Math.floor(stats.passing / 35)));
}

export function getShootingRange(piece: BoardPiece, playerStats: Record<string, PlayerStatsSlice>): number {
  const stats = getEffectiveStats(piece, playerStats);
  return Math.min(4, Math.max(2, Math.floor(stats.shooting / 35)));
}

export function consumeStamina(piece: BoardPiece, amount: number): PlayerStamina {
  return {
    ...piece.stamina,
    currentStamina: Math.max(0, piece.stamina.currentStamina - amount)
  };
}

export function regenerateStamina(piece: BoardPiece): PlayerStamina {
  return {
    ...piece.stamina,
    currentStamina: Math.min(
      piece.stamina.maxStamina,
      piece.stamina.currentStamina + piece.stamina.staminaRegen
    )
  };
}

export function manhattanDistance(a: Position, b: Position): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function positionKey(pos: Position): string {
  return `${pos.row},${pos.col}`;
}

export function getPieceAt(pieces: BoardPiece[], pos: Position): BoardPiece | undefined {
  return pieces.find((p) => p.position.row === pos.row && p.position.col === pos.col);
}

export function getBallCarrier(pieces: BoardPiece[], ballCarrierId: string | null): BoardPiece | undefined {
  if (!ballCarrierId) return undefined;
  return pieces.find((p) => p.id === ballCarrierId);
}

export function getPlayerControlledPiece(board: FootballBoard): BoardPiece | undefined {
  if (!board.playerControlledId) return undefined;
  return board.pieces.find((p) => p.id === board.playerControlledId);
}

export function getValidMovePositions(
  piece: BoardPiece,
  allPieces: BoardPiece[],
  playerStats: Record<string, PlayerStatsSlice>
): Position[] {
  const range = getMovementRange(piece, playerStats);
  const ownPositions = new Set(
    allPieces.filter((p) => p.team === piece.team).map((p) => positionKey(p.position))
  );
  const enemyPositions = new Set(
    allPieces.filter((p) => p.team !== piece.team).map((p) => positionKey(p.position))
  );

  const results: Position[] = [];
  const visited = new Set<string>([positionKey(piece.position)]);
  const queue: Array<{ pos: Position; dist: number }> = [{ pos: piece.position, dist: 0 }];

  const dirs = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1]
  ];

  while (queue.length > 0) {
    const { pos, dist } = queue.shift()!;
    if (dist > 0 && !enemyPositions.has(positionKey(pos))) {
      results.push(pos);
    }
    if (dist >= range) continue;

    for (const [dr, dc] of dirs) {
      const np = { row: pos.row + dr, col: pos.col + dc };
      const key = positionKey(np);
      if (!isInBounds(np) || visited.has(key)) continue;
      if (ownPositions.has(key)) continue;
      visited.add(key);
      queue.push({ pos: np, dist: dist + 1 });
    }
  }

  return results;
}

export function getValidPassTargets(
  piece: BoardPiece,
  allPieces: BoardPiece[],
  playerStats: Record<string, PlayerStatsSlice>
): BoardPiece[] {
  if (!piece.hasBall) return [];
  const range = getPassingRange(piece, playerStats);
  const teammates = allPieces.filter((p) => p.team === piece.team && p.id !== piece.id);
  return teammates.filter((target) => manhattanDistance(piece.position, target.position) <= range);
}

export function getValidShootTargets(
  piece: BoardPiece,
  _allPieces: BoardPiece[],
  playerStats: Record<string, PlayerStatsSlice>
): Position[] {
  if (!piece.hasBall) return [];
  const range = getShootingRange(piece, playerStats);
  const goalPositions = piece.team === 'white' ? BLACK_GOAL_POSITIONS : WHITE_GOAL_POSITIONS;
  return goalPositions.filter((goal) => manhattanDistance(piece.position, goal) <= range);
}

const BLACK_GOAL_POSITIONS: Position[] = BLACK_GOAL_ROWS.flatMap((row) =>
  BLACK_GOAL_COLS.map((col) => ({ row, col }))
);
const WHITE_GOAL_POSITIONS: Position[] = WHITE_GOAL_ROWS.flatMap((row) =>
  WHITE_GOAL_COLS.map((col) => ({ row, col }))
);

export function getValidTackleTargets(
  piece: BoardPiece,
  allPieces: BoardPiece[],
  ballCarrierId: string | null
): BoardPiece[] {
  const carrier = getBallCarrier(allPieces, ballCarrierId);
  if (!carrier || carrier.team === piece.team) return [];
  if (manhattanDistance(piece.position, carrier.position) !== 1) return [];
  return [carrier];
}

function syncBallState(board: FootballBoard): FootballBoard {
  const carrier = board.pieces.find((p) => p.hasBall);
  if (!carrier) {
    return { ...board, ballCarrierId: null };
  }
  return {
    ...board,
    ballPosition: { ...carrier.position },
    ballCarrierId: carrier.id,
    pieces: board.pieces.map((p) => (p.id === carrier.id ? p : { ...p, hasBall: false }))
  };
}

export function movePiece(
  board: FootballBoard,
  pieceId: string,
  targetPosition: Position,
  playerStats: Record<string, PlayerStatsSlice>
): FootballBoard {
  const piece = board.pieces.find((p) => p.id === pieceId);
  if (!piece) return board;

  const occupant = getPieceAt(board.pieces, targetPosition);
  if (occupant && occupant.id !== pieceId) return board;

  const validMoves = getValidMovePositions(piece, board.pieces, playerStats);
  if (!validMoves.some((m) => m.row === targetPosition.row && m.col === targetPosition.col)) {
    return board;
  }

  const distance = manhattanDistance(piece.position, targetPosition);
  const staminaCost = distance * 5;

  let newPieces = board.pieces.map((p) => {
    if (p.id === pieceId) {
      return {
        ...p,
        position: targetPosition,
        stamina: consumeStamina(p, staminaCost),
        hasActed: true
      };
    }
    return p;
  });

  if (piece.hasBall) {
    newPieces = newPieces.map((p) => (p.id === pieceId ? { ...p, hasBall: true } : p));
  }

  let newBoard: FootballBoard = {
    ...board,
    pieces: newPieces,
    ballPosition: piece.hasBall ? { ...targetPosition } : { ...board.ballPosition }
  };

  newBoard = syncBallState(newBoard);
  newBoard.moveHistory.push(`${piece.playerId} 移动到 (${targetPosition.row},${targetPosition.col})`);
  return newBoard;
}

export function passBall(
  board: FootballBoard,
  fromPieceId: string,
  toPieceId: string,
  playerStats: Record<string, PlayerStatsSlice>
): FootballBoard {
  const fromPiece = board.pieces.find((p) => p.id === fromPieceId);
  const toPiece = board.pieces.find((p) => p.id === toPieceId);
  if (!fromPiece || !toPiece) return board;
  if (!fromPiece.hasBall) return board;
  if (fromPiece.team !== toPiece.team) return board;

  const range = getPassingRange(fromPiece, playerStats);
  const distance = manhattanDistance(fromPiece.position, toPiece.position);
  if (distance > range) return board;

  const stats = getEffectiveStats(fromPiece, playerStats);
  let successChance = Math.max(0.3, stats.passing / 100 - distance * 0.05);

  const fromPlayer = getCampusPlayerById(fromPiece.playerId);
  if (fromPlayer?.uniqueSkill?.effectType === 'pass_power') {
    successChance += fromPlayer.uniqueSkill.effectValue / 100;
  }

  const success = Math.random() < successChance;

  let newBoard: FootballBoard = { ...board, pieces: [...board.pieces] };

  if (success) {
    newBoard.pieces = newBoard.pieces.map((p) => {
      if (p.id === fromPieceId) return { ...p, hasBall: false, stamina: consumeStamina(p, 10), hasActed: true };
      if (p.id === toPieceId) return { ...p, hasBall: true };
      return { ...p, hasBall: false };
    });
    newBoard.ballPosition = { ...toPiece.position };
    newBoard.ballCarrierId = toPieceId;
    newBoard.moveHistory.push(`${fromPiece.playerId} 传球给 ${toPiece.playerId} 成功`);
  } else {
    const neighbors = [
      { row: toPiece.position.row - 1, col: toPiece.position.col },
      { row: toPiece.position.row + 1, col: toPiece.position.col },
      { row: toPiece.position.row, col: toPiece.position.col - 1 },
      { row: toPiece.position.row, col: toPiece.position.col + 1 }
    ].filter(isInBounds);
    const dropPos = neighbors[Math.floor(Math.random() * neighbors.length)] || toPiece.position;
    newBoard.pieces = newBoard.pieces.map((p) => ({ ...p, hasBall: false, stamina: p.id === fromPieceId ? consumeStamina(p, 10) : p.stamina }));
    newBoard.ballPosition = dropPos;
    newBoard.ballCarrierId = null;
    newBoard.moveHistory.push(`${fromPiece.playerId} 传球给 ${toPiece.playerId} 失败，球落地`);
  }

  newBoard = syncBallState(newBoard);
  return newBoard;
}

export function shootBall(
  board: FootballBoard,
  pieceId: string,
  targetGoal: Position,
  playerStats: Record<string, PlayerStatsSlice>
): FootballBoard {
  const piece = board.pieces.find((p) => p.id === pieceId);
  if (!piece || !piece.hasBall) return board;

  const validTargets = getValidShootTargets(piece, board.pieces, playerStats);
  if (!validTargets.some((t) => t.row === targetGoal.row && t.col === targetGoal.col)) return board;

  const stats = getEffectiveStats(piece, playerStats);
  const distance = manhattanDistance(piece.position, targetGoal);
  let successChance = Math.max(0.1, stats.shooting / 100 - distance * 0.1);

  const player = getCampusPlayerById(piece.playerId);
  if (player?.uniqueSkill?.effectType === 'shoot_power') {
    successChance += player.uniqueSkill.effectValue / 100;
  }

  const goalie = board.pieces.find(
    (p) =>
      p.team !== piece.team &&
      p.role === 'GK' &&
      Math.abs(p.position.row - targetGoal.row) <= 1 &&
      Math.abs(p.position.col - targetGoal.col) <= 1
  );

  let finalChance = successChance;
  if (goalie) {
    const goalieStats = getEffectiveStats(goalie, playerStats);
    let saveChance = Math.min(0.8, Math.max(0.2, goalieStats.defense / 100));

    const goaliePlayer = getCampusPlayerById(goalie.playerId);
    if (goaliePlayer?.uniqueSkill?.effectType === 'goalkeeper_save') {
      saveChance += goaliePlayer.uniqueSkill.effectValue / 100;
    }

    const angleBonus = 1 - Math.abs(targetGoal.col - goalie.position.col) / 3;
    saveChance *= angleBonus;

    finalChance = successChance * (1 - saveChance);
  }

  const success = Math.random() < finalChance;

  let newBoard: FootballBoard = { ...board, pieces: [...board.pieces] };

  if (success) {
    if (piece.team === 'white') newBoard.whiteScore += 1;
    else newBoard.blackScore += 1;

    newBoard.moveHistory.push(
      `⚽ ${piece.playerId} 进球！白队 ${newBoard.whiteScore}:${newBoard.blackScore} 黑队`
    );
    newBoard = resetBallAfterGoal(newBoard, getOpponent(piece.team));
  } else {
    const neighbors = [
      { row: targetGoal.row, col: targetGoal.col - 1 },
      { row: targetGoal.row, col: targetGoal.col + 1 },
      { row: targetGoal.row + (piece.team === 'white' ? 1 : -1), col: targetGoal.col }
    ].filter(isInBounds);
    const dropPos = neighbors[Math.floor(Math.random() * neighbors.length)] || targetGoal;
    newBoard.pieces = newBoard.pieces.map((p) => ({ ...p, hasBall: false }));
    newBoard.ballPosition = dropPos;
    newBoard.ballCarrierId = null;
    newBoard.moveHistory.push(`${piece.playerId} 射门偏出`);
  }

  newBoard.pieces = newBoard.pieces.map((p) =>
    p.id === pieceId ? { ...p, stamina: consumeStamina(p, 20), hasActed: true } : p
  );

  newBoard = syncBallState(newBoard);
  return newBoard;
}

export function tackleBall(
  board: FootballBoard,
  defenderId: string,
  attackerId: string,
  playerStats: Record<string, PlayerStatsSlice>
): FootballBoard {
  const defender = board.pieces.find((p) => p.id === defenderId);
  const attacker = board.pieces.find((p) => p.id === attackerId);
  if (!defender || !attacker) return board;
  if (defender.team === attacker.team) return board;
  if (manhattanDistance(defender.position, attacker.position) !== 1) return board;
  if (!attacker.hasBall) return board;

  const defenderStats = getEffectiveStats(defender, playerStats);
  const attackerStats = getEffectiveStats(attacker, playerStats);

  let tacklePower = (defenderStats.defense + defenderStats.physical) / 2;
  let dribbleSkill = attackerStats.dribbling;

  const defenderPlayer = getCampusPlayerById(defender.playerId);
  if (defenderPlayer?.uniqueSkill?.effectType === 'tackle_power') {
    tacklePower += defenderPlayer.uniqueSkill.effectValue;
  }

  const attackerPlayer = getCampusPlayerById(attacker.playerId);
  if (attackerPlayer?.uniqueSkill?.effectType === 'dribble_protect') {
    dribbleSkill += attackerPlayer.uniqueSkill.effectValue;
  }

  const tackleChance = Math.min(0.85, Math.max(0.2, tacklePower / (tacklePower + dribbleSkill)));
  const success = Math.random() < tackleChance;

  let newBoard: FootballBoard = { ...board, pieces: [...board.pieces] };

  if (success) {
    newBoard.pieces = newBoard.pieces.map((p) => {
      if (p.id === defenderId) return { ...p, hasBall: true, stamina: consumeStamina(p, 15), hasActed: true };
      if (p.id === attackerId) return { ...p, hasBall: false };
      return { ...p, hasBall: false };
    });
    newBoard.moveHistory.push(`${defender.playerId} 抢断 ${attacker.playerId} 成功`);
  } else {
    newBoard.pieces = newBoard.pieces.map((p) =>
      p.id === defenderId ? { ...p, stamina: consumeStamina(p, 10) } : p
    );
    newBoard.moveHistory.push(`${defender.playerId} 抢断 ${attacker.playerId} 失败`);
  }

  newBoard = syncBallState(newBoard);
  return newBoard;
}

export function applySkill(
  board: FootballBoard,
  pieceId: string,
  skillId: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: Record<string, PlayerStatsSlice>
): FootballBoard {
  const piece = board.pieces.find((p) => p.id === pieceId);
  if (!piece) return board;

  const player = getCampusPlayerById(piece.playerId);
  const skill = player?.uniqueSkill;
  if (!skill || skill.id !== skillId) return board;
  if (piece.skillCooldown > 0) return board;
  if (piece.stamina.currentStamina < skill.staminaCost) return board;

  let newBoard: FootballBoard = { ...board, pieces: [...board.pieces] };

  if (skill.effectType === 'speed_boost') {
    newBoard.pieces = newBoard.pieces.map((p) => {
      if (p.id === pieceId) {
        return {
          ...p,
          activeSkill: skill,
          stamina: consumeStamina(p, skill.staminaCost),
          hasActed: true,
          skillCooldown: skill.cooldown
        };
      }
      return p;
    });
    newBoard.moveHistory.push(`${piece.playerId} 激活技能「${skill.name}」！`);
  } else if (skill.effectType === 'defense_boost') {
    newBoard.pieces = newBoard.pieces.map((p) => {
      if (p.team === piece.team) {
        return { ...p, skillCooldown: skill.cooldown };
      }
      return p;
    });
    newBoard.pieces = newBoard.pieces.map((p) =>
      p.id === pieceId ? { ...p, stamina: consumeStamina(p, skill.staminaCost), hasActed: true } : p
    );
    newBoard.moveHistory.push(`${piece.playerId} 激活技能「${skill.name}」！全队防守提升！`);
  } else if (skill.effectType === 'counter_attack') {
    newBoard.pieces = newBoard.pieces.map((p) => {
      if (p.id === pieceId) {
        return {
          ...p,
          activeSkill: skill,
          stamina: consumeStamina(p, skill.staminaCost),
          hasActed: true,
          skillCooldown: skill.cooldown
        };
      }
      return p;
    });
    newBoard.moveHistory.push(`${piece.playerId} 激活技能「${skill.name}」！反击准备！`);
  } else {
    newBoard.pieces = newBoard.pieces.map((p) => {
      if (p.id === pieceId) {
        return {
          ...p,
          activeSkill: skill,
          stamina: consumeStamina(p, skill.staminaCost),
          hasActed: true,
          skillCooldown: skill.cooldown
        };
      }
      return p;
    });
    newBoard.moveHistory.push(`${piece.playerId} 激活技能「${skill.name}」！`);
  }

  newBoard = syncBallState(newBoard);
  return newBoard;
}

export function resetBallAfterGoal(board: FootballBoard, concedingTeam: Team): FootballBoard {
  const centerPositions: Position[] = [
    { row: 3, col: 3 },
    { row: 3, col: 4 },
    { row: 4, col: 3 },
    { row: 4, col: 4 }
  ];

  const teamPieces = board.pieces.filter((p) => p.team === concedingTeam);
  const queen = teamPieces.find((p) => p.pieceType === 'queen');

  let newPieces = board.pieces.map((p) => ({ ...p, hasBall: false }));

  if (queen) {
    newPieces = newPieces.map((p) => (p.id === queen.id ? { ...p, hasBall: true } : p));
  } else {
    let closest = teamPieces[0];
    let minDist = Infinity;
    for (const piece of teamPieces) {
      for (const center of centerPositions) {
        const dist = manhattanDistance(piece.position, center);
        if (dist < minDist) {
          minDist = dist;
          closest = piece;
        }
      }
    }
    if (closest) {
      newPieces = newPieces.map((p) => (p.id === closest.id ? { ...p, hasBall: true } : p));
    }
  }

  let newBoard: FootballBoard = {
    ...board,
    pieces: newPieces
  };

  newBoard = syncBallState(newBoard);
  return newBoard;
}

export function applyAction(
  board: FootballBoard,
  action: GameAction,
  playerStats: Record<string, PlayerStatsSlice>
): FootballBoard {
  switch (action.type) {
    case 'move':
      if (!action.targetPosition) return board;
      return movePiece(board, action.pieceId, action.targetPosition, playerStats);
    case 'pass':
      if (!action.targetPieceId) return board;
      return passBall(board, action.pieceId, action.targetPieceId, playerStats);
    case 'shoot':
      if (!action.targetPosition) return board;
      return shootBall(board, action.pieceId, action.targetPosition, playerStats);
    case 'tackle':
      if (!action.targetPieceId) return board;
      return tackleBall(board, action.pieceId, action.targetPieceId, playerStats);
    case 'skill':
      if (!action.skillId) return board;
      return applySkill(board, action.pieceId, action.skillId, playerStats);
    case 'end':
      return board;
    default:
      return board;
  }
}

export function switchPlayerControl(board: FootballBoard, pieceId: string): FootballBoard {
  const piece = board.pieces.find((p) => p.id === pieceId);
  if (!piece || piece.team !== 'white') return board;

  return {
    ...board,
    pieces: board.pieces.map((p) =>
      p.id === pieceId ? { ...p, controlType: 'player' as ControlType } : { ...p, controlType: 'ai' as ControlType }
    ),
    playerControlledId: pieceId,
    selectedPieceId: pieceId
  };
}

export function startNewRound(board: FootballBoard): FootballBoard {
  const resetPieces = board.pieces.map((p) => ({
    ...p,
    hasActed: false,
    stamina: regenerateStamina(p),
    skillCooldown: Math.max(0, p.skillCooldown - 1),
    activeSkill: p.skillCooldown <= 1 ? null : p.activeSkill
  }));

  const firstWhite = resetPieces.find((p) => p.team === 'white');
  const playerControlledId = firstWhite?.id || board.playerControlledId;

  return {
    ...board,
    pieces: resetPieces.map((p) =>
      p.id === playerControlledId ? { ...p, controlType: 'player' as ControlType } : { ...p, controlType: 'ai' as ControlType }
    ),
    turnCount: board.turnCount + 1,
    roundState: 'playerInput',
    selectedPieceId: playerControlledId,
    playerControlledId
  };
}

export function executeRound(
  board: FootballBoard,
  playerAction: GameAction | null,
  playerStats: Record<string, PlayerStatsSlice>,
  aiDifficulty: AIDifficulty,
  aiDecisionFn: AIDecisionFn
): FootballBoard {
  let newBoard: FootballBoard = { ...board, roundState: 'executing' };

  const scoreBefore = { white: newBoard.whiteScore, black: newBoard.blackScore };
  if (playerAction && playerAction.type !== 'end') {
    newBoard = applyAction(newBoard, playerAction, playerStats);
  }

  if (newBoard.whiteScore !== scoreBefore.white || newBoard.blackScore !== scoreBefore.black) {
    return startNewRound(newBoard);
  }

  // 如果还有己方球员未行动，让玩家继续控制下一名球员
  const remainingWhite = newBoard.pieces.some((p) => p.team === 'white' && !p.hasActed);
  if (remainingWhite) {
    const nextWhite = newBoard.pieces.find((p) => p.team === 'white' && !p.hasActed);
    const nextId = nextWhite?.id || newBoard.playerControlledId;
    return {
      ...newBoard,
      roundState: 'playerInput',
      playerControlledId: nextId,
      selectedPieceId: nextId,
      pieces: newBoard.pieces.map((p) =>
        p.id === nextId
          ? { ...p, controlType: 'player' as ControlType }
          : { ...p, controlType: 'ai' as ControlType }
      )
    };
  }

  // 所有己方球员行动完毕，触发黑方 AI 回合
  const aiActions = collectAIActions(newBoard, playerAction, playerStats, aiDifficulty, aiDecisionFn);
  const blackActions = aiActions.filter((a) => {
    const piece = newBoard.pieces.find((p) => p.id === a.pieceId);
    return piece && piece.team === 'black';
  });
  const resolvedActions = resolveActionConflicts(newBoard, blackActions);
  newBoard = executeActionsInBatch(newBoard, resolvedActions, playerStats);

  return startNewRound(newBoard);
}

export function collectAIActions(
  board: FootballBoard,
  playerAction: GameAction | null,
  playerStats: Record<string, PlayerStatsSlice>,
  difficulty: AIDifficulty,
  aiDecisionFn: AIDecisionFn
): GameAction[] {
  const actions: GameAction[] = [];

  for (const piece of board.pieces) {
    if (piece.hasActed) continue;
    if (piece.controlType === 'player') continue;

    const visiblePlayerAction = piece.team === 'white' ? playerAction : null;
    const action = aiDecisionFn(board, piece, visiblePlayerAction, playerStats, difficulty);
    if (action) {
      actions.push(action);
    }
  }

  return actions;
}

export function resolveActionConflicts(
  board: FootballBoard,
  actions: GameAction[]
): GameAction[] {
  const resolved: GameAction[] = [];
  const claimedPositions = new Set<string>();
  const claimedTargets = new Set<string>();
  const claimedTackleTargets = new Set<string>();

  const sorted = [...actions].sort((a, b) => {
    const priorityOrder = { tackle: 4, shoot: 3, skill: 3, pass: 2, move: 1, end: 0 };
    return (priorityOrder[b.type] || 0) - (priorityOrder[a.type] || 0);
  });

  for (const action of sorted) {
    if (action.type === 'move' && action.targetPosition) {
      const key = positionKey(action.targetPosition);
      if (claimedPositions.has(key)) continue;
      claimedPositions.add(key);
      resolved.push(action);
    } else if (action.type === 'pass' && action.targetPieceId) {
      if (claimedTargets.has(action.targetPieceId)) continue;
      claimedTargets.add(action.targetPieceId);
      resolved.push(action);
    } else if (action.type === 'tackle' && action.targetPieceId) {
      if (claimedTackleTargets.has(action.targetPieceId)) continue;
      claimedTackleTargets.add(action.targetPieceId);
      resolved.push(action);
    } else {
      resolved.push(action);
    }
  }

  return resolved;
}

export function executeActionsInBatch(
  board: FootballBoard,
  actions: GameAction[],
  playerStats: Record<string, PlayerStatsSlice>
): FootballBoard {
  const priorityOrder: Record<ActionType, number> = { tackle: 4, shoot: 3, skill: 3, pass: 2, move: 1, end: 0 };
  const sorted = [...actions].sort((a, b) => priorityOrder[b.type] - priorityOrder[a.type]);

  let newBoard = board;
  for (const action of sorted) {
    newBoard = applyAction(newBoard, action, playerStats);
  }

  return newBoard;
}

export function getRoleFromPieceType(pieceType: PieceType): PlayerRole {
  switch (pieceType) {
    case 'king':
      return 'GK';
    case 'queen':
      return 'ST';
    case 'rook':
      return 'CB';
    case 'bishop':
      return 'CM';
    case 'knight':
      return 'LW';
    case 'pawn':
      return 'ST';
    default:
      return 'ST';
  }
}

function createStamina(physical: number): PlayerStamina {
  return {
    maxStamina: Math.floor(physical * 1.5),
    currentStamina: Math.floor(physical * 1.5),
    staminaRegen: Math.floor(physical / 10)
  };
}

export function initializeBoard3v3(activeSquadIds?: string[]): FootballBoard {
  const pieces: BoardPiece[] = [];
  const gameMode = '3v3' as const;

  if (activeSquadIds && activeSquadIds.length >= 3) {
    const squadPlayers = activeSquadIds
      .map((id) => getCampusPlayerById(id))
      .filter((p): p is import('./playerTypes').CampusPlayer => p !== undefined);

    const positionMap = {
      king: { row: 7, col: 3 },
      rook: { row: 6, col: 2 },
      queen: { row: 5, col: 4 }
    };

    const byPiece: Record<PieceType, import('./playerTypes').CampusPlayer[]> = {
      king: [],
      queen: [],
      rook: [],
      bishop: [],
      knight: [],
      pawn: []
    };
    squadPlayers.forEach((p) => {
      const pieceType = p.chessPiece as PieceType;
      if (byPiece[pieceType]) {
        byPiece[pieceType].push(p);
      }
    });

    const addPiece = (
      player: import('./playerTypes').CampusPlayer,
      pos: Position,
      suffix: string,
      hasBall: boolean
    ) => {
      const role = getRoleFromPieceType(player.chessPiece as PieceType);
      pieces.push({
        id: `w-${player.chessPiece}-${suffix}`,
        playerId: player.id,
        team: 'white',
        pieceType: player.chessPiece as PieceType,
        position: pos,
        hasBall,
        hasActed: false,
        controlType: 'ai',
        role,
        homePosition: { ...pos },
        currentState: 'idle',
        stamina: player.stamina || createStamina(player.stats.physical),
        activeSkill: null,
        skillCooldown: 0
      });
    };

    if (byPiece.king.length > 0) {
      addPiece(byPiece.king[0], positionMap.king, '1', false);
    }

    let ballAssigned = false;
    if (byPiece.queen.length > 0) {
      addPiece(byPiece.queen[0], positionMap.queen, '1', true);
      ballAssigned = true;
    }

    if (byPiece.rook.length > 0) {
      addPiece(byPiece.rook[0], positionMap.rook, '1', false);
    }

    const remaining = [
      ...byPiece.pawn,
      ...byPiece.king.slice(1),
      ...byPiece.queen.slice(1),
      ...byPiece.rook.slice(1),
      ...byPiece.bishop,
      ...byPiece.knight
    ];

    const fallbackPositions = [
      { row: 6, col: 4 },
      { row: 5, col: 3 },
      { row: 6, col: 3 }
    ];

    remaining.slice(0, 3 - pieces.length).forEach((player, i) => {
      const pos = fallbackPositions[i % fallbackPositions.length];
      const pieceType = player.chessPiece as PieceType;
      const role = getRoleFromPieceType(pieceType);
      pieces.push({
        id: `w-${player.chessPiece}-fallback${i}`,
        playerId: player.id,
        team: 'white',
        pieceType,
        position: pos,
        hasBall: !ballAssigned && i === 0,
        hasActed: false,
        controlType: 'ai',
        role,
        homePosition: { ...pos },
        currentState: 'idle',
        stamina: player.stamina || createStamina(player.stats.physical),
        activeSkill: null,
        skillCooldown: 0
      });
      if (!ballAssigned && i === 0) ballAssigned = true;
    });
  }

  if (pieces.filter((p) => p.team === 'white').length === 0) {
    pieces.push(
      { id: 'w-king', playerId: 'wuyanming', team: 'white', pieceType: 'king', position: { row: 7, col: 3 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'GK', homePosition: { row: 7, col: 3 }, currentState: 'idle', stamina: createStamina(82), activeSkill: null, skillCooldown: 0 },
      { id: 'w-rook', playerId: 'xiayibo', team: 'white', pieceType: 'rook', position: { row: 6, col: 2 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CB', homePosition: { row: 6, col: 2 }, currentState: 'idle', stamina: createStamina(82), activeSkill: null, skillCooldown: 0 },
      { id: 'w-queen', playerId: 'wuerken', team: 'white', pieceType: 'queen', position: { row: 5, col: 4 }, hasBall: true, hasActed: false, controlType: 'ai', role: 'ST', homePosition: { row: 5, col: 4 }, currentState: 'idle', stamina: createStamina(92), activeSkill: null, skillCooldown: 0 }
    );
  }

  pieces.push(
    { id: 'b-king', playerId: 'neuer', team: 'black', pieceType: 'king', position: { row: 0, col: 4 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'GK', homePosition: { row: 0, col: 4 }, currentState: 'idle', stamina: createStamina(85), activeSkill: null, skillCooldown: 0 },
    { id: 'b-rook', playerId: 'ramos', team: 'black', pieceType: 'rook', position: { row: 1, col: 5 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CB', homePosition: { row: 1, col: 5 }, currentState: 'idle', stamina: createStamina(90), activeSkill: null, skillCooldown: 0 },
    { id: 'b-queen', playerId: 'messi', team: 'black', pieceType: 'queen', position: { row: 2, col: 3 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'ST', homePosition: { row: 2, col: 3 }, currentState: 'idle', stamina: createStamina(88), activeSkill: null, skillCooldown: 0 }
  );

  const ballHolder = pieces.find((p) => p.team === 'white' && p.hasBall);
  const queenPiece = pieces.find((p) => p.team === 'white' && p.pieceType === 'queen');
  const playerControlledId = queenPiece ? queenPiece.id : pieces[0]?.id || null;

  const finalPieces = pieces.map((p) =>
    p.id === playerControlledId ? { ...p, controlType: 'player' as ControlType } : p
  );

  const board: FootballBoard = {
    pieces: finalPieces,
    ballPosition: ballHolder ? { ...ballHolder.position } : { row: 4, col: 4 },
    ballCarrierId: ballHolder ? ballHolder.id : null,
    whiteScore: 0,
    blackScore: 0,
    turnCount: 0,
    selectedPieceId: playerControlledId,
    playerControlledId,
    roundState: 'playerInput',
    moveHistory: [],
    gameMode
  };

  return syncBallState(board);
}

export function initializeBoard9v9(activeSquadIds?: string[]): FootballBoard {
  const pieces: BoardPiece[] = [];

  if (activeSquadIds && activeSquadIds.length >= 3) {
    const squadPlayers = activeSquadIds
      .map((id) => getCampusPlayerById(id))
      .filter((p): p is import('./playerTypes').CampusPlayer => p !== undefined);

    const positionMap: Record<string, Position> = {
      king: { row: 7, col: 3 },
      rook1: { row: 6, col: 1 },
      rook2: { row: 6, col: 6 },
      rook3: { row: 6, col: 3 },
      bishop1: { row: 5, col: 2 },
      bishop2: { row: 5, col: 5 },
      knight1: { row: 4, col: 0 },
      knight2: { row: 4, col: 7 },
      queen: { row: 4, col: 4 }
    };

    const byPiece: Record<string, import('./playerTypes').CampusPlayer[]> = {
      king: [],
      queen: [],
      rook: [],
      bishop: [],
      knight: [],
      pawn: []
    };
    squadPlayers.forEach((p) => {
      byPiece[p.chessPiece].push(p);
    });

    const usedPositions = new Set<string>();

    const addPiece = (
      player: import('./playerTypes').CampusPlayer,
      pos: Position,
      suffix: string,
      hasBall: boolean
    ) => {
      const pieceType = player.chessPiece as PieceType;
      const role = getRoleFromPieceType(pieceType);
      pieces.push({
        id: `w-${player.chessPiece}-${suffix}`,
        playerId: player.id,
        team: 'white',
        pieceType,
        position: pos,
        hasBall,
        hasActed: false,
        controlType: 'ai',
        role,
        homePosition: { ...pos },
        currentState: 'idle',
        stamina: player.stamina || createStamina(player.stats.physical),
        activeSkill: null,
        skillCooldown: 0
      });
      usedPositions.add(`${pos.row},${pos.col}`);
    };

    let ballAssigned = false;

    if (byPiece.king.length > 0) {
      addPiece(byPiece.king[0], positionMap.king, '1', false);
    }

    if (byPiece.queen.length > 0) {
      addPiece(byPiece.queen[0], positionMap.queen, '1', true);
      ballAssigned = true;
    }

    byPiece.rook.slice(0, 3).forEach((p, i) => {
      const positions = [positionMap.rook1, positionMap.rook2, positionMap.rook3];
      addPiece(p, positions[i], `${i + 1}`, false);
    });

    byPiece.bishop.slice(0, 2).forEach((p, i) => {
      addPiece(p, i === 0 ? positionMap.bishop1 : positionMap.bishop2, `${i + 1}`, false);
    });

    byPiece.knight.slice(0, 2).forEach((p, i) => {
      addPiece(p, i === 0 ? positionMap.knight1 : positionMap.knight2, `${i + 1}`, false);
    });

    const overflow = [
      ...byPiece.pawn,
      ...byPiece.king.slice(1),
      ...byPiece.queen.slice(1),
      ...byPiece.rook.slice(3),
      ...byPiece.bishop.slice(2),
      ...byPiece.knight.slice(2)
    ];

    const fallbackPositions: Position[] = [
      { row: 5, col: 0 },
      { row: 5, col: 7 },
      { row: 6, col: 0 },
      { row: 6, col: 7 },
      { row: 7, col: 0 },
      { row: 7, col: 7 },
      { row: 4, col: 1 },
      { row: 4, col: 6 },
      { row: 5, col: 3 },
      { row: 5, col: 4 }
    ];

    overflow.slice(0, 9 - pieces.length).forEach((player, i) => {
      const pos =
        fallbackPositions.find((p) => !usedPositions.has(`${p.row},${p.col}`)) ||
        fallbackPositions[i % fallbackPositions.length];
      addPiece(player, pos, `ov${i + 1}`, !ballAssigned && i === 0);
      if (!ballAssigned && i === 0) ballAssigned = true;
    });
  }

  if (pieces.filter((p) => p.team === 'white').length === 0) {
    pieces.push(
      { id: 'w-king', playerId: 'wuyanming', team: 'white', pieceType: 'king', position: { row: 7, col: 3 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'GK', homePosition: { row: 7, col: 3 }, currentState: 'idle', stamina: createStamina(82), activeSkill: null, skillCooldown: 0 },
      { id: 'w-rook1', playerId: 'wuzhiming', team: 'white', pieceType: 'rook', position: { row: 6, col: 1 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CB', homePosition: { row: 6, col: 1 }, currentState: 'idle', stamina: createStamina(76), activeSkill: null, skillCooldown: 0 },
      { id: 'w-rook2', playerId: 'xiayibo', team: 'white', pieceType: 'rook', position: { row: 6, col: 6 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'LB', homePosition: { row: 6, col: 6 }, currentState: 'idle', stamina: createStamina(82), activeSkill: null, skillCooldown: 0 },
      { id: 'w-rook3', playerId: 'tangjiarui', team: 'white', pieceType: 'rook', position: { row: 6, col: 3 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CB', homePosition: { row: 6, col: 3 }, currentState: 'idle', stamina: createStamina(85), activeSkill: null, skillCooldown: 0 },
      { id: 'w-bishop1', playerId: 'liujunzhe', team: 'white', pieceType: 'rook', position: { row: 5, col: 2 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CM', homePosition: { row: 5, col: 2 }, currentState: 'idle', stamina: createStamina(82), activeSkill: null, skillCooldown: 0 },
      { id: 'w-bishop2', playerId: 'sunyiwen', team: 'white', pieceType: 'rook', position: { row: 5, col: 5 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CM', homePosition: { row: 5, col: 5 }, currentState: 'idle', stamina: createStamina(80), activeSkill: null, skillCooldown: 0 },
      { id: 'w-knight1', playerId: 'wangkaishuo', team: 'white', pieceType: 'rook', position: { row: 4, col: 0 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'LW', homePosition: { row: 4, col: 0 }, currentState: 'idle', stamina: createStamina(82), activeSkill: null, skillCooldown: 0 },
      { id: 'w-knight2', playerId: 'luosangluobu', team: 'white', pieceType: 'rook', position: { row: 4, col: 7 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'RW', homePosition: { row: 4, col: 7 }, currentState: 'idle', stamina: createStamina(80), activeSkill: null, skillCooldown: 0 },
      { id: 'w-queen', playerId: 'wuerken', team: 'white', pieceType: 'queen', position: { row: 4, col: 4 }, hasBall: true, hasActed: false, controlType: 'ai', role: 'ST', homePosition: { row: 4, col: 4 }, currentState: 'idle', stamina: createStamina(92), activeSkill: null, skillCooldown: 0 }
    );
  }

  pieces.push(
    { id: 'b-king', playerId: 'neuer', team: 'black', pieceType: 'king', position: { row: 0, col: 4 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'GK', homePosition: { row: 0, col: 4 }, currentState: 'idle', stamina: createStamina(85), activeSkill: null, skillCooldown: 0 },
    { id: 'b-rook1', playerId: 'ramos', team: 'black', pieceType: 'rook', position: { row: 1, col: 1 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CB', homePosition: { row: 1, col: 1 }, currentState: 'idle', stamina: createStamina(90), activeSkill: null, skillCooldown: 0 },
    { id: 'b-rook2', playerId: 'vandijk', team: 'black', pieceType: 'rook', position: { row: 1, col: 6 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'LB', homePosition: { row: 1, col: 6 }, currentState: 'idle', stamina: createStamina(92), activeSkill: null, skillCooldown: 0 },
    { id: 'b-rook3', playerId: 'cafu', team: 'black', pieceType: 'rook', position: { row: 1, col: 3 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CB', homePosition: { row: 1, col: 3 }, currentState: 'idle', stamina: createStamina(88), activeSkill: null, skillCooldown: 0 },
    { id: 'b-bishop1', playerId: 'modric', team: 'black', pieceType: 'rook', position: { row: 2, col: 2 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CM', homePosition: { row: 2, col: 2 }, currentState: 'idle', stamina: createStamina(80), activeSkill: null, skillCooldown: 0 },
    { id: 'b-bishop2', playerId: 'kante', team: 'black', pieceType: 'rook', position: { row: 2, col: 5 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CM', homePosition: { row: 2, col: 5 }, currentState: 'idle', stamina: createStamina(88), activeSkill: null, skillCooldown: 0 },
    { id: 'b-knight1', playerId: 'mbappe', team: 'black', pieceType: 'rook', position: { row: 3, col: 0 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'LW', homePosition: { row: 3, col: 0 }, currentState: 'idle', stamina: createStamina(95), activeSkill: null, skillCooldown: 0 },
    { id: 'b-knight2', playerId: 'neymar', team: 'black', pieceType: 'rook', position: { row: 3, col: 7 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'RW', homePosition: { row: 3, col: 7 }, currentState: 'idle', stamina: createStamina(88), activeSkill: null, skillCooldown: 0 },
    { id: 'b-queen', playerId: 'messi', team: 'black', pieceType: 'queen', position: { row: 3, col: 4 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'ST', homePosition: { row: 3, col: 4 }, currentState: 'idle', stamina: createStamina(88), activeSkill: null, skillCooldown: 0 }
  );

  const ballHolder = pieces.find((p) => p.team === 'white' && p.hasBall);
  const queenPiece = pieces.find((p) => p.team === 'white' && p.pieceType === 'queen');
  const playerControlledId = queenPiece ? queenPiece.id : pieces[0]?.id || null;

  const finalPieces = pieces.map((p) =>
    p.id === playerControlledId ? { ...p, controlType: 'player' as ControlType } : p
  );

  const board: FootballBoard = {
    pieces: finalPieces,
    ballPosition: ballHolder ? { ...ballHolder.position } : { row: 4, col: 4 },
    ballCarrierId: ballHolder ? ballHolder.id : null,
    whiteScore: 0,
    blackScore: 0,
    turnCount: 0,
    selectedPieceId: playerControlledId,
    playerControlledId,
    roundState: 'playerInput',
    moveHistory: [],
    gameMode: '9v9'
  };

  return syncBallState(board);
}

export function initializeBoard11v11(activeSquadIds?: string[]): FootballBoard {
  const pieces: BoardPiece[] = [];

  if (activeSquadIds && activeSquadIds.length >= 3) {
    const squadPlayers = activeSquadIds
      .map((id) => getCampusPlayerById(id))
      .filter((p): p is import('./playerTypes').CampusPlayer => p !== undefined);

    const positionMap: Record<string, Position> = {
      king: { row: 7, col: 3 },
      rook1: { row: 6, col: 0 },
      rook2: { row: 6, col: 2 },
      rook3: { row: 6, col: 5 },
      rook4: { row: 6, col: 7 },
      bishop1: { row: 5, col: 1 },
      bishop2: { row: 5, col: 4 },
      bishop3: { row: 5, col: 6 },
      knight1: { row: 4, col: 0 },
      knight2: { row: 4, col: 7 },
      queen: { row: 4, col: 3 }
    };

    const byPiece: Record<string, import('./playerTypes').CampusPlayer[]> = {
      king: [],
      queen: [],
      rook: [],
      bishop: [],
      knight: [],
      pawn: []
    };
    squadPlayers.forEach((p) => {
      byPiece[p.chessPiece].push(p);
    });

    const usedPositions = new Set<string>();

    const addPiece = (
      player: import('./playerTypes').CampusPlayer,
      pos: Position,
      suffix: string,
      hasBall: boolean
    ) => {
      const pieceType = player.chessPiece as PieceType;
      const role = getRoleFromPieceType(pieceType);
      pieces.push({
        id: `w-${player.chessPiece}-${suffix}`,
        playerId: player.id,
        team: 'white',
        pieceType,
        position: pos,
        hasBall,
        hasActed: false,
        controlType: 'ai',
        role,
        homePosition: { ...pos },
        currentState: 'idle',
        stamina: player.stamina || createStamina(player.stats.physical),
        activeSkill: null,
        skillCooldown: 0
      });
      usedPositions.add(`${pos.row},${pos.col}`);
    };

    let ballAssigned = false;

    if (byPiece.king.length > 0) {
      addPiece(byPiece.king[0], positionMap.king, '1', false);
    }

    if (byPiece.queen.length > 0) {
      addPiece(byPiece.queen[0], positionMap.queen, '1', true);
      ballAssigned = true;
    }

    byPiece.rook.slice(0, 4).forEach((p, i) => {
      const positions = [positionMap.rook1, positionMap.rook2, positionMap.rook3, positionMap.rook4];
      addPiece(p, positions[i], `${i + 1}`, false);
    });

    byPiece.bishop.slice(0, 3).forEach((p, i) => {
      const positions = [positionMap.bishop1, positionMap.bishop2, positionMap.bishop3];
      addPiece(p, positions[i], `${i + 1}`, false);
    });

    byPiece.knight.slice(0, 2).forEach((p, i) => {
      addPiece(p, i === 0 ? positionMap.knight1 : positionMap.knight2, `${i + 1}`, false);
    });

    const overflow = [
      ...byPiece.pawn,
      ...byPiece.king.slice(1),
      ...byPiece.queen.slice(1),
      ...byPiece.rook.slice(4),
      ...byPiece.bishop.slice(3),
      ...byPiece.knight.slice(2)
    ];

    const fallbackPositions: Position[] = [
      { row: 5, col: 0 },
      { row: 5, col: 7 },
      { row: 6, col: 1 },
      { row: 6, col: 6 },
      { row: 7, col: 0 },
      { row: 7, col: 7 },
      { row: 4, col: 1 },
      { row: 4, col: 6 },
      { row: 5, col: 2 },
      { row: 5, col: 5 },
      { row: 4, col: 4 },
      { row: 3, col: 3 },
      { row: 3, col: 4 }
    ];

    overflow.slice(0, 11 - pieces.length).forEach((player, i) => {
      const pos =
        fallbackPositions.find((p) => !usedPositions.has(`${p.row},${p.col}`)) ||
        fallbackPositions[i % fallbackPositions.length];
      addPiece(player, pos, `ov${i + 1}`, !ballAssigned && i === 0);
      if (!ballAssigned && i === 0) ballAssigned = true;
    });
  }

  if (pieces.filter((p) => p.team === 'white').length === 0) {
    pieces.push(
      { id: 'w-king', playerId: 'wuyanming', team: 'white', pieceType: 'king', position: { row: 7, col: 3 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'GK', homePosition: { row: 7, col: 3 }, currentState: 'idle', stamina: createStamina(82), activeSkill: null, skillCooldown: 0 },
      { id: 'w-rook1', playerId: 'wuzhiming', team: 'white', pieceType: 'rook', position: { row: 6, col: 0 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'LB', homePosition: { row: 6, col: 0 }, currentState: 'idle', stamina: createStamina(76), activeSkill: null, skillCooldown: 0 },
      { id: 'w-rook2', playerId: 'xiayibo', team: 'white', pieceType: 'rook', position: { row: 6, col: 2 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CB', homePosition: { row: 6, col: 2 }, currentState: 'idle', stamina: createStamina(82), activeSkill: null, skillCooldown: 0 },
      { id: 'w-rook3', playerId: 'tangjiarui', team: 'white', pieceType: 'rook', position: { row: 6, col: 5 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CB', homePosition: { row: 6, col: 5 }, currentState: 'idle', stamina: createStamina(85), activeSkill: null, skillCooldown: 0 },
      { id: 'w-rook4', playerId: 'qianwenwei', team: 'white', pieceType: 'rook', position: { row: 6, col: 7 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'RB', homePosition: { row: 6, col: 7 }, currentState: 'idle', stamina: createStamina(88), activeSkill: null, skillCooldown: 0 },
      { id: 'w-bishop1', playerId: 'liujunzhe', team: 'white', pieceType: 'rook', position: { row: 5, col: 1 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CM', homePosition: { row: 5, col: 1 }, currentState: 'idle', stamina: createStamina(82), activeSkill: null, skillCooldown: 0 },
      { id: 'w-bishop2', playerId: 'sunyiwen', team: 'white', pieceType: 'rook', position: { row: 5, col: 4 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CM', homePosition: { row: 5, col: 4 }, currentState: 'idle', stamina: createStamina(80), activeSkill: null, skillCooldown: 0 },
      { id: 'w-bishop3', playerId: 'tanqi', team: 'white', pieceType: 'rook', position: { row: 5, col: 6 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CM', homePosition: { row: 5, col: 6 }, currentState: 'idle', stamina: createStamina(85), activeSkill: null, skillCooldown: 0 },
      { id: 'w-knight1', playerId: 'wangkaishuo', team: 'white', pieceType: 'rook', position: { row: 4, col: 0 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'LW', homePosition: { row: 4, col: 0 }, currentState: 'idle', stamina: createStamina(82), activeSkill: null, skillCooldown: 0 },
      { id: 'w-knight2', playerId: 'luosangluobu', team: 'white', pieceType: 'rook', position: { row: 4, col: 7 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'RW', homePosition: { row: 4, col: 7 }, currentState: 'idle', stamina: createStamina(80), activeSkill: null, skillCooldown: 0 },
      { id: 'w-queen', playerId: 'wuerken', team: 'white', pieceType: 'queen', position: { row: 4, col: 3 }, hasBall: true, hasActed: false, controlType: 'ai', role: 'ST', homePosition: { row: 4, col: 3 }, currentState: 'idle', stamina: createStamina(92), activeSkill: null, skillCooldown: 0 }
    );
  }

  pieces.push(
    { id: 'b-king', playerId: 'neuer', team: 'black', pieceType: 'king', position: { row: 0, col: 4 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'GK', homePosition: { row: 0, col: 4 }, currentState: 'idle', stamina: createStamina(85), activeSkill: null, skillCooldown: 0 },
    { id: 'b-rook1', playerId: 'ramos', team: 'black', pieceType: 'rook', position: { row: 1, col: 0 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'LB', homePosition: { row: 1, col: 0 }, currentState: 'idle', stamina: createStamina(90), activeSkill: null, skillCooldown: 0 },
    { id: 'b-rook2', playerId: 'vandijk', team: 'black', pieceType: 'rook', position: { row: 1, col: 2 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CB', homePosition: { row: 1, col: 2 }, currentState: 'idle', stamina: createStamina(92), activeSkill: null, skillCooldown: 0 },
    { id: 'b-rook3', playerId: 'cafu', team: 'black', pieceType: 'rook', position: { row: 1, col: 5 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CB', homePosition: { row: 1, col: 5 }, currentState: 'idle', stamina: createStamina(88), activeSkill: null, skillCooldown: 0 },
    { id: 'b-rook4', playerId: 'carlos', team: 'black', pieceType: 'rook', position: { row: 1, col: 7 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'RB', homePosition: { row: 1, col: 7 }, currentState: 'idle', stamina: createStamina(92), activeSkill: null, skillCooldown: 0 },
    { id: 'b-bishop1', playerId: 'modric', team: 'black', pieceType: 'rook', position: { row: 2, col: 1 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CM', homePosition: { row: 2, col: 1 }, currentState: 'idle', stamina: createStamina(80), activeSkill: null, skillCooldown: 0 },
    { id: 'b-bishop2', playerId: 'kante', team: 'black', pieceType: 'rook', position: { row: 2, col: 4 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CM', homePosition: { row: 2, col: 4 }, currentState: 'idle', stamina: createStamina(88), activeSkill: null, skillCooldown: 0 },
    { id: 'b-bishop3', playerId: 'zidane', team: 'black', pieceType: 'rook', position: { row: 2, col: 6 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'CM', homePosition: { row: 2, col: 6 }, currentState: 'idle', stamina: createStamina(84), activeSkill: null, skillCooldown: 0 },
    { id: 'b-knight1', playerId: 'mbappe', team: 'black', pieceType: 'rook', position: { row: 3, col: 0 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'LW', homePosition: { row: 3, col: 0 }, currentState: 'idle', stamina: createStamina(95), activeSkill: null, skillCooldown: 0 },
    { id: 'b-knight2', playerId: 'neymar', team: 'black', pieceType: 'rook', position: { row: 3, col: 7 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'RW', homePosition: { row: 3, col: 7 }, currentState: 'idle', stamina: createStamina(88), activeSkill: null, skillCooldown: 0 },
    { id: 'b-queen', playerId: 'messi', team: 'black', pieceType: 'queen', position: { row: 3, col: 3 }, hasBall: false, hasActed: false, controlType: 'ai', role: 'ST', homePosition: { row: 3, col: 3 }, currentState: 'idle', stamina: createStamina(88), activeSkill: null, skillCooldown: 0 }
  );

  const ballHolder = pieces.find((p) => p.team === 'white' && p.hasBall);
  const queenPiece = pieces.find((p) => p.team === 'white' && p.pieceType === 'queen');
  const playerControlledId = queenPiece ? queenPiece.id : pieces[0]?.id || null;

  const finalPieces = pieces.map((p) =>
    p.id === playerControlledId ? { ...p, controlType: 'player' as ControlType } : p
  );

  const board: FootballBoard = {
    pieces: finalPieces,
    ballPosition: ballHolder ? { ...ballHolder.position } : { row: 4, col: 4 },
    ballCarrierId: ballHolder ? ballHolder.id : null,
    whiteScore: 0,
    blackScore: 0,
    turnCount: 0,
    selectedPieceId: playerControlledId,
    playerControlledId,
    roundState: 'playerInput',
    moveHistory: [],
    gameMode: '11v11'
  };

  return syncBallState(board);
}

export function initializeBoardWithAIOpponent(
  activeSquadIds: string[],
  aiTeam: AIOpponentTeam,
  gameMode: '3v3' | '9v9' | '11v11' = '3v3'
): FootballBoard {
  const pieces: BoardPiece[] = [];

  const squadPlayers = activeSquadIds
    .map((id) => getCampusPlayerById(id))
    .filter((p): p is import('./playerTypes').CampusPlayer => p !== undefined);

  const modeConfigs = {
    '3v3': {
      playerCount: 3,
      positions: {
        king: { row: 7, col: 3 },
        rook1: { row: 6, col: 2 },
        queen: { row: 5, col: 4 }
      },
      aiPositions: {
        king: { row: 0, col: 4 },
        rook1: { row: 1, col: 5 },
        queen: { row: 2, col: 3 }
      },
      fallbackPositions: [
        { row: 6, col: 4 },
        { row: 5, col: 3 },
        { row: 6, col: 3 }
      ]
    },
    '9v9': {
      playerCount: 9,
      positions: {
        king: { row: 7, col: 3 },
        rook1: { row: 6, col: 1 },
        rook2: { row: 6, col: 6 },
        rook3: { row: 6, col: 3 },
        bishop1: { row: 5, col: 2 },
        bishop2: { row: 5, col: 5 },
        knight1: { row: 4, col: 0 },
        knight2: { row: 4, col: 7 },
        queen: { row: 4, col: 4 }
      },
      aiPositions: {
        king: { row: 0, col: 4 },
        rook1: { row: 1, col: 1 },
        rook2: { row: 1, col: 6 },
        rook3: { row: 1, col: 3 },
        bishop1: { row: 2, col: 2 },
        bishop2: { row: 2, col: 5 },
        knight1: { row: 3, col: 0 },
        knight2: { row: 3, col: 7 },
        queen: { row: 3, col: 4 }
      },
      fallbackPositions: [
        { row: 5, col: 0 },
        { row: 5, col: 7 },
        { row: 6, col: 0 },
        { row: 6, col: 7 },
        { row: 7, col: 0 },
        { row: 7, col: 7 },
        { row: 4, col: 1 },
        { row: 4, col: 6 },
        { row: 5, col: 3 },
        { row: 5, col: 4 }
      ]
    },
    '11v11': {
      playerCount: 11,
      positions: {
        king: { row: 7, col: 3 },
        rook1: { row: 6, col: 0 },
        rook2: { row: 6, col: 2 },
        rook3: { row: 6, col: 5 },
        rook4: { row: 6, col: 7 },
        bishop1: { row: 5, col: 1 },
        bishop2: { row: 5, col: 4 },
        bishop3: { row: 5, col: 6 },
        knight1: { row: 4, col: 0 },
        knight2: { row: 4, col: 7 },
        queen: { row: 4, col: 3 }
      },
      aiPositions: {
        king: { row: 0, col: 4 },
        rook1: { row: 1, col: 0 },
        rook2: { row: 1, col: 2 },
        rook3: { row: 1, col: 5 },
        rook4: { row: 1, col: 7 },
        bishop1: { row: 2, col: 1 },
        bishop2: { row: 2, col: 4 },
        bishop3: { row: 2, col: 6 },
        knight1: { row: 3, col: 0 },
        knight2: { row: 3, col: 7 },
        queen: { row: 3, col: 3 }
      },
      fallbackPositions: [
        { row: 5, col: 0 },
        { row: 5, col: 7 },
        { row: 6, col: 1 },
        { row: 6, col: 6 },
        { row: 7, col: 0 },
        { row: 7, col: 7 },
        { row: 4, col: 1 },
        { row: 4, col: 6 },
        { row: 5, col: 2 },
        { row: 5, col: 5 },
        { row: 4, col: 4 },
        { row: 3, col: 3 },
        { row: 3, col: 4 }
      ]
    }
  };

  const config = modeConfigs[gameMode];
  const positionMap = config.positions;

  const byPiece: Record<PieceType, import('./playerTypes').CampusPlayer[]> = {
    king: [],
    queen: [],
    rook: [],
    bishop: [],
    knight: [],
    pawn: []
  };
  squadPlayers.forEach((p) => {
    const pieceType = p.chessPiece as PieceType;
    if (byPiece[pieceType]) {
      byPiece[pieceType].push(p);
    }
  });

  // 当 activeSquad 缺少某些棋子类型时，从 campusPlayers 中补齐到当前模式所需数量
  const requiredCounts: Record<typeof gameMode, Record<PieceType, number>> = {
    '3v3': { king: 1, queen: 1, rook: 1, bishop: 0, knight: 0, pawn: 0 },
    '9v9': { king: 1, queen: 1, rook: 3, bishop: 2, knight: 2, pawn: 0 },
    '11v11': { king: 1, queen: 1, rook: 4, bishop: 3, knight: 2, pawn: 0 }
  };

  const usedPlayerIds = new Set<string>(squadPlayers.map((p) => p.id));
  const pieceTypePriority: PieceType[] = ['king', 'queen', 'rook', 'bishop', 'knight', 'pawn'];
  const campusFillers = campusPlayers.filter((p) => !usedPlayerIds.has(p.id));

  pieceTypePriority.forEach((pieceType) => {
    const needed = requiredCounts[gameMode][pieceType] - byPiece[pieceType].length;
    if (needed > 0) {
      const fillers = campusFillers
        .filter((p) => !usedPlayerIds.has(p.id) && (p.chessPiece as PieceType) === pieceType)
        .slice(0, needed);
      fillers.forEach((p) => {
        byPiece[pieceType].push(p);
        usedPlayerIds.add(p.id);
      });
    }
  });

  const addPiece = (
    player: import('./playerTypes').CampusPlayer,
    pos: Position,
    suffix: string,
    hasBall: boolean
  ) => {
    const role = getRoleFromPieceType(player.chessPiece as PieceType);
    pieces.push({
      id: `w-${player.chessPiece}-${suffix}`,
      playerId: player.id,
      team: 'white',
      pieceType: player.chessPiece as PieceType,
      position: pos,
      hasBall,
      hasActed: false,
      controlType: 'ai',
      role,
      homePosition: { ...pos },
      currentState: 'idle',
      stamina: player.stamina || createStamina(player.stats.physical),
      activeSkill: null,
      skillCooldown: 0
    });
  };

  let ballAssigned = false;
  if (byPiece.king.length > 0) {
    addPiece(byPiece.king[0], positionMap.king, '1', false);
  }

  if (byPiece.queen.length > 0) {
    addPiece(byPiece.queen[0], positionMap.queen, '1', true);
    ballAssigned = true;
  }

  const rookCount = gameMode === '3v3' ? 1 : gameMode === '9v9' ? 3 : 4;
  byPiece.rook.slice(0, rookCount).forEach((p, i) => {
    const pos = positionMap[`rook${i + 1}` as keyof typeof positionMap] || { row: 6, col: 2 };
    addPiece(p, pos, `${i + 1}`, false);
  });

  const bishopCount = gameMode === '3v3' ? 0 : gameMode === '9v9' ? 2 : 3;
  byPiece.bishop.slice(0, bishopCount).forEach((p, i) => {
    const pos = positionMap[`bishop${i + 1}` as keyof typeof positionMap] || { row: 5, col: 2 };
    addPiece(p, pos, `${i + 1}`, false);
  });

  const knightCount = gameMode === '3v3' ? 0 : 2;
  byPiece.knight.slice(0, knightCount).forEach((p, i) => {
    const pos = positionMap[`knight${i + 1}` as keyof typeof positionMap] || { row: 4, col: 0 };
    addPiece(p, pos, `${i + 1}`, false);
  });

  const remaining = [
    ...byPiece.pawn,
    ...byPiece.king.slice(1),
    ...byPiece.queen.slice(1),
    ...byPiece.rook.slice(rookCount),
    ...byPiece.bishop.slice(bishopCount),
    ...byPiece.knight.slice(knightCount)
  ];

  // 若仍有空位，继续用未使用的 campusPlayers 按棋子类型优先级填充
  const overflowPriority: Record<PieceType, number> = {
    king: 0,
    queen: 1,
    rook: 2,
    bishop: 3,
    knight: 4,
    pawn: 5
  };

  const campusOverflow = campusPlayers
    .filter((p) => !usedPlayerIds.has(p.id))
    .sort((a, b) => {
      const ptA = (a.chessPiece as PieceType) || 'pawn';
      const ptB = (b.chessPiece as PieceType) || 'pawn';
      return overflowPriority[ptA] - overflowPriority[ptB];
    });

  const allRemaining = [...remaining, ...campusOverflow];

  allRemaining.slice(0, config.playerCount - pieces.length).forEach((player, i) => {
    const pos = config.fallbackPositions[i % config.fallbackPositions.length];
    const pieceType = player.chessPiece as PieceType;
    const role = getRoleFromPieceType(pieceType);
    pieces.push({
      id: `w-${player.chessPiece}-fallback${i}`,
      playerId: player.id,
      team: 'white',
      pieceType,
      position: pos,
      hasBall: !ballAssigned && i === 0,
      hasActed: false,
      controlType: 'ai',
      role,
      homePosition: { ...pos },
      currentState: 'idle',
      stamina: player.stamina || createStamina(player.stats.physical),
      activeSkill: null,
      skillCooldown: 0
    });
    if (!ballAssigned && i === 0) ballAssigned = true;
  });

  // 扩展 AI 黑队到当前模式人数：保留 3 人核心，其余从 starPlayers 补充
  const aiSlotEntries = Object.entries(config.aiPositions);
  const coreByType: Record<PieceType, AIOpponentPlayer[]> = {
    king: [],
    queen: [],
    rook: [],
    bishop: [],
    knight: [],
    pawn: []
  };

  aiTeam.players.forEach((p) => {
    if (coreByType[p.pieceType]) {
      coreByType[p.pieceType].push(p);
    }
  });

  const usedAIIds = new Set<string>(aiTeam.players.map((p) => p.id));

  const expandedAIPlayers = aiSlotEntries.map(([slotKey]) => {
    const pieceType = slotKey.replace(/\d+$/, '') as PieceType;
    let player = coreByType[pieceType].shift();

    if (!player) {
      const star = starPlayers
        .filter((s) => {
          const starPieceType = getStarPieceType(s);
          return !usedAIIds.has(s.id) && starPieceType === pieceType;
        })
        .sort((a, b) => (b.overall || 0) - (a.overall || 0))[0];

      if (star) {
        usedAIIds.add(star.id);
        player = {
          id: star.id,
          name: star.name,
          position: star.position,
          positionCN: star.positionCN,
          stats: star.stats,
          pieceType,
          role: getRoleFromStarPieceType(pieceType)
        };
      }
    }

    if (!player) {
      const fallback =
        aiTeam.players.find((p) => p.pieceType === pieceType) || aiTeam.players[0];
      player = { ...fallback, id: `${fallback.id}_${slotKey}` };
    }

    return { slotKey, pieceType, player };
  });

  expandedAIPlayers.forEach(({ slotKey, pieceType, player }) => {
    const pos = config.aiPositions[slotKey as keyof typeof config.aiPositions];
    pieces.push({
      id: `b-${slotKey}-${player.id}`,
      playerId: player.id,
      team: 'black',
      pieceType,
      position: pos,
      hasBall: false,
      hasActed: false,
      controlType: 'ai',
      role: player.role,
      homePosition: { ...pos },
      currentState: 'idle',
      stamina: createStamina(player.stats.physical),
      activeSkill: player.uniqueSkill || null,
      skillCooldown: 0
    });
  });

  const ballHolder = pieces.find((p) => p.team === 'white' && p.hasBall);
  const queenPiece = pieces.find((p) => p.team === 'white' && p.pieceType === 'queen');
  const playerControlledId = queenPiece ? queenPiece.id : pieces[0]?.id || null;

  const finalPieces = pieces.map((p) =>
    p.id === playerControlledId ? { ...p, controlType: 'player' as ControlType } : p
  );

  const board: FootballBoard = {
    pieces: finalPieces,
    ballPosition: ballHolder ? { ...ballHolder.position } : { row: 4, col: 4 },
    ballCarrierId: ballHolder ? ballHolder.id : null,
    whiteScore: 0,
    blackScore: 0,
    turnCount: 0,
    selectedPieceId: playerControlledId,
    playerControlledId,
    roundState: 'playerInput',
    moveHistory: [],
    gameMode
  };

  return syncBallState(board);
}

export const initializeBoard = initializeBoard3v3;
export const getValidMoves = getValidMovePositions;

function getStarPieceType(star: StarPlayer): PieceType {
  switch (star.position) {
    case 'GK':
      return 'king';
    case 'DEF':
      return 'rook';
    case 'MID':
      return 'bishop';
    case 'FWD':
      return 'knight';
    default:
      return 'pawn';
  }
}

function getRoleFromStarPieceType(pieceType: PieceType): PlayerRole {
  switch (pieceType) {
    case 'king':
      return 'GK';
    case 'queen':
      return 'ST';
    case 'rook':
      return 'CB';
    case 'bishop':
      return 'CM';
    case 'knight':
      return 'LW';
    case 'pawn':
      return 'ST';
    default:
      return 'ST';
  }
}
