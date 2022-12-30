import { useState, useCallback, useEffect } from 'react';





export const useAuth = () => {

  

  const [token, setToken] = useState(false);
  const [userId, setUserId] = useState(null)
  const [tokenExpirationDate, setTokenExpirationDate] = useState()

  const login = useCallback(( uid, token, expirationDate ) => {
    setToken(token);
    setUserId(uid)
    // Note the below tokenExpirationDate is not the same as in state because of scoping. It is a shadow variable. I don't like this. CHANGE!!!
    const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60)    // this expiry must match that set in backend (user-controllers.js),     if first login expiration will be an hour, otherwise if login coming from useEffect below use that expiry
    setTokenExpirationDate(tokenExpirationDate)
    localStorage.setItem(
      'userData', 
      JSON.stringify({
        userId: uid, 
        token: token,
        expiration: tokenExpirationDate.toISOString()        // toISOString is a special string that can store date data that won't get lost during stringify.
      }))        // could also use cookies which is a bit more secure however they are a bit more fiddly. Local Storage allows hackers to access data and submit cross sites scripting attacks however if there are no vulnerabilities this should be ok. React auto sanitizes data.
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null)
    setTokenExpirationDate(null)
    localStorage.removeItem('userData')
  }, []);

  // Perhaps try create function that can be called by various events/actions. Would also need to update on the backend!
  // const prolongTimer = () => {
  //   blah blah
  // }

  // Note that the logoutTimer will log someone out after specified time no matter if they are still using it. I want to make so that if consistent use the login timer resets.
  useEffect(() => {
    let logoutTimer
    if (token && tokenExpirationDate) {
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime()
      logoutTimer = setTimeout(logout, remainingTime)
    } else {
      clearTimeout(logoutTimer)
    }
  }, [token, logout, tokenExpirationDate])

  // The app renders once before useEffect runs so you see a flicker because the loggedout page runs initially and then rerenders with the loggedin screen
  // this may be solved with a splash screen. !!!! Def do this.
  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'))
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration))
    }
  }, [login])

  return { token, login, logout, userId }
}