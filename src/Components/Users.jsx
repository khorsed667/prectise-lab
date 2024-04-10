import React from 'react';
import Avatar from 'react-avatar';
import './Users.css'

const Users = ({userName}) => {

    console.log(userName);

    return (
        <div className='userWrapper'>
            <Avatar name={userName} size="50" round="20px" />
            <span className='userNAme'>{userName}</span>
        </div>
    );
};

export default Users;