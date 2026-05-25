require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');

const createAdmin = async () => {
  try {
    await connectDB();
    
    // Check if admin exists
    const adminExists = await User.findOne({ email: 'admin@hotel.com' });
    if (adminExists) {
      console.log('Admin user already exists! Email: admin@hotel.com, Password: adminpassword');
      process.exit();
    }

    const adminUser = new User({
      name: 'System Admin',
      email: 'admin@hotel.com',
      password: 'adminpassword',
      role: 'admin',
      contactNo: '1234567890'
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@hotel.com');
    console.log('Password: adminpassword');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();
