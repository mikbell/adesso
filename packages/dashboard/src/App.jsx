// src/App.jsx
import { useEffect, lazy, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { getUserProfile } from "@adesso/core-logic";

// -> Importa i tuoi componenti e rotte...
import { LoadingPage } from "@adesso/ui-components";
import publicRoutes from "./router/routes/publicRoutes";
import privateRoutes from "./router/routes/privateRoutes";
import ProtectedRoute from "./router/ProtectedRoute";
import PublicRoute from "./router/PublicRoute";

const MainLayout = lazy(() => import('./layout/MainLayout.jsx'));

function App() {
  const dispatch = useDispatch();
  // -> Seleziona il nuovo stato e userInfo
  const { authStatus, userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    // -> Esegui il controllo solo una volta, all'avvio dell'app
    if (authStatus === 'idle') {
      dispatch(getUserProfile());
    }
  }, [authStatus, dispatch]);

  // ▼▼▼ LA LOGICA CHIAVE ▼▼▼
  // Se stiamo ancora verificando l'autenticazione, mostra una schermata di caricamento globale.
  // Questo impedisce al router di attivarsi prematuramente.
  if (authStatus === 'loading' || authStatus === 'idle') {
    return <LoadingPage />;
  }

  // Una volta che il controllo è finito, renderizza l'app.
  return (
    <Suspense fallback={<LoadingPage />}>
      <Routes>
        {/* Rotte Pubbliche */}
        {publicRoutes.map((route, index) => (
          <Route
            key={index}
            path={route.path}
            element={<PublicRoute>{route.element}</PublicRoute>}
          />
        ))}

        {/* Rotte Private */}
        <Route path="/" element={<ProtectedRoute roles={['admin', 'seller']}><MainLayout /></ProtectedRoute>}>
          {privateRoutes.map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<ProtectedRoute route={route}>{route.element}</ProtectedRoute>}
            />
          ))}
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;