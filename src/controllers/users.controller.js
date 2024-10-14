import { asyncHandler } from "../utils/asyncHanlder.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const userRegister = asyncHandler(async (req, res) => {
  const { fullName, userName, password, phoneNumber } = req.body;

  if (
    [fullName, userName, password, phoneNumber].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All field are required");
  }

  const userAlreadyExist = await User.findOne({
    $or: [{ userName }, { phoneNumber }],
  });

  if (userAlreadyExist) {
    throw new ApiError(400, "User Already exist");
  }

  const user = await User.create({
    fullName,
    userName,
    password,
    phoneNumber
  });

  const userCreated = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!userCreated) {
    throw new ApiError(500, "Something went wrong while creating a user!!");
  }

  return res
    .status(201)
    .json(new ApiResponse(200, userCreated, "User Created Sucessfully"));
});

const getUsers = asyncHandler(async (req,res) => {
  const users = await User.find().select("-password -refreshToken")
  res.status(200).json(new ApiResponse(200,users, "Data Retrive"))
})




export {userRegister, getUsers};
