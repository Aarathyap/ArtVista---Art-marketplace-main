import Bg from "../assets/register.jpg";
import UploadPic from "../assets/addImage.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { Url } from "../url"; 


export default function Register() {

  const [ formData, setFormData ] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: ""
  }); 
  const [ file, setFile ] = useState(null); 
  const navigate = useNavigate();
  

  const toastOptions = {
    position: "bottom-right",
    autoClose: 1500,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleChange = (e)=> {
     setFormData({...formData, [e.target.name] : e.target.value})
  }

  const handleSubmit = async(e)=> {
    e.preventDefault();
    if(handleValidation()){
      const data = new FormData()
      const filename = Date.now()+file.name
      data.append("img",filename)
      data.append("file",file)
      const profile = filename;
        const { password, email, username } = formData;
        if(file){
            try{
              const imgUpload = await axios.post(Url+"/api/upload",data);
            }
            catch(err){
              console.log(err)
            }
          }
        try {
            const res = await axios.post(Url+"/api/auth/register", {
                username,
                password,
                email,
                profile
            })
            if(res.status === 200){
                navigate("/login");
            }
        } catch (error) {
            console.log(error);
        }  
    }
  }


  const handleValidation = ()=> {
    const { password, email, username, confirmPassword } = formData;
    if(password != confirmPassword){
      toast.error("Password and confirm password should be same!", toastOptions);
      return false;
    }
    else if(email === ""){
      toast.error("Email should not be empty!", toastOptions);
      return false;
    }
    else if(username.length < 3 ){
      toast.error("Username should not be smaller than 3 characters!", toastOptions);
      return false;
    }
    else if(password.length < 6){
      toast.error("Password should be 6 characters or more!", toastOptions);
      return false;
    }
    else if(file === null ){
      toast.error("Profile photo required!", toastOptions);
      return false;
    }
    return true;
  }



  return (
    <div className="h-screen bg-[#FDF5DF] flex justify-center items-center">
      <img
       src={Bg}
       loading="lazy"
       alt="bgPic"
       className="hidden md:block rounded-l-md h-[550px] w-[300px]" />
      <div className="bg-gray-700 h-[550px] w-[70%] md:w-[35%] flex flex-col justify-center items-center rounded md:rounded-r-md"> 
        <form 
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-[70%] text-white" autoComplete="off">
          <input className="w-full bg-transparent outline-none p-2 border border-gray-300" 
          name="username"
          onChange={handleChange}
          type="text" placeholder="Username" />
          <input
          onChange={handleChange}
           className="w-full bg-transparent outline-none p-2 border border-gray-300"
           name="email"
          type="email" placeholder="Email" 
          />
          <input
          onChange={handleChange}
          name="password"
          className="w-full bg-transparent outline-none p-2 border border-gray-300"
          type="password" placeholder="Password" />
          <input
          onChange={handleChange}
          name="confirmPassword"
          className="w-full bg-transparent outline-none p-2 border border-gray-300"
          type="password" placeholder="Confirm Password" />
          <input
            id="image"
            type="file"
            name="profileImage"
            onChange={(e)=>setFile(e.target.files[0])}
            accept="image/*"
            className="hidden"
          />
          <label htmlFor="image" className="flex flex-col justify-center gap-2 items-center cursor-pointer" >
            <img src={UploadPic} alt="add profile" height={25} width={25} />
            <p>Upload Profile Photo</p>
          </label>
           {file && (
            <img
              src={URL.createObjectURL(file)}
              alt="Profile"
              width={80}
              height={100}
            />
          )}
          <button 
          type="submit"
          className="bg-blue-500 w-64 p-1 rounded-md font-semibold hover:bg-blue-400">Register</button>
          <a href="/login" className="hover:underline">Already have an account? Log In Here</a>
        </form>
      </div>
      <ToastContainer />
    </div>
  )
}
