const validator = require("validator");

module.exports = body => {
  let errors = {
    name: [],
    email: [],
    password: [],
    confirm: []
  };
  let isValid = true;
  if (validator.isEmpty(body.name)) {
    errors.name.push({ message: "Name is required" });
  }
  if (body.name.length < 3 || body.name.length > 15) {
    errors.name.push({
      message: "Name should be greater than 3 and less than 15 characters"
    });
  }
  if (validator.isEmpty(body.email)) {
    errors.email.push({ message: "Email is required" });
  }
  if (!validator.isEmail(body.email)) {
    errors.email.push({ message: "Please enter a valid email" });
  }
  if (validator.isEmpty(body.password)) {
    errors.password.push({ message: "Password is required" });
  }
  if (body.password.length < 8) {
    errors.password.push({
      message: "Password cannot be less than 8 characters"
    });
  }
  if (validator.isEmpty(body.confirm)) {
    errors.confirm.push({ message: "Please confirm your password" });
  }
  if (body.confirm !== body.password) {
    errors.confirm.push({ message: "Passwords do not match" });
  }
  for (let key in errors) {
    if (errors[key].length > 0) {
      isValid = false;
    }
  }

  return {
    errors,
    isValid
  };
};
