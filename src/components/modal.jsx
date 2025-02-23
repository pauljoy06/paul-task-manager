import { useEffect } from 'react';
import { Icon } from '@/components';

/**
     * Modal component to display a modal dialog.
     * 
     * @param {Object} props - Component props
     * @param {string} [props.className] - Additional class names for styling
     * @param {boolean} [props.noHeader=false] - If true, hides the modal header
     * @param {boolean} [props.noFooter=false] - If true, hides the modal footer
     * @param {string} [props.title] - Title of the modal
     * @param {Function} props.toggleModal - Function to toggle modal visibility
     * @param {string} [props.buttonName] - Name for the submit button in the footer
     * @param {string} [props.form] - Form ID associated with the modal footer button
     * @param {boolean} [props.loading=false] - If true, disables the footer button
     * @param {React.ReactNode} [props.children] - Modal content
     * @returns {JSX.Element} The rendered Modal component
 */
export default function Modal(props) {
    useEffect(() => {
        document.addEventListener('click', onClick, false);

        return () =>
            document.removeEventListener('click', onClick, false);
    }, []);

    function onClick(e) {
        if (e.target.classList.contains('modal')) {
            // console.log('Clicked outside');
            props.toggleModal();
        }
    }

    return <div className={`modal ${props.className || ''}`}>
        <div className='inner'>
            {!props.noHeader && <ModalHeader title={props.title}
                toggleModal={props.toggleModal}
            />}

            {props.children}
            
            {!props.noFooter && <ModalFooter
                buttonName={props.buttonName}
                form={props.form}
                disabled={props.loading}
            />}
        </div>
    </div>
}

function ModalHeader(props) {
    return <div className='header'>
        <h2>{props.title}</h2>

        <button
            type='button'
            className='cobb close-button'
            onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                props.toggleModal();
            }}
        >
            <Icon path='x-dark-grey.svg' size={10}/>
        </button>
    </div>
}

function ModalFooter(props) {
    return <div className='footer'>
        <button className='button primary-button'
            type='submit'
            form={props.form}
            disabled={props.loading}
        >
            {props.buttonName || 'Submit'}
        </button>
    </div>
}

