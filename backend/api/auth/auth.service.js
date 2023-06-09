const bcrypt = require('bcrypt');
const userService = require('../user/user.service');
const logger = require('../../services/logger.service');

async function login(username, password) {
  logger.debug(`auth.service - login with username: ${username}`);
  const user = await userService.getByUsername(username);

  if (!user) return Promise.reject('Invalid username or password');
  const match = await bcrypt.compare(password, user.password);
  if (!match) return Promise.reject('Invalid username or password');
  delete user.password;
  return user;
}

async function signup(username, password, fullname, imgUrl, googleId) {
  if (googleId) {
    const saltRounds = 10;
    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`);
    if (!username || !password || !fullname || !imgUrl)
      return Promise.reject('fullname, username and password are required!');
    const user = await userService.getByUsername(username);
    // With Google - user Exists
    if (user) {
      return user
    } else {
      // With Google - user doesnt Exists
      const hash = await bcrypt.hash(password, saltRounds);
      return userService.add({ username, password: hash, fullname, imgUrl, googleId });
    }

  } else {

    const saltRounds = 10;
    logger.debug(`auth.service - signup with username: ${username}, fullname: ${fullname}`);
    if (!username || !password || !fullname || !imgUrl)
      return Promise.reject('fullname, username and password are required!');
    const user = await userService.getByUsername(username);
    // Check if username is already taken
    if (user) return Promise.reject('User already exist');
    const hash = await bcrypt.hash(password, saltRounds);
    return userService.add({ username, password: hash, fullname, imgUrl });
  }
}

module.exports = {
  signup,
  login,
};
