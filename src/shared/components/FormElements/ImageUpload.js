import React, { useRef, useState } from 'react';

import Button from './Button';
import './ImageUpload.css';

const ImageUpload = props => {
  // const [file, setFile] = useState()       only needed for inside old useEffect
  const [previewUrl, setPreviewUrl] = useState()
  const [isValid, setIsValid] = useState(false)


  const filePickerRef = useRef();       // builds ref link to input element

  // useEffect(() => {
  //   if (!file) {
  //     return
  //   }
  //   const fileReader = new FileReader()     // FileReader is a browser API, it is clunky but works
    
  //    // have to set a function which says what to do with a result before calling
  //   fileReader.onLoad = () => {            
  //     setPreviewUrl(fileReader.result)
  //   }

  //   // then call fileReader method.
  //   fileReader.readAsDataURL(file)          // for some reason .readAsDataURL() is not working. Used a better method below anyway
  // }, [file])

  const pickedHandler = event => {
    let pickedFile
    let fileIsValid
    if (event.target.files && event.target.files.length === 1 ) {         // we only want to support upload of one file at a time
      pickedFile = event.target.files[0]

      setPreviewUrl(window.URL.createObjectURL(pickedFile));
      // setFile(pickedFile) only in useEffect
      setIsValid(true)
      fileIsValid = true
    } else {
      setIsValid(false)
      fileIsValid = false
    }
    props.onInput(props.id, pickedFile, fileIsValid)       // we had to create fileIsValid variable and could not use isValid as isValid would not update until state update. setIsValid schedules the state update but it is not instant.

  };

  const pickImageHandler = () => {      // Basically we want to use <input type=file > functionality but not display it. When pick image button clicked we will open the filepickerRef ie <Input
    filePickerRef.current.click();
  };

  return (
    <div className="form-control">
      <input
        id={props.id}
        ref={filePickerRef}
        style={{ display: 'none' }}      // inline style to hide the input. hidden because it is ugly!
        type="file"
        accept=".jpg,.png,.jpeg"             
        onChange={pickedHandler}
      />
      <div className={`image-upload ${props.center && 'center'}`}>         {/*    className = "image upload and if center is passed as a prop it will add center to className    */}
        <div className="image-upload__preview">
          {previewUrl && <img src={previewUrl} alt="Preview" />}
          {!previewUrl && <p>Please pick an image.</p>}
        </div>
        <Button type="button" onClick={pickImageHandler}>PICK IMAGE</Button>
      </div>
      {!isValid && <p>{props.errorText}</p>}
    </div>
  );
};

export default ImageUpload;

