// make sure you include the timeline stylesheet or the timeline will not be styled
//import "react-calendar-timeline/lib/Timeline.css";
import "../components/styled/timeline.css";
import PipelineView from "../components/PipelineView";
import NavbarAuth from "../components/NavbarAuth";
import { UnAuthRedirect } from "../utils/UnAuthRedirect";
import Footer from "../components/Footer";

export default function Pipeline() {
  UnAuthRedirect();
  return (
    <div>
      <NavbarAuth />
      <PipelineView />
      <Footer />
    </div>
  );
}
