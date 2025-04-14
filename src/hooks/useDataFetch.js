import { useEffect, useRef, useState } from "react";
import { useApi } from "./useApi";

const useDataFetch = (url) => {
  const [userData, setUserData] = useState([]);
  const [isLoding, setIsLoding] = useState(false);
  const [isError, setIsError] = useState(false);
  const {request} = useApi();
  console.log("url>>>",url)

  async function userdata() {
    setIsLoding(true);


    try {
      const response = await request({
        endpoint: url,
        method: "GET"
      });
      console.log("data response >>>>>", response);
      setUserData(response.data);
      setIsLoding(false);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        console.warn("403 Forbidden: Clearing localStorage and redirecting...");
        localStorage.clear();
        window.location.reload(); 
      }
      setIsError(error.message || "An error occurred while fetching data");
    } finally {
      setIsLoding(false);
    }
  }

  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    userdata();
  }, [url]);
  

  return [userData,isLoding, isError];
};

export default useDataFetch;
