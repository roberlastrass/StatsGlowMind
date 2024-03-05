// team.model.ts
export interface Team {
    league: string;
    season: number;
    team: {
      id: number;
      name: string;
      nickname: string;
      code: string;
      logo: string;
    };
    conference: {
      name: string;
      rank: number;
      win: number;
      loss: number;
    };
    division: {
      name: string;
      rank: number;
      win: number;
      loss: number;
      gamesBehind: string | null;
    };
    win: {
      home: number;
      away: number;
      total: number;
      percentage: string;
      lastTen: number;
    };
    loss: {
      home: number;
      away: number;
      total: number;
      percentage: string;
      lastTen: number;
    };
    gamesBehind: string | null;
    streak: number;
    winStreak: boolean;
    tieBreakerPoints: number | null;
  }
  