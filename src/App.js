import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScorePage from "./ScorePage";
import ListPage from "./ListPage";
import RankingTop from "./RankingTop";
import TotalTopRanking from "./TotalTopRanking";
import TotalScoreRanking from "./TotalScoreRanking";
const Routers = () => {
  return(
    <BrowserRouter>
    <Routes>
        <Route path="/" element={<ScorePage/>}/>
        <Route path="/List" element={<ListPage/>}/>
        <Route path="/RankingTop" element={<RankingTop/>}/>
        <Route path="/TotalTopRanking" element={<TotalTopRanking/>}/>
        <Route path="/TotalScoreRanking" element={<TotalScoreRanking/>}/>
    </Routes>
</BrowserRouter>
  )
}
export default Routers