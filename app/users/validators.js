const Validator = require('validator');
const isEmpty = require('./isEmpty');



exports.userValidator = function (data) {

  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : '';
  data.mobile = !isEmpty(data.mobile) ? data.mobile : '';
  data.email = !isEmpty(data.email) ? data.email : '';
  data.password = !isEmpty(data.password) ? data.password : '';

  if(Validator.isEmpty(data.name)) {
    errors.name = "Name field is required";
  }

  if(Validator.isEmpty(data.mobile)) {
    errors.mobile = "Mobile Number is required";
  }

  if(Validator.isEmpty(data.password)) {
    errors.password = "Password is required";
  }

  if(Validator.isEmpty(data.email)) {
    errors.email = "E-mail is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  }
}


