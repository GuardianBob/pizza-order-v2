import React, { Component } from "react";
import { Switch, Route, Link, BrowserRouter as Router } from "react-router-dom";
import Home from './Home';
import Admin from './Admin';
import Login from './Login';

import AddProduct from './components/AddProduct';
import Cart from './components/Cart';
import ProductList from './components/ProductList';
import firebase from './Firebase';
import { getDatabase, ref, set, onValue } from 'firebase/database';

import Context from "./Context";
import axios from 'axios';
import jwt_decode from 'jwt-decode';

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!===========IMPORTANT=============!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// To run backend mock-database, first fix the execution policy.  Run this command in terminal:
// set-ExecutionPolicy RemoteSigned -Scope CurrentUser 
// Then run this command to start server:
// ./node_modules/.bin/json-server-auth ./backend/db.json --port 3001

let settings = {};

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      cart: {},
      toppings: [],
      settings: {}
    };
    this.routerRef = React.createRef();
  }

  componentDidMount() {    
    const db = getDatabase();      
    const settingsRef = ref(db, 'settings/');      
    onValue(settingsRef, (snapshot) => {
        // this.state.toppingsOptions = snapshot.val();
        settings = snapshot.val();
        console.log(settings);
        this.state.settings = settings;
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
    // This loads the user when the application is started
    // let user = localStorage.getItem("user");
    // This fetches the cart
    let cart = localStorage.getItem("pizza");
    // This fetches products when app is loaded
    // const products = await axios.get('http://localhost:3001/products');
    // user = user ? JSON.parse(user) : null;
    cart = cart? JSON.parse(cart) : {};
    // this.setState({ user });    
    this.setState({ cart });
    // console.log(this.state);
    // const prevOrders = JSON.parse(localStorage.getItem('pizza'))
    //   if (prevOrders) {
    //       // console.log(prevOrders);
    //       prevOrders.map(item => {
    //           cart.push(item);
    //           // console.log(item);
    //       })
    //   }
    // this.state.cart = cart
    console.log(this.state.settings);
    console.log(settings);
  }

  // login = async (email, password) => {
  //   const res = await axios.post(
  //     'http://localhost:3001/login',
  //     { email, password },
  //   ).catch((res) => {
  //     return { status: 401, message: 'Unauthorized' }
  //   })
  
  //   if(res.status === 200) {
  //     const { email } = jwt_decode(res.data.accessToken)
  //     const user = {
  //       email,
  //       token: res.data.accessToken,
  //       accessLevel: email === 'admin@example.com' ? 0 : 1
  //     }
  
  //     this.setState({ user });
  //     localStorage.setItem("user", JSON.stringify(user));
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  
  // logout = e => {
  //   e.preventDefault();
  //   this.setState({ user: null });
  //   localStorage.removeItem("user");
  // };

  // Receives product object and appends it to the array of products and saves to app state.
  // addProduct = (product, callback) => {
  //   let products = this.state.products.slice();
  //   products.push(product);
  //   this.setState({ products }, () => callback && callback());
  // };

  addToCart = cartItem => {
    let cart = this.state.cart;
    // Check if item already exists in cart and increase the amount
    if (cart[cartItem.id]) {
      cart[cartItem.id].amount += cartItem.amount;
    } else {
      cart[cartItem.id] = cartItem;
    }
    // Validates number of items added to cart against available inventory
    if (cart[cartItem.id].amount > cart[cartItem.id].product.stock) {
      cart[cartItem.id].amount = cart[cartItem.id].product.stock;
    }
    // Saves cart items to local storage
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });
  };

  removeFromCart = cartItemId => {
    let cart = this.state.cart;
    delete cart[cartItemId];
    localStorage.setItem("cart", JSON.stringify(cart));
    this.setState({ cart });
  };
  
  clearCart = () => {
    let cart = {};
    localStorage.removeItem("cart");
    this.setState({ cart });
  };

  testFunc = () => {
    console.log("Test Worked!")
  }

  // checkout = () => {
  //   // Verify user is logged in before adding items to cart
  //   if (!this.state.user) {
  //     this.routerRef.current.history.push("/login");
  //     return;
  //   }
  
  //   const cart = this.state.cart;
  
  //   const products = this.state.products.map(p => {
  //     if (cart[p.name]) {
  //       p.stock = p.stock - cart[p.name].amount;
  
  //       axios.put(
  //         `http://localhost:3001/products/${p.id}`,
  //         { ...p },
  //       )
  //     }
  //     return p;
  //   });
  
  //   this.setState({ products });
  //   this.clearCart();
  // };

  render() {
    return (
      <Context.Provider
        value={{
          ...this.state,
          removeFromCart: this.removeFromCart,
          addToCart: this.addToCart,
          // login: this.login,
          // addProduct: this.addProduct,
          clearCart: this.clearCart,
          testFunc: this.testFunc,
          // checkout: this.checkout
        }}
      >
        <Router>
          <Route path="/" component={Home} />
          <Route path="/admin" component={Admin} />
          <Route path="/login" component={Login} />
        
        </Router>
      </Context.Provider>
    );
  }
}
