import React, { createContext, ReactNode, useContext } from 'react';
import { ApolloError, useQuery } from "@apollo/client";
import { gql } from "@apollo/client/core";

interface IAuthContext {
  user: {
    email: string;
    imageUrl: string;
    username: string
  } | null;
  loggedIn: boolean;
  error: ApolloError | undefined;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  loggedIn: false,
  error: undefined
});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const { data, error, loading } = useQuery(gql`
        query LoggedInUser{
            loggedInUser{
                username,
                imageUrl
            }
        }
    `);

  if (loading) return null;

  if (error) {
    console.log(JSON.stringify(error, null, 4))

    return null;
  }

  const value = {
    user: data?.loggedInUser,
    loggedIn: !!data?.loggedInUser,
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

export function useUserProfileImage(): string | undefined {
  return useContext(AuthContext).user?.imageUrl || '/profilePlaceholder.png';
}

export function useUsername(): string | undefined {
  return useContext(AuthContext).user?.username;
}

export default AuthProvider;
