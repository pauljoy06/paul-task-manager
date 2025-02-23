import Modal from "./modal";

/**
     * Icon component for displaying an icon with customizable size and style.
     * 
     * @param {Object} props - Component props
     * @param {string} props.path - Path to the icon image
     * @param {number} [props.size=12] - Size of the icon (applies to both width and height)
     * @param {number} [props.width] - Width of the icon (overrides size if provided)
     * @param {number} [props.height] - Height of the icon (overrides size if provided)
     * @param {Function} [props.onClick] - Click handler for the icon
     * @param {string} [props.className] - Additional class names for styling
     * @param {Object} [props.style] - Additional inline styles
     * @returns {JSX.Element} The rendered Icon component
 */
function Icon(props) {
    let width, height;

    if (props.size) {
        width = height = props.size;
    } else if (props.width || props.height) {
        if (props.width) {
            width = props.width;
        }

        if (props.height) {
            height = props.height;
        }
    } else {
        width = height = 12;
    }

    return <div className='icon'>
        <div onClick={props.onClick}
            className={`icon-image ${props.className || ''}`}
            style={{
                width: width ? width + 'px' : undefined,
                height: height ? height + 'px' : undefined,
                backgroundImage:
                    `url(/icons/${props.path ? props.path : 'placeholder.svg'})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                backgroundSize: `${width}px ${height}px`,
                ...props.style,
            }}
        >
        </div>
    </div>
}

export {
    Icon,
    Modal,
}
