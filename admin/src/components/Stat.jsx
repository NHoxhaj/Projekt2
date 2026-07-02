import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { apiUrl } from '../config/api';

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
        const productsResponse = await axios.get(apiUrl('/api/admin/top-products'), { withCredentials: true });
        setTopProducts(productsResponse.data.data || []);
        const leastProductsResponse = await axios.get(apiUrl('/api/admin/least-ordered'), { withCredentials: true });
        setLeastProducts(leastProductsResponse.data.data || []);
        const paymentResponse = await axios.get(apiUrl('/api/admin/payment-distribution'), { withCredentials: true });
        setPaymentData({
          cash: paymentResponse.data.cash || 0,
          creditCard: paymentResponse.data.creditCard || 0,
        });
        const addressResponse = await axios.get(apiUrl('/api/admin/address-distribution'), { withCredentials: true });
        setAddressData({
          tirane: addressResponse.data.tirane || 0,
          tjeter: addressResponse.data.tjeter || 0,
        });

        const response = await axios.get(apiUrl('/api/admin/top-day'), { withCredentials: true });
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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="admin-content-page text-center stat-page">
      <h1 className='titullst'>Statistikat</h1>
        <div className="pie-charts" id='dflex'>
          <div className="stat-chart-card">
            <h4>Shpërndarja e porosive sipas qytetit</h4>
            <div className="stat-chart-body">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
          <div className="stat-chart-card">
            <h4>Shpërndarja sipas metodës së pagesës</h4>
            <div className="stat-chart-body">
              <Pie data={paymentPieData} options={chartOptions} />
            </div>
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
            <h5>{topProducts.map((item, index) => (
              <h4 key={index}>
                <strong>{item._id}</strong> - {item.totalOrders} porosi
              </h4>
            ))}</h5>
        
        </div>

        <div className="bottom-items">
          <h5>Produktet më pak  te preferuara</h5>
           <h5> {leastProducts.map((item, index) => (
              <h4 key={index}>
                <strong>{item._id}</strong> - {item.totalOrders} porosi
              </h4>
            ))}</h5>
            </div>
        </div> 
    </div>
  );
};

export default Stat;
