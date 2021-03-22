import React, { createContext, ReactNode, useContext } from 'react';
import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "@apollo/client/core";

interface IAuthContext {
  loggedIn: boolean;
  error: ApolloError | undefined;
}

const AuthContext = createContext<IAuthContext>({
  loggedIn: false,
  error: undefined
});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const { data, error, loading } = useQuery(gql`
        query LoggedIn{
            loggedIn
        }
    `);

  if (loading) return null;

  const value = {
    loggedIn: data?.loggedIn,
    error
  };

  return (
      <AuthContext.Provider value={value}>
        {children}
      </AuthContext.Provider>
  );
};

export function useLoggedIn(): boolean {
  return useContext(AuthContext).loggedIn;
}

export default AuthProvider;
