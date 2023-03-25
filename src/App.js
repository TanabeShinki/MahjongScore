import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScorePage from "./ScorePage";
import ListPage from "./ListPage";

const Routers = () => {
  return(
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<ScorePage/>}/>
        <Route path="/List" element={<ListPage/>}/>
    </Routes>
</BrowserRouter>
  )
}
export default Routers