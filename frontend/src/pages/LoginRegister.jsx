import {useEffect,useContext,useState} from "react";
import {UserContext} from '../components/UserContext'
import Loading from '../components/Loading'
import axios from "axios";
import { useSnackbar } from 'notistack';


const LoginRegister=()=>{
    useEffect(() => {
        setTimeout(()=>{
            setLoading(false)
        },3000)
    },[])

    const [username,setUsername]=useState('')
    const [password,setPassword]=useState('')
    const [loading,setLoading]=useState(true)
    const [registerLogin,setRegisterLogin]=useState('login')
    const {setUsername:setLoggedInUsername,setId}=useContext(UserContext)
    const { enqueueSnackbar } = useSnackbar();

    const handleSubmit=async()=>{
        try{
            const user={
                username:username,
                password:password,
            }
            const url = (registerLogin === 'register' ? 'register' : 'login');
            const {data}=await axios.post(`https://messagewebapp.onrender.com//api/v1/chats/${url}`,user)
            setLoggedInUsername(username);
            setId(data.id);
            enqueueSnackbar(`${url}ed successfully`, { variant: 'success' });
        }
        catch(err){
            enqueueSnackbar('Error: '+err.message, { variant:'error'})
            console.log(err)
        }
    }
    return(
        <div className='p-4 bg-gradient-to-r from-slate-800 to-cyan-700 h-screen'>
            {loading ? <Loading /> : ''}
            <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-200 font-extrabold'>User-Name</label>
                    <input
                        type='text'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='border-2 border-gray-200 px-4 py-2 w-full bg-slate-400'
                    />
                </div>
                <div className='my-4'>
                    <label className='text-xl mr-4 text-gray-200 font-extrabold'>Password</label>
                    <input
                        type='text'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='border-2 border-gray-200 px-4 py-2  w-full bg-slate-400'
                    />
                </div>
                <button className='p-2 bg-sky-300 m-8' onClick={handleSubmit}>
                    {registerLogin==='login'?'Login':'Register'}
                </button>
                <div className="text-center mt-2">
                    {registerLogin === 'register' && (
                        <div>
                            Already a member?
                            <button className="ml-1" onClick={() => setRegisterLogin('login')}>
                                Login here
                            </button>
                        </div>
                    )}
                    {registerLogin === 'login' && (
                        <div>
                            Dont have an account?
                            <button className="ml-1" onClick={() => setRegisterLogin('register')}>
                                Register
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>     
    )
}

export default LoginRegister;