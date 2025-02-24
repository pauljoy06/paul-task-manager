import React, { useState, useEffect } from 'react';

import { byString, equal } from '@/utils';

import { Icon } from '@/components';

function TableRow(props) {
    let userReadableRow = {...props.row};
    if (props.displayRowModifier) {
        userReadableRow = props.displayRowModifier(userReadableRow);
    }

    function getDisplayDataCells() {
        const dataCells = props.columns.map((col) => {
            // TODO Temporary patch until backend is changed to `id` for both sorting and
            // filtering columns (or some other consistent format)
            //Below code commented as columns are state in Sunassist project
            // if (col.id === 'id_') {
            //     col.id = 'id';
            // }
            // console.log('getDisplayDataCells',col.name, col.id, typeof col.render);
            // For retrieving values that are to be displayed that are nested
            let value;
            if (col.id.includes('.')) {      // IE 11 beware of `includes`
                value = byString(userReadableRow, col.id);
            } else {
                value = userReadableRow[col.id];
            }

            let content;
            if (col.render) {
                // Both row and customData are passed in case the custom render
                // function requires those data in order to render successfully
                // collection and updateCollection are passed to update row
                // value - courtesy to installment mapper - there may be a better
                // way of doing it
                content = col.render(
                    props.row,
                    props.customData,
                    props.collection,
                    props.updateCollection,
                    props.index,
                );
            } else {
                content = value;
            }

            //Code added to enable preferred columns using CSS
            let className = `${col.dataClassName} table-body-data`;
            let cell = <td key={col.id} className={className}>
                { content }
            </td>

            return cell;
        });

        let [ selectedOption, setSelectedOption ] = useState(null);

        return <tr key={userReadableRow.id}
            className={`${props.className || ''} data-row table-body-row`}
            onClick={onClick}
            draggable={props.draggedRow === props.index}
            onDragStart={(e) => props.onDragStart(e, props.index, props.row)}
            onDragOver={(e) => props.onDragOver(e, props.index)}
            onDrop={(e) => props.onDragDrop(e, props.index)}
            style={{
                position: props.draggingEnabled? 'stickey' : props.style,
                left: props.draggingEnabled ? '0px' : props.style,
                right: props.draggingEnabled ? 'initial' : props.style,
                transform: props.draggingEnabled? 'translateX(0)' : props.style,
                backgroundColor: props.draggingEnabled ? '#ffffff' : props.style,
            }}
            ref={props.reference}
        >
            {dataCells}

            {props.hoverOptions && <td key={1000} className='table-body-data row-options-wrapper'>
                {/*Element is hidden from user using combination of CSS and JS*/}
                {!selectedOption && <div className='row-options'>
                    {props.hoverOptions.map(option => {
                        return <div className='row-option'>
                            <button onClick={(e) => {
                                e.preventDefault();
                                //If confirmation is requried show the relevant UI
                                if (option.requiresConfirmation) {
                                    setSelectedOption(option);
                                } else {
                                    option.onClick(props.row);
                                }
                            }}>
                                {option.image && <Icon path={option.image} />}
                                {option.text}
                            </button>
                        </div>
                    })}
                </div>}

                {selectedOption && <div className='option-expanded'>
                    <div className='confirmation-wrapper'>
                        <div className='confirmation-message'>
                            {selectedOption.confirmMessage}
                        </div>
                        {selectedOption.confirmRender && <div className='confirm-render'>
                            {selectedOption.confirmRender(props.row, props.customData)}
                        </div>}
                        <div className='close-option-confirmation'>
                            <button onClick={() => setSelectedOption(null)}>
                                <Icon path='confirm-close-circle.svg' />
                            </button>
                        </div>
                    </div>
                    <div className='option-confirm'>
                        <button
                            className='option-confirm-button'
                            onClick={e => {
                                e.preventDefault();
                                selectedOption.onClick(props.row, props.customData);
                            }}
                        >
                            <Icon path={selectedOption.image} />
                        </button>
                    </div>
                </div>}
            </td>}
        </tr>
    }

    function onClick(e) {
        if (props.onClick) {
            props.onClick(e, props.index);
        }
    }

    return getDisplayDataCells();
}

// Re-render only if props are different
export default React.memo(TableRow, (prevProps, nextProps) => {
    // console.log('Previous props:', prevProps);
    // console.log('Next props:', nextProps);
    // return equal(prevProps, nextProps);
    return false;
});

