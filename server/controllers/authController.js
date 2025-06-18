const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret_key', {
    expiresIn: '30d'
  });
};

// Register controller
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if fields are empty
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu' 
      });
    }
    
    // Validate no unicode in username and password
    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    const passwordRegex = /^[a-zA-Z0-9_.\-!@#$%^&*()[\]{}|;:,.<>?]+$/;
    
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tên đăng nhập không được chứa ký tự unicode',
        field: 'username'
      });
    }
    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mật khẩu không được chứa ký tự unicode',
        field: 'password'
      });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Tên đăng nhập đã tồn tại',
        field: 'username'
      });
    }

    // Create new user
    const user = new User({
      username,
      password
    });

    // Save user to database
    await user.save();

    // Generate JWT token
    const token = generateToken(user._id);

    // Send success response
    res.status(201).json({
      success: true,
      message: 'Đăng ký thành công',
      user: {
        id: user._id,
        username: user.username
      },
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi máy chủ khi đăng ký' 
    });
  }
};

// Login controller
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if fields are empty
    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu' 
      });
    }
    
    // Validate no unicode in username and password
    const usernameRegex = /^[a-zA-Z0-9_.-]+$/;
    const passwordRegex = /^[a-zA-Z0-9_.\-!@#$%^&*()[\]{}|;:,.<>?]+$/;
    
    if (!usernameRegex.test(username)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Tên đăng nhập không được chứa ký tự unicode',
        field: 'username'
      });
    }
    
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Mật khẩu không được chứa ký tự unicode',
        field: 'password'
      });
    }

    // Find the user
    const user = await User.findOne({ username });
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Thông tin đăng nhập không chính xác' 
      });
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false, 
        message: 'Thông tin đăng nhập không chính xác' 
      });
    }

    // Generate JWT token
    const token = generateToken(user._id);

    // Remember me functionality
    const rememberMe = req.body.rememberMe || false;
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    };
    
    // If remember me is checked, set cookie to expire in 30 days
    if (rememberMe) {
      cookieOptions.expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    }

    // Send token in cookie
    res.cookie('token', token, cookieOptions);

    // Send success response
    res.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: {
        id: user._id,
        username: user.username
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Lỗi máy chủ khi đăng nhập' 
    });
  }
};

// Logout controller
exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Đăng xuất thành công' });
};

// Check auth status
exports.checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.json({ 
        isAuthenticated: false 
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.json({ 
        isAuthenticated: false 
      });
    }
    
    res.json({
      isAuthenticated: true,
      user: {
        id: user._id,
        username: user.username
      }
    });
    
  } catch (error) {
    console.error('Auth check error:', error);
    res.json({ 
      isAuthenticated: false 
    });
  }
}; 