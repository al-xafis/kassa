import React, {useEffect, useState} from 'react';
import './App.css';
import axios from 'axios';
import {format} from "timeago.js";

function App() {

  interface Order {
    amount: number,
    id: number,
    x_id: number,
    phone_number: string,
    currency: string,
    created_at: string,
  }

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: any, id: number) => {
    e.preventDefault();
    try {
      axios.put('http://localhost:5000', {id})
      setOrders(orders.filter(order => order.id !== id))
    } catch (error) {
      console.log(error);
    }

  }

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        let res = await axios.get('http://localhost:5000');
        setOrders(res.data);
      } catch (error) {
        console.log(error)
      }

      setLoading(false);
    }
    fetch();

  }, [setOrders])
   console.log(orders)

  return (
    <div className="App">
      <div className="table__wrapper">


      <table className="table">
        <thead className="table__head">
          <tr className="table__row">
            <th className="table__header">Order ID</th>
            <th className="table__header">phone</th>
            <th className="table__header">X ID</th>
            <th className="table__header">Currency</th>
            <th className="table__header">Amount</th>
            <th className="table__header">Deposited at</th>
            <th className="table__header">Status</th>
          </tr>
        </thead>
        <tbody>
          {loading===false && orders.map(order => {
            let time = format(order.created_at);

            return (<tr className="table__row" key={order.id}>
            <td className="table__data">{order.id}</td>
            <td className="table__data">{order.phone_number}</td>
            <td className="table__data">{order.x_id}</td>
            <td className="table__data">{order.currency}</td>
            <td className="table__data">{order.amount}</td>
            <td className="table__data">{time}</td>
            <td className="table__data"><button onClick={(e) => handleClick(e, order.id)}className="button">Complete</button></td>
          </tr>)
          })}
        </tbody>
      </table>
      </div>
    </div>
  );
}

export default App;
