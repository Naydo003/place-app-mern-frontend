import React, {useContext} from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/components/FormElements/Input';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';
import Button from '../../shared/components/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import { useForm } from '../../shared/hooks/form-hook';
import { useHttpClient } from '../../shared/hooks/http-hook'
import { AuthContext } from '../../shared/context/auth-context'
import './PlaceForm.css';

const NewPlace = () => {
  const auth = useContext(AuthContext)
  // useForm is a custom hook which takes in form values and validity status and spits out an overall form validity status (formState) and a link to a function that can check the formState.
  const [formState, inputHandler] = useForm(
    {
      title: {                   // these are form initialInputs
        value: '',
        isValid: false
      },
      description: {
        value: '',
        isValid: false
      },
      address: {
        value: '',
        isValid: false
      },
      image: {            // this key must match the id in ImageUpload component
        value: null,
        isValid: false
      }
    },
    false              // this is initialFormValidity
  );
  const { isLoading, error, sendRequest, clearError } = useHttpClient()     // also custom hook

  const history = useHistory()

  const placeSubmitHandler = async event => {
    event.preventDefault();

    try {
      const formData = new FormData()                             // FormData is a browser api, no need for new package
      formData.append('title', formState.inputs.title.value)
      formData.append('description', formState.inputs.description.value)
      formData.append('address', formState.inputs.address.value)
      formData.append('image', formState.inputs.image.value)
      // formData.append('creator', auth.userId)      // We don't need this as its more reliable to get current user info from within backend
      await sendRequest(                    
        process.env.REACT_APP_BACKEND_URL + '/places',       // sendRequest(url, method, body, header) from http-hook
        'POST',
        formData,
        {
          Authorization: 'Bearer ' + auth.token
        }
      )
      // redirect to home page
      history.push('/')
      
    } catch (err){
        // error handled in useHttpClient hook
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <form className="place-form" onSubmit={placeSubmitHandler}>
        {isLoading && <LoadingSpinner asoverlay />}
        <Input
          id="title"
          element="input"
          type="text"
          label="Title"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid title."
          onInput={inputHandler}
          />
        <Input
          id="description"
          element="textarea"
          label="Description"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter a valid description (at least 5 characters)."
          onInput={inputHandler}
          />
        <Input
          id="address"
          element="input"
          label="Address"
          validators={[VALIDATOR_REQUIRE()]}
          errorText="Please enter a valid address."
          onInput={inputHandler}
          />
        <ImageUpload id='image' onInput={inputHandler} errorText="Please provide an image." />
        <Button type="submit" disabled={!formState.isValid}>
          ADD PLACE
        </Button>
      </form>
    </React.Fragment>
  )
};

export default NewPlace;
