import { asyncHandler } from "../utils/asyncHanlder.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";

//--------------Generate Refresh and Access Token-----------------------

const generateRefreshAndAccessToken = async (userId) => {

  try {
    const user = await User.findById(userId)
    const refreshToken = user.generateRefreshToken()
    const accessToken = user.generateAccessToken()
  
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave : false})
  
    return {refreshToken,accessToken}
    
  } catch (error) {
    throw new ApiError(500, error)
  }


};

//--------------Registration-----------------------

const userRegister = asyncHandler(async (req, res) => {
  const { fullName, userName, password, phoneNumber,email } = req.body;

  if (
    [fullName, userName, password, phoneNumber,email].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All field are required");
  }

  const userAlreadyExist = await User.findOne({
    $or: [{ userName }, { phoneNumber }, {email}],
  });

  if (userAlreadyExist) {
    throw new ApiError(400, "User Already exist");
  }

  const user = await User.create({
    fullName,
    userName,
    password,
    phoneNumber,
    email
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

//--------------Login-----------------------

const userLogin = asyncHandler(async (req, res) => {
  const { phoneNumber, userName, password, email } = req.body;

  if (!phoneNumber && !userName && !email) {
    throw new ApiError(400, "Phone Number or User name or Email is Required");
  }

  const user = await User.findOne({
    $or: [{ phoneNumber }, { userName }, {email}],
  });

  if (!user) {
    throw new ApiError(404, "User Doesn't Exist");
  }

  const isPasswordvalid = await user.isPasswordCorrect(password);

  if (!isPasswordvalid) {
    throw new ApiError(401, "Invalid Credential");
  }


const {refreshToken,accessToken} = await generateRefreshAndAccessToken(user._id)

const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

const option = {
  httpOnly: true,
  secure: true
}

res.status(200)
.cookie("accessToken", accessToken,option)
.cookie("refreshToken", refreshToken,option)
.json(new ApiResponse(
  200,
  {
    user: loggedInUser,accessToken,refreshToken
  },
  "User LoggedIn Successfully"
))
});

//--------------Logout-----------------------

const userLogout = asyncHandler(async (req,res) =>{
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1 // this removes the field from document
    }
    },
    {
      new: true
    }
  )

  const option = {
    httpOnly: true,
    secure: true
  }

  return res.
  status(200)
  .clearCookie("accessToken", option)
  .clearCookie("refreshToken", option).
  json(new ApiResponse(200, {fullname : user.fullName}, "User logged out"))
})

export { userRegister, userLogin, userLogout };
