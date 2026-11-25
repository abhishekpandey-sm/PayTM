import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Signup } from "./pages/Signup"
import { Signin } from "./pages/Signin"
import { Dashboard } from "./pages/Dashboard"
import { SendMoney } from "./pages/SendMoney"
import { ProtectedRoutes } from "./components/ProtectedRoutes"
import { PublicRoutes } from "./components/PublicRoutes"



function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoutes/>}>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/signin" element={<Signin/>}/>
          </Route>

          <Route element={<ProtectedRoutes/>}>
            <Route path="/dashboard" element={<Dashboard/>}/>
            <Route path="/send" element={<SendMoney/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
