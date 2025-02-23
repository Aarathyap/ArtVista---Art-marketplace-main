import { useContext } from "react"
import { UserContext } from "../context/UserContext" 
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import WorkList from "../components/WorkList";


export default function Wishlist() {

  const { userData } = useContext(UserContext);
  const { user } = useContext(UserContext);
  const wishlist = userData?.wishlist;

  return (
    !user ? (
      <Loader />
    ) : (
      <>
      <Navbar />

      <p className="m-[40px_100px] text-blue-800 font-bold text-3xl">Your Wishlist</p>

      <WorkList data={wishlist} />
      </>
    )
  )
}
