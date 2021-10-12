import React, {Component} from 'react';
import Checkbox from './components/Checkbox';
import Button from './components/Button';
import TextInput from './components/TextInput';
import DropDown from './components/DropDown';
import TextArea from './components/TextArea';
import TimeInput from './components/TimeInput';
import firebase from './Firebase';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import {FiSave, FiPlusSquare} from 'react-icons/fi';

class Settings extends Component {
    constructor(props){
        super(props);

        this.state = {
            settings: {
                daysAvailable: [],
                startTime: '',
                endTime: '',
                toppings: [],
                toppingsAvailable: [],
                newTopping: '',
                cookTime: '',
                orderCount: ''
            },   
            selected: [],
            selectedDays: [], 
            daysOfWeek: ['Sunday', 'Monday','Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            
        }      

        this.handleInput = this.handleInput.bind(this);
        this.handleToppings = this.handleToppings.bind(this);
        this.handleDays = this.handleDays.bind(this);
        this.handleClearForm = this.handleClearForm.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleNewTopping = this.handleNewTopping.bind(this);
        this.updateSettings = this.updateSettings.bind(this);
        this.handleAvailableToppings = this.handleAvailableToppings.bind(this);
        
        
    }
    // !!!!! IMPORTANT !!!! For the values from settings to display on initial load,
    // the "for" loop must be run inside the "onValue" functions and then 
    // a forceUpdate must be run right after the for loop also inside the onValue function!!!
    componentDidMount() {
        // you can also check props with current version
        // and set conditions to update state or not
        let settings = {};
        const db = getDatabase();
        const settingsRef = ref(db, 'settings/');
        onValue(settingsRef, (snapshot) => {
            settings = snapshot.val();
            // console.log(settings);
        

            for (const [key, value] of Object.entries(settings)) {
                // console.log(key);
                this.state.settings[key] = value; 
                // console.log(this.state.settings[key])
            }

            this.state.selected = this.state.settings.toppingsAvailable;
            
            let addDays = [];
            for (let day of this.state.settings.daysAvailable) {
                addDays.push(this.state.daysOfWeek[day]);
            }
            
            // console.log(addDays);
            this.state.selectedDays = addDays;

            if (!this.state.settings.cookTime > 0) {
                this.state.settings['cookTime'] = 0.5;
            }
            
            this.forceUpdate()
            // console.log(this.state.settings);
        })
    }

    updateSettings(key, value, settings) {
        var schema = settings;
        var kList = key.split('.');
        var len = kList.length;
        for (var i = 0; i < len-1; i++) {
            var elem = kList[i];
            if ( !schema[elem] ) schema[elem] = {}
            schema = schema[elem];
        }
        schema[kList[len-1]] = value;
    }
    
    handleInput(e) {
        let value = e.target.value;
        // console.log(value);
        let name = e.target.name;
        // console.log(name);
        this.setState( prevState => {
            return {
                settings : {
                    ...prevState.settings, [name]: value
                }
            }
        });
        
    }

    handleSave(e, value, name) {
        e.preventDefault();
        const db = getDatabase();
        set(ref(db, `settings/${name}`), value);
        // this.updateSettings(this.state.settings);
    }

    handleTimeStop(e) {}
    
    handleTimeSave(e) {}

    handleToppings(e) {
        const newSelection = e.target.value;
        let newSelectionArray;

        // Change "toppings" to whatever checkbox area is called.
        if(this.state.selected.indexOf(newSelection) > -1) {
            newSelectionArray = this.state.selected.filter(s => s !== newSelection)
        } else {
            newSelectionArray = [...this.state.selected, newSelection];
        }

        this.setState( { selected: newSelectionArray }
        );
        
    }

    handleAvailableToppings(e) {
        e.preventDefault();
        const db = getDatabase();
        set(ref(db, `settings/toppingsAvailable/`), this.state.selected);       
        
    }

    handleDays(e) {
        const newSelection = e.target.value;
        let newSelectionArray;

        // Change "toppings" to whatever checkbox area is called.
        if(this.state.selectedDays.indexOf(newSelection) > -1) {
            newSelectionArray = this.state.selectedDays.filter(s => s !== newSelection)
        } else {
            newSelectionArray = [...this.state.selectedDays, newSelection];
        }

        this.setState( { selectedDays: newSelectionArray }
        );
        
    }

    handleDaysAvailable(e) {
        e.preventDefault();
        let dayNumbers = [];
        // console.log(this.state.selectedDays)

        for (let day of this.state.selectedDays) {
            // console.log(day);
            dayNumbers.push(this.state.daysOfWeek.indexOf(day))
        }

        // console.log(dayNumbers);

        const db = getDatabase();
        set(ref(db, `settings/daysAvailable/`), dayNumbers);      
    }

    handleNewTopping(e, value) {
        e.preventDefault();
        // console.log(value);
        let uToppings = this.state.settings.toppings;
        uToppings.push(value)
        this.setState( prevState => {
            return {
                settings : {
                    ...prevState.settings, ["toppings"]: uToppings                    
                }
            }
        });
        this.state.settings.newTopping = ''
        const db = getDatabase();
        set(ref(db, `settings/toppings`), this.state.settings.toppings);
        document.getElementById('newTopping').value = ''
        return
    }

    validateForm(e) {
        let pTime = this.state.selected.pickUp;
        var hh = parseInt(pTime.slice(0, 2));
        var mm = parseInt(pTime.slice(3, 5));
        var timeNow = new Date();
        var oTime = new Date(timeNow.getTime() + (30*60000)).toLocaleTimeString('en-GB');
        var hhNow = parseInt(oTime.slice(0, 2));
        var mmNow = parseInt(oTime.slice(3, 5));
        // console.log(oTime);
        if (hh < 11 || (hh === 11 && mm < 30)) {
            // console.log("Time is too soon!");
            document.getElementById("timeError").innerHTML = "Too Early!"
        } else if (hh > 20 || (hh === 20 && mm > 30)) {
            // console.log("Too Late!");
            document.getElementById("timeError").innerHTML = "Too Late!"
        } else if (hh < hhNow || (hh === hhNow && mm < mmNow)) {
            document.getElementById("timeError").innerHTML = "Please allow at least 30 minutes for your pizza to be prepared."
        }else {
            // console.log("Looks good!")
            document.getElementById("timeError").innerHTML = ""
            this.addOrder(this.state.selected);
            this.handleClearForm(e);
        }
    }

    handleClearForm(e) {
        e.preventDefault();
        this.setState({
            selected: {
                daysAvailable: [],
                timeAvailable: '',
                toppingsAvailable: [],
                cookTime: '',
                orderCount: ''
            }
        });
    }

    handleCheckTime(e, timeInput) {
        if (timeInput) {
            return timeInput;
        } else {
            return '12:00';
        }
    }

    render() {
        const isToppings = this.state.settings.toppings;
        const isDays = this.state.daysOfWeek;
        // console.log(isToppings);
        const isStartTime = this.state.settings.startTime;
        const isEndTime = this.state.settings.endTime;
        const isCookTime = this.state.settings.cookTime;
        // var startTime = this.handleCheckTime(isStartTime);
        // var endTime = this.handleCheckTime(isEndTime);
        // console.log(this.state.settings);
        
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-10 justify-content-center">
                        <div className="form-control mt-4">
                            {isToppings.length > 0 ? (
                                <Checkbox title={'Toppings: '}
                                    name={'toppings'}
                                    options={this.state.settings.toppings}
                                    selectedOptions = {this.state.selected}
                                    handleChange={this.handleToppings}
                                />) : "No toppings yet"
                            }    
                            <button className={"btn btn-sm btn-outline-primary"} 
                                title="Save Updates" 
                                onClick={e => this.handleAvailableToppings(e)}>
                                    <FiSave />  Save
                            </button>                         
                        </div>
                        <div className='py-1 d-flex align-items-center justify-content-center'>
                            <form className="form-group col-12">
                                <div className="row justify-content-between">
                                    <div className="col-lg-6 py-1">
                                        <label htmlFor="prepTime" className="form-label ">Select estimated time to prepare pizzas (in hours):  </label> 
                                        <div className="input-group">
                                            <span className="text-danger" id="timeError"></span>                
                                            
                                            <TextInput inputType={'number'}
                                                name={'cookTime'}
                                                title={'Select estimated time to prepare pizzas:  '}
                                                value={this.state.settings.cookTime}
                                                placeHolder={this.state.settings.cookTime}
                                                handleChange={this.handleInput}
                                                step={'.5'}                             
                                            />
                                            <button className={"form-control btn btn-sm btn-outline-primary"} 
                                                title="Save Updates" 
                                                onClick={e => this.handleSave(e, this.state.settings.cookTime, 'cookTime')}>
                                                    <FiSave />  Save
                                            </button> 
                                        </div>
                                    </div>
                                    <div className="col-lg-5 py-1">
                                        <label htmlFor="newTopping" className="form-label ">Enter new topping to add to options:  </label> 
                                        <div className="input-group">
                                            <TextInput inputType={'text'}
                                                name={'newTopping'}
                                                title={'Add Topping Option:  '}
                                                value={this.state.settings.newTopping}
                                                placeHolder={'Enter new topping to add to options'}
                                                handleChange={this.handleInput}
                                                id={'newTopping'}
                                            />
                                            <button className={"form-control btn btn-sm btn-outline-primary"} 
                                                title="Save Updates" 
                                                onClick={e => this.handleNewTopping(e, this.state.settings.newTopping)}>
                                                    <FiPlusSquare />  Add
                                            </button> 
                                        </div>
                                    </div> 
                                </div>
                            </form>
                        </div>
                        <div className="form-control mt-4">
                            {isDays.length > 0 ? (
                            <Checkbox title={'Days available this week: '}
                                name={'daysAvailable'}
                                options={this.state.daysOfWeek}
                                selectedOptions = {this.state.selectedDays}
                                handleChange={this.handleDays}
                                />) : "No days yet"
                            }    
                            <button className={"btn btn-sm btn-outline-primary"} 
                                title="Save Updates" 
                                onClick={e => this.handleDaysAvailable(e)}>
                                    <FiSave />  Save
                            </button>                         
                        </div>
                        <div className='py-1 d-flex align-items-center justify-content-center'>
                            <form className="form-group col-12 ">
                                <div className="row justify-content-between">
                                <div className="col-lg-5">
                                <label htmlFor="startTime" className="form-label">Select service start time:  </label>                                                               
                                <div className="input-group">
                                    {/* <div className="input-group-prepend col-5 "> */}
                                        <span className="text-danger" id="timeError"></span>                
                                        <TimeInput inputType={'time'}
                                            id={'startTime'}
                                            name={'startTime'}
                                            title={'Select service start time:  '}
                                            value={this.state.settings.startTime}
                                            placeHolder={this.state.settings.startTime}
                                            handleChange={this.handleInput}
                                        />
                                    {/* </div> */}
                                    <button className={"form-control btn btn-sm btn-outline-primary"} 
                                        title="Save Updates" 
                                        onClick={e => this.handleSave(e, this.state.settings.startTime, 'startTime')}>
                                            <FiSave /> Save
                                    </button>
                                </div>
                                </div>
                                <div className="col-lg-5">
                                <label htmlFor="endTime" className="form-label">Select service end time:  </label> 
                                    <div className="input-group">
                                    
                                    {/* <div className="input-group-prepend col-5"> */}
                                        <span className="text-danger" id="timeError"></span>                
                                        <TimeInput inputType={'time'}
                                            id={'endTime'}
                                            name={'endTime'}
                                            title={'Select service end time:  '}
                                            value={this.state.settings.endTime}
                                            placeHolder={this.state.settings.endTime}
                                            handleChange={this.handleInput}
                                        />
                                    {/* </div> */}
                                    <button className={"form-control btn btn-sm btn-outline-primary"} 
                                        title="Save Updates" 
                                        onClick={e => this.handleSave(e, this.state.settings.endTime, 'endTime')}>
                                            <FiSave />  Save
                                    </button>                                
                                </div>
                                </div>
                                </div>
                            </form> 
                        </div>
                        
                    </div>                    
                </div>
            </div>
        )
    }

}

export default Settings;