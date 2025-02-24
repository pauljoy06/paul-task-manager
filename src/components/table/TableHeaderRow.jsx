import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@/components';
import { useToggle } from '@/hooks';
import { byString, equal, copy } from '@/utils';


export default function TableHeaderRow(props) {
    // For column reorder - used inside the Column component
    const [
        expandColumnPreference,
        toggleExpandColumnPreference,
    ]  = useToggle(false);

    function onColumnSortClick(colID) {
        if (props.sortBy === colID) {
            // Cycle sorting order: asc, desc, null
            const newOrder = props.sortOrder === 'asc' ? 'desc' : props.sortOrder === 'desc' ? null : 'asc';
            props.setSortOrder(newOrder);
            if (newOrder === null) props.setSortBy(null);
        } else {
            // Set new column and start with ascending order
            props.setSortBy(colID);
            props.setSortOrder('asc');
        }
    }

    return (
        <tr className={`table-header-row${props.className ? ' '+props.className : ''}`}>
            {props.columns.map((col) => <Column
                key={col.id}
                column={col}

                // For column reordering
                columns={props.columns}
                setColumns={props.setColumns}

                sortBy={props.sortBy}
                setSortBy={props.setSortBy}
                sortOrder={props.sortOrder}
                setSortOrder={props.setSortOrder}
                onColumnSortClick={onColumnSortClick}
            />)}
            {props.enableColumnPreference && <div className='column-preferences'>
                <div className='column-preferences-toggle'>
                    <button onClick={e => {
                        e.preventDefault();
                        toggleExpandColumnPreference();
                    }}
                    >
                        <Icon path='plus-button-grey.svg' />
                    </button>
                </div>
                {expandColumnPreference && <div className='column-preferences-expanded'>
                    {props.availableColumns.map(aC => {
                        const isChecked = props.preferredColumns.includes(aC.id);
                        return <div className='column-preference-item'
                            onClick={e => props.togglePreferredColumns(e, aC.id)}
                        >
                            {isChecked && <div className='checked-icon box-check-green-icon'>
                                <div className='tick'>&#x2713;</div>
                            </div>}
                            {!isChecked && <div className='checked-icon box-grey-icon'>
                            </div>}

                            <div className='column-name'>{aC.name}</div>
                        </div>
                    }
                    )}
                </div>}
            </div>}
        </tr>
    );
}

function Column(props) {
    return <th
        key={props.column.id}
        className={`data-header ${props.column.headerClassName || ''} table-header-data`}
    >
        <div id={props.column.id}>
            <span className='column-name' onClick={() => props.onColumnSortClick(props.column.id)}>
                {props.column.name}
                {props.sortBy === props.column.id
                    ? props.sortOrder === 'asc' ? ' ↑' 
                        : props.sortOrder === 'desc' ? ' ↓' 
                            : ''
                    : ''}
            </span>
        </div>
    </th>
}

