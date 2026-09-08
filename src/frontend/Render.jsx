import { useEffect } from 'react';
import { BASE_URL } from '../services/api';
export function Render(){
    const checkAdmin = async () => {
        const response = await fetch(`${BASE_URL}/admin/check-admin`);
        const data = await response.json();
        console.log(data);
    }
       useEffect(() => {

      checkAdmin();

   }, []);

  return (
    <div>
    </div>
  );
}
