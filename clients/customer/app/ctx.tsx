import React from 'react';
import { useStorageState } from './useStorageState';


type AuthContextType = {
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  session?: string | null;
  isLoading: boolean;
}

const AuthContext = React.createContext<AuthContextType | null>(null);

// This hook can be used to access the user info.
export function useSession() {
  const value = React.useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }
  return value;
}

export function SessionProvider(props: { children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) {
  const {state, setValue, isLoading} = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
       signIn: async () => {
          await setValue('123');
        },
        signOut: async  () => {
         await setValue(null);
        },
        session: state,
        isLoading,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
}
