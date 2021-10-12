import React, {Component, useState} from 'react';
import firebase from './Firebase';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { Redirect, Route } from 'react-router-dom';
import 'firebase/database';
// import { navigate } from '@reach/router';
import { IoPizza } from "react-icons/io5";
import { BsCheckCircle } from "react-icons/bs";
import { GoCheck } from "react-icons/go";

class OrdersToday extends Component {
    constructor() {
        super();
        this.state = {
            user: null
        };
        
    }

    componentDidMount() {
        const auth = getAuth();
        onAuthStateChanged(auth, (FBUser) => {
            if (FBUser) {
                this.setState({
                    user: FBUser
                });

                var today = new Date().toLocaleDateString().replace(/\//g, '-');

                const db = getDatabase();
                const ordersRef = ref(db, 'orders/' + today + '/');
                onValue(ordersRef, (snapshot) => {
                    let orders = snapshot.val();
                    let ordersList = [];

                    for(let item in orders) {
                        ordersList.push({
                            date: today,
                            orderID: item,
                            orderName: orders[item].oName,
                            email: orders[item].email,
                            phone: orders[item].phone,
                            pickUp: orders[item].pickUp,
                            toppings: orders[item].toppings,
                            ready: orders[item].ready,
                            complete: orders[item].complete
                        });                        
                    }
                    // console.log(ordersList);
                    this.setState({
                        todaysOrders: ordersList
                    })
                });
            } else {
                // navigate('/login');
                <Redirect to='/login' push />;
            }
            
        })
    }

    toggleReady = (e, ready, whichOrder) => {
        e.preventDefault();
        const today = new Date().toLocaleDateString().replace(/\//g, '-');
        const db = getDatabase();
        // console.log(ready);
        
        if (ready === undefined) {
            // readyRef.set(true);
            set(ref(db, 'orders/' + today + `/${whichOrder}/ready`), true);
        } else {
            // readyRef.set(!ready);            
            set(ref(db, 'orders/' + today + `/${whichOrder}/ready`), !ready);
        }
    }

    toggleComplete = (e, complete, whichOrder) => {
        e.preventDefault();
        const today = new Date().toLocaleDateString().replace(/\//g, '-');
        const db = getDatabase();
        // console.log(complete);
        
        if (complete === undefined) {
            // completeRef.set(true);
            set(ref(db, 'orders/' + today + `/${whichOrder}/complete`), true);
        } else {
            // completeRef.set(!complete);
            set(ref(db, 'orders/' + today + `/${whichOrder}/complete`), !complete);
        }
    }

    toggleHidden (e, divID) {
        var x = document.getElementById(divID);
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
    }
    
    render() {
        
        const orders = this.state.todaysOrders;
        // console.log(orders);
        const today = new Date().toLocaleDateString().replace(/\//g, '-');
        let tOrders;
        if (orders) {
            tOrders = orders.map(item => {
                return (
                    <div className=""
                        key={item.orderID}>
                        <div className="card" onClick={e => this.toggleHidden(e, item.orderID + "toppings")}>
                            <div className={
                                'card-body align-items-center p-0 '
                            }>
                                <div className="card-title fs-5 mb-0">
                                    <div className="btn-group pe-2" role="group">
                                        <button className={"btn " + (item.ready ? 'btn-info' : 'btn-outline-secondary')}
                                            title="Order is ready"
                                            onClick={e => this.toggleReady(e, item.ready, item.orderID)}>
                                                <IoPizza />
                                        </button>
                                        <button className={"btn " + (item.complete ? 'btn-info' : 'btn-outline-secondary')}
                                            title="Order is complete"
                                            onClick={e => this.toggleComplete(e, item.complete, item.orderID)}>
                                                <BsCheckCircle />
                                        </button>
                                    </div>
                                    <span className="mt-1" >
                                    {item.orderName} - {item.orderDate} - Pick up time: {item.pickUp}
                                    <ul className="card-text list-group list-group-flush p-0 text-center " id={item.orderID + "toppings"} style={{display: ""}}>{item.toppings.map((topping) => {
                                        return (
                                            <li className="list-group-item col-5 p-0 d-inline mx-1 text-primary " key={topping}> + {topping}</li>
                                        )
                                    })}</ul>
                                    </span>
                                </div>                                
                            </div>
                        </div>
                    </div>
                );
            });
            {/* console.log(tOrders); */}
        }
        
        return(
            <div className="row justify-content-center">
                <div className="col-8 col-sm-8 col-md-8 col-lg-8 mb-2 ">
                    <h3 className="text-center">Orders</h3>
                    {tOrders}
                </div>            
            </div>            
        );
    }
}

export default OrdersToday;