import React, { Component } from 'react';
import Etherisk from '../../lib/etherisk-sdk';
import 'react-datepicker/dist/react-datepicker.css';

export const RatingTable = ({ratingTable, premium, setPremium, applyForPolicy}) => {
  return (
    <div>
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
    </div>
  );
}

export default class EtheriskAirline extends Component {

  constructor() {
    super();
    this.state = {
      showRatingTable: false,
      showTransaction: false,
      premium: '',
    };
    this.onSetPremium = this.onSetPremium.bind(this);
    this.applyForPolicy = this.applyForPolicy.bind(this);
  }

  componentDidMount() {
    this.setRatingTable();
  }

  setRatingTable() {
    this.etherisk = window.etherisk = new Etherisk();
    this.etherisk.connect()
      .then(() => this.etherisk.getNetwork())
      .then(() => this.etherisk.getBalance())
      .then(() => this.etherisk.getFlightContractAddress())
      .then(() => this.etherisk.getRating())
      .then((rating) => {
        const ratingTable = this.etherisk.getRatingTable(rating);
        this.setState({
          showRatingTable: true,
          ratingTable,
        });
      });
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
    this.etherisk.applyForPolicy(this.state.premium, JSON.parse(window.localStorage.getItem('flight')))
      .then(transaction => {
        this.setState({transaction, showTransaction: true});
      });
  }

  render() {
    return (
      <div className="b-etherisk">
        <h3>Apply for Policy</h3>

        {this.state.ratingTable && (
          <RatingTable
            applyForPolicy={this.applyForPolicy}
            premium={this.state.premium}
            setPremium={this.onSetPremium}
            ratingTable={this.state.ratingTable}
          />
        )}

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
