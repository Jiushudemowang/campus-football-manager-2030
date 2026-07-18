import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { StartPage } from "./pages/StartPage";
import { GamePage } from "./pages/GamePage";
import { EndingPage } from "./pages/EndingPage";
import { GalleryPage } from "./pages/GalleryPage";
import { TimelinePage } from "./pages/TimelinePage";
import { ChessMatchPage } from "./pages/ChessMatchPage";
import { CollectionPage } from "./pages/CollectionPage";
import { ManagerHubPage } from "./pages/ManagerHubPage";
import { SquadSetupPage } from "./pages/SquadSetupPage";
import { TrainingPage } from "./pages/TrainingPage";
import { TrainingPlayerPage } from "./pages/TrainingPlayerPage";
import { MatchHistoryPage } from "./pages/MatchHistoryPage";
import { QuestPage } from "./pages/QuestPage";
import { QuizPage } from "./pages/QuizPage";
import { TeamCardsPage } from "./pages/TeamCardsPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/ending" element={<EndingPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/match" element={<ChessMatchPage />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/manager" element={<ManagerHubPage />} />
        <Route path="/manager/squad" element={<SquadSetupPage />} />
        <Route path="/manager/training" element={<TrainingPage />} />
        <Route path="/manager/training/:playerId" element={<TrainingPlayerPage />} />
        <Route path="/manager/history" element={<MatchHistoryPage />} />
        <Route path="/manager/quests" element={<QuestPage />} />
        <Route path="/manager/quiz" element={<QuizPage />} />
        <Route path="/team-cards" element={<TeamCardsPage />} />
      </Routes>
    </Router>
  );
}
