import axios from "axios";
let permission : string[] = [];
export const fetchPermission = async(id:number) =>{
  try{
    const res = await axios.get(`http://127.0.0.1:8000/role/rights/${id}`)
    localStorage.setItem("permissions", JSON.stringify(res.data));
    return res.data;
  }
  catch(error)
  {
    console.error("Failed to fetch permissions", error)
    return [];
  }
};

export const getPermission = ():string[] =>{
    const data =localStorage.getItem("permissions");
    return data ? JSON.parse(data) :[];
};

export const setPermissions = (permissions: string[]) => {
  localStorage.setItem("permissions", JSON.stringify(permissions));
};

export const hasPermission = (permission:string):boolean=>{
 const permissions =getPermission();
 return permissions.includes(permission)
}

export const hasAnyPermission = (permList: string[]): boolean => {
  const permissions = getPermission();
  return permList.some(p => permissions.includes(p));
};

export const hasAllPermissions = (permList: string[]): boolean => {
  const permissions = getPermission();
  return permList.every(p => permissions.includes(p));
};