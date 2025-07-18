import genToken from "../config/token.js";
import User from "../modals/user.Modal.js";
import bcrypt from "bcrypt"

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const emailExist = await User.findOne({ email });
    if (emailExist) {
      return res.status(400).json({message: "email already exists"});
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Length must be greater than 6 chars" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `SignUp Error: ${error}` });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email does not exixt !" });
    }

    const passwordIsMatch = await bcrypt.compare(password, user.password);

    if (!passwordIsMatch) {
      return res.status(400).json({ message: "Incorrect Credentials" });
    }

    const token = await genToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "None",
      secure: true,
    });

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `Login Error: ${error}` });
  }
};

export const logOut = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "LogOut Succesfully" });
  } catch (error) {
    return res.status(500).json({ message: `LogOut Error: ${error}` });
  }
};
