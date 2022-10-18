const bcrypt = require('bcrypt');
const { Schema, model } = require('mongoose');

const {
  // DEFAULT_PROFILE_IMG,
  ACCOUNT_TYPE,
  SALT_ROUNDS
} = require('../utils/constants');

const userSchema = new Schema({
  phone_number: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    maxlength: 60,
    trim: true,
    lowercase: true,
    index: {
      unique: true,
      sparse: true,
    },
    required: true,
  },
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  account_type: {
     type: String,
     enum: ACCOUNT_TYPE.options,
     default: ACCOUNT_TYPE.default
  },
  is_blocked: {
    type: Boolean,
    default: false,
  }
}, { 
    timestamps: { 
        createdAt: 'created_at', 
        updatedAt: 'updated_at'
    }, 
    toJSON: 
    { 
        virtuals: true, 
        getters: true 
    } 
});

userSchema.set('toJSON', {
  transform: function(doc, ret, opt) {
      delete ret['password']
      return ret
  }
});

userSchema.pre('save', function (next) {
    if (!this.isModified('password')) return next();
    this.password = bcrypt.hashSync(this.password, parseInt(SALT_ROUNDS, 10));
    return next();
  });
  
const userModel = model('user', userSchema);
module.exports = userModel;
