import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './main.css'

import Sidebar from './components/sidebar'
import TasksPage from '../src/pages/tasks'
import NotFoundView from './pages/not-found'
import Header from './components/header'
import { MeContext } from '@/contexts';

function App() {
    const [ pages ] = useState([
        {
            path: '/',
            redirectTo: '/tasks',
        },
        {
            path: '/tasks',
            component: TasksPage,
            title: 'Tasks',
            heading: 'Tasks',
        },
    ]);

    return <MeContext.Provider value={{}}> 
        <Router>
            <Routes>
                {/* 404 route */}
                <Route path='*' element={<NotFoundView />} />

                {/* All the pages */}
                {pages.map(page => {
                    return <Route
                        key={page.path}
                        path={page.path}
                        element={<ElementWrapper
                            path={page.path}
                            title={page.title}
                            component={page.component}
                            redirectTo={page.redirectTo}
                            heading={page.heading}
                        />}
                    />
                })}
            </Routes>
        </Router>
    </MeContext.Provider>
}
function ElementWrapper(props) {
    useEffect(() => {
        // To scroll page to the top and to set the page title
        document.title = props.title;
        window.scrollTo(0, 0);
    }, [ props.title ])


    if (props.redirectTo) {
        console.log('Redirecting..');
        return <Navigate to={props.redirectTo} />
    }

    const [ mainClassName, setMainClassName] = useState(
        JSON.parse(localStorage.getItem('preferences.sidebarCollapsed'))
            ? 'expanded-view'
            : ''
    );

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'preferences.sidebarCollapsed') {
                setMainClassName(JSON.parse(localStorage.getItem('preferences.sidebarCollapsed'))
                    ? ' expanded-view'
                    : ''
                )
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return <div id='main-grid' className={`${mainClassName}`}>
        <Header />
        <Sidebar />
        <props.component heading={props.heading} />
    </div>
}


export default App
