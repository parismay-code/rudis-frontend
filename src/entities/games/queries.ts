import { useMutation } from '@tanstack/react-query';
import { queryClient, ReactQueryService } from '~shared/lib/react-query';
import { createGameMutation, deleteGameMutation, getAllGamesQuery, getGameQuery, updateGameMutation } from './api';
import { GameDto } from './types';

const keys = {
  root: () => ['game'] as const,
  getAll: () => [...keys.root(), 'all'] as const,
  get: (gameId: number) => [...keys.root(), 'get', gameId.toString()] as const,
  create: () => [...keys.root(), 'create'] as const,
  update: () => [...keys.root(), 'update'] as const,
  delete: () => [...keys.root(), 'delete'] as const,
};

export const allGamesService = new ReactQueryService(keys.getAll, getAllGamesQuery);

export const gameService = new ReactQueryService((gameId: number) => keys.get(gameId), getGameQuery);

export function useCreateGameMutation() {
  return useMutation({
    mutationKey: keys.create(),
    mutationFn: (game: GameDto) => createGameMutation({ game }),
    onSuccess: async (game) => {
      gameService.setCache(game.id, game);

      await queryClient.invalidateQueries({ queryKey: keys.getAll() });
    },
  });
}

export function useUpdateGameMutation(gameId: number) {
  return useMutation({
    mutationKey: keys.update(),
    mutationFn: (game: GameDto) => updateGameMutation({ gameId, game }),
    onSuccess: async (game) => {
      gameService.setCache(gameId, game);

      await queryClient.invalidateQueries({ queryKey: keys.getAll() });
    },
  });
}

export function useDeleteGameMutation(gameId: number) {
  return useMutation({
    mutationKey: keys.delete(),
    mutationFn: () => deleteGameMutation({ gameId }),
    onSuccess: async () => {
      gameService.removeCache(gameId);

      await queryClient.invalidateQueries({ queryKey: keys.getAll() });
    },
  });
}