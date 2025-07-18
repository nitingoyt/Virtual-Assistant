import React, { useContext, useState } from "react";
import { userDataContext } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MdOutlineArrowBack } from "react-icons/md";

const Customize2 = () => {
  const { userData, backendImage, selectedImage, serverUrl, setUserData } =
    useContext(userDataContext);
  const [assistantName, setAssistantName] = useState(
    userData?.AssistantName || ""
  );

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUpdateAssistant = async () => {
    setLoading(true )
    try {
      const formData = new FormData();
      formData.append("assistantName", assistantName);
      if (backendImage) {
        formData.append("assistantImage", backendImage);
      } else {
        formData.append("imageUrl", selectedImage);
      }
      const result = await axios.post(
        `${serverUrl}/api/user/update`,
        formData,
        { withCredentials: true }
      );
setLoading(false)
      console.log(result.data);
      setUserData(result.data);
      navigate("/");
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#2323c5] flex justify-center
     items-center flex-col relative "
    >
      <MdOutlineArrowBack
        className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer "
        onClick={() => navigate("/customize")}
      />
      <h1 className=" text-white text-[30px] text-center mb-[20px] ">
        Enter your <span className=" text-blue-100 ">Assistant Name</span>
      </h1>
      <input
        type="text"
        placeholder="eg:Rani"
        required
        value={assistantName}
        onChange={(e) => setAssistantName(e.target.value)}
        className=" w-full max-w-[600px] h-[60px] outline-none border-2 border-white bg-transparent
         text-white placeholder-gray-300 px-[20px] py-[10px] rounded-full text-[18px] "
      />
      {assistantName && (
        <button
          disabled={loading}
          onClick={handleUpdateAssistant}
          className=" w-[150px] h-[60px] mt-[30px] bg-white rounded-full text-black 
          font-semibold text-[19px]  cursor-pointer"
        >
          Create
        </button>
      )}
    </div>
  );
};

export default Customize2;
