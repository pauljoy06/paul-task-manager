import React, { useState, useEffect, useContext } from 'react';
// import { useAlert } from 'react-alert';

import { MeContext } from '@/contexts';
import { Icon } from '@/components';
import { copy, byString, equal } from '@/utils';

import TableRow from './TableRow';
import TableHeaderRow from './TableHeaderRow';


const Table = (props) => {
    // let alert_ = useAlert();
    let returnItem;
    let tableHeaderClassName;

    //Column Preferences
    const { me, setMe } = useContext(MeContext);
    const [ preferredColumns, setPreferredColumns ] = useState([]);

    const [ sorting, setSorting ] = useState({
        sortedColID: null,
        reverseSorted: false,
    });

    // Filter out visible columns
    const visibleColumns = props.columns?.filter(column => column.visible) ?? [];

    // To set colSpan for the loaders
    let totalColumns = visibleColumns.length;
    if (props.selectableRows === -1) {
        totalColumns += 1;
    }

    //Code for updating preferred columns
    useEffect(() => {
        if (me?.preferred_columns) {
            let preferredColumnsTemp = me?.preferred_columns[props.name] ?? null;
            if (preferredColumnsTemp !== null) {
                setPreferredColumns(me.preferred_columns[props.name]);

                props.setColumns(old => {
                    //Below code commented out so that render function is not removed
                    // let new_ = copy(old);

                    old = old.map(column => {
                        if (preferredColumnsTemp.includes(column.id)) {
                            column.visible = true;
                        } else {
                            column.visible = false;
                        }
                        return  column;
                    });

                    return old;
                });
            }
        }
    }, [me]);

    function togglePreferredColumns(e, columnId) {
        let index = preferredColumns.indexOf(columnId);
        let preferredColCopy = copy(preferredColumns);
        let mePreferredColumns = copy(me?.preferred_columns);

        if (index === -1) {
            //Column is not selected. Add it to the preferred columns
            preferredColCopy.push(columnId);
        } else {
            //Column present in preferred column. Remove it from list
            preferredColCopy.splice(index, 1);
        }
        if (preferredColCopy.length === 0) {
            // alert_.error('Atleast one column should be selected');
            return;
        }

        setPreferredColumns(preferredColCopy);

        props.setColumns(old => {
            //Below code commented out so that render function is not removed
            // let new_ = copy(old);

            old = old.map(column => {
                if (preferredColCopy.includes(column.id)) {
                    column.visible = true;
                } else {
                    column.visible = false;
                }
                return  column;
            });

            return old;
        });

        if (mePreferredColumns) {
            mePreferredColumns[props.name] = preferredColCopy;

            let requestData = {
                data: {
                    preferred_columns: mePreferredColumns,
                }
            }
            // console.log('Table PC useEffect IF', requestData);
            request.patch('me', requestData)
                .then(([status_, response]) => {
                    setMe(old => {
                        let new_ = copy(old);

                        new_.preferred_columns = mePreferredColumns;

                        return new_;
                    });
                });
        }
    }

    // Data rows
    let dataRows = null;
    if (props.loaded) {
        dataRows = props.items.map((item, index) => {
            let className = 'row';

            return (
                <TableRow className={className}
                    key={
                        byString(props.items[index], props.keyField)
                            || props.items[index].id.toString()
                    }

                    index={index}
                    row={props.items[index]}
                    columns={visibleColumns}
                    hoverOptions={props.hoverOptions}

                    onClick={props.onRowClick}
                    urlPath={props.urlPath} // Required for URL cells in each row

                    onEditIconClick={props.onEditIconClick}
                    customData={props.customData}

                    collection={props.collection}
                    updateCollection={props.updateCollection}
                    reference={index === (props.items.length-1) ? props.reference : null}
                    
                />
            );
        });

        if (props.getCustomRows) {
            dataRows.push(props.getCustomRows(visibleColumns, props.customData));
        }
    }
    if (!props.loaded) {
        // Code to show skelton loader
        returnItem = <table
            className={`table table-loader ${props.className ? props.className : ''}`}
        >
            <thead className='table-header'>
                <tr className='table-loader-header-row'>
                    {[1, 2, 3, 4, 5].map((column, index) => <th className='table-loader-header-data' key={index} />)}
                </tr>
            </thead>
            <tbody className='table-body'>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((row, index) => <tr className='table-loader-row' key={index}>
                    {[1, 2, 3, 4, 5].map((column, colIndex) => <td className='table-loader-data' key={colIndex} />)}
                </tr>)}
            </tbody>
        </table>
    } else if (props.loaded && props.items.length > 0 ) {
        returnItem = <table className={`table ${props.className ? props.className : ''}`}
        >
            <thead className='table-header'>
                <TableHeaderRow collapsed={props.collapsed}
                    customData={props.customData}
                    items={props.items}
                    columns={visibleColumns}
                    queryString={props.queryString}

                    listName={props.listName}

                    // For column reorder functionality to work
                    setColumns={props.setColumns}
                    className={tableHeaderClassName}

                    //For column sorting
                    sortBy={props.sortBy}
                    setSortBy={props.setSortBy}
                    sortOrder={props.sortOrder}
                    setSortOrder={props.setSortOrder}


                    //For column preferences
                    availableColumns={props.columns}
                    preferredColumns={preferredColumns}
                    setPreferredColumns={setPreferredColumns}
                    togglePreferredColumns={togglePreferredColumns}
                    enableColumnPreference={props.enableColumnPreference}
                />
            </thead>
            <tbody className='table-body'>
                {!props.collapsed && (
                    !props.loaded
                        ? <tr className='table-body-row'>
                            <td className='loader' colSpan={totalColumns}>
                                Loading...
                            </td>
                        </tr>
                        : dataRows && dataRows.length > 0
                            ? dataRows
                            : <tr className='table-body-row'>
                                <td className='no-data' colSpan={totalColumns}>
                                    {/* No data found */}
                                    {props.noRecordsMessage && <div className='create-first-record'>
                                        {props.noRecordsMessage}
                                    </div>}
                                    {props.createFirstRecordText && <div className='create-first-record'>
                                        <Icon path='create-table-record.svg' size={35} />
                                        <div className='create-first-record-text'>
                                            {props.createFirstRecordText || ''}
                                        </div>
                                        {<button
                                            className='cobb primary'
                                            onClick={props.createRecordToggle}
                                        >
                                            {props.newRecordLabel}
                                        </button>}
                                    </div>}
                                </td>
                            </tr>
                )}
            </tbody>
        </table>
    } else if (props.loaded && props.items.length === 0) {
        returnItem = <div className='table-empty'>
            <div className='table-empty-text'>{props.tableEmptyText}</div>
        </div>
    }

    return returnItem;
}

// Re-render only if props are different
export default React.memo(Table, (prevProps, nextProps) => {
    // console.log('Table memo', prevProps, nextProps);
    // return equal(prevProps, nextProps);
    return false;
});

