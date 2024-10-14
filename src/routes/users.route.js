import Router from "express"
import {userRegister, getUsers} from "../controllers/users.controller.js"

const router = Router()

router.route("/register").post(userRegister)
router.route("/getUsers").get(getUsers)

export default router;