import ProjectSelector from "../components/ProjectSelector";
import Metrics from "../components/Metrics";
export const appRoutes = [
  { path: "/", element: <ProjectSelector /> },
  { path: "/showMetrics/:projectId", element: <Metrics /> },
];