import { useState, useEffect } from 'react';

import { useToggle, usePaginatedData, useForm } from '@/hooks';
import { Modal, Table, PageTopRow } from '@/components';
import { DateField, Input, SelectField } from '@/components/form';
import { TASK_PRIORITIES, TASK_STATUSES } from '@/constants';
import { getOptions, getList } from '@/utils';

const STORAGE_KEY = 'tasks';
const SAMPLE_DATA_URL = 'https://gist.githubusercontent.com/yangshun/7acbe005af922e43a26dea8109e16aed/raw';
const INIT_TASK_DATA = {
    title: null,
    status: null,
    priority: null,
}

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
        {
            name: 'Status',
            id: 'status',
            visible: true,
            render: (row) => TASK_STATUSES[row.status] || ''
        },
        {
            name: 'Priority',
            id: 'priority',
            visible: true,
            render: (row) => TASK_PRIORITIES[row.priority] || ''
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
        totalPagesTask,
        sortByTask,
        setSortByTask,
        sortOrderTask,
        setSortOrderTask,
    ] = usePaginatedData({storageKey: STORAGE_KEY});

    const [ taskFormType, setTaskFormType ] = useState('create'); // create/update
    const [ taskModal, toggleTaskModal ] = useToggle(false);
    const [
        taskForm,
        setTaskForm,
        onTaskChange,
        taskError,
        setTaskError,
    ] = useForm(INIT_TASK_DATA);

    const hoverOptions = [
        {
            image: 'edit.svg',
            onClick: (row) => onEditTaskClick(row),
        },
        {
            image: 'delete-bin-red.svg',
            onClick: (row) => onTaskDelete(row),
            requiresConfirmation: true,
            confirmMessage: 'Are you sure you want to delete this task?',
        }
    ];
    
    function onTaskSubmit() {
        if (taskFormType === 'create') addTask(taskForm);
        if (taskFormType === 'update') updateTask(taskForm.id, taskForm);
    }

    function onTaskDelete(task) {
        deleteTask(task.id);
    }

    function onAddTaskClick() {
        setTaskFormType('create');
        toggleTaskModal();
    }

    function onEditTaskClick(row) {
        setTaskFormType('update');
        setTaskForm(row);
        toggleTaskModal();
    }


    // To initialise tasks if localStorage is empty
    useEffect(() => {
        const loadData = async () => {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                if (Array.isArray(parsedData)) {
                    setTasks(parsedData);
                    if (parsedData.length > 0) return;
                }
            }
            
            try {
                const response = await fetch(SAMPLE_DATA_URL);
                const data = await response.json();
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
                setTasks(data);
            } catch (error) {
                console.error('Failed to fetch mock data, using sample tasks', error);
                setTasks([]);
            }
        };

        loadData();
    }, []);

    return <div id='tasks-page' className='app-content listing-view'>
        <PageTopRow
            title='Tasks'
            buttonText='+ Add Task'
            onButtonClick={onAddTaskClick}
        />
        <div className='page-content'>
            <Table
                loaded={true}
                items={tasks} 
                columns={columns}
                tableEmptyText='No tasks'
                hoverOptions={hoverOptions}
                sortBy={sortByTask}
                setSortBy={setSortByTask}
                sortOrder={sortOrderTask}
                setSortOrder={setSortOrderTask}
            />
        </div>
        {taskModal && <Modal
            title={taskFormType === 'create' ? 'Add Task' : 'Edit Task'}
            className='task-modal'
            toggleModal={toggleTaskModal}
            form='task-form' 
            buttonName='Save'
        >
            <form id='task-form' onSubmit={onTaskSubmit}>
                <div className='title'>
                    <Input label='Title'
                        name='title'
                        value={taskForm.title}
                        onChange={onTaskChange}
                    />
                </div>
                <div className='status'>
                    <SelectField label='Status'
                        options={getList(TASK_STATUSES, 'value', 'name')}
                        name='status'
                        value={taskForm.status}
                        onChange={onTaskChange}
                    />
                </div>
                <div className='status'>
                    <SelectField label='Priority'
                        options={getList(TASK_PRIORITIES, 'value', 'name')}
                        name='priority'
                        value={taskForm.priority}
                        onChange={onTaskChange}
                    />
                </div>
            </form>
        </Modal>}

    </div>
}

export default TasksPage;
