const Order = require('../models/order.model'); 

function getStartAndEndOfPeriod(period) {
  let startDate, endDate;

  switch (period) {
    case 'daily':
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0); 
      endDate = new Date(startDate);
      endDate.setHours(23, 59, 59, 999); 
      break;

    case 'weekly':
      startDate = new Date();
      const currentDayOfWeek = startDate.getDay();
      const distanceToMonday = (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1); 
      startDate.setDate(startDate.getDate() - distanceToMonday); 
      startDate.setHours(0, 0, 0, 0); 
      endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6); 
      endDate.setHours(23, 59, 59, 999); 
      break;

    case 'monthly':
      startDate = new Date();
      startDate.setDate(1); 
      startDate.setHours(0, 0, 0, 0); 
      endDate = new Date(startDate);
      endDate.setMonth(startDate.getMonth() + 1); 
      endDate.setDate(0); 
      endDate.setHours(23, 59, 59, 999); 
      break;

    case 'yearly':
      startDate = new Date();
      startDate.setMonth(0, 1);
      startDate.setHours(0, 0, 0, 0); 
      endDate = new Date(startDate);
      endDate.setFullYear(startDate.getFullYear() + 1); 
      endDate.setDate(0); 
      endDate.setHours(23, 59, 59, 999); 
      break;

    default:
      throw new Error('Invalid period');
  }

  return { startDate, endDate };
}
exports.getEarnings = async (req, res) => {
  const { period } = req.query;

  try {
    const { startDate, endDate } = getStartAndEndOfPeriod(period);

    const matchStage = {
      $match: {
        status: 'Finished',
        orderDate: { $gte: startDate, $lt: endDate }
      }
    };

    if (period === 'daily') {
      const earnings = await Order.aggregate([
        matchStage,
  {
    $addFields: { orderDateConverted: { $toDate: '$orderDate' } }
  },
  {
          $group: {
            _id: {
              $hour: {
                date: '$orderDateConverted',
                timezone: 'Europe/Tirane' 
              }
            },
            total: { $sum: '$totalPrice' }, 
            totalOrders: { $sum: 1 }  
          }
        },
        { $sort: { '_id': 1 } }
      ]);
      const formattedEarnings = Array.from({ length: 24 }, (_, i) => {
        const hourData = earnings.find(e => e._id === i) || { total: 0 };
        return { hour: `${i}:00`, total: hourData.total };
      });

      const totalDailyOrders = earnings.reduce((acc, curr) => acc + curr.totalOrders, 0);
      const totalHourlyEarnings = formattedEarnings.reduce((acc, curr) => acc + curr.total, 0);
res.json({ hourlyEarnings: formattedEarnings, totalDailyOrders,earnings: totalHourlyEarnings });
} 

    else if (period === 'weekly') {
      const earnings = await Order.aggregate([
        matchStage,
        {
          $addFields: { orderDateConverted: { $toDate: '$orderDate' } }
        },
        {
          $group: {
            _id: { $dayOfWeek: '$orderDateConverted' },
            total: { $sum: '$totalPrice' }, 
            totalOrders: { $sum: 1 }  
          }
        },
        { $sort: { '_id': 1 } }
      ]);

  
      const totalWeeklyOrders = earnings.reduce((acc, curr) => acc + curr.totalOrders, 0);
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const formattedEarnings = Array.from({ length: 7 }, (_, i) => {
        const dayData = earnings.find(e => e._id === (i + 1)) || { total: 0 };
        return { day: daysOfWeek[i], total: dayData.total };
      });

      const totalWeekEarnings = formattedEarnings.reduce((acc, curr) => acc + curr.total, 0);
      res.json({ dailyEarnings: formattedEarnings, totalWeekEarnings, totalWeeklyOrders });

     }
    else if (period === 'monthly') {
      const earnings = await Order.aggregate([
        matchStage,
        {
          $addFields: { orderDateConverted: { $toDate: '$orderDate' } }
        },
        {
          $group: {
            _id: { $dayOfMonth: '$orderDateConverted' },
            total: { $sum: '$totalPrice' }, 
            totalOrders: { $sum: 1 }}
        },
        { $sort: { '_id': 1 } }
      ]);

      const totalMonthlyOrders = earnings.reduce((acc, curr) => acc + curr.totalOrders, 0);
      const formattedEarnings = Array.from({ length: 31 }, (_, i) => {
        const dayData = earnings.find(e => e._id === (i + 1)) || { total: 0 };
        return { day: i + 1, total: dayData.total };
      });

      const totalMonthEarnings = formattedEarnings.reduce((acc, curr) => acc + curr.total, 0);
      res.json({ dailyEarnings: formattedEarnings, totalMonthEarnings , totalMonthlyOrders});
    }
    else if (period === 'yearly') {
      const earnings = await Order.aggregate([
        matchStage,
        matchStage,
        {
          $addFields: { orderDateConverted: { $toDate: '$orderDate' } }
        },
        {
          $group: {
            _id: { $month: '$orderDate' }, 
            total: { $sum: '$totalPrice' }, 
            totalOrders: { $sum: 1 } 
          }
        },
        { $sort: { '_id': 1 } }
      ]);
      const totalYearlyOrders = earnings.reduce((acc, curr) => acc + curr.totalOrders, 0);
      const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const formattedEarnings = monthsOfYear.map((month, i) => {
        const monthData = earnings.find(e => e._id === (i + 1)) || { total: 0 };
        return { month, total: monthData.total };
      });

      const totalYearEarnings = formattedEarnings.reduce((acc, curr) => acc + curr.total, 0);
      res.json({ monthlyEarnings: formattedEarnings, totalYearEarnings, totalYearlyOrders });
    } else {
      return res.status(400).json({ message: 'Invalid period' });
    }
  } catch (error) {
    console.error('Error fetching earnings:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
