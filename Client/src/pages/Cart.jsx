import { useContext } from 'react';
import { UserContext } from './../context/UserContext';
import Navbar from './../components/Navbar';
import Loader from './../components/Loader';
import { IF, Url } from '../url';
import axios from "axios";
import { MdAddCircleOutline } from "react-icons/md";
import { MdRemoveCircleOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { Link } from "react-router-dom";
import { BsArrowLeftCircle } from "react-icons/bs";



export default function Cart() {

  const { user } = useContext(UserContext);
  const { userData } = useContext(UserContext);
  const { setUserData } = useContext(UserContext);
  const cart = userData?.cart;
  const userId = user?._id;

  const updateCart = async(cart)=> {
    try {
      const res = await axios.post(Url+`/api/user/${userId}/cart`,{ cart }, {withCredentials: true});
      const response = await axios.get(Url+`/api/user/${user._id}`);
      localStorage.setItem("user-details", JSON.stringify(response.data))
        setUserData(await JSON.parse(
          localStorage.getItem("user-details")
        ));
    } catch (error) {
      console.log(error);
    }
  }

  const calcSubtotal = (cart) => {
    return cart?.reduce((total, item) => {
      return total + item.quantity * item.price;
    }, 0);
  };

  const increaseQty = (cartItem) => {
    const newCart = cart?.map((item) => {
      if (item === cartItem) {
        item.quantity += 1;
        return item;
      } else return item;
    });
    updateCart(newCart);
  };

  const decreaseQty = (cartItem) => {
    const newCart = cart?.map((item) => {
      if (item === cartItem && item.quantity > 1) {
        item.quantity -= 1;
        return item;
      } else return item;
    });
    updateCart(newCart);
  };

  const removeFromCart = (cartItem) => {
    const newCart = cart.filter((item) => item.WorkId !== cartItem.WorkId);
    updateCart(newCart);
  };

  const subtotal = calcSubtotal(cart);
  
  const handleCheckout = async()=> {
    
    const response = await axios.post(Url+"/api/stripe", { cart })

    if (response.status === 500) {
      return
    }
    if(response.status === 200){
      const res = await axios.post(Url+"/api/order", { cart, userId, subtotal });
      localStorage.setItem("user-details", JSON.stringify(res.data))
        setUserData(await JSON.parse(
          localStorage.getItem("user-details")
        ));
    }
    const { url } = await response.data
    console.log(url);
     window.location = url;
  }
  

  return (
    !userData?.cart ? <Loader /> : (
      <>
      <Navbar />
      <div className='flex justify-center items-center m-[50px_0px] '>
       <div className='w-[90%] p-[60px_10px] md:p-[60px] bg-gray-300 flex flex-col'>
         <div className='flex flex-col md:flex-row justify-between items-start md:gap-0 gap-4 md:items-center m-[0_0_60px]'>
           <p className='text-4xl font-bold'>Your Cart</p>
           <p className='text-3xl text-gray-500 font-bold'>
           Subtotal: <span className='text-red-500'>₹{subtotal}</span>
           </p>
         </div>

         {cart?.length === 0 && <h3>Empty Cart</h3>}

         {cart?.length > 0 && (
          <div className='flex flex-col gap-9'>
            {cart?.map((item, index)=> (
              <div key={index} className="flex items-center">
                 <div className='flex flex-[3] gap-5 items-center text-[13px]'>
                   <img src={IF+item.image} className='w-[80px] h-[80px] rounded-[5px]' loading='lazy' alt="product" />
                   <div className='flex flex-col gap-1'>
                      <p className='font-bold text-base md:text-2xl'>{item.title}</p>
                      <p>Category: {item.category}</p>
                      <p>Seller: {item.creator.username}</p>
                   </div>
                 </div>

                 <div className='flex flex-[1] items-center md:gap-[9px] gap-[3px] text-[22px] font-bold'>
                  <MdRemoveCircleOutline className='md:text-2xl text-lg  md:hover:text-3xl transform text-gray-600 cursor-pointer'
                  onClick={()=> decreaseQty(item)} />
                  <p>{item.quantity}</p>
                  <MdAddCircleOutline
                  onClick={()=> increaseQty(item)}
                  className='md:text-2xl text-lg md:hover:text-3xl transform text-gray-600 cursor-pointer' />
                 </div>

                 <div className='flex flex-[1] items-center gap-[7px] flex-col justify-center'>
                  <p className='md:text-3xl text-xl font-bold '>₹{item.quantity * item.price}</p>
                  <p className='text-gray-700'>₹{item.price} / each</p>
                 </div>

                 <div className='flex flex-[0.5] justify-end'>
                   <MdDelete onClick={() => removeFromCart(item)} className='cursor-pointer md:text-2xl md:hover:text-3xl' />
                 </div>
              </div>
            ))}

            <div className='flex justify-between items-center m-[30px]'>
              <Link className='flex items-center gap-[10px] text-lg font-medium hover:text-red-500' to="/">
                  <BsArrowLeftCircle /> Continue Shopping
              </Link>
              <button onClick={handleCheckout} className='p-2 bg-blue-500 rounded-md text-white
              font-bold shadow-md hover:bg-blue-400'>CHECK OUT NOW</button>
            </div>
          </div>
         )}
       </div>
      </div>
      </>
    )
  )
}
