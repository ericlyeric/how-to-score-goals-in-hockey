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

function buildTargetUrl(getProps: getProps): string {
  const base = getProps.base.endsWith("/") ? getProps.base : `${getProps.base}/`;
  const path = getProps.path.startsWith("/") ? getProps.path.slice(1) : getProps.path;

  const queryString = getProps.queryParams
    ? new URLSearchParams(
        Object.entries(getProps.queryParams).map(([key, value]) => [key, String(value)]),
      ).toString()
    : "";

  const isAbsoluteBase = base.startsWith("http://") || base.startsWith("https://");
  if (isAbsoluteBase) {
    const targetUrl = new URL(path, base);
    if (queryString) targetUrl.search = queryString;
    return targetUrl.toString();
  }

  return `${base}${path}${queryString ? `?${queryString}` : ""}`;
}

async function get<T>(getProps: getProps): Promise<T> {
  const targetUrl = buildTargetUrl(getProps);
  const fetchUrl = import.meta.env.DEV
    ? targetUrl
    : `/api/proxy?url=${encodeURIComponent(targetUrl)}`;

  const response = await fetch(fetchUrl);
  if (!response.ok) {
    throw new Error(`NHL API error! status: ${response.status}: ${getProps.path}`);
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
        limit: 10,
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