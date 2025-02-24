import { useState, useEffect } from 'react';

import { usePaginatedData } from '@/hooks/usePaginatedData';
import { Modal, Table, PageTopRow } from '@/components';
import { DateField, Input } from '@/components/form';

const STORAGE_KEY = 'tasks';
const SAMPLE_DATA_URL = 'https://gist.githubusercontent.com/yangshun/7acbe005af922e43a26dea8109e16aed/raw';

const TasksPage = (props) => {
    const [ columns, setColumns ]  = useState([
        {
            name: 'ID',
            id: 'id',
            visible: true,
        },
        {
            name: 'Title',
            id: 'title',
            visible: true,
            render: (row) => row.title
        },
    ]);

    const [
        tasks,
        setTasks,
        addTask,
        updateTask,
        deleteTask,
        filterQueryTask,
        setFilterQueryTask,
        currentPageTask,
        setCurrentPageTask,
        totalPagesTask
    ] = usePaginatedData(STORAGE_KEY);

    // To initialise tasks if localStorage is empty
    useEffect(() => {
        const loadData = async () => {
            const storedData = localStorage.getItem(STORAGE_KEY);

            if (storedData) {
                setTasks(JSON.parse(storedData));
            } else {
                try {
                    const response = await fetch(SAMPLE_DATA_URL);
                    const data = await response.json();
                    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                    setTasks(data);
                } catch (error) {
                    console.error('Failed to fetch mock data, using sample tasks', error);
                    setTasks([]);
                }
            }
        };

        loadData();
    }, []);

    return <div id='tasks-page' className='app-content listing-view'>
        <div className='page-content'>
            <PageTopRow
                title='Tasks'
                buttonText='+ Add Task'
            />
            <Table
                items={tasks} 
                columns={columns}
                loaded={true}
            />
        </div>
    </div>
}

export default TasksPage;
