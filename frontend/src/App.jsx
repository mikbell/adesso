import { useState } from "react"
import Router from "./router/Router"
import PublicRoute from "./router/routes/publicRoutes"
import { useEffect } from "react"
import { getRoutes } from "./router/routes"

function App() {
  const publicRoutePath = PublicRoute
  const [allRoutes, setAllRoutes] = useState([...publicRoutePath])

  useEffect(() => {
    const routes = getRoutes()
    setAllRoutes([...allRoutes, routes])
  }, [])

  return <Router allRoutes={allRoutes} />
}

export default App
