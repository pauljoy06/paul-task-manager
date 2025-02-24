import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

import { Icon } from '@/components';
import { useToggle } from '@/hooks';
import { byString, equal, copy } from '@/utils';


export default function TableHeaderRow(props) {
    // For column reorder - used inside the Column component
    const [ source, setSource ] = useState();
    const [
        expandColumnPreference,
        toggleExpandColumnPreference,
    ]  = useToggle(false);

    function onColumnSortClick(colID, sortable, e) {
        var list = [...props.items];

        // Frontend sorting
        if (props.sorting.sortedColID === colID) {
            // console.log('Reverse sorting..');
            list.reverse();
            props.setSorting((sorting) => ({
                ...sorting,
                reverseSorted: !sorting.reverseSorted,
            }));
        } else {
            // console.log('Normal sorting..');
            list.sort((a, b) => {
                if (byString(a, colID) === byString(b, colID)) {
                    return 0;
                } else {
                    return (byString(a, colID) < byString(b, colID)) ? -1 : 1;
                }
            });
            props.setSorting((sorting) => ({
                sortedColID: colID,
                reverseSorted: false,
            }));
        }
        props.updateCollection({items: list})
    }

    function toggleAllRowsSelection(e) {
        let select = false;
        if (rowsSelectionState === 'none') {
            select = true;
        }

        let tempItems = copy(props.items);
        tempItems.map(item => {
            item._selected = select;
        });

        // console.log('Toggling everything..');
        props.updateCollection({
            items: tempItems
        });
    }

    function getRowsSelectionState() {
        // Returns: 'all'/'none'/'some'
        let selectedCount = 0;
        let unselectedCount = 0;
        props.items.map(item => {
            if (item._selected) {
                selectedCount += 1;
            } else {
                unselectedCount += 1;
            }
        });

        if (selectedCount === 0) {
            return 'none';
        } else if (unselectedCount === 0) {
            return 'all';
        } else {
            return 'some';
        }
    }

    const rowsSelectionState = getRowsSelectionState();

    return (
        <tr className={`table-header-row${props.className ? ' '+props.className : ''}`}>
            {props.columns.map((col) => <Column
                key={col.id}
                column={col}
                customData={props.customData}
                sorting={props.sorting}
                onColumnSortClick={onColumnSortClick}

                // For column reordering
                columns={props.columns}
                setColumns={props.setColumns}
                source={source}
                setSource={setSource}
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
    // if (!props?.col.visible) {
        //Added to check feasibility of column preferences using CSS
        // return;
    // }
    return <th key={props.column.id}
        className={`data-header ${props.column.headerClassName || ''} table-header-data`}
    >
        <div className='draggable-header'
            id={props.column.id}
        >
            {props.column.renderHeader
                ? props.column.renderHeader(props.column, props.customData)
                : <span className='column-name'
                    onClick={props.column.sortable
                        ? () => props.onColumnSortClick(props.column.id, props.column.sortable)
                        : null
                    }
                >
                    {props.column.name}
                    {props.column.id === props.sorting.sortedColID
                        ? props.sorting.reverseSorted ? ' ↓' : ' ↑'
                        : ''
                    }
                </span>
            }
        </div>
    </th>
}

