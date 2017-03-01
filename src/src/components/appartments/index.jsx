import React from 'react';
import { Link } from 'react-router';
import Data from '../../data/appartments.json';

const Appartments = () => {
  const list = Data.map(appartment => (
    <Link to={`/appartments/${appartment.id}`} key={appartment.id} className="b-appartments__item">
      <h2>{appartment.title}</h2>
      <img src={appartment.image} alt={appartment.title} />
      <div><b>Price: ${appartment.price}</b></div>
    </Link>
  ));

  return (
    <div className="b-appartments">{list}</div>
  );
};

export default Appartments;
