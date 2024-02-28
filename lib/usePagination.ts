import { useState, useCallback } from 'react';

interface PaginationProps<T> {
    data: T[];
    itemsPerPage: number;
    onPageChange?: (page: number) => void;
}

interface PaginationReturn<T> {
    currentData: T[];
    currentPage: number;
    maxPage: number;
    next: () => void;
    prev: () => void;
    jump: (page: number) => void;
}

export function usePagination<T>({
    data,
    itemsPerPage,
    onPageChange,
}: PaginationProps<T>): PaginationReturn<T> {
    const [currentPage, setCurrentPage] = useState(1);

    const maxPage = Math.ceil(data.length / itemsPerPage);

    const currentData = useCallback(() => {
            const start = (currentPage - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            return data.slice(start, end);
    }, [data, currentPage, itemsPerPage]);

    const next = () => {
        setCurrentPage((currentPage) => {
            const newPage = Math.min(currentPage + 1, maxPage);
            onPageChange?.(newPage);
            return newPage;
        });
    };

    const prev = () => {
        setCurrentPage((currentPage) => {
            const newPage = Math.max(currentPage - 1, 1);
            onPageChange?.(newPage);
            return newPage;
        });
    };

    const jump = (page: number) => {
        const pageNumber = Math.max(1, Math.min(page, maxPage));
        onPageChange?.(pageNumber);
        setCurrentPage(pageNumber);
    };

    return { currentData: currentData(), currentPage, maxPage, next, prev, jump };
}
