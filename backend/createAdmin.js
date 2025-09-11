const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { UserModel } = require("./models/User.model");
require("dotenv").config();

const createAdmin = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.url);
    console.log('Connected to database');

    // Check if admin already exists
    const existingAdmin = await UserModel.findOne({ email: 'admin@zauvijekmart.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 5);
    
    const admin = new UserModel({
      name: 'Admin User',
      username: 'admin',
      email: 'admin@zauvijekmart.com',
      password: hashedPassword,
      phone: 9999999999,
      gender: 'other',
      role: 'admin',
      status: 'approved'
    });

    await admin.save();
    console.log('Admin user created successfully');
    console.log('Email: admin@zauvijekmart.com');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    mongoose.connection.close();
  }
};

createAdmin();
