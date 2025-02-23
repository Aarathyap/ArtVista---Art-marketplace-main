import { useContext, useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { useNavigate } from "react-router-dom";
// import { IF } from "../url"; 
import { UserContext } from './../context/UserContext';
import { BiSolidTrashAlt } from "react-icons/bi";
import  axios  from 'axios';
import { Url } from './../url';
import { FaHeart } from "react-icons/fa";


export default function WorkCard({ work }) {

  const { user }= useContext(UserContext);
  const { userData }= useContext(UserContext);
  const { setUserData }= useContext(UserContext);
  const If ='http://localhost:5000/'
  
  const UserId = user?._id;

  //Photo Slider  
  const [currentIndex, setCurrentIndex] = useState(0) 

  const navigate = useNavigate();

  const goToNextSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % work.workPhotos.length
    );
  };

  const goToPrevSlide = () => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + work.workPhotos.length) %
        work.workPhotos.length
    );
  };
  

 //Delete work
 const handleDelete = async()=> {
  const hasConfirmed = confirm("Are you sure you want to delete this work?");

  if(hasConfirmed){
    try {
      await axios.delete(Url+`/api/work/${work._id}`, {withCredentials: true});
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  }
 } 


 //add to wishlist
 const wishlist = userData?.wishlist;
 const isLiked = wishlist?.find((item) => item?._id === work._id);

 const patchWishlist = async()=> {
  if(!user){
    navigate("/login");
    return;
  }
  
  const res  = await axios.patch(Url+`/api/user/${UserId}/wishlist/${work._id}`);
  const response = await axios.get(Url+`/api/user/${user._id}`);
  localStorage.setItem("user-details", JSON.stringify(response.data))
        setUserData(await JSON.parse(
          localStorage.getItem("user-details")
        ));
 }
 work.workPhotos?.map((photo, index)=> {
  console.log(`/${photo}`)})
    
  return (
    <div className="relative p-[10px] rounded-[10px] hover:shadow-lg"
    onClick={()=> navigate(`/workDetails?id=${work._id}`)}>
      <div className="w-[360px] overflow-hidden rounded-[10px] mb-[10px]">
        <div className="flex duration-200" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {work.workPhotos?.map((photo, index)=> (
              
                <div className="relative flex-[0_0_100%] w-full h-[270px] flex items-center" key={index}>
                  <img className="w-full h-full" loading="lazy" src={`http://localhost:5000/${photo}`} alt="work" />
                  <div 
                  className="absolute top-2/4 transform p-[6px] rounded-[50%] cursor-pointer flex
                  items-center justify-center bg-[#43ff64d9] z-[99] hover:bg-white left-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevSlide(e);
                  }}>
                   <IoMdArrowDropleft className="text-2xl" />
                  </div>
                  <div className="absolute top-2/4 transform p-[6px] rounded-[50%] cursor-pointer flex
                  items-center justify-center bg-[#43ff64d9] z-[99] hover:bg-white right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextSlide(e);
                  }}>
                   <IoMdArrowDropright className="text-2xl" />
                  </div>
                </div>
            ))}
        </div>
      </div>
       <div className="flex justify-between items-center p-[15px_0px]">
        <div>
        <p className="text-lg mb-1">{work.title.slice(0,30)+"..."}</p>
        <div className="flex items-center gap-1">
            <img 
            loading="lazy"
            className="w-10 h-10 rounded-full"
            src={If+work.creator.profileImage} alt="profilePic" />
            <p className="text-[15px] font-semibold">{work.creator.username}</p>in
            <p className="text-[15px] font-semibold">{work.category}</p>
        </div>  
        </div>
        <div className="bg-blue-200 p-[10px] font-bold text-[17px]">₹{work.price}</div>
       </div>
       {UserId === work?.creator._id ? (
         <div 
         className="absolute right-5 top-5 cursor-pointer text-xl z-[999]"
         onClick={(e) => {
          e.stopPropagation();
          handleDelete();
        }}>
        <BiSolidTrashAlt className="text-3xl p-1 bg-white rounded-full hover:text-4xl transform" />
         </div>
       ) : (
        <div
        className="absolute right-5 top-5 cursor-pointer text-xl z-[999]"
          onClick={(e) => {
            e.stopPropagation();
            patchWishlist();
          }}>
           {isLiked ? (
                <FaHeart className="text-red-500 p-1 bg-white rounded-full text-3xl hover:text-4xl"  />
              ): (
                <FaHeart className="text-gray-300 p-1 bg-white rounded-full text-3xl hover:text-4xl" />
              )}
        </div>
       )}
    </div>
  )
}
