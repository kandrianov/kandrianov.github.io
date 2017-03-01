import React, { Component } from 'react';
import Etherisk from '../../lib/etherisk-sdk';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';


const Flights = ({flights, onFlightSelect}) => {
  const list = flights.map(flight => (
    <div key={flight.id} onClick={onFlightSelect(flight)}>
      {flight.id}: {flight.origin} - {flight.destination}; dep: {flight.departureTime}; arr: {flight.arrivalTime}
    </div>
  ));

  return (<div>{list}</div>);
}

const RatingTable = ({show, ratingTable, premium, setPremium, applyForPolicy}) => {
  return (
    <div>
      {show && (
        <div>
        <h3>Delay in minutes</h3>
        <table>
          <tr>
            <td>15-29</td>
            <td>30-44</td>
            <td>45+</td>
            <td>Cancelled</td>
            <td>Deverted</td>
          </tr>
          <tr>
            <td>{ratingTable.text_15m}%</td>
            <td>{ratingTable.text_30m}%</td>
            <td>{ratingTable.text_45m}%</td>
            <td>{ratingTable.text_can}%</td>
            <td>{ratingTable.text_div}%</td>
          </tr>
          <tr>
            <td>{ratingTable.payout_15m}</td>
            <td>{ratingTable.payout_30m}</td>
            <td>{ratingTable.payout_45m}</td>
            <td>{ratingTable.payout_can}</td>
            <td>{ratingTable.payout_div}</td>
          </tr>
        </table>
        <div>
          <p>Premium in ETH (min. 0.5 ETH, max. 5 ETH)</p>
          <input value={premium} onChange={v => setPremium(v)} />
          <br />
          <button onClick={applyForPolicy}>Apply</button>
        </div>
      </div>

      )}
    </div>
  );
}

export default class EtheriskComponent extends Component {

  constructor() {
    super();
    this.state = {
      from: '',
      to: '',
      date: moment(),
      flights: [],
      flight: '',
      showRatingTable: false,
      showTransaction: false,
      premium: '',
    };

    this.connectWeb3();

    this.onSetPremium = this.onSetPremium.bind(this);
    this.onFlightSelect = this.onFlightSelect.bind(this);
    this.applyForPolicy = this.applyForPolicy.bind(this);
  }

  connectWeb3() {
    this.etherisk = window.etherisk = new Etherisk();
    this.etherisk.connect()
      .then(() => this.etherisk.getNetwork())
      .then(() => this.etherisk.getBalance());
  }

  searchFlights() {
    this.etherisk.searchFlights(this.state.from, this.state.to, moment(this.state.date).format('YYYY-MM-DD'))
      .then(flights => this.setState({flights}));
  }

  onFlightSelect(flight) {
    return () => {
      this.etherisk
        .getFlightContractAddress()
        .then(() => this.etherisk.getRating())
        .then((rating) => {
          const ratingTable = this.etherisk.getRatingTable(rating);
          this.setState({
            flight,
            showRatingTable: true,
            ratingTable,
          });
        });
    };
  }

  onSetPremium(e) {
    const premium = e.target.value;
    const table = this.etherisk.calculatePayout(premium);

    this.setState({
      premium,
      ratingTable: table,
    });
  }

  applyForPolicy() {
    this.etherisk.applyForPolicy(this.state.premium, this.state.flight)
      .then(transaction => {
        this.setState({transaction, showTransaction: true})
      });
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
      });

      if (this.state.from && this.state.to && this.state.date) {
        this.searchFlights(this.state.from, this.state.to, this.state.date);
      }
    };
  }

  render() {
    const airports = this.etherisk.airports.map(airport => (
      <option key={airport.id} value={airport.id}>{airport.text}</option>
    ));

    return (
      <div className="b-etherisk">
        <h3>Apply for Policy</h3>
        <form>

          <div className="b-etherisk__field">
            <label>From: </label><br />
            <select onChange={this.onFieldChange('from')} value={this.state.from}>
              {airports}
            </select>
          </div>

          <div className="b-etherisk__field">
            <label>To: </label><br />
            <select onChange={this.onFieldChange('to')} value={this.state.to}>
              {airports}
            </select>
          </div>

          <div className="b-etherisk__field">
            <label>Date: </label><br />
            <DatePicker
              dateFormat='YYYY-MM-DD'
              selected={this.state.date}
              onChange={this.onFieldChange('date')}
            />
          </div>


        </form>

        <Flights
          flights={this.state.flights}
          onFlightSelect={this.onFlightSelect}
        />

        <RatingTable
          applyForPolicy={this.applyForPolicy}
          premium={this.state.premium}
          setPremium={this.onSetPremium}
          show={this.state.showRatingTable}
          ratingTable={this.state.ratingTable}
        />

        {this.state.showTransaction === true && (
          <div>
            <div>Transaction:</div>
            <a target="_blank" href={`https://testnet.etherscan.io/tx/${this.state.transaction}`}>{this.state.transaction}</a>
          </div>
        )}


      </div>
    );
  }
}
