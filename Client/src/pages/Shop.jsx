import { useContext, useEffect, useState } from "react";
import Loader from "../components/Loader";
import { UserContext } from "../context/UserContext"; 
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Url } from "../url";
import Navbar from "../components/Navbar";
import WorkList from "../components/WorkList";


export default function Shop() {

  const [loading, setLoading] = useState(true);
  const {user} = useContext(UserContext);

  const loggedInUserId = user?._id;

  const SearchParam = useLocation();
  const Params = SearchParam.search.split("?id=");
  const profileId = Params[1];

  const [workList, setWorkList] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(()=> {
    const getWorkList = async()=> {
      const res  = await axios.get(Url+`/api/user/${profileId}/shop`);
      const data = await res.data;
      setWorkList(data.workList);
      setProfile(data.user);
      setLoading(false);
    }
    if(profileId){
      getWorkList();
    }
  }, [profileId]);

  return (
    loading ? (
      <Loader />
    ) : (
      <>
      <Navbar />

      {loggedInUserId === profileId && (
        <p className="m-[40px_100px] text-blue-800 font-bold text-3xl">Your works</p>
      )}

      {loggedInUserId !== profileId && (
        <p className="m-[40px_100px] text-blue-800 font-bold text-3xl">{profile.username}&apos;s Works</p>
      )}

      <WorkList data={workList} />
    </>
    )
  )
}
