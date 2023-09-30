function isStrongPassword(password){
  if (password.length < 8 || password.length > 20) {
    return false;
  }

  if (!/[a-z]/.test(password)) {
    return false;
  }

  if (!/[A-Z]/.test(password)) {
    return false;
  }

  if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password)) {
    return false;
  }

  return true;
}

module.exports = isStrongPassword;