import React from 'react';
import Input from "../ui/Input";
import { Controller, useForm } from "react-hook-form";

const Navbar = () => {
  const { watch, control } = useForm();

  const search = watch('search', '');

  return (
      <div className='flex justify-between items-center border-b-2 border-grey-100 shadow-sm' style={{ height: '10vh', width: '90vw' }}>
        <div className='flex justify-between items-center w-1/2'>
          <img className='w-1/6 -z-10' src="https://i.pinimg.com/originals/f9/6a/26/f96a261e5a60d7d66b36e2850e3eb19b.png"
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
