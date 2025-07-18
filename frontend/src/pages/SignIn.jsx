import React, { useContext, useState } from "react";
import bg from "../assets/authBg.png";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { userDataContext } from "../context/UserContext";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { serverUrl, userData, setUserData } = useContext(userDataContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      let result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        {
          email,
          password,
        },
        { withCredentials: true }
      );
      setUserData(result.data);
      setLoading(false);
      navigate("/customize");
    } catch (error) {
      setUserData(null);
      console.log(error);
      setLoading(false);
      setErr(error.response.data.message);
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-cover flex justify-center items-center "
      style={{ backgroundImage: `url(${bg})` }}
    >
      <form
        onSubmit={handleSignIn}
        className="w-[90%] h-[600px] max-w-[500px] bg-[#00000069] backdrop-blur shadow-lg shadow-black-950 flex justify-center items-center flex-col gap-[20px] px-[20px]  "
      >
        <h1 className="text-white text-[30px] font-semibold ">
          Sing In to <span className="text-blue-400"> Virtual Assistant </span>
        </h1>
        <input
          type="email"
          placeholder="Enter your email"
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          className=" w-full h-[60px] outline-none border-2 border-white bg-transparent text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] "
        />
        <div className="w-full h-[60px] border-2 border-white bg-transparent text-white rounded-full text-[18px] relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="password"
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            className="w-full h-full outline-none rounded-full bg-transparent placeholder-gray-300 px-[20px] py-[10px] pr-[50px]"
          />
          {!showPassword && (
            <IoEye
              className="absolute top-1/2 right-[20px] transform -translate-y-1/2 w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
          {showPassword && (
            <IoEyeOff
              className="absolute top-1/2 right-[20px] transform -translate-y-1/2 w-[25px] h-[25px] text-white cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          )}
        </div>
        {err.length > 0 && <p className="text-red-500">*{err}</p>}
        <button
          className=" w-[150px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] mt-[10px] cursor-pointer"
          disabled={loading}
        >
          Sign In
        </button>
        <p className="text-white cursor-pointer  ">
          Want to create a new account ?{" "}
          <span
            className="text-blue-400 text-[18px]"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignIn;
