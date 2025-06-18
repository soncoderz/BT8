const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Validate that username has no Unicode special characters
        return /^[a-zA-Z0-9_.-]+$/.test(v);
      },
      message: props => 'Username cannot contain unicode special characters'
    }
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        // Validate that password has no Unicode special characters (this is normally not checked directly as the password is hashed)
        return /^[a-zA-Z0-9_.\-!@#$%^&*()[\]{}|;:,.<>?]+$/.test(v);
      },
      message: props => 'Password cannot contain unicode special characters'
    }
  },
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User; 