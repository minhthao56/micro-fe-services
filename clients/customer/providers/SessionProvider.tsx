import React, { useEffect, useState, createContext, useContext, useCallback } from "react";
import { authMobile } from "utils/firebase/mobile";
import type { User, ParsedToken } from "firebase/auth";
import { AuthWithFirebase } from "utils/firebase/provider";
import { setToken } from "../services/initClient";
import { whoami } from "../services/usermgmt/user";
import { Alert } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface CustomClaims extends ParsedToken {
  customer_id: string;
  db_user_id: string;
  driver_id: string;
}

type AuthContextType = {
  signIn: AuthWithFirebase["signIn"];
  signOut: AuthWithFirebase["signOut"];
  signInWithCustomToken: AuthWithFirebase["signInWithCustomToken"];
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  claims: CustomClaims | null;
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
  const [claims, setClaims] = useState<CustomClaims | null>(null);

  const checkAuthenticated = useCallback(async () => {
    setLoading(true);
      try {
        const isAuthenticated = await authMobile.getIsAuthenticated();
        if (isAuthenticated) {
          setIsAuthenticated(true);
          console.log("User is authenticated", isAuthenticated);
          const user = authMobile.getUser();
          console.log("uid: ", user?.uid);
          setUser(user);

          const getIdTokenResult = await user?.getIdTokenResult(true);
          console.log("token: ", getIdTokenResult?.token);
          setToken( getIdTokenResult?.token || "");

          const claims = getIdTokenResult?.claims as CustomClaims
          setClaims(claims);
          console.log("customer_id: ", claims.customer_id);
          const userDB = await whoami();
          await AsyncStorage.setItem("userDB", JSON.stringify(userDB.results));
          
        }
      } catch (error: any) {
        console.log(error);
        Alert.alert("Error", error.message);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
  }, []);

  useEffect(() => {
    checkAuthenticated();
  }, [checkAuthenticated]);

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
            setIsAuthenticated(false);
            console.error(error);
            throw error;
          }
        },
        signOut: async () => {
          try {
            await authMobile.signOut();
            setIsAuthenticated(false);
            setUser(null);
            setClaims(null);
            router.replace("/sign-in");
          } catch (error) {
            console.error(error);
            throw error;
          }
        },
        signInWithCustomToken: async (token: string) => {
          try {
            const userCredential = await authMobile.signInWithCustomToken(
              token
            );
             await checkAuthenticated();
            return userCredential;
          } catch (error) {
            setIsAuthenticated(false);
            console.error(error);
            throw error;
          }
        },

        user,
        isLoading,
        isAuthenticated,
        claims,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}
