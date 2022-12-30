
// A hook is a react function with use at the front which can change the state within a functional component (not class component)
// A component which uses a hook will re-render when it detects a state change from your hook function


//This custom hook takes form initial form inputs and validity status then through inputHandler upadates form values and dispatches new requests to check formIsValid status

import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
  switch (action.type) {
    case 'INPUT_CHANGE':
      let formIsValid = true;
      for (const inputId in state.inputs) {
        if (!state.inputs[inputId]) {         // In auth.js when we switch from signup to login we have created a name field then set it to undefined. We don't want to run validation on this.
          continue;
        }
        if (inputId === action.inputId) {
          formIsValid = formIsValid && action.isValid;
        } else {
          formIsValid = formIsValid && state.inputs[inputId].isValid;
        }
      }
      return {
        ...state,
        inputs: {
          ...state.inputs,
          [action.inputId]: { value: action.value, isValid: action.isValid }
        },
        isValid: formIsValid
      };
    case 'SET_DATA':
      return {
        inputs: action.inputs,
        isValid: action.formIsValid
      };
    default:
      return state;
  }
};

export const useForm = (initialInputs, initialFormValidity) => {
  const [formState, dispatch] = useReducer(formReducer, {
    inputs: initialInputs,
    isValid: initialFormValidity
  });

  const inputHandler = useCallback((id, value, isValid) => {     // useCallback important to avoid infinite loop. The imput handler is called from <Input />, even if no change in props this func will be redefined which means props will be same but in different location triggering useEffect to run again. useCallback stores function for later use so it doesn'y have to be redefined.
    dispatch({
      type: 'INPUT_CHANGE',
      value: value,
      isValid: isValid,
      inputId: id
    });
  }, []);

  const setFormData = useCallback((inputData, formValidity) => {
    dispatch({
      type: 'SET_DATA',
      inputs: inputData,
      formIsValid: formValidity
    });
  }, []);       // dispatch technically a dependency however react ensures dispatch from useReducer never changes so you can omit it

  return [formState, inputHandler, setFormData];
};