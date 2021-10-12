import React from 'react';

const TextInput = (props) => {
    return (
        <div className="form-group">
            {/* <label htmlFor={props.name} className="form-label me-2">{props.title}</label> */}
            <input
                className="form-control"
                id={props.name}
                name={props.name}
                type={props.inputType}
                defaultValue={props.value}
                onChange={props.handleChange}
                placeholder={props.placeHolder}
                required={props.required}
                step={props.step}
            />
        </div>
    );
}

export default TextInput;