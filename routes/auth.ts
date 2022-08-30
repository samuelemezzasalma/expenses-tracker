import { Router } from "express";
import passport from "passport";
import UserModel from "../models/user";

const router = Router();

/** */
router.get('/user', (req, res) => {
  if (req.user) {
    res.json(extractUser(req))
  } else {
    res.json({ user: null })
  }
})

router.post('/sign-up',
  async (req, res, next) => {
    const { username, password } = req.body;
    try {
      await UserModel.register(new UserModel({username}), password)
    } catch (error: any) {
      console.log(error.name)
      if (error.name === 'UserExistsError') {
        return res.status(400).json({ message: 'UserExistsError' })
      }
      return res.status(500).json({ message: 'There was an error when signing up the user' })
    }
    next()
  },
  passport.authenticate('local'),
  (req, res) => res.json(extractUser(req))
)

router.post('/logout', (req, resp, next) => {
  if (req.user) {
    req.logOut((err) => {
      if (err) { console.log(err) }
    });
    return resp.json({ message: "Logged out" })
  } else {
    return resp.json({ message: "No user to log out" })
  }
})

router.post('/login', passport.authenticate('local'), (req, res) => res.json(extractUser(req)))

router.post('/update-password', (req, res, next) => { 
  if (!req.user) {
    return res.send({message: 'No user to change password'})
  }
  next()
 }, 
 async (req, res) => {
  const {oldPassword, newPassword} = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).send({message: 'Invalid request'})
  }
  try {
    const user = await UserModel.findById(req.user['_id']);
    await user.changePassword(oldPassword, newPassword)
    res.json({message: 'success'})
  } catch (error) {
    if (error.name === 'IncorrectPasswordError') {
      return res.status(400).json({message: 'IncorrectPasswordError'})
    }
    return res.status(500).json({message: 'There was an error'})
  }
 })


function extractUser(req): any {
  const {username, _id} = req.user;
  return {user: {username, _id}}
}

export default router
