import axios from 'axios';

const getData = axios.create({
    baseURL:"http://localhost:3001"
});


export default getData;