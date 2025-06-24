import axios from 'axios';

const url = '';

export const addUser = async (data)=> {
    try{
        await axios.post(url, data);
    }catch(error) {
        console.log('Error while calling addUser API', error.message);
    }
}