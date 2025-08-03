const mongoose = require('mongoose');
const Admin = require('./models/admin.model'); // adjust path if needed

// Replace with your actual MongoDB connection string
const MONGO_URI = 'mongodb://localhost:27017/your-db-name';

const createAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = 'admin@gmail.com';
    const password = 'admin123';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const newAdmin = new Admin({ email, password });
    await newAdmin.save();

    console.log('Admin created successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

createAdmin();
