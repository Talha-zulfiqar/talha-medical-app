const USER_KEY = 'fm_current_user'
const TOKEN_KEY = 'fm_token'

export function setAuth({ token, user }){
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    if (user) localStorage.setItem(USER_KEY, JSON.stringify(user))
  } catch(e){}
}

export function getToken(){
  try { return localStorage.getItem(TOKEN_KEY) } catch(e){ return null }
}

export function setCurrentUser(user){
  try { localStorage.setItem(USER_KEY, JSON.stringify(user)) } catch(e){}
}

export function getCurrentUser(){
  try { const v = localStorage.getItem(USER_KEY); return v ? JSON.parse(v) : null } catch(e){ return null }
}

export function clearCurrentUser(){
  try { localStorage.removeItem(USER_KEY); localStorage.removeItem(TOKEN_KEY) } catch(e){}
}

export default { setAuth, getToken, setCurrentUser, getCurrentUser, clearCurrentUser }
