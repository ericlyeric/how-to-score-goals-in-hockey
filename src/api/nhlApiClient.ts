import type { ShotHand, Position, ShotType, Player, GameType } from "../utils/types";
import { API_CONFIG } from "./config";
import { transformGetGameLogResponse, transformGetPlayByPlayResponse, transformGetPlayersResponse } from "./utils";

interface requestProps {
  path: string;
  queryParams?: Record<string, string | number>;
}

interface getProps extends requestProps {
  base: string;
}

export interface PlayerFromApi {
  goals: number;
  playerId: number;
  positionCode: Position;
  shootsCatches: ShotHand;
  skaterFullName: string;
}

export interface GetPlayersRequestFromApi {
  season: string; // format: "20242025"
  gameTypeId: GameType;
  position?: Position;
  shotHand?: ShotHand;
}

export interface GetPlayersResponseFromApi {
  data: PlayerFromApi[];
}

export interface GetGameLogRequestFromApi {
  playerId: number;
  season: string;
  gameType: GameType;
}

export interface GetGameLogFromApi {
  gameId: number;
  gameDate: string;
  goals: number;
}

export interface GetGameLogResponseFromApi {
  gameLog: GetGameLogFromApi[];
}

export interface CoordinatesFromApi {
  xCoord: number;
  yCoord: number;
}
export interface DetailsFromPlay extends CoordinatesFromApi {
  shotType: ShotType;
  scoringPlayerId: number;
}

export interface PlayFromApi {
  typeDescKey: string;
  details: DetailsFromPlay;
}

export interface GetPlayByPlayRequestFromApi {
  gameId: number;
  playerId: number;
}

export interface GetPlayByPlayResponseFromApi {
  plays: PlayFromApi[];
}

async function get<T>(getProps: getProps): Promise<T> {
  const url = new URL(getProps.base + getProps.path, window.location.origin);
  if (getProps.queryParams) {
    for (const [key, value] of Object.entries(getProps.queryParams)) {
      url.searchParams.set(key, String(value));
    }
  }
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`NHL API error! status: ${response.status}: ${url.pathname}`);
  }
  const data = await response.json();
  return data as T;
}

const stats = <T>(requestProps: requestProps) => get<T>({ ...requestProps, base: API_CONFIG.statsBase });
const web = <T>(requestProps: requestProps) => get<T>({ ...requestProps, base: API_CONFIG.webBase });

export const nhlApi = {
  getPlayers: async (playersRequest: GetPlayersRequestFromApi): Promise<Player[]> => {
    const query = [
      `seasonId=${playersRequest.season}`,
      `gameTypeId=${playersRequest.gameTypeId}`,
      playersRequest.position && `positionCode="${playersRequest.position}"`,
      playersRequest.shotHand && `shootsCatches="${playersRequest.shotHand}"`,
    ].filter(Boolean).join(" and ");

    const response = await stats<GetPlayersResponseFromApi>({
      path: "/skater/summary",
      queryParams: {
        cayenneExp: query,
        sort: 'goals',
        dir: 'desc',
        limit: 5,
      },
    });
    return transformGetPlayersResponse(response);
  },
  getGameLog: async (gameLogRequest: GetGameLogRequestFromApi) => {
    const response = await web<GetGameLogResponseFromApi>({
      path: `/v1/player/${gameLogRequest.playerId}/game-log/${gameLogRequest.season}/${gameLogRequest.gameType}`
    });
    return transformGetGameLogResponse(response);
  },
  getPlayByPlay: async (playByPlayRequest: GetPlayByPlayRequestFromApi) => {
    const response = await web<GetPlayByPlayResponseFromApi>({
      path: `/v1/gamecenter/${playByPlayRequest.gameId}/play-by-play`
    });
    return transformGetPlayByPlayResponse(response, playByPlayRequest.playerId);
  }
};