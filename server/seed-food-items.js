const mongoose = require('mongoose');
const FoodItem = require('./models/foodItem.model');
require('dotenv').config();

const foodItems = [
  {
    _id: '60d0fe4f5311236168a109cb',
    name: 'Sallate Vegjetariane',
    image: 'assets/food_2.png',
    price: 8,
    quantity: 1,
    description: 'Perberesit: domate, kastravec, qepe, ullinj, djathe feta',
    category: 'Salad',
  },
  {
    _id: '60d0fe4f5311236168a108dd',
    name: 'Cheesecake',
    image: 'assets/food_20.png',
    price: 18,
    quantity: 1,
    description: 'Perberesit: miell, sheqer, veze, fruta te fresketa, gjalpe',
    category: 'Cake',
  },
  {
    _id: '60d0fe4f5311236168a109df',
    name: 'Pasta me Pule',
    image: 'assets/food_22.png',
    price: 20,
    quantity: 1,
    description: 'Perberesit: makarone, fileto pule, salce, ereza',
    category: 'Pasta',
  },
  {
    _id: '60d0fe4f5311236168a109e5',
    name: 'Noodle Pule',
    image: 'assets/food_28.png',
    price: 20,
    quantity: 1,
    description: 'Perberesit: noodle, fileto pule, perime, salce soje',
    category: 'Noodles',
  },
  {
    _id: '60d0fe4f5311236168a109ec',
    name: 'Sallate Klore',
    image: 'assets/food_3.png',
    price: 16,
    quantity: 1,
    description: 'Perberesit: laker, karrota, speca, rrush i thate, arra',
    category: 'Salad',
  },
  {
    _id: '60d0fe4f5311236168a109cd',
    name: 'Sallate me Pule',
    image: 'assets/food_4.png',
    price: 24,
    quantity: 1,
    description: 'Perberesit: marule, fileto pule, domate, kastravec, qepe',
    category: 'Salad',
  },
  {
    _id: '60d0fe4f5311236168a109ce',
    name: 'Roll Lasagna',
    image: 'assets/food_5.png',
    price: 14,
    quantity: 1,
    description: 'Perberesit: pete lasagna, mish vici, djathe mozzarella, domate',
    category: 'Rolls',
  },
  {
    _id: '60d0fe4f5311236168a109f1',
    name: 'Roll Peri Peri',
    image: 'assets/food_6.png',
    price: 12,
    quantity: 1,
    description: 'Perberesit: mish pule, speca peri peri, djathe, domate',
    category: 'Rolls',
  },
  {
    _id: '60d0fe4f5311236168a109d0',
    name: 'Roll Pule',
    image: 'assets/food_7.png',
    price: 20,
    quantity: 1,
    description: 'Perberesit: fileto pule, speca, qepe, domate',
    category: 'Rolls',
  },
  {
    _id: '60d0fe4f5311236168a109d1',
    name: 'Roll Vegjetarian',
    image: 'assets/food_8.png',
    price: 15,
    quantity: 1,
    description: 'Perberesit: marule, karrota, speca, domate',
    category: 'Rolls',
  },
  {
    _id: '60d0fe4f5311236168a109d2',
    name: 'Akullore Ripple',
    image: 'assets/food_9.png',
    price: 14,
    quantity: 1,
    description: 'Perberesit: qumesht, sheqer, vanilje, fruta',
    category: 'Deserts',
  },
  {
    _id: '60d0fe4f5311236168a109d3',
    name: 'Akullore Frutash',
    image: 'assets/food_10.png',
    price: 22,
    quantity: 1,
    description: 'Perberesit: qumesht, sheqer, fruta te fresketa',
    category: 'Deserts',
  },
  {
    _id: '60d0fe4f5311236168a109d4',
    name: 'Akullore ne Kavanoz',
    image: 'assets/food_11.png',
    price: 10,
    quantity: 1,
    description: 'Perberesit: qumesht, sheqer, vanilje',
    category: 'Deserts',
  },
  {
    _id: '60d0fe4f5311236168a109ca',
    name: 'Sallate Greke',
    image: 'assets/food_1.png',
    price: 12,
    quantity: 1,
    description: 'Perberesit: marule, karrota, speca, kastravec, qepe',
    category: 'Salad',
  },
  {
    _id: '60d0fe4f5311236168a109d5',
    name: 'Akullore Vanilje',
    image: 'assets/food_12.png',
    price: 12,
    quantity: 1,
    description: 'Perberesit: qumesht, sheqer, vanilje',
    category: 'Deserts',
  },
  {
    _id: '60d0fe4f5311236168a109d7',
    name: 'Sanduic Vegan',
    image: 'assets/food_14.png',
    price: 16,
    quantity: 1,
    description: 'Perberesit: buke, avokado, domate, marule, qepe',
    category: 'Sandwich',
  },
  {
    _id: '60d0fe4f5311236168a109d8',
    name: 'Sanduic me Proshute',
    image: 'assets/food_15.png',
    price: 14,
    quantity: 1,
    description: 'Perberesit: buke, proshute, domate, kastravec, marule',
    category: 'Sandwich',
  },
  {
    _id: '60d0fe4f5311236168a109da',
    name: 'Cup Cake',
    image: 'assets/food_17.png',
    price: 3,
    quantity: 1,
    description: 'Perberesit: miell, sheqer, veze, luleshtrydhe, gjalpe',
    category: 'Cake',
  },
  {
    _id: '60d0fe4f5311236168a109d6',
    name: 'Sanduic me Pule',
    image: 'assets/food_13.png',
    price: 5,
    quantity: 1,
    description: 'Perberesit: buke, fileto pule, domate, kastravec, sallate',
    category: 'Sandwich',
  },
  {
    _id: '60d0fe4f5311236168a109d9',
    name: 'Sanduic me Djathe',
    image: 'assets/food_16.png',
    price: 14,
    quantity: 1,
    description: 'Perberesit: buke, djathe, domate, marule',
    category: 'Sandwich',
  },
  {
    _id: '60d0fe4f5311236168a109db',
    name: 'Torte Vanilje',
    image: 'assets/food_19.png',
    price: 14,
    quantity: 1,
    description: 'Perberesit: miell, sheqer, veze, vanilje, gjalpe',
    category: 'Cake',
  },
  {
    _id: '60d0fe4f5311236168a109dc',
    name: 'Torte Red Velvet',
    image: 'assets/food_18.png',
    price: 18,
    quantity: 1,
    description: 'Perberesit: miell, sheqer, veze, ngjyre e kuqe, gjalpe',
    category: 'Cake',
  },
  {
    _id: '60d0fe4f5311236168a109dd',
    name: 'Torte Frutash',
    image: 'assets/food_20.png',
    price: 20,
    quantity: 1,
    description: 'Perberesit: miell, sheqer, veze, fruta te fresketa, gjalpe',
    category: 'Cake',
  },
  {
    _id: '60d0fe4f5311236168a109de',
    name: 'Pasta me Djathe',
    image: 'assets/food_25.png',
    price: 22,
    quantity: 1,
    description: 'Perberesit: makarone, djathe, qumesht, gjalpe, ereza',
    category: 'Pasta',
  },
  {
    _id: '60d0fe4f5311236168a109e0',
    name: 'Sallate Cezar',
    image: 'assets/food_23.png',
    price: 18,
    quantity: 1,
    description: 'Perberesit: makarone, mish vici, salce domate, qepe',
    category: 'Pasta',
  },
  {
    _id: '60d0fe4f5311236168a109e2',
    name: 'Oriz me perime',
    image: 'assets/food_24.png',
    price: 16,
    quantity: 1,
    description: 'Perberesit: oriz, fileto pule, ereza, perime',
    category: 'Rice',
  },
  {
    _id: '60d0fe4f5311236168a109e3',
    name: 'Pasta Bolonjeze',
    image: 'assets/food_26.png',
    price: 16,
    quantity: 1,
    description: 'Perberesit: oriz, perime, ereza',
    category: 'Rice',
  },
  {
    _id: '60d0fe4f5311236168a109e4',
    name: 'Noodle Vici',
    image: 'assets/food_27.png',
    price: 22,
    quantity: 1,
    description: 'Perberesit: noodle, mish vici, perime, salce soje',
    category: 'Noodles',
  },
  {
    _id: '60d0fe4f5311236168a109e6',
    name: 'Noodle Vegjetarian',
    image: 'assets/food_29.png',
    price: 16,
    quantity: 1,
    description: 'Perberesit: noodle, perime, salce soje',
    category: 'Noodles',
  },
  {
    _id: '60d0fe4f5311236168a109e7',
    name: 'Pica Pepperoni',
    image: 'assets/pepperoni.png',
    price: 25,
    quantity: 1,
    description: 'Perberesit: brume, salce domate, djathe mozzarella, pepperoni',
    category: 'Pizza',
  },
];

const seedFoodItems = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is required');
    }

    await mongoose.connect(process.env.MONGODB_URI);

    await FoodItem.bulkWrite(
      foodItems.map((item) => ({
        updateOne: {
          filter: { _id: item._id },
          update: { $set: item },
          upsert: true,
        },
      }))
    );

    console.log(`Seeded ${foodItems.length} food items.`);
  } catch (error) {
    console.error('Failed to seed food items:', error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedFoodItems();
