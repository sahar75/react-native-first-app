import { getCurrentUser } from "@/lib/appwrite";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { Models } from "react-native-appwrite";

interface IValue {
  isLoggedIn?: boolean;
  setIsLoading?: (value: boolean) => void;
  user?: Models.Document | null;
  setUser?: (value: Models.Document | null) => void;
  isLoading?: boolean;
  setIsLoggedIn?: (value: boolean) => void;
}

const GlobalContext = createContext<IValue>({});

export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }: PropsWithChildren) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<Models.Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        setIsLoading,
        user,
        setUser,
        isLoading,
        setIsLoggedIn,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
