const express=require('express')
const controller=require('../controllers/dealer-controllers')
const authentication=require('../middlewares/authentication')
const router=express.Router()

router.post('/',controller.dealerLogin)
router.get('/isDealerAuth',authentication.dealerJwt,controller.dealerAuth)
// router.get('/getUsers',adminAuth.adminJwt,adminController.getUsers)
// router.post('/delete_user',adminAuth.adminJwt,adminController.deleteUsers)
// router.post('/edit_user',adminAuth.adminJwt,adminController.editUsers)

module.exports =router