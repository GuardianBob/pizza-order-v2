import React from 'react';
import moment from 'moment';
import Select from 'react-select';
// import ReactTimeslotCalendar from 'react-timeslot-calendar';
import { collection, getDatabase, ref, onValue, query } from "firebase/database";

const TimeSlot = (props) => {
    let tsFormat ={
        format: 'h:mm'
    }
    let bookedSlots = [];
    var today = new Date().toLocaleDateString().replace(/\//g, '-');

    const db = getDatabase();
    const ordersRef = ref(db, 'orders/' + today + '/');

    onValue(ordersRef, (snapshot) => {
        let orders = snapshot.val();
        let bookedList = [];

        for(let item in orders) {
            bookedList.push({
                pickUp: orders[item].pickUp
            });                        
        }
        // console.log(ordersList);
        bookedSlots = bookedList
    });
    // let tsSlots = [
    //     ['15', '16']
    // ]
    let today2 = new Date();
    let tsDisabled = {        
        startDate: today2,
        format: 'MMMM Do YYYY, h:mm:ss A'        
    };

    const options = [
        { value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' },
        { value: 'vanilla', label: 'Vanilla' }
    ]

    console.log(bookedSlots);
    return (
        
        <div className="form-group">
        
            {/* <label htmlFor={props.name} className="form-label me-2">{props.title}</label> */}
            {/* <input
                className="form-control"
                id={props.name}
                name={props.name}
                type={props.inputType}
                // value={allSlots}
                onChange={props.handleChange}
                placeholder={props.placeHolder}
                min={props.min}
                max={props.max}
                required={props.required}
            /> */}
            <Select
                value={null}
                options={bookedSlots}
            />
        </div>
    );
}

export default TimeSlot;