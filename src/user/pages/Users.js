import React, { useEffect, useState } from 'react';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState()
  const { isLoading, error, sendRequest, clearError } = useHttpClient()

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(process.env.REACT_APP_BACKEND_URL + '/users')
  
        setLoadedUsers(responseData.users)
      } catch (err) {
        
      }
    }

    fetchUsers()
  },[sendRequest])   // the useEffect will rerun each time the sendRequest updates, (this will flag warning if we don't add it). useCallback on sendRequest important to avoid infinite loop


  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className='center'>
          <LoadingSpinner asoverlay />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  )
};

export default Users;
