import {useContext} from 'react'
import {UserContext} from './components/UserContext'
import LoginRegister from './pages/LoginRegister'
import Chat from './pages/Chat'

export default function Routes(){
    const {username} = useContext(UserContext)
    if(username) return <Chat/>
    return <LoginRegister/>
}