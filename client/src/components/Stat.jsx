import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import AdminNavBar from './AdminNavBarr';

const Stat = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [leastProducts, setLeastProducts] = useState([]); 
  const [paymentData, setPaymentData] = useState({ cash: 0, creditCard: 0 });
  const [addressData, setAddressData] = useState({ tirane: 0, tjeter: 0 });
  const [topDay, setTopDay] = useState(''); 
  const days = {
    "Monday": "E Hënë",
    "Tuesday": "E Martë",
    "Wednesday": "E Mërkurë",
    "Thursday": "E Enjte",
    "Friday": "E Premte",
    "Saturday": "E Shtunë",
    "Sunday": "E Diel"
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await axios.get(`http://localhost:8000/api/admin/top-products`);
        setTopProducts(productsResponse.data.data || []);
        const leastProductsResponse = await axios.get(`http://localhost:8000/api/admin/least-ordered`);
        setLeastProducts(leastProductsResponse.data.data || []);
        const paymentResponse = await axios.get(`http://localhost:8000/api/admin/payment-distribution`);
        setPaymentData({
          cash: paymentResponse.data.cash || 0,
          creditCard: paymentResponse.data.creditCard || 0,
        });
        const addressResponse = await axios.get(`http://localhost:8000/api/admin/address-distribution`);
        setAddressData({
          tirane: addressResponse.data.tirane || 0,
          tjeter: addressResponse.data.tjeter || 0,
        });

        const response = await axios.get(`http://localhost:8000/api/admin/top-day`);
        const averageOrdersByDay = response.data.topDays || [];
        if (averageOrdersByDay.length > 0) {
          let maxAverageOrders = Math.max(...averageOrdersByDay.map(day => day.averageOrders));
          const topDayObj = averageOrdersByDay.find(day => day.averageOrders === maxAverageOrders);

          setTopDay({
            name: days[topDayObj.day] || topDayObj.day,  
            averageOrders: topDayObj.averageOrders
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const pieData = {
    labels: ['Tirane', 'Tjeter'],
    datasets: [
      {
        label: 'Orders by Address',
        data: [addressData.tirane, addressData.tjeter],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
        hoverBackgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
      }
    ]
  };

  const paymentPieData = {
    labels: ['Cash', 'Credit Card'],
    datasets: [
      {
        label: 'Payments by Method',
        data: [paymentData.cash, paymentData.creditCard],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 159, 64, 0.6)'],
        hoverBackgroundColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 159, 64, 1)'],
      }
    ]
  };

  return (
    <div style={{ display: 'flex' }}>
      <AdminNavBar />
      <div style={{ marginLeft: '100px', padding: '20px', flexGrow: 1 }}>
        <div className="pie-charts" id='dflex'>
          <div id="pie-chart">
            <h4>Shpërndarja e porosive sipas qytetit</h4>
            <Pie data={pieData} />
          </div>
          <div id="pie-chart">
            <h4>Shpërndarja sipas metodës së pagesës</h4>
            <Pie data={paymentPieData} />
          </div>
        </div>
        <div id='dflex'>
        <div className="top-day">
          <h5>Dita me më shumë porosi: </h5>
          {topDay ? (
            <h4 className='dita'>
              <strong>{topDay.name} </strong>: {topDay.averageOrders.toFixed(2)} porosi/ditë
            </h4>
          ) : (
            <p>Nuk ka të dhëna të disponueshme</p>
          )}
        </div>

        <div className="top-items">
          <h5>Produktet e preferuara</h5>
          <ul>
            <h5>{topProducts.map((item, index) => (
              <li key={index}>
                <strong>{item._id}</strong> - {item.totalOrders} porosi
              </li>
            ))}</h5>
          </ul>
        </div>

        <div className="bottom-items">
          <h5>Produktet më pak  te preferuara</h5>
          <ul>
           <h5> {leastProducts.map((item, index) => (
              <li key={index}>
                <strong>{item._id}</strong> - {item.totalOrders} porosi
              </li>
            ))}</h5>
          </ul>
        </div>
        </div> 
      </div>
    </div>
  );
};

export default Stat;
