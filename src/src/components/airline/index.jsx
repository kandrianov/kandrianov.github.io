import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import airports from '../../lib/airports';
import moment from 'moment';

// just for gapi
import Etherisk from '../../lib/etherisk-sdk';


export const Flights = ({flights, onFlightSelect}) => {
  const list = flights.map(flight => (
    <div key={flight.id} onClick={onFlightSelect(flight)}>
      {flight.id}: {flight.origin} - {flight.destination}; dep: {flight.departureTime}; arr: {flight.arrivalTime}
    </div>
  ));

  return (<div>{list}</div>);
}

export default class Airline extends Component {
  constructor() {
    super();

    this.state = {
      from: '',
      to: '',
      date: '',
      flights: [],
      searching: false,
    };

    this.airportsSearch = new Etherisk();
    this.onFieldChange = this.onFieldChange.bind(this);
    this.onFlightSelect = this.onFlightSelect.bind(this);
  }

  onFieldChange(field) {
    return (e) => {
      let value;
      if (e.hasOwnProperty('target')) {
        value = e.target.value;
      } else {
        value = e;
      }
      this.setState({
        [field]: value,
      }, () => {
        if (this.state.from !== '' && this.state.to !== '' && this.state.date !== '') {
          this.setState({searching: true});
          this.airportsSearch.searchFlights(this.state.from, this.state.to, moment(this.state.date).format('YYYY-MM-DD'))
            .then(flights => this.setState({flights, searching: false}));
        }
      });
    };
  }

  onFlightSelect(flight) {
    return () => {
      window.localStorage.setItem('flight', JSON.stringify(flight));
      this.props.router.push('/airline/order');
    };
  }

  render() {
    const operatorAirports = airports.map(airport => (
      <option key={airport.id} value={airport.id}>{airport.text}</option>
    ));

    return (
      <div className="b-airline">
        <form>
          <div className="b-airline__field">
            <label>From: </label><br />
            <select onChange={this.onFieldChange('from')} value={this.state.from}>
              {operatorAirports}
            </select>
          </div>

          <div className="b-airline__field">
            <label>To: </label><br />
            <select onChange={this.onFieldChange('to')} value={this.state.to}>
              {operatorAirports}
            </select>
          </div>

          <div className="b-airline__field">
            <label>Date: </label><br />
            <DatePicker
              dateFormat='YYYY-MM-DD'
              selected={this.state.date}
              onChange={this.onFieldChange('date')}
            />
          </div>
        </form>

        {this.state.searching && (<div>Searching...</div>)}

        <Flights
          flights={this.state.flights}
          onFlightSelect={this.onFlightSelect}
        />

      </div>
    );
  }
}
