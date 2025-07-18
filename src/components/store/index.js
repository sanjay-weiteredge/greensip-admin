import { createContext, useContext, useEffect, useState } from "react";

export const UserContext = createContext({
  userInfo: null,
  updateUser: () => {},
});

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }) {
  const [userInfo, setUserInfo] = useState(null);

  const updateUser = (newUser) => {
    setUserInfo(newUser);
    if (newUser) {
      localStorage.setItem("userInfo", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("userInfo");
    }
  };

  useEffect(() => {
    const storedData = localStorage.getItem("userInfo");
    if (storedData) {
      try {
        setUserInfo(JSON.parse(storedData));
      } catch {
        setUserInfo(null);
      }
    }
  }, []);

  useEffect(() => {
    console.log("[UserProvider] userInfo:", userInfo);
  }, [userInfo]);

  return (
    <UserContext.Provider value={{ userInfo, updateUser }}>
      {children}
    </UserContext.Provider>
  );
}
