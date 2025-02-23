import { Link } from "react-router-dom";
import Logo from "../assets/Logo.jpeg";
import { BsSearch } from "react-icons/bs";
import { RiShoppingCart2Fill } from "react-icons/ri";
import { IoPersonCircle } from "react-icons/io5";
import { MdMenu } from "react-icons/md";
import { useContext, useState } from "react";
import { UserContext } from './../context/UserContext';
import { IF } from "../url"; 
import  axios from 'axios';
import { Url } from './../url';
import { useNavigate } from "react-router-dom"; 
import { TbLogout2 } from "react-icons/tb";


export default function Navbar() {

  const [dropDownMenu , setDropDownMenu] = useState(false);

  const {user}= useContext(UserContext);
  const {setUser} = useContext(UserContext);
  const {userData} = useContext(UserContext);
  const {setUserData} = useContext(UserContext);

  const navigate = useNavigate();

  const handleLogout = async()=> {
    try {
      // eslint-disable-next-line no-unused-vars
      const res = await axios.get(Url+"/api/auth/logout",{withCredentials:true});
      setUser(null);
      setUserData(null);
      localStorage.clear();
      navigate("/")
    } catch (error) {
      console.log(error);
    }
  }
  
  const [query, setQuery] = useState('')

  const searchWork = async () => {
    navigate(`/search/${query}`)
  }

  const cart = userData?.cart;


  return (
    <div className="bg-white flex justify-between gap-1 mt-1 md:mt-0 items-center relative p-[0px_2px] md:p-[0px_50px]">

        {/* Logo */}
      <Link to="/">
       <img src={Logo} loading="lazy" className="w-20 md:w-32 hover:opacity-75 mb-2" alt="logo" />
      </Link>

      {/* Search */}
      <div className="h-10 md:h-12 w-[180px] mt-0 md:mt-5 flex items-center rounded-3xl md:w-[300px] border border-solid
        border-gray-400 hover:shadow-md">
        <input type="text" className="p-3 w-[80%] md:w-[90%] h-full outline-none rounded-3xl" placeholder="Search"
        value={query} onChange={(e) => setQuery(e.target.value)} />
        <BsSearch className="text-red-500 cursor-pointer hover:text-red-700 md:p-0"
        onClick={searchWork} />
      </div>

      {/* Nav Links */}
      <div className="flex items-center gap-3 mt-0 md:mt-4 md:gap-5 md:mr-10">
       {user && (
        <Link className="font-bold text-gray-500 md:text-base text-sm items-center flex md:p-[5px_15px]
        border border-solid border-gray-300 rounded-xl gap-1 hover:shadow-md p-[5px_8px]" to="/cart">
        <RiShoppingCart2Fill className="text-xl md:text-3xl" />
        Cart<span> ({cart?.length})</span>
        </Link>
       )}
       <button className="flex items-center gap-3 hover:opacity-80" onClick={()=>setDropDownMenu(!dropDownMenu)}>
       <MdMenu className="text-2xl md:text-4xl text-gray-500" />
       {!user ? (
        <IoPersonCircle className="text-2xl md:text-4xl text-gray-500" />
       ) : (
        <img src={IF+user.profileImage} alt="profilePic" className="w-6 h-6 md:w-9 md:h-9 rounded-full" />
       )} 
       </button>

       {dropDownMenu && !user && (
          <div className="absolute right-5 md:right-16 top-16 md:top-20 flex flex-col bg-white w-52
          p-[5px_0px] md:p-[10px_0px] border border-solid border-gray-400 z-[9999] rounded-2xl shadow-md md:text-base text-sm">
            <Link className="p-[8px_15px] font-medium hover:text-gray-500" to="/login">Log In</Link>
            <Link className="p-[8px_15px] font-medium hover:text-gray-500" to="/register">Sign Up</Link>
          </div>
        )}

       {dropDownMenu && user && (
          <div className="absolute right-5 md:right-16 top-16 md:top-20 flex flex-col bg-white w-52
         p-[5px_0px] md:p-[10px_0px] border border-solid border-gray-400 z-[9999] rounded-2xl shadow-md md:text-base text-sm">
            <Link className="p-[8px_15px] font-medium hover:text-gray-500" to="/wishlist">Wishlist</Link>
            <Link className="p-[8px_15px] font-medium hover:text-gray-500" to="/cart">Cart</Link>
            <Link className="p-[8px_15px] font-medium hover:text-gray-500" to="/order">Orders</Link>
            <Link className="p-[8px_15px] font-medium hover:text-gray-500" to={`/shop?id=${user._id}`}>Your Shop</Link>
            <Link className="p-[8px_15px] font-medium hover:text-gray-500" to="/createWork">Sell Your Work</Link>
            {user?.role === "admin" && (
              <button
                className="p-[8px_15px] font-medium hover:text-gray-500 text-red-600"
                onClick={() => {
                  console.log("Navigating to Admin Panel..."); // Debugging log
                  navigate("/admin");
                }}
              >
                Admin Panel
              </button>
            )}

            <button className="p-[8px_15px] font-medium hover:text-gray-500 flex items-center ml-10" onClick={handleLogout}><TbLogout2 />&nbsp;Log Out</button>

          </div>
        )}

       </div>

    </div>
  )
}
