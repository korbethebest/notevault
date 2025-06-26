import { useState } from 'react';

import { useLogin } from "../model";

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useLogin();

  const handleLogin = async () => {
    const { error } = await login(email, password)
    if (error) alert(error.message);
  };

  return (
    <div>
      <h1>로그인</h1>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="이메일" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="비밀번호" />
      <button onClick={handleLogin}>로그인</button>
    </div>
  );
}

export default LoginForm;
