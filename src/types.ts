export interface Benefit {
  id: string;
  name: string;
  category: string;
  cost: number;
  happiness: number;
  size: number;
}

export interface EventConfig {
  id: string;
  name: string;
  budget: number;
  timer: number;
  status: 'waiting' | 'playing' | 'finished';
  rules?: string;
  teamsCount?: number;
  createdAt?: any;
}

export interface TeamState {
  id: string;
  name: string;
  selectedBenefits: Benefit[];
  budgetUsed: number;
  totalHP: number;
  isLocked: boolean;
  efficiency?: number;
}

export interface GameState {
  timeLeft: number;
  isPaused: boolean;
}
