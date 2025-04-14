import { createContext, useContext, useState } from "react";

const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [sharedData, setSharedData] = useState([]);
  console.log("profile name",sharedData)

  return (
    <DataContext.Provider value={{ sharedData, setSharedData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
