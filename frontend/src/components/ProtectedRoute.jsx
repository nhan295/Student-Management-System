import {Navigate} from 'react-router-dom';
import api from '../api';
import {jwtDecode} from 'jwt-decode'
import {REFRESH_TOKEN, ACCESS_TOKEN} from '../constants';
import {useState, useEffect} from 'react';


function ProtectedRoute({children}) {
  const [isAuthorized, setIsAuthorized] = useState(null);
  
   useEffect(() => {
    // Delay nhỏ để đảm bảo token đã lưu xong
    const timer = setTimeout(() => {
      auth().catch(() => setIsAuthorized(false));
    }, 100); // 100ms

    return () => clearTimeout(timer); // cleanup
  }, []);

  const refreshToken = async()=>{
    const refreshToken = localStorage.getItem(REFRESH_TOKEN)
    try{
      const res = await api.post('/api/v1/user_auth/refreshtoken',{
        refresh: refreshToken
      }); 
      if(res.status === 200){
       
        localStorage.setItem(ACCESS_TOKEN, res.data.access)
        
        setIsAuthorized(true);
      }else{
        setIsAuthorized(false)
      }
    }catch(err){
      console.log(err);
      setIsAuthorized(false)
    }
  }

  const auth = async()=>{
    const token = localStorage.getItem(ACCESS_TOKEN)
   
    if(!token){
      console.log("Chưa có token, không cho vào.");
      setIsAuthorized(false)
      return;
    }
    const decoded = jwtDecode(token);
    const tokenExpiration = decoded.exp; // lấy thời gian hết hạn của token
    const now = Date.now() / 1000; // lấy thời gian hiện tại


    if(tokenExpiration < now){
      await refreshToken();
  }else{
    setIsAuthorized(true)
  }
  }
  if(isAuthorized === null){
    return <div>Loading...</div>
  }

  return isAuthorized ? children : <Navigate to="/login"/>
   
  
}
export default ProtectedRoute;