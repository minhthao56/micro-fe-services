import React, { useEffect, useState, createContext, useContext } from "react";
import { authMobile } from "../firebase/mobile";
import type {User} from "firebase/auth"
import { AuthWithFirebase } from "../firebase/provider";

type AuthContextType = {
  signIn: AuthWithFirebase["signIn"];
  signOut: AuthWithFirebase["signOut"];
  signInWithCustomToken: AuthWithFirebase["signInWithCustomToken"];
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }
  return value;
}

export function SessionProvider(props: {
  children:
    | string
    | number
    | boolean
    | React.ReactElement<any, string | React.JSXElementConstructor<any>>
    | Iterable<React.ReactNode>
    | React.ReactPortal
    | null
    | undefined;
}) {
  const [isLoading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const isAuthenticated = await authMobile.getIsAuthenticated();
        if (isAuthenticated) {
          setIsAuthenticated(true);
          console.log("User is authenticated", isAuthenticated);
          const user = authMobile.getUser();
          setUser(user);
          console.log("uid: ", user?.uid);
        }
      } catch (error) {
        console.log(error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signIn: async (email: string, password: string) => {
            try {
                const userCredential = await authMobile.signIn(email, password);
                const user = userCredential?.user;
                if (user?.uid) {
                  setIsAuthenticated(true);
                  setUser(user);
                }
                return userCredential;

            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        signOut: async () => {
          try {
            await authMobile.signOut();
            setIsAuthenticated(false);
            setUser(null);
          } catch (error) {
            console.log(error);
            throw error;
          }
        },
        signInWithCustomToken: async (token: string) => {
          return await authMobile.signInWithCustomToken(token);
        },

        user,
        isLoading,
        isAuthenticated,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
