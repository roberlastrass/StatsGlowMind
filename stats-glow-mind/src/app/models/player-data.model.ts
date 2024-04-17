// player-data.model.ts
export interface PlayerData {
    id: number;
    idTeam: number;
    firstname: string;
    lastname: string;
    birth: {
      date: string;
      country: string;
    };
    nba: {
      start: number;
      pro: number;
    };
    height: {
      feets: string;
      inches: string;
      meters: string;
    };
    weight: {
      pounds: string;
      kilograms: string;
    };
    college: string;
    affiliation: string;
    leagues: {
      standard: {
        jersey: number;
        active: boolean;
        pos: string;
      };
    };
}