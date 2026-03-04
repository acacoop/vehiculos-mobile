import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  RefreshControl,
} from "react-native";
import { colors } from "../constants/colors";

type FetchResult<T> = {
  items: T[];
  total: number;
  hasMore: boolean;
};

type PaginatedFlatListProps<T> = {
  /** Function to fetch data, receives page and limit */
  fetchData: (page: number, limit: number) => Promise<FetchResult<T>>;
  /** Key extractor for items (defaults to using item.id) */
  keyExtractor?: (item: T, index: number) => string;
  /** Render function for each item */
  renderItem: (info: { item: T; index: number }) => React.ReactElement | null;
  /** Number of items per page */
  pageSize?: number;
  /** Header component */
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
  /** Empty list component */
  ListEmptyComponent?: React.ComponentType | React.ReactElement | null;
  /** Style for the list */
  style?: object;
  /** Content container style */
  contentContainerStyle?: object;
  /** Whether to show vertical scroll indicator */
  showsVerticalScrollIndicator?: boolean;
  /** Threshold to trigger load more (0-1) */
  onEndReachedThreshold?: number;
  /** Enable pull to refresh */
  enableRefresh?: boolean;
  /** Callback after data is loaded */
  onDataLoaded?: (items: T[], total: number) => void;
  /** Callback on error */
  onError?: (error: Error) => void;
  /** Dependencies that trigger a refetch when changed */
  refreshDeps?: unknown[];
  /** Whether to skip initial fetch */
  skipInitialFetch?: boolean;
  /** Whether the list is enabled (will skip fetch if false) */
  enabled?: boolean;
};

export function PaginatedFlatList<T extends { id?: string }>({
  fetchData,
  keyExtractor = (item: T, index: number) =>
    item.id ?? `item-${index}-${Date.now()}`,
  renderItem,
  pageSize = 10,
  ListHeaderComponent,
  ListEmptyComponent,
  style,
  contentContainerStyle,
  showsVerticalScrollIndicator = false,
  onEndReachedThreshold = 0.5,
  enableRefresh = true,
  onDataLoaded,
  onError,
  refreshDeps = [],
  skipInitialFetch = false,
  enabled = true,
}: PaginatedFlatListProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(!skipInitialFetch);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageRef = useRef(1);
  const loadedIdsRef = useRef<Set<string>>(new Set());
  const isLoadingRef = useRef(false);

  // Use refs for callbacks to avoid triggering re-renders
  const onDataLoadedRef = useRef(onDataLoaded);
  const onErrorRef = useRef(onError);
  const fetchDataRef = useRef(fetchData);

  // Keep refs updated
  useEffect(() => {
    onDataLoadedRef.current = onDataLoaded;
  }, [onDataLoaded]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    fetchDataRef.current = fetchData;
  }, [fetchData]);

  const loadInitialData = useCallback(async () => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    setLoading(true);
    setError(null);
    pageRef.current = 1;
    loadedIdsRef.current = new Set();

    try {
      const result = await fetchDataRef.current(1, pageSize);
      const uniqueItems = deduplicateItems(result.items, loadedIdsRef.current);

      setData(uniqueItems);
      setHasMore(result.hasMore && uniqueItems.length > 0);
      onDataLoadedRef.current?.(uniqueItems, result.total);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al cargar datos";
      setError(errorMessage);
      setData([]);
      onErrorRef.current?.(
        err instanceof Error ? err : new Error(errorMessage),
      );
    } finally {
      setLoading(false);
      isLoadingRef.current = false;
    }
  }, [pageSize]);

  const loadMore = useCallback(async () => {
    if (isLoadingRef.current || loadingMore || !hasMore) return;

    isLoadingRef.current = true;
    setLoadingMore(true);

    try {
      const nextPage = pageRef.current + 1;
      const result = await fetchDataRef.current(nextPage, pageSize);
      const uniqueItems = deduplicateItems(result.items, loadedIdsRef.current);

      if (uniqueItems.length > 0) {
        setData((prev) => [...prev, ...uniqueItems]);
        pageRef.current = nextPage;
      }

      setHasMore(result.hasMore && uniqueItems.length > 0);
    } catch (err) {
      console.error("Error loading more:", err);
      onErrorRef.current?.(
        err instanceof Error ? err : new Error("Error al cargar más"),
      );
    } finally {
      setLoadingMore(false);
      isLoadingRef.current = false;
    }
  }, [pageSize, loadingMore, hasMore]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    pageRef.current = 1;
    loadedIdsRef.current = new Set();

    try {
      const result = await fetchDataRef.current(1, pageSize);
      const uniqueItems = deduplicateItems(result.items, loadedIdsRef.current);

      setData(uniqueItems);
      setHasMore(result.hasMore && uniqueItems.length > 0);
      setError(null);
      onDataLoadedRef.current?.(uniqueItems, result.total);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error al actualizar";
      setError(errorMessage);
      onErrorRef.current?.(
        err instanceof Error ? err : new Error(errorMessage),
      );
    } finally {
      setRefreshing(false);
    }
  }, [pageSize]);

  // Deduplicate items based on id
  const deduplicateItems = (items: T[], loadedIds: Set<string>): T[] => {
    const unique: T[] = [];

    for (const item of items) {
      const itemKey = item.id ?? String(items.indexOf(item));
      if (!loadedIds.has(itemKey)) {
        loadedIds.add(itemKey);
        unique.push(item);
      }
    }

    return unique;
  };

  // Initial load
  useEffect(() => {
    if (!skipInitialFetch && enabled) {
      loadInitialData();
    }
  }, [loadInitialData, skipInitialFetch, enabled]);

  // Refetch when dependencies change
  useEffect(() => {
    if (refreshDeps.length > 0 && !skipInitialFetch && enabled) {
      loadInitialData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, refreshDeps);

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    if (error) {
      return <Text style={styles.errorText}>{error}</Text>;
    }
    if (ListEmptyComponent) {
      if (React.isValidElement(ListEmptyComponent)) {
        return ListEmptyComponent;
      }
      const EmptyComponent = ListEmptyComponent as React.ComponentType<unknown>;
      return <EmptyComponent />;
    }
    return null;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={style}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={renderEmpty}
      contentContainerStyle={contentContainerStyle}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      onEndReached={loadMore}
      onEndReachedThreshold={onEndReachedThreshold}
      refreshControl={
        enableRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        ) : undefined
      }
    />
  );
}

// Hook to use with the PaginatedFlatList for external control
export function usePaginatedList() {
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return { refreshKey, refresh };
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: colors.error,
    textAlign: "center",
    marginTop: 20,
  },
});
