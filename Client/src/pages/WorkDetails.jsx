import { useContext, useEffect, useState } from "react"
import Loader from './../components/Loader';
import Navbar from './../components/Navbar';
import axios from 'axios';
import { IF, Url } from './../url';
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";  
import { FaEdit } from "react-icons/fa";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { MdExpandMore } from "react-icons/md";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { FaHeart } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function WorkDetails() {
  
  const [loading, setLoading] = useState(true);
  const [work, setWork] = useState({});
  const {user} = useContext(UserContext);
  const {setUser} = useContext(UserContext);
  const {userData} = useContext(UserContext);
  const {setUserData} = useContext(UserContext);
  const navigate = useNavigate();

  const toastOptions = {
    position: "bottom-right",
    autoClose: 1500,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const SearchParam = useLocation();
  const Params = SearchParam.search.split("?id=");
  const WorkId = Params[1];

  
  //get work details
  useEffect(()=> {
    const getWorkDetails = async()=> {
      const res = await axios.get(Url+`/api/work/${WorkId}`);
      const workData = await res.data;
      setWork(workData);
      setLoading(false);
    }
    if(WorkId){
      getWorkDetails();
    } 
  }, [WorkId]);

  /* SLIDER FOR PHOTOS */
  const [currentIndex, setCurrentIndex] = useState(0);

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

  
  //Add to wishlist 
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
 

  /* SHOW MORE PHOTOS */
  const [visiblePhotos, setVisiblePhotos] = useState(5);

  const loadMorePhotos = () => {
    setVisiblePhotos(work.workPhotos.length);
  };

  /* SELECT PHOTO TO SHOW */
  const [selectedPhoto, setSelectedPhoto] = useState(0);

  const handleSelectedPhoto = (index) => {
    setSelectedPhoto(index);
    setCurrentIndex(index);
  };

  
  //Add to cart
  const cart = userData?.cart;

  const isInCart = cart?.find((item) => item?.WorkId === WorkId);

  const addToCart = async()=> {
     if(!user){
      navigate("/login");
     }

     const newCartItem = {
      WorkId,
      image: work.workPhotos[0],
      title: work.title,
      category: work.category,
      creator: work.creator,
      price: work.price,
      quantity: 1,
    };

    if(!isInCart){
      const newCart = [...cart, newCartItem];

      try {
        const res = await axios.post(Url+`/api/user/${UserId}/cart`,{
          cart: newCart
        },{withCredentials:true});
        const response = await axios.get(Url+`/api/user/${user._id}`);
        localStorage.setItem("user-details", JSON.stringify(response.data))
        setUserData(await JSON.parse(
          localStorage.getItem("user-details")
        ));
        toast.success("Item added to cart!", toastOptions);
      } catch (error) {
        console.log(error);
      }
    }else {
      toast.warning("This item is already in your cart!", toastOptions);
      return;
    }
  }


  const UserId = user?._id;

  return (
    loading ? (
      <Loader />
    ) : (
      <>
      <Navbar />
      <div className="md:p-[40px_80px_120px] p-[40px_20px_120px]">
        <div className="flex md:flex-row flex-col justify-between md:items-center items-start md:gap-0 gap-4">
           <p className="text-2xl md:text-3xl font-bold">{work.title}</p>
           {work?.creator?._id === UserId ? (
             <div className="flex items-center gap-[10px] cursor-pointer hover:text-red-500"
             onClick={()=> {
              navigate(`/updateWork?id=${WorkId}`)
             }}>
               <FaEdit className="text-xl" />
               <p className="text-xl font-bold">Edit</p>
             </div>
           ) : (
            <div className="flex items-center gap-[10px] cursor-pointer text-2xl"
            onClick={patchWishlist}>
              {isLiked ? (
                <FaHeart className="text-red-500"  />
              ): (
                <FaHeart className="text-gray-300" />
              )}
            </div>
           )}
        </div>

        <div className="max-w-[800px] overflow-hidden rounded-[10px] m-[40px_0]">
          <div className="flex transform duration-300"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
            {work.workPhotos?.map((photo, index)=>(
            <div className="relative flex-[0_0_100%] w-full h-auto flex items-center"  key={index}>
                <img className="w-full h-full shadow-lg shadow-gray-500" src={IF+photo} alt="workPhoto" loading="lazy" />
                <div className="absolute top-2/4 transform p-[6px] rounded-[50%] cursor-pointer flex
                  items-center justify-center bg-[#43ff64d9] z-[99] hover:bg-white left-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevSlide(e);
                  }}>
                 <IoMdArrowDropleft className="text-3xl" />
                </div>
                <div className="absolute top-2/4 transform p-[6px] rounded-[50%] cursor-pointer flex
                  items-center justify-center bg-[#43ff64d9] z-[99] hover:bg-white right-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextSlide(e);
                  }}>
                 <IoMdArrowDropright className="text-3xl" />
                </div>
            </div>
          ))}
          </div>
        </div>

        <div className="flex flex-wrap m-[20px_0px] gap-[10px]">
          {work.workPhotos?.slice(0, visiblePhotos).map((photo, index)=> (
             <img src={IF+photo}
             loading="lazy"
             className={selectedPhoto === index ? "w-[150px] cursor-pointer h-auto border-[3px] border-blue-500 border-solid shadow-md shadow-gray-500" : "w-[150px] cursor-pointer h-auto shadow-md shadow-gray-500"}
             onClick={() => handleSelectedPhoto(index)}
             key={index} 
             alt="work" /> 
          ))}

          {visiblePhotos < work.workPhotos.length && (
            <div className="flex font-semibold flex-col gap-5 items-center justify-center cursor-pointer" onClick={loadMorePhotos}>
             <MdExpandMore className="text-5xl" />
             Show More
            </div>
          )}
        </div>

        <hr className="m-[20px_0px] mt-20 border border-solid border-black" />

        <div className="flex gap-5 items-center cursor-pointer hover:opacity-80 hover:text-gray-600"
        onClick={()=> {
          navigate(`/shop?id=${work.creator._id}`)
        }}>
         <img src={IF+work.creator.profileImage} 
         className="h-14 w-14 rounded-full "
         loading="lazy" alt="profile" />
         <p className="font-sans text-xl font-semibold">Created by {work.creator.username}</p>
        </div>

        <hr className="m-[20px_0px] mb-16 border border-solid border-black" />

        <p className="text-xl font-semibold">About this product</p>
        <p className="max-w-[800px] m-[20px_0px_40px]">{work.description}</p>

        <p className="text-3xl font-bold">₹{work.price}</p>
        <button className="mt-12 flex items-center gap-1 text-xl font-semibold p-3 bg-blue-500 text-white
        rounded-lg hover:bg-blue-400" onClick={addToCart}>
         <RiShoppingCart2Fill />
         ADD TO CART
        </button>
        <ToastContainer />
      </div>
      </>
    )
  )
}
