import React, { Component } from 'react';
import EtheriskComponent from '../policy';

export default class Order extends Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
  }

  render() {
    return (
      <div className="b-booking">
        <h2>Order</h2>
        <form onSubmit={this.onSubmit}>

          <div className="b-order-form">
            <div>
              <label>Name:</label>
              <input type="text" ref={(name) => this.name = name} />
            </div>
            <div>...and other fields for booking</div>
            <input type="submit" value="Order" />
          </div>
         </form>

         <EtheriskComponent />
      </div>
    );
  }
}
