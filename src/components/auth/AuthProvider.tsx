import React, { createContext, ReactNode, useContext } from 'react';
import { ApolloError, useMutation, useQuery } from "@apollo/client";
import { gql } from "@apollo/client/core";
import { useHistory } from "react-router-dom";

interface IAuthContext {
  profile: {
    email: string;
    imageUrl: string;
    username: string
    user: {
      id: number;
    }
  } | null;
  loggedIn: boolean;
  error: ApolloError | undefined;

  signout: Function;
}

const AuthContext = createContext<IAuthContext>({
  profile: null,
  loggedIn: false,
  error: undefined,
  signout() {}
});

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const history = useHistory();

    const { data, error, loading } = useQuery(gql`
        query LoggedInUser{
            loggedInUser{
                username,
                imageUrl,
                user{
                    id
                }
            }
        }
    `);

    const [signoutMutation, { error: signoutError }] = useMutation(gql`
        mutation SignoutMain{
            signout{
                email
            }
        }
    `);

  if (loading) return null;

  if (error) {
    console.log(JSON.stringify(error, null, 4))

    return null;
  }

  if (signoutError) {
    console.log('Error signing out', signoutError);
  }

  const signout = async () => {
    await signoutMutation();

    history.push('/');

    window.location.reload(); // to update global state
  }

  const value = {
    profile: data?.loggedInUser,
    loggedIn: !!data?.loggedInUser,
    error: error || signoutError,
    signout
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
  return useContext(AuthContext).profile?.imageUrl || '/profilePlaceholder.png';
}

export function useUsername(): string | undefined {
  return useContext(AuthContext).profile?.username;
}

export function useUserId(): number | undefined {
  return useContext(AuthContext).profile?.user?.id;
}

export function useSignout(): Function {
  return useContext(AuthContext).signout;
}

export default AuthProvider;
