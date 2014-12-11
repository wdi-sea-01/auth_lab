"use strict";

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define("user", {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
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
