const User = require('../../data/db-config')

/*
  If the user does not have a session saved in the server

  status 401
  {
    "message": "You shall not pass!"
  }
*/
function restricted(req, res, next) {
  if(req.session.user){
      next()
  }else{
      next({status: 401, message: 'Must be logged in!'})
  }
}

/*
  If the username in req.body already exists in the database

  status 422
  {
    "message": "Username taken"
  }
*/
async function checkUsernameFree(req, res, next) {
  const {username} = req.body
  const result = await User.findBy({username})
  const taken = result[0].user
  // console.log(taken)

  if(!taken){
    next()
  }else{
    next({status:422, message: 'Username taken'})
  }
}

/*
  If the username in req.body does NOT exist in the database

  status 401
  {
    "message": "Invalid credentials"
  }
*/
async function checkUsernameExists(req, res, next) {
  const {username} = req.body
  const result = await User.findBy({username})
  const exists = result[0].user

  if(exists){
    next()
  }else{
    next({status:401, message: 'Invalid Credentials'})
  }
}

/*
  If password is missing from req.body, or if it's 3 chars or shorter

  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
*/
async function checkPasswordLength(req, res, next) {
  const {password} = req.body
  const result = await User.findBy({password})
  const exists = result[0].password

  if(!exists || exists.length < 3){
    next({status:422, message: 'Password must be longer than 3 chars'})
  }else{
    next()
  }
}

// Don't forget to add these to the `exports` object so they can be required in other modules
 module.exports = {
   restricted,
   checkUsernameFree,
   checkUsernameExists,
   checkPasswordLength
 }