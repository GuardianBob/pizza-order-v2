import React, { Component } from 'react';
import ItemList from './ItemList';
import './BackDrop.css'

class BackDrop extends Component {
    render(){
        return(
            <div className="backdrop" onClick={this.props.click}/>
        )
    }
}

export default BackDrop