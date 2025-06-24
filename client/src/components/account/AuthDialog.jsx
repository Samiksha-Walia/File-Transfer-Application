import React, { useState } from 'react';
import LoginDialog from './LoginDialog';
import RegisterDialog from './RegisterDialog';

const AuthDialog = ({onLoginSuccess}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');

  const toggleDialog = () => {
    setIsLogin(!isLogin);
  };

  

  return (
    <>
      {isLogin ? (
        <LoginDialog onSwitch={toggleDialog}  onLoginSuccess={onLoginSuccess}/>
      ) : (
        <RegisterDialog onSwitch={toggleDialog}  onLoginSuccess={onLoginSuccess} />
      )}
    </>
  );
};

export default AuthDialog;
