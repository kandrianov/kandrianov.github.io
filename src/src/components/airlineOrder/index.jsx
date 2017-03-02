import React, { Component } from 'react';
import EtheriskAirline from '../policy/etheriskAirline';

export default class AirlineOrder extends Component {

  render() {
    const flight = JSON.parse(window.localStorage.getItem('flight'));
    return (
      <div>
        <h2>Order</h2>
        <div>
          <p><b>FlightId: </b>{flight.flightId}</p>
          <p><b>Origin: </b>{flight.origin}</p>
          <p><b>Destination </b>{flight.destination}</p>
          <p><b>Arrival time: </b>{flight.arrivalTime}</p>
          <p><b>Departure time: </b>{flight.departureTime}</p>
        </div>

        <div>
          <h3>Customer data:</h3>
          <form>

            <div className="b-order-form">
              <div>
                <label>Name:</label>
                <input type="text" ref={(name) => this.name = name} />
              </div>
              <div>...and other fields for booking</div>
            </div>
          </form>

          <EtheriskAirline />
        </div>

      </div>
    );
  }
}
