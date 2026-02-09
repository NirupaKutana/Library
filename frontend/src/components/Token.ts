import axios from "axios";
import { refreshAccessToken } from "./RefreshToken";
export const Api = async(url :string)=>
{
   const token = localStorage.getItem("access_token")
   
   try
   {
        return await axios.get(url,{
            headers :
            {
              Authorization:`Bearer${token}`,
            },
        });
   }
   catch (err:any)
   {
      if (err.response?.status===401)
        {      
               const newToken = await refreshAccessToken();
               return axios.get(url,{
                    headers: {
                    Authorization: `Bearer ${newToken}`,
                    },
                });
                // const refreshToken = localStorage.getItem("refresh_token");
                // const refresh = await   axios.post("http://127.0.0.1:8000/token/refresh/",{},{
                // headers:{"Refresh-Token":refreshToken},
                // });
               // const newToken = refresh.data.access_token
               // localStorage.setItem("access_token",newToken)

        
                
            
        }
   }

}