import React, { useEffect, useRef, useState } from "react";
import Users from "../Components/Users";
import "./EditPage.css";
import Editor from "../Components/Editor";
import { initSocket } from "../Components/socket";
import ACTIONS from "../Socket/action";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

const EditPage = () => {

    const [connectedUsers, setConnectedUser] = useState([]);
    
    
    const socketRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const userName = localStorage.getItem('userName');
    const roomId = localStorage.getItem('roomId');

    useEffect(()=>{
        const init = async () =>{
            socketRef.current = await initSocket();

            // Handel Errors in socket connection
            socketRef.current.on('connect_error', (err) => handelErrors(err))
            socketRef.current.on('connect_failed', (err) => handelErrors(err))

            function handelErrors(e){
                console.log('Socket Error', e);
                // TODO : Show this in tost
                console.log('Socket connection failed, try again latter');
                navigate('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                userName
            })

            // Handel Joined Users

            socketRef.current.on(ACTIONS.JOINED,(({users, userName, socketId}) =>{
                if(userName !== localStorage.getItem('userName')){
                    // TODO: impliment this on tost
                    console.log(`${userName} connected to the room`);
                }
                setConnectedUser(users);
            }))

            // Handel Disconnected User

            socketRef.current.on(ACTIONS.DISCONNECTED, ({socketId, userName})=>{
                console.log(`${userName} disconnected fromm the room`);
                setConnectedUser(prev =>{
                    return prev.filter(user => user.socketId !== socketId)
                })
            })
        }
        init();
    }, [])



    const logMousePosition = (event) => {
      console.log('Mouse X:', event.clientX);
      console.log('Mouse Y:', event.clientY);
  };

  useEffect(() => {
      document.addEventListener('mousemove', logMousePosition);
      return () => {
          document.removeEventListener('mousemove', logMousePosition);
      };
  }, []);



    const handelRoomIdCopy = async () =>{
      try{
        await navigator.clipboard.writeText(roomId);
        // TODO: Implemet tose here
        console.log('Room Id cpoied successfully');
      }catch (err) {
        console.log(err);
      }
    }

  if(!location.state){
    return <Navigate to={'/'}></Navigate>
  }

  return (
    <div>
      <div className="dashboard">
        <div className="dashboardWrapper">
          <div className="namingArea">
            <p>CodeLab</p>
          </div>
          <div className="usersArea">
            <p>Connected Users</p>
            <div className="connectedUsers">
              {connectedUsers.map(({ userName, userId }) => (
                <Users key={userId} userName={userName}  userId={userId}></Users>
              ))}
            </div>
          </div>
          <button className="leaveButton">{roomId}</button>
          <button className="copyButton" onClick={handelRoomIdCopy}>Copy Room Id</button>
        </div>
        <div className="editArea">
          <Editor socketRef={socketRef}></Editor>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
