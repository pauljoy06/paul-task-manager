import React from 'react';
import { useToggle } from '@/hooks';

/**
 * PageTopRow component representing the top row of a page layout.
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Title displayed on the left side
 * @param {string} [props.buttonText] - Text for the primary button (if provided)
 * @param {Function} [props.onButtonClick] - Callback function for button click
 * @param {Array<{ label: string, icon: string, onClick: Function }>} [props.moreOptions] - List of more options, each with a label, icon, and click handler
 * @param {Object} [props.filterData] - Filter box properties
 * @param {React.ReactNode} props.filterData.content - Filter content
 * @param {Function} props.filterData.applyFilter - Function to apply the filter
 * @param {Function} props.filterData.clearFilter - Function to clear the filter
 * @param {boolean} props.filterData.filterEnabled - Indicates if the filter is active
 * @returns {JSX.Element} The rendered PageTopRow component
 */
const PageTopRow = (props) => {
    const [ isMoreOpen, toggleIsMoreOpen, setIsMoreOpen ] = useToggle(false);
    let searchInput = 'Search Input';
    return <div className='page-top-row'>
        <div className='top-row-left'>
            <div className='page-title' data-test='page-title'>
                {props.title}
            </div>
        </div>
        <div className='top-row-right'>
            {<>
                {false && <div className='search-box-wrapper'>
                    {searchInput}
                </div>}
                {props.buttonText && <div className='add-record-button'>
                    <button className='button primary-button' data-test='primary-button'
                        onClick={e => {
                            e.preventDefault();
                            props.onButtonClick();
                        }}
                    >
                        {props.buttonText}
                    </button>
                </div>}
                {props.moreOptions && <div className='more-options-wrapper'>
                    <button className='more-options-button'
                    onClick={e => {
                        e.preventDefault();
                        toggleIsMoreOpen();
                    }}>
                        <Icon path='more.svg' width={18} height={4}/>
                    </button>
                    {isMoreOpen && <div className='more-options-list'>
                        {props.moreOptions.map((moreOption, index) => <button
                            className='more-option-button'
                            onClick={e => {
                                e.preventDefault();
                                moreOption.onClick();
                                setIsMoreOpen(false);
                            }}
                        >
                            <div className='more-option-icon'>
                                <Icon path={moreOption.icon} width={14} height={12.25} />
                            </div>
                            <div className='more-option-text'>
                                {moreOption.label}
                            </div>
                        </button>)}
                    </div>}
                </div>}
            </>}
            {props.filterData && <FilterBox
                content={props.filterData.content}
                applyFilter={props.filterData.applyFilter}
                clearFilter={props.filterData.clearFilter}
                filterEnabled={props.filterData.filterEnabled}
            />}
        </div>
    </div>
}

export default PageTopRow;
