import Navbar from './../components/Navbar';
import { UserContext } from '../context/UserContext'; 
import { useContext } from 'react';
import { IF } from "../url";


export default function Order() {
  
  const { userData } = useContext(UserContext); 
  
  const orders = userData?.orders;

  return (
    <>
     <Navbar />
     <div className='m-[50px_100px_70px] md:m-[50px_20px_70px] flex flex-col items-center md:items-start'>
     <p className='text-4xl font-bold text-blue-700'>Your Orders</p>
     <div className='flex flex-col gap-[30px] max-w-[700px] min-w-[380px] m-[50px_0px]'>
      {orders?.map((order, index) => (
         <div className='flex flex-col gap-[10px] p-[30px] bg-gray-400 rounded-xl' key={index}>
            <div className='flex justify-between items-center'> 
            <p className='font-bold text-xl'>Total Paid: ₹{order.amountPaid}</p>
            </div>

            <div className='flex flex-col gap-5'>
             {order.orderItems.map((item, index) =>(
                <div className='flex justify-between items-center' key={index}>
                <div className='gap-5 flex items-center'>
                  <img className='w-[80px] h-[80px]' src={IF+item.image} alt={item.title} />
                  <div>
                    <p className='text-lg font-bold mb-[10px]'>{item.title}</p>
                  </div>
                </div>

                <div className='flex flex-col gap-[10px] items-center'>
                   <p className='font-bold text-xl'>Price: ₹{item.price}</p> 
                   <p>Quantity: {item.quantity}</p>
                </div>
                </div>
             ))}
            </div>
         </div>
      ))}
     </div>
    </div> 
    </>
  )
}
