import axios from 'axios';

const url = 'http://localhost:5000/api';

export const addUser = async (data)=> {
    try{
        await axios.post(url, data);
    }catch(error) {
        console.log('Error while calling addUser API', error.message);
    }
}

export const setConversation=async (data)=>{
    try{
        await axios.post(`${url}/conversation/add`,data);
    } catch(error){
        console.log('Error while calling setConversation API', error.message);
    }
}