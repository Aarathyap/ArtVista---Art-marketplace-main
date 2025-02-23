import { useContext, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Bg from "../assets/login.jpg";
import { useNavigate } from "react-router-dom"; 
import axios from "axios";
import { Url } from "../url";
import { UserContext } from "../context/UserContext"; 

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {setUser} = useContext(UserContext);
  const {setUserData} = useContext(UserContext);

  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 1500,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  
  const handleSubmit = async(e)=> {
    e.preventDefault();
    if(handleValidation()){
      try {
        const res = await axios.post(Url+"/api/auth/login", {
          email,
          password
        },{withCredentials:true})
        if(res.status === 200){
          setUser(res.data);
          localStorage.setItem("user-details", JSON.stringify(res.data))
          setUserData(await JSON.parse(
            localStorage.getItem("user-details")
          ));
          navigate("/");
        }
      } catch (error) {
        console.log(error);
        toast.error(
          "Something went wrong! Check your credentials or try again later!",
          toastOptions
        );
      }
    }
  }

  const handleValidation = ()=> {
    if(password === ""){
      toast.error(
        "Email and password is required.",
        toastOptions
      );
     return false;
     } else if (email.length === "") {
      toast.error(
        "Email and password is required.",
        toastOptions
      );
      return false;
    } 
    return true;
  }



  return (
    <div className="h-screen flex justify-center items-center bg-sky-200 text-white">
      <img alt="background" loading="lazy" src={Bg} height={450} width={300} className="hidden md:block rounded-l-md"  />
      <div className="w-[70%] md:w-[35%] bg-gray-700 gap-5 h-[450px] flex flex-col justify-center items-center rounded md:rounded-r-md">
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-5 w-[70%] text-white" autoComplete="off">
        <input
          onChange={(e) => setEmail(e.target.value)}
           className="w-full bg-transparent outline-none p-2 border border-gray-300"
           name="email"
          type="email" placeholder="Email" 
          />
          <input
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          className="w-full bg-transparent outline-none p-2 border border-gray-300"
          type="password" placeholder="Password" />
          <button 
          type="submit"
          className="bg-blue-500 w-64 p-1 rounded-md font-semibold hover:bg-blue-400">Log In</button>
        </form>
          <a className="hover:underline" href="/register">Don&apos;t have an account? Sign Up Here</a>
      </div>
      <ToastContainer />
    </div>
  )
}
