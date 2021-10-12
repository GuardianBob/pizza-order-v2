import React, {Component, useState} from 'react';
import firebase from './Firebase';
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { Redirect, Route } from 'react-router-dom';
import 'firebase/database';
// import { navigate } from '@reach/router';

import { IoIosSettings } from "react-icons/io";
import { GiBigGear } from "react-icons/gi";
import { GoCheck } from "react-icons/go";
import Orders from './Orders';
import OrdersToday from './OrdersToday';
import Settings from './Settings'

class Admin extends Component {
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
            } else {
                // navigate('/login');
                <Redirect to='/login' push />;
            }
            
        })
    }

    logOutUser = e => {
        e.preventDefault();
        const auth = getAuth();
        signOut(auth).then(() => {
            this.setState({
                user: null
            });
            // navigate('/')
            <Redirect to='/' push />;
        }).catch((error) => {

        })
    };

    toggleActive (e, tabID) {
        // this.setState({
        //     isHidden: !this.state.isHidden
        // })
        var x = document.getElementById(tabID);
        if (x.classList.contains("active")) {
            x.classList.remove("active");
        } else {
            x.classList.add("active");
        }
    }
    
    
    render() {
        const { user, logOutUser } = this.props;
        
        const gStyle = { marginRight: "2px"}
        return(
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-sm-6 text-center">
                        <h3>Meyer Family Pizza - Admin</h3>
                    </div>                
                </div>
                <div className="card">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                            <button className="nav-link active" id="orders-today-tab" 
                                data-bs-toggle="tab" 
                                data-bs-target="#orders-today" 
                                type="button" 
                                role="tab" 
                                aria-controls="orders-today" 
                                aria-selected="false">
                                    Today's Orders
                            </button>
                        </li>
                        <li className="nav-item" role="presentation">
                            <button className="nav-link" id="orders-tab" 
                                data-bs-toggle="tab" 
                                data-bs-target="#orders" 
                                type="button" 
                                role="tab" 
                                aria-controls="orders" 
                                aria-selected="false">
                                    All Orders
                            </button>
                        </li>
                        <li className="nav-item flex-grow-1 bd-highlight text-end" role="presentation">
                            <button className="nav-link text-decoration-none" 
                                id="settings-tab" 
                                data-bs-toggle="tab"
                                data-bs-target="#settings" 
                                type="button" 
                                role="tab" 
                                aria-controls="settings" 
                                aria-selected="false">
                                    <IoIosSettings style={gStyle} />Settings
                            </button>
                        </li>
                        <li className="nav-item">
                            <button className="btn btn-link text-decoration-none" 
                                id="logout-tab" 
                                data-bs-target="#logout" 
                                type="button" 
                                role="link" 
                                aria-controls="logout" 
                                aria-selected="false"
                                onClick={e => this.logOutUser(e)}>
                                    Log Out
                            </button>
                        </li>
                    </ul>
                    
                    <div className="tab-content" id="myTabContent">
                        <div className="tab-pane fade show active" id="orders-today" role="tabpanel" aria-labelledby="orders-today-tab"><OrdersToday /></div>
                        <div className="tab-pane fade" id="orders" role="tabpanel" aria-labelledby="orders-tab"><Orders /></div>                        
                        <div className="tab-pane fade" id="settings" role="tabpanel" aria-labelledby="settings-tab"><Settings /></div>
                    </div>                    
                </div>
                
            </div>        
        );
    }
}

export default Admin;