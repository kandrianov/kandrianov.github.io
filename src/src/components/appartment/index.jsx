import React from 'react';
import Data from '../../data/appartments.json';
import {Link} from 'react-router';
import find from 'lodash.find';

const Appartment = ({params: {appartmentId}}) => {
  const data = find(Data, {id: Number(appartmentId)});

  return (
    <div className="b-appartment">
      <Link to="/appartments">All Appartments</Link>
      <h2>{data.title}</h2>
      <p>{data.description}</p>
      <img src={data.image} alt={data.title} />
      <div>Price: ${data.price}</div>
      <Link className="b-order" to={`/order/${data.id}`}>Order</Link>
    </div>
  );
};

export default Appartment;
