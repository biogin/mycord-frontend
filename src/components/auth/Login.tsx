import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Controller, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

import Button from "../../ui/Button";
import Input from "../../ui/Input";
import { BASE_ERROR, INVALID_CREDENTIALS } from "./errorTypes";

const Login = () => {
  const [loginError, setLoginError] = useState((): any => {
    let err = localStorage.getItem('_autherror');

    if (err) {
      setTimeout(() => {
        localStorage.removeItem('_autherror');
      });

      return JSON.parse(err);
    }

    return null;
  });

  const { control, handleSubmit } = useForm();
  const location = useLocation();

    const [login] = useMutation(gql`
        mutation Login($email: String, $password: String){
            login(email: $email, password: $password){
                email
            }
        }
    `);

  const onSubmit = async ({ email, password }: any) => {
    try {
      await login({ variables: { email, password } });

      window.location.reload();
    } catch (e) {
      switch (e.message) {
        case INVALID_CREDENTIALS:
          setLoginError({ type: INVALID_CREDENTIALS });

          break;
        default:
          setLoginError({ type: BASE_ERROR });

          break;
      }
    }
  }

  return (
      <div className='flex flex-col items-center justify-center w-full lg:w-1/2 mx-auto h-full sm:h-screen'>
        <h1 className='text-4xl'>
          Listen.
        </h1>
        <form className="flex items-center flex-col justify-center w-3/4  space-y-4 mx-auto mt-3" method="POST"
              onSubmit={handleSubmit(onSubmit)}>
          {loginError &&
          <div className='w-1/2 border-0 font-light text-center text-base border-opacity-5 bg-red-100 p-3'>
            {loginError.type === INVALID_CREDENTIALS ? 'Email or password you entered is incorrect. Please try again' : 'An error occurred 🤷'}
          </div>
          }
          <div className="rounded-md shadow-sm -space-y-px w-full sm:w-1/2 mx-auto">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <Controller
                  name='email'
                  control={control}
                  defaultValue={''}
                  rules={{
                    minLength: 10,
                    maxLength: 200
                  }}
                  render={({ onChange, value }, { invalid }) => <Input type='email' value={value} rounded name='email'
                                                                       className='p-2'
                                                                       errored={invalid} required
                                                                       errorMessage='Invalid email address'
                                                                       placeholder='Email address'
                                                                       autoComplete='email' onChange={onChange}/>}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <Controller
                  name='password'
                  rules={{
                    minLength: 6,
                    maxLength: 200
                  }}
                  control={control}
                  defaultValue={''}
                  render={({ onChange, value }, { invalid }) => <Input type='password'
                                                                       rounded
                                                                       className='p-2'
                                                                       value={value}
                                                                       name='password'
                                                                       required
                                                                       placeholder='Password'
                                                                       autoComplete='current-password'
                                                                       errored={invalid}
                                                                       errorMessage='Invalid password'
                                                                       onChange={onChange}/>}
              />
            </div>
          </div>

          <div className="flex items-center justify-between w-full sm:w-1/2 flex-row">
            <div className="text-sm flex justify-start w-full sm:mt-auto sm:p-0">
              <Link to={'/reset'} className="font-medium text-secondary">
                Forgot your password?
              </Link>
            </div>
            <div className="text-sm flex justify-end w-full sm:mt-auto sm:p-0 text-right">
              <Link
                  to={{
                    pathname: '/signup',
                    state: { background: location }
                  }}
                  className="font-medium text-secondary">
                Don't have an account?
              </Link>
            </div>
          </div>

          <div className='w-full sm:w-1/2'>
            <Button type='submit' filled={true} text='Login'/>
          </div>
        </form>
      </div>
  );
};

export default Login;
