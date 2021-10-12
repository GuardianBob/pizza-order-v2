import React from 'react';

const FormButton = (props) => {
    return (
        <button className={props.className} onClick={props.action}>
            {props.title}
        </button>
    );
}

export default FormButton;