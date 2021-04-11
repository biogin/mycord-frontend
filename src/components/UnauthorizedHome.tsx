import React from 'react';
import { useHistory, useLocation, Link } from 'react-router-dom';
import { gql, useMutation } from "@apollo/client";
import { useForm, Controller } from "react-hook-form";

import Button from "../ui/Button";
import Input from "../ui/Input";
import { BASE_ERROR, INVALID_CREDENTIALS } from "./auth/errorTypes";

const UnauthorizedHome: React.FunctionComponent = (): any => {
  const { handleSubmit, formState: { errors }, control } = useForm();

  const router = useHistory();
  const location = useLocation();

    const [login, { error }] = useMutation(gql`
        mutation HomeLogin($email: String, $password: String){
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
          localStorage.setItem('_autherror', JSON.stringify({ type: INVALID_CREDENTIALS }));

          break;
        default:
          localStorage.setItem('_autherror', JSON.stringify({ type: BASE_ERROR, caught: e }));

          break;
      }

      router.push('/login');
    }
  }

  return (
      <>
        <div className='flex flex-col justify-center items-center sm:flex-row'>
          <div className='flex items-center justify-center w-1/2'>
            <img src="https://i.pinimg.com/originals/f9/6a/26/f96a261e5a60d7d66b36e2850e3eb19b.png" alt="alt"
                 className='hidden sm:block'/>
          </div>
          <div
              className="h-screen sm:min-h-screen flex items-center justify-center flex-col mx-1 sm:w-1/2 border-l-0 sm:border-l sm:px-6 lg:px-8">
            <form className="space-y-3 mt-20 sm:mt-auto self-start" style={{ flex: '40%' }}
                  onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col sm:flex-row rounded-md shadow-sm -space-y-px mt-4">
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
                      render={({ field: { onChange, value } }) => <Input type='email' value={value} rounded name='email'
                                                                         errored={errors.email} required
                                                                         placeholder='Email address'
                                                                         autoComplete='email' onChange={onChange}/>}
                  />
                </div>
                <div className='sm:ml-2'>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <Controller
                      name='password'
                      rules={{
                        minLength: 6,
                        maxLength: 200
                      }}
                      control={control}
                      defaultValue={''}
                      render={({ field: { onChange, value } }) => <Input type='password'
                                                                         rounded
                                                                         value={value}
                                                                         name='password'
                                                                         required
                                                                         placeholder='Password'
                                                                         autoComplete='current-password'
                                                                         errored={errors.password}
                                                                         onChange={onChange}/>}
                  />
                </div>
                <div className='sm:ml-2'>
                  <Button type='submit' text='Login'/>
                </div>
              </div>

              <div className="flex items-center justify-end mt-0">
                <div className="text-sm text-right">
                  <Link to={'/reset-pass'} className="font-medium text-secondary">
                    Forgot your password?
                  </Link>
                </div>
              </div>
            </form>
            <div className="max-w-md w-full mb-2 sm:m-auto" style={{ flex: '80%' }}>
              <h2 className="mt-6 mb-5 text-center text-5xl font-extrabold text-gray-900">
                Listen, <br/>
                and read.
              </h2>
              <Button type='submit' filled={true} text='Login' click={() => router.push('/login')}/>
              <Button type='button' text='Sign up' click={() => router.push('/signup/', { background: location })}/>
            </div>
          </div>
        </div>
      </>
  );
};

export default UnauthorizedHome;
