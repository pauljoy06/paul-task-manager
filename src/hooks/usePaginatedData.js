import { useState, useEffect, useMemo } from 'react';
import { loadStoredData } from '@/utils';

/**
 * Custom hook for managing data with localStorage persistence.
 * Supports filtering, sorting, pagination, and CRUD operations.
 * @param {string} storageKey - The localStorage key to store data
 * @param {string} filterBy - The field name to filter by
 * @param {string} sortByP - The field name to sort by
 * @param {number} pageSize - Number of items per page
 * @param {number} initialPage - Initial page number
 */
export function usePaginatedData({
    storageKey,
    filterBy = '',
    sortByP,
    sortOrderP,
    pageSize = 200,
    initialPage = 1
}) {
    const [data, setData] = useState(() => loadStoredData(storageKey));
    const [sortBy, setSortBy] = useState(sortByP);
    const [sortOrder, setSortOrder] = useState(sortOrderP); // 'asc', 'desc', null
    const [filterQuery, setFilterQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);

    const priorityOrder = { low: 1, medium: 2, high: 3 };
    const statusOrder = { not_started: 1, in_progress: 2, completed: 3 };

    // Persist data to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem(storageKey, JSON.stringify(data));
    }, [data, storageKey]);

    const setDataManually = (newData) => {
        if (!Array.isArray(newData)) {
            console.error("setData expects an array.");
            return;
        }
        setData(newData);
    };

    // CRUD Operations
    const addItem = (item) => {
        const highestId = data.length > 0 ? Math.max(...data.map((item) => item.id)) : 0;
        const newItem = { id: highestId + 1, ...item };
        const newData = [newItem, ...data];
        setData(newData);
        return newData;
    };

    const updateItem = (id, updatedItem) => {
        setData((prev) => prev.map((item) => (item.id === id ? { ...item, ...updatedItem } : item)));
    };

    const deleteItem = (id) => {
        setData((prev) => prev.filter((item) => item.id !== id));
    };

    // Filtering
    const filteredData = useMemo(() => {
        return filterQuery
            ? data.filter((item) =>
                item[filterBy]?.toString().toLowerCase().includes(filterQuery.toLowerCase())
            )
            : data;
    }, [data, filterQuery, filterBy]);

    const sortedData = useMemo(() => {
        if (!sortBy || !sortOrder) return filteredData;

        return [...filteredData].sort((a, b) => {
            let result = 0;
            if (sortBy === 'id') {
                result = a.id - b.id;
            } else if (sortBy === 'title') {
                result = a.title.localeCompare(b.title);
            } else if (sortBy === 'priority') {
                result = (priorityOrder[a.priority] || 0) - (priorityOrder[b.priority] || 0);
            } else if (sortBy === 'status') {
                result = (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0);
            }
            return sortOrder === 'asc' ? result : -result;
        });
    }, [filteredData, sortBy, sortOrder]);

    // Pagination
    useEffect(() => {
        setTotalPages(Math.ceil(sortedData.length / pageSize));
    }, [sortedData, pageSize]);

    const paginatedData = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, currentPage, pageSize]);

    return [
        paginatedData,
        setDataManually,
        addItem,
        updateItem,
        deleteItem,
        filterQuery,
        setFilterQuery,
        currentPage,
        setCurrentPage,
        totalPages,
        sortBy,
        setSortBy,
        sortOrder,
        setSortOrder
    ];
}

