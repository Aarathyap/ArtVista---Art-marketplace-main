import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { Url } from "../url"; 

export const UserContext = createContext({})

// eslint-disable-next-line react/prop-types
export function UserContextProvider({children}){

    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(()=>{
        getUser()
        getUserData()
      },[])


    const getUser = async()=>{
        try{
          const res = await axios.get(Url+"/api/auth/refetch",{withCredentials:true})
          setUser(res.data);
        }
        catch(err){
          console.log(err)
        }
      }

    const getUserData = async ()=> {
      setUserData(await JSON.parse(
        localStorage.getItem("user-details")
      ))
    }   
      

      return (<UserContext.Provider value={{user,setUser,userData, setUserData}}>
        {children}
      </UserContext.Provider>)
}