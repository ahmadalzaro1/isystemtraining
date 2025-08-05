import { useInfiniteQuery } from '@tanstack/react-query';
import { mockWorkshops } from '@/data/mockWorkshops';
import { Workshop, WorkshopFilters } from '@/types/workshop';
import { filterWorkshopsByFilters } from '@/utils/workshopFilters';

interface UseInfiniteWorkshopsParams {
  filters: WorkshopFilters;
  pageSize?: number;
}

interface WorkshopPage {
  workshops: Workshop[];
  nextCursor?: number;
  hasNextPage: boolean;
}

/**
 * Hook for infinite loading of workshops with filtering and pagination
 * Simulates server-side pagination for better performance with large datasets
 */
export const useInfiniteWorkshops = ({ 
  filters, 
  pageSize = 10 
}: UseInfiniteWorkshopsParams) => {
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['workshops', 'infinite', filters, pageSize],
    queryFn: async ({ pageParam = 0 }): Promise<WorkshopPage> => {
      const pageNumber = pageParam as number;
      
      // Filter workshops
      const filteredWorkshops = filterWorkshopsByFilters(mockWorkshops, filters);
      
      // Paginate results
      const startIndex = pageNumber * pageSize;
      const endIndex = startIndex + pageSize;
      const pageWorkshops = filteredWorkshops.slice(startIndex, endIndex);
      
      const hasNextPage = endIndex < filteredWorkshops.length;
      const nextCursor = hasNextPage ? pageNumber + 1 : undefined;
      
      return {
        workshops: pageWorkshops,
        nextCursor,
        hasNextPage
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Flatten pages into single array
  const workshops = data?.pages.flatMap(page => page.workshops) ?? [];
  const totalWorkshops = data?.pages[0] ? mockWorkshops.length : 0;
  const loadedCount = workshops.length;

  return {
    workshops,
    totalWorkshops,
    loadedCount,
    error,
    fetchNextPage,
    hasNextPage: hasNextPage ?? false,
    isFetching,
    isFetchingNextPage,
    isLoading: status === 'pending',
    isError: status === 'error',
  };
};