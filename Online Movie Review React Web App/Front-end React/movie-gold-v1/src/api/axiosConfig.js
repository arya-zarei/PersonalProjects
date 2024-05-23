import axios from "axios";

//axios object used to make http requests
//CORS was bypassed through web application installation
//by default CORS error will appear :(

export default axios.create({
  baseURL: "http://localhost:8080",
});
