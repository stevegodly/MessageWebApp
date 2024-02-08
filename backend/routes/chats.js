const express=require('express')
const router=express.Router()

const {profile,userLogin,registerUser,getMessages,people}=require('../controllers/chats')

router.route('/').get(profile)
router.route('/login').post(userLogin)
router.route('/people').get(people)
router.route('/register').post(registerUser)
router.route('/:id').get(getMessages)

module.exports=router
