import { z } from 'zod';
import { baseUrl } from '~shared/api';
import { createJsonMutation, createJsonQuery } from '~shared/lib/fetch';
import { zodContract } from '~shared/lib/zod';
import { GameSchema } from './contracts';
import { GameDto } from './types';

export async function getAllGamesQuery(page: number, signal?: AbortSignal) {
  return createJsonQuery({
    request: {
      url: baseUrl('/games'),
      method: 'GET',
      query: {
        page,
      },
    },
    response: {
      contract: zodContract(GameSchema.array()),
    },
    abort: signal,
  });
}

export async function getGameQuery(gameId: number, signal?: AbortSignal) {
  return createJsonQuery({
    request: {
      url: baseUrl(`/games/${gameId}`),
      method: 'GET',
    },
    response: {
      contract: zodContract(GameSchema),
    },
    abort: signal,
  });
}

export async function createGameMutation(params: { game: GameDto }) {
  return createJsonMutation({
    request: {
      url: baseUrl('/games'),
      method: 'POST',
      body: JSON.stringify(params.game),
    },
    response: {
      contract: zodContract(GameSchema),
    },
  });
}

export async function updateGameMutation(params: {
  gameId: number;
  game: GameDto;
}) {
  return createJsonMutation({
    request: {
      url: baseUrl(`/games/${params.gameId}`),
      method: 'PUT',
      body: JSON.stringify(params.game),
    },
    response: {
      contract: zodContract(GameSchema),
    },
  });
}

export async function deleteGameMutation(params: { gameId: number }) {
  return createJsonMutation({
    request: {
      url: baseUrl(`/games/${params.gameId}`),
      method: 'DELETE',
    },
    response: {
      contract: zodContract(z.any()),
    },
  });
}