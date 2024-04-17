// game-stats.model.ts
export interface GameStats {
    id: number;
    home: {
      id: number;
      statistics: {
        fastBreakPoints: number | null;
        pointsInPaint: number | null;
        biggestLead: number | null;
        secondChancePoints: number | null;
        pointsOffTurnovers: number | null;
        longestRun: number | null;
        points: number;
        fgm: number;
        fga: number;
        fgp: string;
        ftm: number;
        fta: number;
        ftp: string;
        tpm: number;
        tpa: number;
        tpp: string;
        offReb: number;
        defReb: number;
        totReb: number;
        assists: number;
        pFouls: number;
        steals: number;
        turnovers: number;
        blocks: number;
        plusMinus: string;
        min: string;
      };
    };
    visitors: {
      id: number;
      statistics: {
        fastBreakPoints: number | null;
        pointsInPaint: number | null;
        biggestLead: number | null;
        secondChancePoints: number | null;
        pointsOffTurnovers: number | null;
        longestRun: number | null;
        points: number;
        fgm: number;
        fga: number;
        fgp: string;
        ftm: number;
        fta: number;
        ftp: string;
        tpm: number;
        tpa: number;
        tpp: string;
        offReb: number;
        defReb: number;
        totReb: number;
        assists: number;
        pFouls: number;
        steals: number;
        turnovers: number;
        blocks: number;
        plusMinus: string;
        min: string;
      };
    };
  }