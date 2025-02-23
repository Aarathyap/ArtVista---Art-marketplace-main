import { useContext, useState } from "react";
import Form from "../components/Form";
import Navbar from "../components/Navbar";
import { UserContext } from "../context/UserContext"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Url } from "../url";


export default function CreateWork() {

  const [work, setWork] = useState({
    creator: "",
    category: "",
    title: "",
    description: "",
    price: "",
    photos: []
  });
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 1500,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  if(user){
    work.creator = user._id;
  }
  
  const handleValidation = ()=> {
    const {category, title, description, price, photos} = work;
    if(title === ""){
      toast.error("Please provide a title!", toastOptions);
      return false;
    }
    else if(description === ""){
      toast.error("Please provide description!", toastOptions);
      return false;
    }
    else if(price === ""){
      toast.error("Price should not be empty!", toastOptions);
      return false;
    }
    else if(category === ""){
      toast.error("Please choose a category!", toastOptions);
      return false;
    }
    else if(photos.length === 0){
      toast.error("Minimum one photo is required!", toastOptions);
      return false;
    }
    return true;
  }

  const handleSubmit= async(e)=> {
    e.preventDefault()
    const {creator,category, title, description, price, photos} = work;
  
    if(handleValidation()){
      const pictures = [];
      for(let i=0; i < photos.length; i++){
        const photo = photos[i];
        const filename = Date.now()+photo.name
        const data = new FormData();
        data.append("img",filename)
        data.append("files", photo)
        pictures.push(filename)
        try {
          const imgUpload = await axios.post(Url+"/api/multiUpload",data);
         } catch (error) {
           console.log(error);
         }
     } 
       try {
        const res = await axios.post(Url+"/api/work/create",{
          creator,
          category, 
          title, 
          description, 
          price, 
          pictures   
        }, {withCredentials:true});
        if(res.status === 200){
          navigate("/");
        }
      } catch (error) {
        console.log(error);
      } 
  }
}

  return (
    <>
      <Navbar />
      <Form
       type="Create"
       work={work}
       setWork={setWork}
       handleSubmit={handleSubmit}
       note=""
      />
    </>
  )
}
