import React from 'react';

const Checkbox = (props) => {
    return (
        <div className="form-group">
            <label htmlFor={props.name} className="form-label">
                {props.title}
            </label>
            <div className="form-control checkbox">
                {props.options.map(option => {
                    return (
                        <label key={option} className="checkbox-inline me-2">
                    <input 
                        id={props.name}                        
                        name={props.name}
                        onChange={props.handleChange}
                        value={option}
                        checked={ props.selectedOptions.indexOf(option) > -1 }
                        className="mx-1"                        
                        type="checkbox"
                    />
                    {option}
                    </label>
                    );                    
                })}
            </div>
        </div>
    )
    }

export default Checkbox;