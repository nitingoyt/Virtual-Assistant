import React, { useContext, useEffect, useRef, useState } from "react";
import { userDataContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import aiImg from "../assets/ai.gif";
import userImg from "../assets/user.gif";
import { CiMenuBurger } from "react-icons/ci";
import { MdCancel } from "react-icons/md";

const Home = () => {
  const { userData, setUserData, serverUrl, geminiResponse } =
    useContext(userDataContext);

  const navigate = useNavigate();
  const [listening, setListening] = useState(false);
  const isSpeakingRef = useRef(false);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const [userText, setUserText] = useState("");
  const [aiText, setAitext] = useState("");
  const [ham, setHam] = useState(false);
  const synth = window.speechSynthesis;

  const handleLogOut = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      setUserData(null);
      navigate("/signup");
    } catch (error) {
      setUserData(null);
      console.log(error);
    }
  };

  const startRecognition = () => {
    if (!isSpeakingRef.current && !isRecognizingRef.current) {
      try {
        recognitionRef.current?.start();
        console.log("Recognition requested to start");
        // setListening(true);
      } catch (error) {
        if (error.name !== "InvalidStateError") {
          console.error("Start error:", error);
        }
      }
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);

    isSpeakingRef.current = true;

    utterance.onend = () => {
      setAitext("");
      isSpeakingRef.current = false;
      setTimeout(() => {
        startRecognition();
      }, 800);
    };
    synth.cancel();
    synth.speak(utterance);
  };

  const handleCommand = (data) => {
    const { type, userInput, response } = data;

    speak(response); // speak the response regardless of type

    if (type === "google_search") {
      const query = encodeURIComponent(userInput);
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }

    if (type === "youtube_search") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }

    if (type === "youtube_play") {
      const query = encodeURIComponent(userInput);
      window.open(
        `https://www.youtube.com/results?search_query=${query}`,
        "_blank"
      );
    }

    if (type === "calculator_open") {
      window.open("https://www.google.com/search?q=calculator", "_blank");
    }

    if (type === "instagram_open") {
      window.open("https://www.instagram.com", "_blank");
    }

    if (type === "facebook_open") {
      window.open("https://www.facebook.com", "_blank");
    }

    if (type === "weather_show") {
      const query = encodeURIComponent(userInput || "weather");
      window.open(`https://www.google.com/search?q=${query}`, "_blank");
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = false;

    recognitionRef.current = recognition;

    let isMounted = true;

    const startTimeOut = setTimeout(() => {
      if (isMounted && !isSpeakingRef.current && !isRecognizingRef.current) {
        try {
          recognition.start();
          console.log("Recognition requested to start");
        } catch (e) {
          if (e.name !== "InvalidStateError") console.error(e);
        }
      }
    }, 1000);

    recognition.onstart = () => {
      isRecognizingRef.current = true;
      setListening(true);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
      setListening(false);

      if (isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition started");
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 1000);
      }
    };

    recognition.onerror = (event) => {
      console.warn("Recognition error:", event.error);
      isRecognizingRef.current = false;
      setListening(false);
      if (event.error === "aborted" && isMounted && !isSpeakingRef.current) {
        setTimeout(() => {
          if (isMounted) {
            try {
              recognition.start();
              console.log("Recognition restarted after error");
            } catch (e) {
              if (e.name !== "InvalidStateError") console.error(e);
            }
          }
        }, 1000);
      }
    };

    recognition.onresult = async (e) => {
      const transcript = e.results[e.results.length - 1][0].transcript.trim();
      // console.log("Heard:" + transcript);
      if (
        transcript.toLowerCase().includes(userData.assistantName.toLowerCase())
      ) {
        setAitext("");
        setUserText(transcript);
        recognition.stop();
        isRecognizingRef.current = false;
        setListening(false);
        const data = await geminiResponse(transcript);
        // console.log(data);
        handleCommand(data);
        setAitext(data.response);
        setUserText("");
      }
    };

    return () => {
      isMounted = false;
      clearTimeout(startTimeOut);
      recognition.stop();
      setListening(false);
      isRecognizingRef.current = false;
    };
  }, []);

  return (
    <div
      className="w-full h-[100vh] bg-gradient-to-t from-[black] to-[#010169] flex justify-center
     items-center flex-col relative gap-[15px] overflow-hidden "
    >
      <CiMenuBurger
        onClick={() => setHam(true)}
        className="absolute lg:hidden text-white top-[20px] right-[20px] w-[25px] h-[25px] "
      />
      <div
        className={`absolute top-0 w-full h-full backdrop-blur-lg bg-[#00000016] p-[20px] items-start ${
          ham ? "translate-x-0" : "translate-x-full"
        } transition-transform`}
      >
        <MdCancel
          onClick={() => setHam(false)}
          className="absolute  text-white top-[20px] right-[20px] w-[25px] h-[25px] "
        />
        <button
          onClick={handleLogOut}
          className=" w-[150px] h-[60px]  top-[20px] right-[20px] bg-white rounded-full text-black font-semibold text-[19px] mt-[10px] cursor-pointer"
        >
          Log Out
        </button>
        <button
          onClick={() => navigate("/customize")}
          className=" w-[150px] h-[60px] bg-white  top-[100px] right-[20px] rounded-full text-black font-semibold text-[19px] mt-[10px] cursor-pointer"
        >
          Customize
        </button>

        <div className="w-full h-[2px] bg-gray-400 "></div>
        <h1 className="text-white font-semibold text-[19px] mt-[10px] mb-[10px]">
          History
        </h1>
        <div className="w-full h-[400px] gap-[20px] overflow-y-auto flex flex-col ">
          {userData.history?.map((his) => (
            <span className="text-gray-200 text-[18px] truncate ">{his}</span>
          ))}
        </div>
      </div>
      <button
        onClick={handleLogOut}
        className=" w-[150px] h-[60px] absolute top-[20px] right-[20px] bg-white rounded-full text-black font-semibold text-[19px] mt-[10px] cursor-pointer hidden lg:block"
      >
        Log Out
      </button>
      <button
        onClick={() => navigate("/customize")}
        className=" w-[150px] h-[60px] bg-white absolute top-[100px] right-[20px] rounded-full text-black font-semibold text-[19px] mt-[10px] cursor-pointer hidden lg:block"
      >
        Customize
      </button>
      <div className=" w-[300px] h-[400px] flex justify-center items-center overflow-hidden shadow-lg  ">
        <img
          src={userData?.assistantImage}
          alt=""
          className="h-full object-cover rounded-4xl  "
        />
      </div>
      {/* <h1 className="text-white text-[18px] font-semibold  ">
        I'm {userData?.assistantName}
      </h1> */}
      <button
        className=" w-[150px] h-[60px] bg-[#ffffff]  rounded-full text-black font-semibold text-[19px] cursor-pointer hidden lg:block"
        onClick={() => {
          recognitionRef.current && recognitionRef.current.start();
        }}
      >
        I'm {userData?.assistantName}
      </button>
      {!aiText && <img src={userImg} alt="" className=" w-[200px] " />}
      {aiText && <img src={aiImg} alt="" className="w-[200px] " />}
      <h1 className="text-white text-[20px] text-wrap font-semibold]">
        {userText ? userText : aiText ? aiText : null}{" "}
      </h1>
    </div>
  );
};

export default Home;
