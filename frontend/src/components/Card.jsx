import React, { useContext } from "react";
import { userDataContext } from "../context/UserContext";

const Card = ({ image }) => {
  const {
    frontendImage,
    setFrontendImage,
    backendImage,
    setBackendImage,
    selectedImage,
    setSelectedImage,
  } = useContext(userDataContext);
  return (
    <div
      className={`w-[150px] h-[250px] bg-[#030236] border-2 border-[#0000ff77] rounded-2xl overflow-hidden hover:shadow-2xl
     hover:shadow-blue-950 cursor-pointer hover:border-4, hover:border-black`}
      onClick={() => {
        setSelectedImage(image);
        setBackendImage(null);
        setFrontendImage(null);
      }}
    >
      <img src={image} alt="" className="h-full object-cover" />
    </div>
  );
};

export default Card;
