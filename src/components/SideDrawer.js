import React from 'react';
import ItemList from './ItemList';
import './SideDrawer.css'


const SideDrawer = (props) => {   

    const demoItems = [
        {
            id: 1,
            name: 'Item 1',
            price: 5
        },
        {
            id: 2,
            name: 'Item 2',
            price: 10
        }
    ]

    var cUrl = window.location.href;

    let orderItems = []

    let drawerClasses = 'side-drawer'
    // console.log(props)
    if (props.sideDrawerOpen) {
        drawerClasses = 'side-drawer open'
        const orders = JSON.parse(localStorage.getItem('pizza'));
        // console.log(this.props.click)
        // console.log(orders);
        orders.map(item => {
            orderItems.push(item);
        })
        
    }
    // console.log(props.action);
        
    return (
        <nav className={drawerClasses}>
            <form className="container" id="orderForm" onSubmit={props.action}>
                <ItemList name={'Shopping Cart'}
                    items={orderItems}
                />
                <button className="btn btn-outline-primary" >Submit</button>
            </form>          
        </nav>
    )
}

export default SideDrawer