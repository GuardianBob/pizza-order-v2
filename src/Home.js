import React, { Component, useState } from 'react';
import {FaPizzaSlice} from 'react-icons/fa';
// import {Link} from '@reach/router'
import FormError from './FormError';
import firebase from './Firebase';
import Order from './Order';
import SideDrawer from './components/SideDrawer'
import DrawerToggle from './components/DrawerToggle'
import BackDrop from './components/BackDrop'
import Context from "./Context";
import withContext from "./withContext";
import { getDatabase, ref, set, onValue } from 'firebase/database';

// export const MContext = React.createContext();  //exporting context object
// class MyProvider extends Component {
// state = {message: ""}
// render() {
//         return (
//             <MContext.Provider value={
//             {   state: this.state,
//                 setMessage: (value) => this.setState({
//                             message: value })}}>
//             {this.props.children}   {/* //this indicates that all the child tags with MyProvider as Parent can access the global store. */}
//             </MContext.Provider>)
//     }
// }
let settings = {};

class Home extends Component {
        
    constructor(props) {
        super(props); 
        console.log(props)       
        settings = props.context.settings;
        this.state = props.context;        
        

        const db = getDatabase();
        const settingsRef = ref(db, 'settings/');
        onValue(settingsRef, (snapshot) => {
        // this.state.toppingsOptions = snapshot.val();
            settings = snapshot.val();
            console.log(settings);
            // this.state.settings = settings;
            this.setState({ settings });
            this.state.toppingsOptions = settings['toppingsAvailable'];
            // console.log(this.state.toppingsOptions);
            var d = new Date();
            var dN = d.getDay();
            // console.log(dN + ": " + settings['daysAvailable']);
            if (settings['daysAvailable'].includes(dN)) {
                this.state.available = true;
            } else {
                this.state.available = false;
            }
            // console.log(this.state.available);       
        
        })  

        console.log(this.state.settings);
        
        this.drawerClickHandler = this.drawerClickHandler.bind(this);
        
    }
    
    componentDidMount() {
        
        let cartOrders = []
        const prevOrders = JSON.parse(localStorage.getItem('pizza'))
        if (prevOrders) {
            // console.log(prevOrders);
            prevOrders.map(item => {
                cartOrders.push(item);
            })
        }
        this.state.cartOrders = cartOrders
        console.log(this.state.cartOrders);

        
    }

    drawerClickHandler = () => {
        this.setState({
            sideDrawerOpen: !this.state.sideDrawerOpen
        })
        // console.log(this.state.sideDrawerOpen)
    }

    backgroundClickHandler = () => {
        if (this.state.sideDrawerOpen){
            this.setState({
                sideDrawerOpen: false
            })
        }
        
        // console.log(this.state.sideDrawerOpen)
    }

    submitOrder(e) {
        e.preventDefault();
        var timestamp = new Date().getTime();
        // let orderID = `${this.state.newOrder.phone}-${timestamp}`;
        var today = new Date().toLocaleDateString().replace(/\//g, '-');
        // console.log(today.toLocaleDateString("en-US"));
        // console.log(this.state.cartOrders);
        console.log(e.target);
        // const db = getDatabase();
        // set(ref(db, 'orders/' + today + '/' + orderID), newOrder);
    };    

    render() {
        const {user} = this.props;
        
        let backdrop;
        if(this.state.sideDrawerOpen){
            backdrop = <BackDrop  click={this.backgroundClickHandler}/>;
        }
        console.log(this.state);

        const pStyle = { color: "orange"}
        // let cartOrders = this.state.cartOrders

        return (
            <Context.Provider
                    value={{
                    ...this.state
                    }}
                >
            <div>
                {/* <MyProvider> */}
                    <SideDrawer sideDrawerOpen={this.state.sideDrawerOpen} cartOrders={this.state.cartOrders} action={this.submitOrder}/>
                    { backdrop }    
                    <div className="container" id="home-title">
                        <div className="row text-center justify-content-center">
                            <div className="col my-4">
                                <span className="align-middle me-2">
                                    <FaPizzaSlice size={25} style={pStyle}/> 
                                </span>
                                <span className="align-middle display-4 text-primary">
                                    Meyer Family Pizza - Daybreak
                                </span>                                                   
                            </div>
                            <div className="col-md-auto mt-4">
                                <DrawerToggle click={this.drawerClickHandler}/> 
                            </div>
                            <hr></hr>
                        </div>
                        <div className="row justify-content-center text-center">
                            <div className="col-md-8 mb-3">
                                <span className="text-center">
                                    Deep dish pizza prepared traditionally by your neighbors on West Upland View Dr, South Jordan, Utah. 
                                </span>                        
                            </div>
                            <hr></hr>
                        </div>                
                    </div>
                    <div className="container" id="order-form">
                        <Order sideDrawerOpen={this.state.sideDrawerOpen} addToCart={this.state.cartOrders} />
                    </div>
                {/* </MyProvider> */}
            </div>
            </Context.Provider>
            );
    }
}

export default withContext(Home);