import React, { useState, useEffect, useRef } from 'react';

import { equal, toLower } from '@/utils';
import { useToggle } from '@/hooks';
import { Icon } from '@/components';

const SelectField = React.memo(props => {
    const [ isOn, toggle, setOn ] = useToggle(false);

    const scrollRef = useRef(null); // Reference to scroll to the selected option

    let displayElement;
    let options = props.options || [];

    // To close the options when clicking outside
    useEffect(() => {
        document.addEventListener('click', onClick);

        return () => document.removeEventListener('click', onClick);
    }, []);

    function onClick(e) {
        let optionsElement = document.querySelector('.select-options');
        let selectInputElement = selectFieldNode.current;

        if (optionsElement && !optionsElement.contains(e.target)
            && !selectInputElement.contains(e.target)) {
            setOn(false);
        }
    }

    if (props.enableNoneOption) {
        options = [{
            name: '-----',
            value: 'clear',
        }, ...options];
    }

    let selectedOption;
    if (props.value !== null && props.value !== undefined) {
        selectedOption = options.find(option => option.value === props.value);

        if (props.enableLazyLoadOptions && selectedOption === undefined) {
            request.get(`${props.optionsURL}/${props.value}`)
                .then(([status_, response]) => {
                    let newItems = copy(optionC.items);
                    newItems.push(response.data);
                    updateOptionC({
                        items: newItems,
                    });
                })
            ;
        }
    }


    const [ filterText, setFilterText ] = useState('');

    // Frontend search: New custom search matches if all words in box
    // are found anywhere in the option.label, case in-sensitive
    function customFilter(option, rawInput) {
        const words = rawInput.split(' ');

        if (option.data.searchString) {
            return words.reduce(
                (acc, cur) =>
                    acc &&
                        option.data.searchString
                            .toLowerCase()
                            .includes(cur.toLowerCase()),
                true
            );
        }

        if (typeof option.label === 'string') {
            return words.reduce(
                (acc, cur) =>
                    acc && option.label.toLowerCase().includes(cur.toLowerCase()),
                true
            );
        }

        if (!rawInput) {
            return true;
        }

        return false;
    }

    const selectFieldNode = useRef();

    const ref = useRef(null);

    const onDropdownArrowClick = () => {
        ref.current.focus();
    };

    //To scroll into view when option is selected
    //Added as seperate useEffect as the options are not strictly rendered on
    //dropdown click
    // useEffect(() => {
    //
    //     if(isOn) {
    //         const parent = selectFieldNode.current;
    //         const selectedElement = selectFieldNode.current.querySelector('.selected');
    //
    //         if(parent && selectedElement) {
    //             parent.scrollTop = selectedElement.offsetTop - parent.offsetTop;
    //         }
    //     }
    // }, [isOn])

    let inputClassName = 'select-box-left input-display-text';
    if (filterText) {
        inputClassName += ' filter-text';
    }

    if (selectedOption) {
        inputClassName += ' option-selected';
    }

    // console.log('SelectField', props);


    if (!props.viewMode || props.viewMode === 'edit') {
        //Display logic for edit
        displayElement = <>
            {props.label && <label className={`label${props.error ? ' error-label' : ''}`}>
                {props.label}
                {props.required && <span className='required'> *</span>}
            </label>}

            <div className='select-field-inner'>
                <div className={`select-box ${props.error && 'error'}`}
                    onClick={!props.disabled ? toggle : null}
                >
                    <input
                        ref={ref}
                        {...props}
                        type='text'
                        className={inputClassName}
                        data-test='dropdown-searchable-text-input'
                        value={filterText}
                        onChange={e => {
                            setFilterText(e.target.value);
                            setOn(true);
                        }}
                        placeholder={(selectedOption && selectedOption.name)
                            || props.placeholder
                            || 'Select a value'
                        }
                        autoComplete='off'
                        disabled={props.disabled}
                    />
                    <div className='select-box-right' onClick={onDropdownArrowClick}>
                        <Icon width={10} height={7}
                            path={props.boxRightIcon || 'line-arrow-down-faded.svg'}
                        />
                    </div>
                </div>

                {isOn && <div className='select-options'>
                    {options.length > 0 && options.map((selectOption, index) => {
                        const isSelected = selectOption.value === props.value;
                        let itemMatches = true;
                        let optionNameCharacters = selectOption.name
                            ? selectOption.name.toString().split('')
                            : [];

                        let filterTextRemainingChars = toLower(filterText).split('');
                        let buttonText = optionNameCharacters.map((character, index) => {
                            let className = 'suggestion-character';
                            // console.log(filterTextChars, filterTextChars[0], character);
                            if (filterTextRemainingChars.length > 0
                                && filterTextRemainingChars[0] === toLower(character)) {
                                className += ' match';
                                filterTextRemainingChars.splice(0, 1);
                            }

                            if (index === optionNameCharacters.length - 1
                                && filterTextRemainingChars.length > 0) {
                                itemMatches = false;
                            }

                            // if(isSelected) {
                            //     className += ' selected';
                            // }

                            if (character === ' ') {
                                return <span className={className}>
                                    &nbsp;
                                </span>
                            }
                            return <span className={className}>
                                {character}
                            </span>
                        });

                        if (!itemMatches) {
                            return null;
                        }

                        return <button type='button'
                            className={`select-option ${isSelected ? 'selected' : ''}`}
                            data-value={selectOption.value}
                            // Since HTML attributes cannot store type, we
                            // have to explicity specify the type here
                            // for useForm to get the value in the proper type
                            data-type={typeof selectOption.value}
                            onClick={e => {
                                props.onChange(e);
                                setOn(false);
                                setFilterText('');
                            }}
                            key={selectOption.value}
                            ref={isSelected ? scrollRef : null}
                        >
                            {buttonText}
                        </button>
                    })}
                    {options.length === 0 && <div className='select-options-no-data'>
                        No options available
                    </div>}
                </div>}
            </div>

            {!props.pure && <>
                <span className='error-message'>{props.error}</span>
                <span className='success-message'>{props.success}</span>
            </>}
        </>
    } else {
        const selectedValue = options.find(option => option.value === props.value);
        //Dispaly logic for read state
        displayElement = <>
            {props.label && <label className='read-state-label'>
                {props.label}
                {props.required && <span className='required'> *</span>}
            </label>}
            <div className='read-state-value'>
                {selectedValue?.name ?? '-'}
            </div>
        </>
    }

    useEffect(() => {
        if (props.enableLazyLoadOptions) {
            console.log('$$Inside SelectField lazy load');
            updateOptionC({
                url: props.optionsURL,
                queryString: `${props.optionsURLParams ? props.optionsURLParams+'&' : ''}page_size=10&q=${filterText}`,
            });
        }
    }, [props.enableLazyLoadOptions, filterText]);

    return <div
        className={`select-field ${props.className || ''}${props.disabled && props.viewMode === 'edit' ? 'select-field-disabled' : ''}`}
        name={props.name}
        ref={selectFieldNode}
    >
        {displayElement}
    </div>
}, equal);

export default SelectField;
