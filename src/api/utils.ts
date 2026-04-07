import type { GameIds, Player } from "../utils/types";
import type { CoordinatesFromApi, GetGameLogFromApi, GetGameLogResponseFromApi, GetPlayByPlayResponseFromApi, GetPlayersResponseFromApi, PlayerFromApi, PlayFromApi } from "./nhlApiClient";

export function transformGetPlayersResponse(apiResponse: GetPlayersResponseFromApi): Player[] {
  return apiResponse.data.map((p: PlayerFromApi) => ({
    id: p.playerId,
    name: p.skaterFullName,
    position: p.positionCode,
    hand: p.shootsCatches,
    goals: p.goals,
  }));
}

export function transformGetGameLogResponse(apiResponse: GetGameLogResponseFromApi): GameIds {
  return apiResponse.gameLog.filter((g: GetGameLogFromApi) => g.goals > 0).map((g: GetGameLogFromApi) => g.gameId);
}

export function transformGetPlayByPlayResponse(apiResponse: GetPlayByPlayResponseFromApi, playerId: number): PlayFromApi[] {
  return apiResponse.plays.filter((p: PlayFromApi) => p.typeDescKey === 'goal' && p.details.scoringPlayerId === playerId);
}

export function handleMirroringCoordinates(coordinates: CoordinatesFromApi): CoordinatesFromApi {
  if (coordinates.xCoord < 0) {
    return {
      xCoord: -coordinates.xCoord,
      yCoord: coordinates.yCoord,
    }
  } else {
    return {
      xCoord: coordinates.xCoord,
      yCoord: -coordinates.yCoord,
    }
  }
}