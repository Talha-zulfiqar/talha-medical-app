const STORAGE_KEY = 'fm_current_user'

export function setCurrentUser(user){
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(user)) } catch(e){}
}

export function getCurrentUser(){
  try { const v = localStorage.getItem(STORAGE_KEY); return v ? JSON.parse(v) : null } catch(e){ return null }
}

export function clearCurrentUser(){
  try { localStorage.removeItem(STORAGE_KEY) } catch(e){}
}

export default { setCurrentUser, getCurrentUser, clearCurrentUser }
