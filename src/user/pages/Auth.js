import React, { useState, useContext } from 'react';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal'
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook';
import { AuthContext } from '../../shared/context/auth-context';
import './Auth.css';

const Auth = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false
      },
      password: {
        value: '',
        isValid: false
      }
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {                     // when we switch from signup to login formState has remembered the name field and is validating it. We need to reset the formState to keep the email and password but drop the name.
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(                      // likewise need to tell useForm to add name to formState.
        {
          ...formState.inputs,
          name: {
            value: '',
            isValid: false
          },
          image: {
            value: null,          // null because its a file not just a string!?
            isValid: false
          }
        },
        false
      );
    }
    setIsLoginMode(prevMode => !prevMode);          // Note there are two state changes here. React is smart, if multiple state changes under one synchronous function react will batch them and only re-render once.
  };

  const authSubmitHandler = async event => {
    event.preventDefault();
    
    if (isLoginMode) {

      try {

        console.log(`${process.env.REACT_APP_BACKEND_URL}/users/login`)
        const responseData = await sendRequest(                    
          process.env.REACT_APP_BACKEND_URL + '/users/login',       // sendRequest(url, method, body, header) from http-hook
            'POST',
            JSON.stringify({
              email: formState.inputs.email.value,
              password: formState.inputs.password.value
            }),
            {
              'Content-Type': 'application/json'              // This tells the backend api that it will be receiving json so the bodyParser.json
            },
          )
          auth.login(responseData.userId, responseData.token);      // login function defined in app.js
      } catch (err) {
        console.log(err)                     // no error handling required here as the error state is set in http-hook. could have done .then() instead.
      }


    } else {
        try {
          const formData = new FormData()                             // FormData is a browser api, no need for new package
          formData.append('name', formState.inputs.name.value)
          formData.append('email', formState.inputs.email.value)
          formData.append('password', formState.inputs.password.value)
          formData.append('image', formState.inputs.image.value)
          
          const responseData = await sendRequest(          
            'http://localhost:5000/api/users/signup',       
            'POST',
            formData                                           // Note we don't need headers when using FormData() as the fetch api will automatically detect them from a FormData object.
          )

          auth.login(responseData.userId, responseData.token);     // login function defined in app.js
      } catch (err) {

      }
    } 
  }


  return (
    <React.Fragment>

      <ErrorModal error={error} onClear={clearError} />
      <Card className="authentication">
        {isLoading && <LoadingSpinner asoverlay />}         {/*  asoverlay=true when called like this,    */}
        <h2>Login Required</h2>
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              element="input"
              id="name"
              type="text"
              label="Your Name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a name."
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && <ImageUpload center id='image' onInput={inputHandler} errorText="Please provide an image." />}       {/*  The input handler function is defined in form.js hook, it is the same as handling text input from input.js component    */}
          <Input
            element="input"
            id="email"
            type="email"
            label="E-Mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email address."
            onInput={inputHandler}
          />
          <Input
            element="input"
            id="password"
            type="password"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(6)]}
            errorText="Please enter a valid password, at least 6 characters."
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button inverse onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Auth;
