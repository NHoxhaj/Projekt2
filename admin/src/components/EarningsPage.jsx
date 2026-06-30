import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto'; 
import { CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';  
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { apiUrl } from '../config/api';
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const EarningsPage = () => {
  const [period, setPeriod] = useState('daily');
  const [totalHourlyEarnings, setTotalHourlyEarnings] = useState(0);
  const [totalDailyOrders, setTotalDailyOrders] = useState(0);
  const [totalWeekEarnings, setTotalWeekEarnings] = useState(0);
  const [totalWeeklyOrders, setTotalWeeklyOrders] = useState(0);
  const [totalMonthEarnings, setTotalMonthEarnings] = useState(0);
  const [totalMonthlyOrders, setTotalMonthlyOrders] = useState(0);
  const [totalYearEarnings, setTotalYearEarnings] = useState(0);
  const [totalYearlyOrders, setTotalYearlyOrders] = useState(0);
  const [hourlyData, setHourlyData] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const response = await axios.get(apiUrl(`/api/admin/earnings?period=${period}`), { withCredentials: true });
        if (response.data) {
          if (period === 'daily') {
            setHourlyData(response.data.hourlyEarnings || []);
            setTotalHourlyEarnings(response.data.earnings || 0);
            setTotalDailyOrders(response.data.totalDailyOrders || 0);
          } else if (period === 'weekly') {
            setWeeklyData(response.data.dailyEarnings || []);
            setTotalWeekEarnings(response.data.totalWeekEarnings || 0);
            setTotalWeeklyOrders(response.data.totalWeeklyOrders || 0);
          } else if (period === 'monthly') {
            setMonthlyData(response.data.dailyEarnings || []);
            setTotalMonthEarnings(response.data.totalMonthEarnings || 0);
            setTotalMonthlyOrders(response.data.totalMonthlyOrders || 0);
          } else if (period === 'yearly') {
            setYearlyData(response.data.monthlyEarnings || []);
            setTotalYearEarnings(response.data.totalYearEarnings || 0);
            setTotalYearlyOrders(response.data.totalYearlyOrders || 0);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchEarnings();
  }, [period]);

  const hoursOfDay = Array.from({ length: 24 }, (_, i) => `${i}:00`);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dailyChartData = {
    labels: hoursOfDay,
    datasets: [{
      label: 'Earnings',
      data: hourlyData.map(entry => entry.total || 0),
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      fill: true,
    }]
  };

  const weeklyChartData = {
    labels: daysOfWeek,
    datasets: [{
      label: 'Earnings',
      data: weeklyData.map(entry => entry.total || 0),
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      fill: true,
    }]
  };

  const monthlyChartData = {
    labels: Array.from({ length: 31 }, (_, i) => i + 1),
    datasets: [{
      label: 'Earnings',
      data: monthlyData.map(entry => entry.total || 0),
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      fill: true,
    }]
  };

  const yearlyChartData = {
    labels: monthsOfYear,
    datasets: [{
      label: 'Earnings',
      data: yearlyData.map(entry => entry.total || 0),
      borderColor: 'rgba(75,192,192,1)',
      backgroundColor: 'rgba(75,192,192,0.2)',
      fill: true,
    }]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        title: { display: true, text: 'Time Period' },
        ticks: {
          autoSkip: true,
          maxRotation: 0,
          maxTicksLimit: 8,
        },
      },
      y: { beginAtZero: true, title: { display: true, text: 'Earnings (in EUR)' } }
    }
  };

  return (
    <div className="admin-content-page earnings-page">
        <div className="filter-navbar">
          <button className='aaa' onClick={() => setPeriod('daily')}>Ditore  <ExpandMoreIcon style={{ color: 'white', fontSize: '30px', marginLeft: '5px' }} /></button>
          <button className='aaa' onClick={() => setPeriod('weekly')}>Javore  <ExpandMoreIcon style={{ color: 'white', fontSize: '30px', marginLeft: '5px' }} /></button>
          <button className='aaa' onClick={() => setPeriod('monthly')}>Mujore  <ExpandMoreIcon style={{ color: 'white', fontSize: '30px', marginLeft: '5px' }} /></button>
          <button  className='aaa' onClick={() => setPeriod('yearly')}>Vjetore  <ExpandMoreIcon style={{ color: 'white', fontSize: '30px', marginLeft: '5px' }} /></button>
        </div>
        <div className="line-chart">
          {period === 'daily' && (
            <div id='dflex' >
             <div className='grafiku'>
             <p id='pershkrimi'>Te ardhurat ditore nga shitjet</p>
            <div className='sales-chart-frame'>
              <Line data={dailyChartData} options={options} /></div>
            </div>
            <div id='cards'> <div id='card'><h5>Të ardhurat ditore: </h5><p>{totalHourlyEarnings} euro</p> </div>
              <div id='card'><h2>Totali i porosive ditore:</h2> <p> {totalDailyOrders} porosi</p></div></div>
              </div>
          )}
       {period === 'weekly' && (
          <div id='dflex' >
          <div className='grafiku'>
          <p id='pershkrimi'>Te ardhurat javore nga shitjet</p>
  <div className='sales-chart-frame'>
    <Line data={weeklyChartData} options={options} /></div></div>
    <div id='cards' style={{ justifyContent: 'space-around', marginTop: '20px' }}>
      <div id="card">
        <h2>Totali i te ardhurave</h2>
        <p>{totalWeekEarnings} euro</p>
      </div>
      <div id="card">
        <h2>Totali i porosive javore</h2>
        <p>{totalWeeklyOrders} porosi</p>
      </div>
    
  </div>
  </div>
)}

{period === 'monthly' && (
  <div id='dflex'>
    <div className='grafiku'>
      <p id='pershkrimi'>Të ardhurat mujore nga shitjet</p>
      <div className='sales-chart-frame'>
        <Line data={monthlyChartData} options={options} />
      </div>
    </div>
    <div id='cards' style={{ justifyContent: 'space-around', marginTop: '20px' }}>
      <div id='card'>
        <h5>Të ardhurat mujore:</h5>
        <p>{totalMonthEarnings} EUR</p>
      </div>
      <div id='card'>
        <h2>Totali i porosive mujore:</h2>
        <p>{totalMonthlyOrders} porosi</p>
      </div>
    </div>
  </div>
)}

{period === 'yearly' && (
  <div id='dflex'>
    <div className='grafiku'>
      <p id='pershkrimi'>Të ardhurat vjetore nga shitjet</p>
      <div className='sales-chart-frame'>
        <Line data={yearlyChartData} options={options} />
      </div>
    </div>
    <div id='cards' style={{  justifyContent: 'space-around', marginTop: '20px' }}>
      <div id='card'>
        <h5>Të ardhurat vjetore:</h5>
        <p>{totalYearEarnings} EUR</p>
      </div>
      <div id='card'>
        <h2>Totali i porosive vjetore:</h2>
        <p>{totalYearlyOrders} porosi</p>
      </div>
    </div>
  </div>
)}

        </div>
    </div>
  );
};

export default EarningsPage;
