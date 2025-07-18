import React, { useRef } from "react";
import Card from "../components/Card";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.jpg";
import image4 from "../assets/image4.png";
import image5 from "../assets/image5.png";
import image6 from "../assets/image6.jpeg";
import image7 from "../assets/image7.jpeg";
import { MdOutlineArrowBack } from "react-icons/md";
import { MdOutlineCloudUpload } from "react-icons/md";
import { useContext } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Customize = () => {
  const inputImage = useRef();
  const navigate = useNavigate();

  const {
    frontendImage,
    setFrontendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
    setSelectedImage("uploaded");
  };
  return (
    <div className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#2323c5] flex justify-center items-center flex-col ">
      <MdOutlineArrowBack
              className="absolute top-[30px] left-[30px] text-white w-[25px] h-[25px] cursor-pointer "
              onClick={() => navigate("/")}
            />
      <h1 className=" text-white text-[30px] text-center mb-[20px] ">
        Select your <span className=" text-blue-100 ">Assistant Image</span>
      </h1>
      <div className="w-[90%] max-w-[60%] flex justify-center items-center flex-wrap gap-[15px]  ">
        <Card image={image1} />
        <Card image={image2} />
        <Card image={image4} />
        <Card image={image5} />
        <Card image={image6} />
        <Card image={image7} />
        <div
          className=" w-[150px] h-[250px] bg-[#030236] border-2 border-[#0000ff77] rounded-2xl overflow-hidden 
        hover:shadow-2xl hover:shadow-blue-950 cursor-pointer hover:border-4 flex items-center justify-center "
          onClick={() => {
            inputImage.current.click();
          }}
        >
          {!frontendImage && (
            <MdOutlineCloudUpload className=" text-white w-[25px] h-[25px]  " />
          )}
          {frontendImage && (
            <img src={frontendImage} className="h-full object-cover" />
          )}
        </div>
        <input
          type="file"
          accept="image/*"
          ref={inputImage}
          hidden
          onChange={handleImage}
        />
      </div>
      {selectedImage && (
        <button
          onClick={() => navigate("/customize2")}
          className=" w-[150px] h-[60px] bg-white rounded-full text-black font-semibold text-[19px] mt-[10px] cursor-pointer"
        >
          Next
        </button>
      )}
    </div>
  );
};

export default Customize;
