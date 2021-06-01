import React from 'react';
import Input from "../ui/Input";
import { Controller, useForm } from "react-hook-form";

import logo from '../static/img/logo.png';

const Navbar = () => {
  const { control } = useForm();

  return (
      <div className='flex justify-between items-center border-b-2 border-grey-200 shadow-sm h-20' style={{ width: '100vw' }}>
        <div className='flex justify-between items-center w-1/2'>
          <img className='-z-10 relative w-28' src={logo}
               alt="alt"/>
          <Controller
              name='email'
              control={control}
              defaultValue={''}
              rules={{
                minLength: 10,
                maxLength: 200
              }}
              render={({ field: { onChange, value } }) => <Input type='text'
                                                      rounded
                                                      fluid={false}
                                                      className='ml-5 w-1/2 py-3'
                                                      value={value}
                                                      name='search'
                                                      placeholder={'Search'}
                                                      onChange={onChange}/>
              }
          />

        </div>
        <div className='ml-auto mr-5'>
          <h1>Other shit</h1>
        </div>
      </div>
  );
};

export default Navbar;
