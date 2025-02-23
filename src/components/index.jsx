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
}
