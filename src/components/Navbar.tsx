import React from 'react';
import Input from "../ui/Input";

const Navbar = () => {
  return (
      <div className='flex justify-between' style={{ height: '10vh' }}>
        <div className='flex-1'>
          <img src="https://i.pinimg.com/originals/f9/6a/26/f96a261e5a60d7d66b36e2850e3eb19b.png" alt="alt"/>
        </div>
        <div className='flex-1'>
          <Input type='text' value='search' name='search' placeholder={'Search'} onChange={() => {}} />
        </div>
        <div className='flex-1'>
          <h1>Other shit</h1>
        </div>
      </div>
  );
};

export default Navbar;
