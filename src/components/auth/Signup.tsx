import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import ReactDatePicker from 'react-datepicker';
import { Link, useHistory } from 'react-router-dom';
import { useMutation, gql } from "@apollo/client";

import 'react-datepicker/dist/react-datepicker.css';

import Wizard, { useCurrentStep, useWizardActions } from '../../ui/wizard/Wizard';
import Input from '../../ui/Input';
import Button from '../../ui/Button';

const GeneralInfo = () => {
  const {
    data: {
      name: stepName,
      signupEmail: stepEmail,
      date: stepDate
    }
  } = useCurrentStep<{ signupEmail: string, name: string, date: Date }>();

  const { setCurrentStepData, goToNext } = useWizardActions();

  const { control, watch, formState: { errors } } = useForm();

  const [name, signupEmail, date] = watch(['name', 'signupEmail', 'date'], {
    name: stepName,
    signupEmail: stepEmail,
    date: stepDate
  });

  return (
      <>
        <div className='flex justify-between items-center flex-col sm:flex-row'>
          <h1 className='font-medium text-left text-2xl' style={{ flex: '80%' }}>Create account</h1>
          <Button click={() => {
            setCurrentStepData({ signupEmail, date, name });

            goToNext();
          }} className='flex-1' type='button' filled disabled={!name || !signupEmail || !date}>
            Next
          </Button>
        </div>
        <form className='mt-8 self-start'>
          <div className='flex flex-col rounded-md shadow-sm space-y-3 mt-4'>
            <div>
              <label htmlFor='name' className='sr-only'>Your username</label>
              <Controller
                  name='name'
                  control={control}
                  defaultValue={stepName || ''}
                  rules={{
                    minLength: 10,
                    maxLength: 200
                  }}
                  render={({ field: { value, onChange } }) => <Input type='text' value={value} rounded name='name'
                                                                     className='p-3'
                                                                     errored={errors.name} required
                                                                     placeholder='Username'
                                                                     onChange={onChange}/>
                  }
              />
            </div>
            <div>
              <label htmlFor='signupEmail' className='sr-only'>Email</label>
              <Controller
                  name='signupEmail'
                  rules={{
                    minLength: 6,
                    maxLength: 200
                  }}
                  control={control}
                  defaultValue={stepEmail || ''}
                  render={({ field: { onChange, value } }) => <Input type='email'
                                                                     rounded
                                                                     value={value}
                                                                     className='p-3'
                                                                     name='signupEmail'
                                                                     required
                                                                     placeholder='Email'
                                                                     autoComplete='email'
                                                                     errored={errors.signupEmail}
                                                                     onChange={onChange}/>}
              />
            </div>
          </div>
          <div className='w-full flex flex-col'>
            <h1 className='mt-5'>Date of birth</h1>
            <p className='text-light text-sm text-accent-muted pt-1'>
              This will not be shown publicly. Confirm your own age, even if this account is for a business, a pet, or
              something else.
            </p>
            <div className='flex mt-3'>
              <Controller
                  control={control}
                  name='date'
                  defaultValue={stepDate || ''}
                  render={({ field: { onChange, onBlur, value } }) => (
                      <ReactDatePicker
                          minDate={new Date('1920')}
                          maxDate={new Date()}
                          autoComplete='bday'
                          popperPlacement='top'
                          onChange={onChange}
                          onBlur={onBlur}
                          selected={value}
                      />
                  )}
              />
            </div>
          </div>
        </form>
      </>
  );
}

type FinishFields = { password: string; repeatPassword: string; };

const Finish = () => {
  const { goToPrevious, setCurrentStepData, finish } = useWizardActions();

  const {
    data: {
      password: stepPassword,
      repeatPassword: stepRepeatPassword
    }
  } = useCurrentStep<FinishFields>();

  const { control, watch, handleSubmit } = useForm();

  const [password, repeatPassword] = watch(['password', 'repeatPassword'], {
        password: stepPassword || '',
        repeatPassword: stepRepeatPassword || ''
      }
  );

  const onSubmit = (data: FinishFields) => {
    setCurrentStepData(data);

    finish();
  };

  return (
      <>
        <div className='flex justify-between items-center flex-col sm:flex-row'>
          <h1 className='font-medium text-left text-2xl' style={{ flex: '80%' }}>Create account</h1>
          <Button click={() => {
            setCurrentStepData({ password, repeatPassword });

            goToPrevious();
          }} className='flex-1' type='button' filled>
            Previous
          </Button>
        </div>
        <form className='mt-8 self-start' onSubmit={handleSubmit(onSubmit)}>
          <div className='flex flex-col rounded-md shadow-sm space-y-3 mt-4'>
            <input type="text" autoComplete="username" className='hidden'/>
            <div>
              <label htmlFor='password' className='sr-only'>Password</label>
              <Controller
                  name='password'
                  control={control}
                  defaultValue={stepPassword || ''}
                  rules={{
                    minLength: 6,
                    required: true,
                    // pattern: /^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9])(?=.*[a-z].*[a-z].*[a-z]).{6, }$/
                  }}
                  render={({ field: { onChange, value }, fieldState: { invalid } }) => <Input type='password'
                                                                                              value={value}
                                                                                              rounded
                                                                                              name='password'
                                                                                              className='p-3'
                                                                                              errored={invalid}
                                                                                              errorMessage='Password is too weak'
                                                                                              required
                                                                                              placeholder='Password'
                                                                                              autoComplete='new-password'
                                                                                              onChange={onChange}/>
                  }
              />
            </div>

            <div>
              <label htmlFor='password' className='sr-only'>Repeat password</label>
              <Controller
                  name='repeatPassword'
                  control={control}
                  defaultValue={stepRepeatPassword || ''}
                  rules={{
                    required: true,
                    validate: val => val === password
                  }}
                  render={({ field: { onChange, value }, fieldState: { invalid } }) => <Input type='password'
                                                                                              value={value}
                                                                                              rounded
                                                                                              name='repeatPassword'
                                                                                              className='p-3'
                                                                                              errored={invalid}
                                                                                              errorMessage={`Passwords don't match`}
                                                                                              required
                                                                                              placeholder='Repeat password'
                                                                                              onChange={onChange}/>
                  }
              />
            </div>
            <div className='mt-5'>
              <p className='font-light mt-7'>
                By signing up, you agree to the <Link className='text-blue-100' to="/terms">Terms of Service</Link> and
                Privacy Policy, including Cookie Use. Others will be able to find you by email or phone number when
                provided
              </p>
            </div>
            <div className='flex flex-col'>
              <Button type='submit'>
                Signup
              </Button>
            </div>
          </div>
        </form>
      </>
  );
}

const Signup = () => {
    const [signup, { error, called }] = useMutation(
        gql`
            mutation Signup($username: String, $password: String, $email: String, $birthday: String){
                signup(username: $username, password: $password, email: $email, birthday: $birthday){
                    username
                }
            }
        `);


  const history = useHistory();

  return (
      <>
        {error && <h1 className='bg-red-100 w-full p-2 rounded text-blue-600 font-light mb-4'>
          {error.message === 'duplicate_email' ? 'User with such email already exists' :
              error.message === 'duplicate_username' ? 'User with such username already exists' :
                  'An error occurred'}
        </h1>}
        <Wizard onFinish={async ({ signupEmail, name, password, date }) => {
          try {
            await signup({ variables: { email: signupEmail, username: name, password, birthday: date.toString() } });
          } catch (e) {

            console.error('ERROR', JSON.stringify(e, null, 4));
            return false;
          }

          window.location.reload();

          history.push('/');

          return true;
        }}>
          <GeneralInfo/>
          <Finish/>
        </Wizard>
      </>
  );
};

export default Signup;
