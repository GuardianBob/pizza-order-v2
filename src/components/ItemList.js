import React from 'react';

const ItemList = (props) => {
    
    return (
        
        <div className="form-group">
            <label htmlFor={props.name} className="form-label">
                {props.title}
            </label>
            <div className="form-control">
                <ul className="list-group">
                    {props.items.map(item => {
                            return (                        
                                <li key={item.orderID} className="list-group-item"
                                    id={item.orderID}                        
                                    name={item.email}                                                
                                    >
                                    <div className="row mx-1 justify-content-between">
                                    <div className="col-8">{item.email}</div>
                                    <div className="col-3">$ 25.50</div>
                                    </div>                
                                </li>
                            );
                        })
                    } 
                </ul>
            </div>
            
        </div>
    )
}

export default ItemList;