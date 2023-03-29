import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScorePage from "./ScorePage";
import ListPage from "./ListPage";
import ScoreAnalysis from "./ScoreAnalysis";


const Routers = () => {
  return(
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<ScorePage/>}/>
        <Route path="/List" element={<ListPage/>}/>
        <Route path="/Analysis" element={<ScoreAnalysis/>}/>

    </Routes>
</BrowserRouter>
  )
}
export default Routers