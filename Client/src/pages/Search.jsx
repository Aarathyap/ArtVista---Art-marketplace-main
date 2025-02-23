import { useEffect, useState } from "react"
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useLocation } from "react-router-dom"; 
import axios from "axios";
import { Url } from "../url";
import WorkList from "../components/WorkList";


export default function Search() {

    const SearchParam = useLocation();
    const path = SearchParam.pathname.split("/search/");;
    const query = path[1]

  const [loading, setLoading] = useState(true);

  const [workList, setWorkList] = useState([]);

  const getWorkList = async () => {
    try {
       const res = await axios.get(Url+`/api/work/search/${query}`);
       const data = res.data;
       setWorkList(data);
       setLoading(false);
    } catch (error) {
        console.log(error);
    }
  }

  
  useEffect(()=> {
    getWorkList();
  }, [query]);


  return (
    loading ? (
        <Loader />
    ) : (
        <>
        <Navbar />

        <p className="m-[40px_100px] text-blue-800 font-bold text-3xl"></p>

        <WorkList data={workList} />
        </>
    )
  )
}
