const mongoose = require('mongoose');
const Admin = require('./models/admin.model');
require('dotenv').config();
const MONGO_URI = process.env.MONGODB_URI;
const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

const createAdmin = async () => {
  try {
    if (!MONGO_URI || !email || !password) {
      throw new Error('MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD are required');
    }

    await mongoose.connect(MONGO_URI);

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const newAdmin = new Admin({ email, password, confirmPassword: password });
    await newAdmin.save();

    console.log('Admin created successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
