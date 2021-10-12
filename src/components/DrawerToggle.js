import React, { Component } from 'react'
import {FaShoppingCart} from 'react-icons/fa';

import './DrawerToggle.css'


class DrawerToggle extends Component {
    
    render(){
        
        return (
            <div>
                <button className="btn btn-primary" onClick={this.props.click}>
                    <FaShoppingCart />
                </button>
            </div>
            )
    }
}

export default DrawerToggle