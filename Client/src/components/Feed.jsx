import { useEffect, useState } from "react"
import Loader from './Loader';
import { categories } from './../data';
import axios from "axios";
import { Url } from './../url';
import WorkList from "./WorkList";


export default function Feed() {
    const [loading, setLoading] = useState(true);

    const [selectedCategory, setSelectedCategory] = useState("All");

    const [workList, setWorkList] = useState([]);

    const getWorkList = async()=> {
        const res = await axios.get(Url+`/api/work/list/${selectedCategory}`)
        const data = await res.data;
        setWorkList(data);
        setLoading(false);
    }
     
    useEffect(()=> {
        getWorkList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedCategory])



  return (
       loading ? (
         <Loader />
       ) : (
         <>
          <div className="flex flex-wrap justify-center items-center gap-12 p-[20px_30px] mb-[60px]
          border border-solid border-black border-[1px_0px_1px_0px]">
          {categories?.map((item, index)=>(
            <p
            onClick={()=> setSelectedCategory(item)}
            className={`${item === selectedCategory ? "text-red-500 font-semibold text-xl cursor-pointer" : "font-semibold text-xl cursor-pointer hover:text-red-500"}`}
            key={index}>{item}</p>
          ))}
          </div>
          <WorkList data={workList} />
         </>
       )
  )
}
