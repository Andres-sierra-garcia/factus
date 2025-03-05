import client from '../plugins/factus.js'

export async function getDataFactus(url) {
    try {
        const response = await client.get(url);
        console.log(response);
        return response.data;
    } catch (error) {
        console.error('error en la peticion GET', error);
        throw error;
    }
} 

export async function postDataFactus(url, data){
    try {
        const response = await client.post(url,data);
        return response.data;
    } catch (error){
        console.error('Errror en la peticion POST', error);
        throw error;
    }
}

export async function putDataFactus(url, data) {
    try {
        
        const response = await client.put(url,data);
        return response.data;
    } catch (error) {
        console.error('error en la peticion PUT', error);
        throw error;    
    }
}
