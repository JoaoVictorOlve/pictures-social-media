const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET;

const verifyToken = (req, res, next) => {

  const token = req.headers.cookie;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  const formatedToken = token.replace(/authorization=/g,'');

  jwt.verify(formatedToken, secretKey, (err, decoded) => {
    if (err) {
      console.log(formatedToken);
      return res.status(401).json({ error: 'Token is not valid' });
    }

    // If the token is valid, store the decoded user information for use in route handlers
    const userId = decoded.id;

    // You can use userId in your route handlers
    req.userId = userId;
    next();
  });
}

module.exports = { verifyToken };