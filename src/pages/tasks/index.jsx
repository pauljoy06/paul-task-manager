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
    const [ taskModal, toggleTaskModal ] = useToggle(false);
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
        totalPagesTask
    ] = usePaginatedData({storageKey: STORAGE_KEY});

    const [
        taskForm,
        setTaskForm,
        onTaskChange,
        taskError,
        setTaskError,
    ] = useForm(INIT_TASK_DATA);
    
    function onTaskSubmit() {
        addTask(taskForm);
    }

    // To initialise tasks if localStorage is empty
    useEffect(() => {
        const loadData = async () => {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                console.log('$$$$$$ if', typeof storedData, storedData);
                const parsedData = JSON.parse(storedData);
                if (Array.isArray(parsedData)) {
                    setTasks(parsedData);
                    console.log('$$$$$$storedData', typeof parsedData, parsedData);
                    if (parsedData.length > 0) return;
                }
            }
            
            try {
                console.log('Executing data refresh........!!!');
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
        <div className='page-content'>
            <PageTopRow
                title='Tasks'
                buttonText='+ Add Task'
                onButtonClick={toggleTaskModal}
            />
            <Table
                items={tasks} 
                columns={columns}
                loaded={true}
            />
        </div>
        {taskModal && <Modal
            title='Add Task'
            className='task-modal'
            toggleModal={toggleTaskModal}
            form='task-form' 
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
                        options={getList(TASK_STATUSES, 'name', 'value')}
                        name='status'
                        value={taskForm.status}
                        onChange={onTaskChange}
                    />
                </div>
            </form>
        </Modal>}

    </div>
}

const transformFormToItem = (formData) => {
    return {
        title: formData.title.trim(),
        status: formData.status,
        priority: formData.priority,
        ...(formData?.id && {id: formData.id})
    };
};


export default TasksPage;
