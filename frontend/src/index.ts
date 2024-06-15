import axios from "axios"

export async function checkWordExists(word : string) {
    try {
        const response : any = await axios.head(`http://localhost:3001/dicio/getWord/${word}`);
        if (response.status == 204) {
            return false;
        }
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

export async function getRandomWord() {
    try {
        const response : any = await axios.get(`http://localhost:3001/dicio/getRandomWords`);        
        if (response.data.length > 0) {
            return response.data;
        } else {
            return false;
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
}