const express=require('express')
const userController=require('../controllers/user-controllers')
const router=express.Router()



router.post('/signup',(req,res)=>{
    console.log('hi');
})
router.post('/login',userController.userlogin)
// router.get ('/is-user-auth',userAuth.verifyJWT,userController.isUserAuth)
// router.post('/user_edit',userAuth.verifyJWT,userController.userEdit)
router.post('/test-drive',userController.testDriveBooking)


module.exports=router