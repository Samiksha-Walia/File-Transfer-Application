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

export const getConversation=async (data)=>{
    try{
        let response=await axios.post(`${url}/conversation/get`,data);
        return response.data;
    } catch(error){
        console.log('Error while calling getConversation API', error.message);
    }
}


export const newMessage = async (data) => {
    try {
        const response = await axios.post(`${url}/message/add`, data);
        return response.data;
    } catch (error) {
        console.log('Error while calling newMessage API ', error.message);
    }
};


export const getMessages = async (id) => {
    try {
        let response = await axios.get(`${url}/message/get/${id}`);
        return response.data;
    } catch (error) {
        console.log('Error while calling getMessages API ', error.message);
    }
}

export const uploadFile = async (data, setProgress) => {
    try {
        const response = await axios.post(`${url}/file/upload`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
                const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percent);
            }
        });
        return response;
    } catch (error) {
        console.log('Error while calling uploadFile API ', error);
        setProgress(0);
    }
};