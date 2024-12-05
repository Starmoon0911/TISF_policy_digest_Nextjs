import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BackEndURL || 'http://localhost:9000',
});

console.log(instance.defaults.baseURL);
export default instance;
