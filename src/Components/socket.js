import {io} from 'socket.io-client'

export const initSocket = async () =>{
    const options = {
        'force new connections' : true,
        reconnectionAttampt : Infinity,
        timeout : 10000,
        transports : ['websocket']
    }
    return io('https://prectise-lab-server-3.onrender.com/', options)
}