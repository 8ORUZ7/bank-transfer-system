const express = require('express');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

let register, login, currentUser, getUsers, verify, getImage;

try {
  ({
    register,
    login,
    currentUser,
    getUsers,
    verify,
    getImage,
  } = require('../controllers/userController'));

  // Validate if all are functions
  if (
    typeof register !== 'function' ||
    typeof login !== 'function' ||
    typeof currentUser !== 'function' ||
    typeof getUsers !== 'function' ||
    typeof verify !== 'function' ||
    typeof getImage !== 'function'
  ) {
    throw new Error('ONE OR MORE CONTROLLER FUNCTIONS ARE INVALID');
  }
} catch (error) {
  console.error('FAILED TO LOAD USER CONTROLLER:', error.message);

  // Fallback error handler for all routes
  const controllerErrorHandler = (req, res) => {
    res.status(500).json({ message: 'USER CONTROLLER ERROR - INTERNAL SERVER ERROR' });
  };

  register = login = currentUser = getUsers = verify = getImage = controllerErrorHandler;
}

// Define routes
router.post('/register', register);
router.post('/login', login);
router.get('/current_user', protect, currentUser);
router.get('/get_users', protect, getUsers);
router.get('/get_image', protect, getImage);
router.put('/verify/:id', protect, admin, verify);

module.exports = router;
