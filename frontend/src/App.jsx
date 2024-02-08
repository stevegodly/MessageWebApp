import {UserContextProvider} from "./components/UserContext";
import Routes from "./Routes";
import axios from "axios"

export default function App() {
  axios.defaults.withCredentials = true;
  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  )
}