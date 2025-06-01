import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import DefaultLayout from "./layouts/DefaultLayout";
import { Fragment } from "react";
import { AllRoutes } from "./routes/AllRoutes";
import PrivateRoute, { protectedRoutes } from "./routes/PrivateRoute";

function App() {
  
  return (
    <Router>
      <div className="App">
        <Routes>
          {AllRoutes.map((route, index) => {
            const Page = route.component;
            let Layout = DefaultLayout;

            if (route.layout) {
              Layout = route.layout;
            } else if (route.layout === null) {
              Layout = Fragment;
            }

            const isProtected = protectedRoutes.includes(route.path);

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  isProtected ? (
                    <PrivateRoute>
                      <Layout>
                        <Page />
                      </Layout>
                    </PrivateRoute>
                  ) : (
                    <Layout>
                      <Page />
                    </Layout>
                  )
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
