import { useState } from 'react';

import { copy, byString, getTime, getMap } from '@/utils';

import moment from 'moment';


const selectEventTypes = [
    'select-option', 'remove-value',
    'clear', 'pop-value', 'set-value',
];

function useForm(initialData) {
    // initialData - Initial JSON structure
    // Make sure to remove all empty fields (lead update - exception) before submitting

    const [ data, setData ] = useState(initialData);
    const [ errors, setErrors ] = useState({});

    function setErrorsMap(error) {
        setErrors(getMap(error, 'field', false, key => key, 'description'));
    }

    function onInputChange(e, selectEvent=null, compositeValueInArray=true) {
        // selectEvent: react-select returns the selected option as the first value
        // and selectEvent as the second with extra info about the event

        let name, value;
        if (selectEvent !== null && selectEventTypes.includes(selectEvent.action)) {
            // React-Select
            name = selectEvent.name;
            value = getEventValue(e, selectEvent);
        } else if (e.target.closest('.select-option') !== null) {
            // Select field
            name = e.target.closest('.select-field').getAttribute('name');
            value = getEventValue(e);

            if (value === 'clear') {
                value = null;
            }
        } else if (e.target
            && e.target.type === 'checkbox'
            && e.target.closest('.checkbox-group') !== null) {
            /*
             * This place before the checkbox check so that it executes first
            */
            name = e.target.closest('.checkbox-group').dataset.name;
            value = e.target.closest('.checkbox-group').dataset.value;
            let returnIntegerId = e.target.closest('.checkbox-group').dataset.returnintegerd;
            let checkboxValue = e.target.dataset.value;

            let tempArray = [];
            if (e.target.closest('.checkbox-group').dataset.value){
                tempArray = e.target.closest('.checkbox-group').dataset.value.split(',');
            }

            let index = tempArray
                .map(element => element).indexOf(checkboxValue);
            if (index === -1) {
                tempArray = [...tempArray, checkboxValue];
            } else {
                tempArray.splice(index, 1);
            }

            if (returnIntegerId) {
                tempArray = tempArray.map(arrayObj => parseInt(arrayObj));
            }
            value = tempArray;
        } else if (e.target && e.target.type === 'checkbox') {
            // Checkbox
            name = e.target.name;
            value = getEventValue(e);
        } else if (e.target.closest('.date-field') !== null) {
            // Date field
            const dateFieldElement = e.target.closest('.date-field');
            name = dateFieldElement.querySelector('.date-text-input').name;
            value = getEventValue(e);
        } else if (e.target.closest('.time-input')) {
            name = e.target.closest('.time-input').getAttribute('name');
            value = getEventValue(e);
        } else if (e.target.closest('.option') !== null) {
            //Code for multi-select component
            name = e.target.closest('.option').dataset.name;
            value = getEventValue(e);
            let tempArray = [];

            if (e.target.closest('.option').dataset.valuearray){
                tempArray = e.target.closest('.option').dataset.valuearray.split(',');
            }

            let index = tempArray
                .map(element => element).indexOf(value);
            if (index === -1) {
                tempArray = [...tempArray, value];
            } else {
                tempArray.splice(index, 1);
            }
            value = tempArray;
        } else {
            // TextField, TextArea, etc.
            name = e.target.name;
            value = getEventValue(e);
        }

        setData(old => {
            let new_ = copy(old);
            byString(new_, name, value);
            return new_;
        });
    }

    return [ data, setData, onInputChange, errors, setErrorsMap ];
}

function getEventValue(e, selectEvent=null, compositeValueInArray=true) {
    // If compositeValueInArray is true, it's value is put in an array - it's
    // a hack used in lead filters

    let value;

    if (selectEvent !== null && selecgttEventTypes.includes(selectEvent.action)) {
        // React-Select
        if (selectEvent.action === 'clear') {
            // User cleared the field value (by clicking on the 'x' icon)
            value = null;
        } else if (Array.isArray(e)) {
            // Multiselect field
            value = e.map(option => option.value)
        } else {
            // Single option select
            value = e.value;
        }
    } else if (e.target.closest('.select-option') !== null) {
        // Select field
        value = e.target.closest('.select-option').dataset.value;

        // For select options where value is the id of the item
        if (e.target.closest('.select-option').dataset.type == 'number') {
            value = Number(value);
        }
    } else if (e.target && e.target.type === 'checkbox') {
        // Checkbox
        value = e.target.checked;
    } else if (e.target && e.target.closest('.composite-text-field') !== null) {
        // Composite Text Field
        const compositeFieldElement = e.target.closest('.composite-text-field');
        const selectedItemElement = compositeFieldElement.querySelector('.selected-item');
        const inputElement = compositeFieldElement.querySelector('.input');

        let dropdownValue;
        if (e.target.classList.contains('dropdown-item')) {
            dropdownValue = e.target.dataset.value;
        } else {
            dropdownValue = selectedItemElement.dataset.value;
        }

        let textValue;
        if (e.target.value) {
            textValue = e.target.value;
        } else if (inputElement.value) {
            textValue = inputElement.value
        } else {
            textValue = '';
        }

        value = {
            [ compositeFieldElement.dataset.operatorName ]: dropdownValue,
            [ compositeFieldElement.dataset.valueName ]: textValue, // Returns 0 for some reason
        }

        // Hack to put the composite value inside an array (for lead filters search)
        if (compositeValueInArray) {
            value[compositeFieldElement.dataset.valueName] = [ textValue ];
        }
    } else if (e.target.closest('.date-field') !== null) {
        // Date field
        const dateFieldElement = e.target.closest('.date-field');
        const dateInputElement = dateFieldElement.querySelector('.calendar')
            .querySelector('.date-input');
        const timeInputElement = dateFieldElement.querySelector('.calendar')
            .querySelector('.time-input');

        // Check if user is clearing or setting the date
        if (e.target.classList.contains('clear-button')) {
            // User just cleared the date
            value = null;
        } else if (e.target.className === 'calendar-year-item') {
            value = moment(dateInputElement.value, 'DD/MM/YYYY').year(e.target.value).format('YYYY-MM-DD');
        } else if (e.target.className === 'calendar-month-item') {
            value = moment(dateInputElement.value, 'DD/MM/YYYY').month(e.target.value).format('YYYY-MM-DD');
        } else if (timeInputElement) {
            // User just set the date and it has a time input field
            let userInputDate = dateInputElement.value;
            let userInputTime = timeInputElement.value;
            value = moment(userInputDate, 'DD/MM/YYYY').format('YYYY-MM-DD')
                + 'T'
                + getTime(userInputTime);
        } else {
            let dateString;
            if (e.target.classList.contains('.calendar-day')) {
                dateString = e.target.dataset.datestring;
            } else if (e.target.closest('.calendar-day')) {
                dateString = e.target.closest('.calendar-day').dataset.datestring;
            }

            value = dateString;
        }
    } else if (e.target.closest('.time-input')) {
        if (e.currentTarget.className === 'time-option')  {
            value =  e.currentTarget.value;
        } else {
            value = getTime(e.target.value);
        }
    } else if (e.target.closest('.option')) {
        value = e.target.closest('.option').dataset.value;
    } else {
        // TextField, TextArea, etc.
        if (e.target.type === 'number') {
            if (e.target.step) {
                // Float
                value = parseFloat(e.target.value);
            } else {
                // Integer
                value = parseInt(e.target.value);
            }
        } else if (e.target.type === 'radio') {
            // if (Array.isArray(e.dataset.value)) {

            // }
            // value = e.dataset.value;
            if (e.target.dataset.multi === 'true') {
                if (!e.target.dataset.value) {
                    value = [ e.target.value ];
                } else {
                    value = e.target.dataset.value.split(',');
                    if (value.includes(e.target.value)) {
                        value.splice(value.indexOf(e.target.value), 1);
                    } else {
                        value.push(e.target.value);
                    }
                }
            } else {
                value = e.target.value;
            }
        } else {
            value = e.target.value;
        }
    }

    return value;
}

export {
    useForm,
    getEventValue,
}

