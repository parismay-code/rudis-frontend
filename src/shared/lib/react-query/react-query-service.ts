import { DefaultError, DefinedInitialDataOptions, queryOptions as tsqQueryOptions } from '@tanstack/react-query';
import { Callback } from '~shared/types';
import { queryClient } from '~shared/lib/react-query';
import type { DataTag } from '@tanstack/query-core';

interface IReactQueryService<T> {
  getCache(key?: any): void;

  removeCache(key?: any): void;

  setCache(key?: any, data?: T): unknown;

  queryOptions(key?: any, ...args: Array<any>): DefinedInitialDataOptions<T, DefaultError, T, readonly string[]> & {
    queryKey: DataTag<readonly string[], T>
  };

  prefetchQuery(key?: any): Promise<void>;

  ensureQueryData(key?: any): Promise<undefined | T>;
}

export class ReactQueryService<T extends object> implements IReactQueryService<T> {
  constructor(
    private readonly queryKey: (() => readonly string[]) | Callback<any, readonly string[]>,
    private readonly queryFn: Callback<any, Promise<T>>) {
  }

  getCache(key?: any) {
    if (!key) {
      return queryClient.getQueryData<T>(this.queryKey());
    }

    if (Array.isArray(key)) {
      return queryClient.getQueryData<T>(this.queryKey(...key));
    }

    return queryClient.getQueryData<T>(this.queryKey(key));
  }

  setCache(key?: any, data?: T) {
    if (!key && !data) {
      return;
    }

    if (!key) {
      return queryClient.setQueryData(this.queryKey(), data);
    }

    if (Array.isArray(key)) {
      return queryClient.setQueryData(this.queryKey(...key), data);
    }

    return queryClient.setQueryData(this.queryKey(key), data);
  }

  removeCache(key?: any) {
    if (!key) {
      return queryClient.removeQueries({ queryKey: this.queryKey() });
    }

    if (Array.isArray(key)) {
      return queryClient.removeQueries({ queryKey: this.queryKey(...key) });
    }

    return queryClient.removeQueries({ queryKey: this.queryKey(key) });
  }

  queryOptions(key?: any, ...args: Parameters<typeof this.queryFn>) {
    let queryKey: readonly string[] | null = null;

    if (!key) {
      queryKey = this.queryKey();
    }

    if (Array.isArray(key)) {
      queryKey = this.queryKey(...key);
    }

    if (!queryKey) {
      queryKey = this.queryKey(key);
    }

    return tsqQueryOptions({
      queryKey,
      queryFn: async ({ signal }) => this.queryFn(...args, signal),
      initialData: () => this.getCache(key)!,
      initialDataUpdatedAt: () =>
        queryClient.getQueryState(queryKey)?.dataUpdatedAt,
      retry: false,
    });
  }

  async prefetchQuery(key?: any) {
    return queryClient.prefetchQuery(this.queryOptions(key));
  }

  async ensureQueryData(key?: any) {
    return queryClient.ensureQueryData(this.queryOptions(key));
  }
}