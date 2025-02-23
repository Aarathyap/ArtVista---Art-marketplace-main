import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { UserContextProvider } from "./context/UserContext";
import Cart from './pages/Cart';
import Shop from "./pages/Shop";
import Wishlist from './pages/Wishlist';
import CreateWork from './pages/CreateWork';
import UpdateWork from "./pages/UpdateWork";
import WorkDetails from "./pages/WorkDetails";
import Search from "./pages/Search";
import Success from "./pages/Success";
import Order from "./pages/Order";
import AdminPanel from "./pages/AdminPanel";


export default function App() {
  return (
    <div >
      <UserContextProvider>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/createWork" element={<CreateWork />} />
        <Route path="/updateWork" element={<UpdateWork />} />
        <Route path="/workDetails" element={<WorkDetails />} />
        <Route path="/search/:query" element={<Search />} />
        <Route path="/order" element={<Order />} />
        <Route path="/success" element={<Success />} />
        <Route path="/admin" element={<AdminPanel />} />
       </Routes>
      </UserContextProvider>
    </div>
  )
}
