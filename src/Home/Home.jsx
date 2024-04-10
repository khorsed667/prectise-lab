import React, { useState } from "react";
import { Form, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const Home = () => {

    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('')
    const [userName, setUserName] = useState('')

  const idGenerator = () => {
    setRoomId(uuidv4());
  };

  const handleRegistration = (e) => {
    e.preventDefault();
    if(userName && roomId){
        localStorage.setItem('userName', userName);
        localStorage.setItem('roomId', roomId);
        navigate('/editor',{
            state: userName,
        });
    }
    else{
        return;
    }
  };

  return (
    <div className="HomeWrapper">
      <nav>
        <p className="projectName">CodeLab</p>
        <label>Welcome to Code Colaboration Field.</label>
      </nav>
      <section className="sectionWrapper">
        <Form onSubmit={handleRegistration}>
          <div className="registratonBox">
            <p>Enter your Room id</p>
            <input type="text" name="id" required placeholder="Room Id" onChange={(e) => setRoomId(e.target.value)} defaultValue={roomId}/>
            <input type="text" name="name" required placeholder="User name"  onChange={(e) => setUserName(e.target.value)} />
          </div>
          <input className="joinbtn" type="submit" value={"Join"} />
          <p>
            If you don't have an invite then{" "}
            <Link onClick={idGenerator} className="generateId">
              Create Room
            </Link>
          </p>
        </Form>
      </section>
    </div>
  );
};

export default Home;
