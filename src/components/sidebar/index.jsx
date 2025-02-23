import React, { useState } from 'react';
import {  NavLink } from 'react-router-dom';
import { Icon } from '..';

export default function Sidebar() {
    const [ isCollapsed, setIsCollapsed] = useState(
        JSON.parse(localStorage.getItem('preferences.sidebarCollapsed'))
    );

    const collapsedClassName = 'sidebar-collapsed';
    const expandedClassName = 'sidebar-expanded';

    const items = [
        {
            name: 'Tasks',
            icon: 'tasks.svg',
            height: 16,
            width: 15,
            url: '/tasks',
        },
    ]


    function onSidebarToggle(e) {
        e.preventDefault();
        setIsCollapsed(old => {
            let new_ = !old;
            localStorage.setItem('preferences.sidebarCollapsed', new_);
            window.dispatchEvent(new StorageEvent('storage', {
              key: 'preferences.sidebarCollapsed',
              old,
              new_,
            }));

            return new_;
        });
    }

    return <div id='sidebar'
        className={isCollapsed ? collapsedClassName : expandedClassName}
    >
        <nav className='navigation-links'>
            {items.map((item, index) => <NavLink
                to={item.url}
                className='sidebar-item'
                key={index}
            >
                <Icon path={item.icon} width={item.width} height={item.height} />
                {!isCollapsed && <div
                    className='item-name'
                >
                    {item.name}
                </div>}

            </NavLink>)}
        </nav>
        <div className='bottom-items'>
            <button
                className='sidebar-toggle sidebar-item'
                data-test='sidebar-toggle'
                onClick={onSidebarToggle}
            >
                {isCollapsed
                    ? <Icon path='expand.svg' width={14.63} height={13.51} />
                    : <>
                        <Icon path='collapse.svg' width={14.63} height={13.51} />
                        <div className='sidebar-toggle-text'>Collapse</div>
                    </>
                }
            </button>
        </div>
    </div>
}

