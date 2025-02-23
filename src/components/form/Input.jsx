import React, { useEffect, useRef } from 'react';

import { Icon } from '@/components';
import { equal } from '@/utils';

const Input = React.memo(props => {
    const textAreaRef = useRef();
    const hiddenDivRef = useRef();
    let displayElement;

    useEffect(() => {
        if (props.autoResize) {
            let textArea = textAreaRef.current;
            let hiddenDiv = hiddenDivRef.current;

            textArea.style.overflow = 'hidden';

            // Add the same content to the hidden div
            let value = props.value || '';
            hiddenDiv.innerHTML = value || 'a';
            if (value[value.length - 1] == '\n') {
                hiddenDiv.innerHTML = value + 'a';
            }

            // Briefly make the hidden div block but invisible
            // This is in order to read the height
            hiddenDiv.style.visibility = 'hidden';
            hiddenDiv.style.display = 'block';

            textArea.style.height = hiddenDiv.offsetHeight + 'px';

            // Make the hidden div display:none again
            hiddenDiv.style.visibility = 'visible';
            hiddenDiv.style.display = 'none';
        }
    }, [ props.value ]);

    let inputElement;
    if (props.type === 'textarea') {
        inputElement = <>
            <textarea {...props}
                ref={textAreaRef}
                className={`input-element input-display-text ${props.error && 'error'}`}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
            >
                {props.value}
            </textarea>

            {/* Used for textarea autoresize
                - https://www.impressivewebs.com/textarea-auto-resize/ */}
            {props.autoResize && <div ref={hiddenDivRef}
                className='hidden-div'
            />}
        </>
    } else {
        let searchStr;
        let options = props.options || [];
        let className = 'input-element-wrapper';
        if (props.error) {
            className += ' error';
        }
        if (props.disabled) {
            className += ' disabled';
        }

        inputElement = <div className={className}>
            {props.prefixIconPath && <Icon path={props.prefixIconPath}
                className='prefix'
                size={15}
            />}

            <input {...props}
                type={props.type}
                className={`input-element input-display-text ${props.error && 'error'}`}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                disabled={!!props.disabled}
            />

            {props.suggest && props.value && <div className='suggestions'>
                {options.map(option => <button
                    type='button'
                    className='cobb suggestion'
                    onClick={e => props.onOptionSelect(e, option)}
                >
                    {(searchStr = toLower(String(props.value)).split('')) && ''}
                    {option.name.split('').map((letter, index) => {
                        let className = 'suggestion-character';
                        if (searchStr.length > 0 && searchStr[0] === toLower(letter)) {
                            className += ' match';
                            searchStr.splice(0, 1);
                        }

                        return <span className={className}>{letter}</span>
                    })}
                </button>)}
            </div>}

            {props.postfixText && <span className='input-inside-right'>
                {props.postfixText}
            </span>}

            {props.postfixIconPath && <Icon path={props.postfixIconPath}
                onClick={props.onPostfixClick}
                className='postfix'
                size={12}
            />}
        </div>
    }

    let className = 'input';
    if (props.className) {
        className += ' ' + props.className;
    }
    if (props.type==='textarea') {
        className += ' textarea';
    }

    if (!props.viewMode || props.viewMode === 'edit') {
        //Display logic for edit
        displayElement = <>
            {props.label && <label className={`label${props.error ? ' error-label' : ''}`}>
                {props.label}
                {props.required && <span className='required'> *</span>}
            </label>}

            {inputElement}

            {!props.pure && <span className='error-message'>
                {props.error}
            </span>}
            {!props.pure && <span className='success-message'>
                {props.success}
            </span>}
        </>
    } else {
        //Dispaly logic for read state
        displayElement = <>
            {props.label && <label className='read-state-label'>
                {props.label}
                {props.required && <span className='required'> *</span>}
            </label>}
            <div className='read-state-value'>
                {props.value ? props.value : '-'}
            </div>
        </>
    }

    return <div className={className}>
        {displayElement}
    </div>
}, equal);

export default Input;
