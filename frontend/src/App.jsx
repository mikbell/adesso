import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Router from "./router/Router";
import publicRoutes from "./router/routes/publicRoutes";
import { getRoutes } from "./router/routes";
import { getUserInfo } from "./store/reducers/authReducer";

function App() {
  const dispatch = useDispatch();
  const { token, userInfo } = useSelector((state) => state.auth);
  const [allRoutes, setAllRoutes] = useState([]);

  useEffect(() => {
    if (token) {
      dispatch(getUserInfo());
    }
  }, [token, dispatch]);

  useEffect(() => {
    const mainRoute = getRoutes();
    setAllRoutes([...publicRoutes, mainRoute]);

  }, [userInfo]);

  return <Router allRoutes={allRoutes} />;
}

export default App;
