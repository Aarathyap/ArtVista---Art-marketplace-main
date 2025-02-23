import { Link } from "react-router-dom";

export default function Success() {


  return (
    <div className="flex flex-col items-center justify-center h-screen bg-sky-100">
      <p className="text-4xl font-bold text-green-500">Payment Successful ✅</p>
      <p className="m-[20px_0px_50px] text-xl">Thank you for your purchase!</p>
      <Link to="/" className="p-3 hover:bg-blue-600 bg-blue-700 text-white font-semibold rounded-md ">CONTINUE SHOPPING</Link>
    </div>
  )
}
