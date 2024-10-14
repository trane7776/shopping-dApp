import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

// Components
import Rating from './Rating';

import close from '../assets/close.svg';

const Product = ({ item, provider, account, dappazon, togglePop }) => {
  const [order, setOrder] = useState(null);
  const [hasBought, setHasBought] = useState(false);
  const fetchDetails = async () => {
    const events = await dappazon.queryFilter('Buy');
    const orders = events.filter(
      (event) =>
        event.args.buyer === account &&
        event.args.itemId.toString() === item.id.toString()
    );
    if (orders.length === 0) return;
    const order = await dappazon.orders(account, orders[0].args.orderId);
    setOrder(order);
  };

  const buyHandler = async () => {
    const signer = await provider.getSigner();
    let transaction = dappazon
      .connect(signer)
      .buy(item.id, { value: item.cost });
    await transaction.wait();
    setHasBought(true);
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div className="product">
      <div className="product-details">
        <div className="product-image">
          <img src={item.image} alt="Product" />
        </div>
        <div className="product-overview">
          <h1>{item.name}</h1>
          <Rating value={item.rating} />
          <hr />
          <p>{item.address}</p>
          <h2>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</h2>
          <hr />
          <h2>Overview</h2>
          <p>
            {item.description}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Aperiam
            harum, vel natus earum molestiae fuga molestias error, quo dicta
            nemo eos modi dolores rerum nihil, illo possimus alias rem.
            Repellendus?
          </p>
        </div>
        <div className="product-order">
          <h1>{ethers.utils.formatUnits(item.cost.toString(), 'ether')} ETH</h1>
          <p>
            FREE delivery <br />
            <strong>
              {new Date(Date.now() + 345600000).toLocaleDateString('en', {
                weekday: 'long',
                month: 'long',
                day: 'numeric',
              })}
            </strong>
          </p>
          {item.stock > 0 ? <p>In Stock</p> : <p>Out of Stock</p>}
          <button className="product-buy" onClick={buyHandler}>
            Buy Now
          </button>
          <p>
            <small>Ships from</small> Dappazon
          </p>
          <p>
            <small>Sold by</small> Dappazon
          </p>
          {order && (
            <div className="product-bought">
              Item bought on <br />
              <strong>
                {new Date(
                  Number(order.time.toString() + '000')
                ).toLocaleDateString(undefined, {
                  weekday: 'long',
                  hour: 'numeric',
                  minute: 'numeric',
                  second: 'numeric',
                })}
              </strong>
            </div>
          )}
          <button onClick={togglePop} className="product-close">
            <img src={close} alt="Close" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Product;
