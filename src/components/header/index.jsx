import React from 'react';
import { Link } from 'react-router-dom';


export default function Header() {
    return <div id='header'>
        <div className='left-section'>
            <Link to='/' className='app-logo'>
                <img src='/images/tasks-manager.png' />
            </Link>
        </div>
        <div className='right-section'>
            <div className='user-profile-picture'>
                <div>
                    <img src='/images/headshot-placeholder.png' />
                </div>
            </div>
            <div className='user-details'>
                <div className='user-name'>
                    Paul
                </div>
            </div>
        </div>
    </div>
}

