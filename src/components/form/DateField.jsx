import React, { useState, useEffect, useRef } from 'react';

import moment from 'moment';
import Calendar from './Calendar';
import { Icon } from '@/components';
import { equal, getDayLabel } from '@/utils';

const DateField = React.memo(({ dateFormat = 'MMM DD, YYYY', ...props }) => {
    // If `props.time` is set to true, the field is assumed to be a
    // datetime field and the time input is taken into account for handling
    //

    /*
        * MeContext is used to fetch preferred date time format.
        *The ideal way to do this would have been to pass a date format
        *as a prop to the DateField component.
    */
    const [ selectedDate, setSelectedDate ] = useState(props.value || null);

    // Note: Passing a function as an argument to useState gets executed without
    // having to call the function: https://github.com/facebook/react/issues/15209
    const [ enteredDate, setEnteredDate ] = useState(() => {
        let date = moment(props.value);
        if (date.isValid()) {
            return date.format('DD/MM/YYYY');
        }
        return moment().add(1, 'days').format('DD/MM/YYYY')
    });
    const [ enteredTime, setEnteredTime ] = useState(() => {
        let time = moment(props.value);
        if (time.isValid()) {
            return time.format('HH:mm A');
        }
        return '10:00 AM';
    });
    const [ calendarVisible, setCalendarVisible ] = useState(false);

    // To close calendar when clicking outside
    useEffect(() => {
        document.addEventListener('click', onClick);

        return () => document.removeEventListener('click', onClick);
    }, []);

    function toggleCalendar() {
        setCalendarVisible(old => {
            if (old) {
                return false;
            }
            return true;
        });
        // calendarVisible ? setCalendarVisible(false) : setCalendarVisible(true);
    }

    function onClick(e) {
        let calendarElement = document.querySelector('.calendar');
        let calendarInputElement = dateFieldNode.current;

        if (calendarElement && !calendarElement.contains(e.target)
            && !calendarInputElement.contains(e.target)) {
            setCalendarVisible(false);
        }
    }

    let className = `date-field ${props.className || ''}`;
    if (props.disabled) {
        className += ' disabled'
    }

    let classNameDateInput = 'date-label';
    const dateFieldNode = useRef();

    //Logic to manipulate states based on viewMode
    let displayElement;
    if (!props.viewMode || props.viewMode === 'edit') {
        // Display logic for edit
        displayElement = <>
            {props.label && <label className={`label${props.error ? ' error-label' : ''}`}>
                {props.label}
                {props.required && <span className='required'> *</span>}
            </label>}

            <div className={`date-input ${props.error && 'error'}`}>
                <div className={classNameDateInput || ''}
                    onClick={e => {
                        props.disabled || toggleCalendar();
                    }}
                    disabled={props.disabled}
                >
                    {props.value
                        ? <span className='readable-date input-display-text'>
                            {props.datetime
                                && moment(props.value).format('MMMM Do, YYYY, h:mm a')
                                || moment(props.value).format('MMM D, YYYY')
                            }
                        </span>
                        : <span className='placeholder'>
                            {props.placeholder ? props.placeholder : ''}
                        </span>
                    }

                    <Icon
                        path={props.iconPath || 'calendar.svg'}
                        width={14}
                        height={15}
                    />
                </div>

                {calendarVisible && <Calendar className='calendar'
                    value={props.value}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    enteredDate={enteredDate}
                    setEnteredDate={setEnteredDate}
                    enteredTime={enteredTime}
                    setEnteredTime={setEnteredTime}
                    onChange={props.onChange}
                    setCalendarVisible={setCalendarVisible}
                    datetime={props.datetime}   // Whether to get the time along with the date or not
                    disableBefore={props.disableBefore}
                    disableAfter={props.disableAfter}
                />}

                <input type='text' autoComplete='off'
                    style={{display: 'none'}}
                    className={`date-text-input`}
                    name={props.name}
                    value={props.value || ''}
                    onChange={props.onChange}
                    // onFocus={showCalendar}
                />
            </div>

            {props.error && <span className='error-message'>
                {props.error}
            </span>}

            {props.success && <span className='succes-message'>
                {props.success}
            </span>}
        </>
    } else {
        // Dispaly logic for read state
        displayElement = <>
            {props.label && <label className='read-state-label'>
                {props.label}
                {props.required && <span className='required'> *</span>}
            </label>}
            <div className='read-state-value'>
                {props.value
                    ? getDayLabel(
                        moment(props.value, 'YYYY-MM-DD'),
                        dateFormat
                    )
                    : '-'
                }
            </div>
        </>
    }

    return <div className={className} ref={dateFieldNode}>
        {displayElement}
    </div>
}, equal);

export default DateField;
