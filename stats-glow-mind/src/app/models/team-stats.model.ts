// team-stats.model.ts
export interface TeamStats {
    id: number;
    averageStats: {
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
}