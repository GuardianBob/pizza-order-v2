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

class Orders extends Component {
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
                const ordersRef = ref(db, 'orders/');
                onValue(ordersRef, (snapshot) => {
                    let orders = snapshot.val();
                    let ordersList = [];
                    for (let date in orders){
                        let oDate = orders[date];                     
                        for (let item in oDate) {
                            // console.log(date);
                            ordersList.push({
                                orderDate: date,
                                orderID: item,
                                orderName: oDate[item].oName,
                                email: oDate[item].email,
                                phone: oDate[item].phone,
                                pickUp: oDate[item].pickUp,
                                toppings: oDate[item].toppings,
                                ready: oDate[item].ready,
                                complete: oDate[item].complete
                            }); 
                        }
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

    toggleReady = (e, ready, whichOrder, orderDate) => {
        e.preventDefault();
        const today = new Date().toLocaleDateString().replace(/\//g, '-');
        const db = getDatabase();
        // console.log(ready);
        
        if (ready === undefined) {
            // readyRef.set(true);
            set(ref(db, 'orders/' + orderDate + `/${whichOrder}/ready`), true);
        } else {
            // readyRef.set(!ready);            
            set(ref(db, 'orders/' + orderDate + `/${whichOrder}/ready`), !ready);
        }
    }

    toggleComplete = (e, complete, whichOrder, orderDate) => {
        e.preventDefault();
        const today = new Date().toLocaleDateString().replace(/\//g, '-');
        const db = getDatabase();
        // console.log(complete);
        
        if (complete === undefined) {
            // completeRef.set(true);
            set(ref(db, 'orders/' + orderDate + `/${whichOrder}/complete`), true);
        } else {
            // completeRef.set(!complete);
            set(ref(db, 'orders/' + orderDate + `/${whichOrder}/complete`), !complete);
        }
    }

    toggleToppings = (e, iToppings) => {
        e.preventDefault();
        return !iToppings;
    }

    toggleHidden (e, divID) {
        // this.setState({
        //     isHidden: !this.state.isHidden
        // })
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

        let tOrders;
        if (orders) {
            tOrders = orders.map(item => {
                const iToppings = false;
                return (
                    <div className=""
                        key={item.orderID}>
                        <div className="card mb-1 " onClick={e => this.toggleHidden(e, item.orderID + "toppings")}>
                            <div className='card-body p-0 '>
                                <div className="fs-5 mb-0">
                                    <div className="btn-group pe-2 " role="group">
                                        <button className={"btn " + (item.ready ? 'btn-info' : 'btn-outline-secondary')}
                                            title="Order is ready"
                                            onClick={e => this.toggleReady(e, item.ready, item.orderID, item.orderDate)}>
                                                <IoPizza />
                                        </button>
                                        <button className={"btn " + (item.complete ? 'btn-info' : 'btn-outline-secondary')}
                                            title="Order is complete"
                                            onClick={e => this.toggleComplete(e, item.complete, item.orderID, item.orderDate)}>
                                                <BsCheckCircle />
                                        </button>
                                    </div>
                                    <span className="mt-1 " >
                                        {item.orderName} - {item.orderDate} - Pick up time: {item.pickUp}
                                            <ul className="card-text list-group list-group-flush p-0 text-center " id={item.orderID + "toppings"} style={{display: "none"}}>{item.toppings.map((topping) => {
                                                return (
                                                    <li className="list-group-item col-6 p-0 d-inline mx-1 text-primary " key={topping}> + {topping}</li>
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
                <div className="col-8">
                    <h3 className="text-center">Orders</h3>
                    {tOrders}
                </div>            
            </div>            
        );
    }
}

export default Orders;