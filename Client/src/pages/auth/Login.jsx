import { useGlobalContext } from "../hooks/GlobalContext";

const Login = () => {
  const { dispatch } = useGlobalContext();

  const handleLogin = async () => {
    const user = { id: 1, name: "John Doe", email: "john.doe@example.com" };
    const token = "your-jwt-token";

    dispatch({ type: "SET_USER", payload: user });
    dispatch({ type: "SET_TOKEN", payload: token });
  };

  return <button onClick={handleLogin}>Login</button>;
};

export default Login;