"use strict";

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    email: {
      type:DataTypes.STRING,
      validate:{
        isEmail: {
          args:true,
          msg:'Please enter a valid email address.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate:{
        len:{
          args:[5,200],
          msg:'You must enter a password over 5 characters.'
        }
      }
    },
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    hooks:{
      beforeCreate:function(data,options,sendback){
        bcrypt.hash(data.password,10,function(err,hash){
          if(err) throw err;
          data.password=hash;
          sendback(null,data);
        })
      }
    }
  });

  return user;
};
