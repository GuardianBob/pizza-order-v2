import React, {Component} from 'react';
import Checkbox from './Checkbox';
import Button from './Button';
import TextInput from './TextInput';
import DropDown from './DropDown';
import TimeSlot from './TimeSlot';
import TimeInput from './TimeInput';
import firebase from '../Firebase';
import { getDatabase, ref, set, onValue } from 'firebase/database';

class FormContainer extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            newOrder: {
                toppings: [],
                pickUp: '',
                oName: '',
                email: '',
                phone: '',
                complete: false,
                ready: false,
            },
            cartOrders: props.cartOrders,
            toppingsOptions: [],
            available: false,
            settings: {}
            
            // toppingsOptions: ["Pepperoni", "Italian Sausage", "Roasted Red Peppers", "Onion", "Green Bell Pepper", "Bacon", "Garlic", "Spinach", "Black Olives"]
            
        }
        console.log(props.cartOrders);
        
        this.handleInput = this.handleInput.bind(this);
        this.handleToppings = this.handleToppings.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    componentDidMount() {
        // you can also check props with current version
        // and set conditions to update state or not
        let settings = {};
        const db = getDatabase();
        const settingsRef = ref(db, 'settings/');
        onValue(settingsRef, (snapshot) => {
            // this.state.toppingsOptions = snapshot.val();
            settings = snapshot.val();
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
            
            this.forceUpdate()
        })
    }

    handleInput(e) {
        let value = e.target.value;
        let name = e.target.name;
        this.setState( prevState => {
            return {
                newOrder : {
                    ...prevState.newOrder, [name]: value
                }
            }
        });
    }

    handleToppings(e) {
        const newSelection = e.target.value;
        let newSelectionArray;

        // Change "toppings" to whatever checkbox area is called.
        if(this.state.newOrder.toppings.indexOf(newSelection) > -1) {
            newSelectionArray = this.state.newOrder.toppings.filter(s => s !== newSelection)
        } else {
            newSelectionArray = [...this.state.newOrder.toppings, newSelection];
        }

        this.setState( prevState => ({ newOrder:
            {...prevState.newOrder, toppings: newSelectionArray }
        })
        );
    }

    addOrder = newOrder => {
        var timestamp = new Date().getTime();
        let orderID = `${this.state.newOrder.phone}-${timestamp}`;
        var today = new Date().toLocaleDateString().replace(/\//g, '-');
        // console.log(today.toLocaleDateString("en-US"));
        // console.log(orderID);
        const db = getDatabase();
        set(ref(db, 'orders/' + today + '/' + orderID), newOrder);
    };

    validateForm(e) {
        let pTime = this.state.newOrder.pickUp;

        // console.log(this.state.newOrder.toppings.length);
        if (!this.state.newOrder.toppings.length > 0) {
            this.state.newOrder.toppings.push("Cheese Only");
        }

        // console.log(this.state.newOrder['toppings'])

        let prepTime;
        // console.log(this.state.settings['cookTime']);
        !this.state.settings['cookTime'] > 0 ? prepTime=.5: prepTime = parseFloat(this.state.settings['cookTime']);
        // console.log(prepTime);

        var hh = parseInt(pTime.slice(0, 2));
        var mm = parseInt(pTime.slice(3, 5));
        var startHH = parseInt(this.state.settings['startTime'].slice(0,2));
        var startMM = parseInt(this.state.settings['startTime'].slice(3,5));
        var endHH = parseInt(this.state.settings['endTime'].slice(0,2));
        var endMM = parseInt(this.state.settings['endTime'].slice(3,5));
        var timeNow = new Date();
        
        
        var oTime = new Date(timeNow.getTime() + ((60 * prepTime)*60000)).toLocaleTimeString('en-GB');
        // console.log(oTime)
        
        var hhNow = parseInt(oTime.slice(0, 2));
        var mmNow = parseInt(oTime.slice(3, 5));
        // console.log(oTime);
        if (hh < startHH || (hh === startHH && mm < startMM)) {
            // console.log("Time is too soon!");
            document.getElementById("timeError").innerHTML = "Too Early!"
        } else if (hh > endHH || (hh === endHH && mm > endMM)) {
            // console.log("Too Late!");
            document.getElementById("timeError").innerHTML = "Too Late!"
        } else if (hh < hhNow || (hh === hhNow && mm < mmNow)) {
            document.getElementById("timeError").innerHTML = `Please allow at least ${(60 * prepTime)} minutes for your pizza to be prepared.`
        }else {
            // console.log("Looks good!")
            document.getElementById("timeError").innerHTML = ""
            // this.addOrder(this.state.newOrder);
            // this.handleClearForm(e);
        }    
    }

    addToCart = newOrder => {
        var timestamp = new Date().getTime();
        let orderID = `${this.state.newOrder.phone}-${timestamp}`;
        var today = new Date().toLocaleDateString().replace(/\//g, '-');
        // console.log(today.toLocaleDateString("en-US"));
        // console.log(orderID);
        let orders = this.state.cartOrders
        orders.push(newOrder)
        this.setState( {cartOrders: orders});
        console.log(this.state.cartOrders);
        this.props.cartOrders(newOrder);
    }

    handleFormSubmit(e) {
        e.preventDefault();
        this.validateForm(e);
        // this.addOrder(this.state.newOrder);
        // this.handleClearForm(e);    
    }

    handleClearForm(e) {
        e.preventDefault();
        this.setState({
            newOrder: {
                toppings: [],
                pickUp: '',
                oName: '',
                email: '',
                phone: '',
            }        
        });
        document.getElementById('oName').value = '';
        document.getElementById('email').value = '';
        document.getElementById('phone').value = '';
    }

    render() {
        const avail = this.state.available;
        return (
            <div> {avail ? 
            <form className="container" id="orderForm" onSubmit={this.handleFormSubmit}>
                <div className="row justify-content-center">
                    <div className="col-md-8 justify-content-center">
                        <div className="form-control form-label fs-4 text-center">
                            <div>12" deep dish pizza serves 4 - 6 people.</div>
                            <div>$25 per pizza with unlimited toppings.</div>
                        </div>
                        <div className="form-control">
                            <Checkbox title={'Toppings Available: '}
                                name={'toppings'}
                                options={this.state.toppingsOptions}
                                selectedOptions = {this.state.newOrder.toppings}
                                handleChange={this.handleToppings}
                            />
                        </div>
                        <div className="form-control">
                        <span className="text-danger" id="timeError"></span>                
                        <TimeInput inputType={'time'}
                            name={'pickUp'}
                            title={'Select pick up time (please allow 30 minutes for your pizza to be made):  '}
                            value={this.state.newOrder.pickUp}
                            placeHolder={'Select Pick Up Time'}
                            handleChange={this.handleInput}
                            minTime={new Date().setHours(11, 30, 0, 0)}
                            maxTime={new Date().setHours(20, 30, 0, 0)}
                            required={'required'}
                        />
                        </div>
                        <div className="form-control">
                        <TextInput inputType={'text'}
                            name={'oName'}
                            id={'oName'}
                            title={'Name on order:  '}
                            value={this.state.newOrder.oName}
                            placeHolder={'First and Last Name'}
                            handleChange={this.handleInput}
                            required={'required'}
                        />
                        </div>
                        <div className="form-control">
                        <TextInput inputType={'email'}
                            name={'email'}
                            id={'email'}
                            title={'Email Address:  '}
                            value={this.state.newOrder.email}
                            placeHolder={'email@mail.com'}
                            handleChange={this.handleInput}
                            required={'required'}
                        />
                        </div>
                        <div className="form-control">
                            <TextInput inputType={'number'}
                                name={'phone'}
                                id={'phone'}
                                title={'Phone Number:'}
                                value={this.state.newOrder.phone}
                                placeHolder={'555-555-5555'}
                                handleChange={this.handleInput}
                                required={'required'}
                            />
                        </div>
                        <div className="form-control">
                            <TimeSlot inputType={'time'}
                                name={'pickup'}
                                id={'pickup'}
                                title={'Time to pickup'}
                                className={''}
                                placeHolder={''}
                                required={''}
                            />
                        </div>
                        <div className="form-control">
                            <Button 
                                action = {this.handleFormSubmit}
                                type = {'primary'}
                                title = {'Submit'}
                                className = {'btn btn-outline-primary me-2'}
                            />
                            <Button 
                                action = {this.handleClearForm}
                                type = {'secondary'}
                                title = {'Clear'}
                                className = {'btn btn-outline-danger'}
                            />
                        </div>
                    </div>
                    
                </div>
            </form> :
            <div className="row justify-content-center">
                <div className="col-md-8 justify-content-center">
                    <div className="form-control form-label fs-4 text-center">
                        Sorry, we're closed today.
                    </div>
                </div>
            </div>
            }
            </div>
        )
    }

}

export default FormContainer;