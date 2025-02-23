import { Modal } from '@/components';
import { DateField, Input } from '@/components/form';

const TasksPage = (props) => {
    return <div id='tasks-page' className='app-content listing-view'>
        <div className='page-content'>
            <Input label='Input' />
            <DateField label='Test Field' />            
        </div>
    </div>
}

export default TasksPage;
