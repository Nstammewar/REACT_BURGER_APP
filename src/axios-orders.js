import axios from 'axios';


const instance = axios.create({
    baseURL:'https://burger-app-2ece2.firebaseio.com/',

})

export default instance;