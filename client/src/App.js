import "./App.css";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import React from "react";
import Register from "./pages/Register";
import HomePage from "./pages/Homepage";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import PasswordRecovery from "./pages/PasswordRecovery";
import PasswordReset from "./pages/PasswordReset";
import RegisterSuccessful from "./pages/RegisterSuccessful";
import PasswordRecovered from "./pages/PasswordRecovered";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import Generate from "./pages/Generate";
import CSVUploadVenue from "./pages/CSVUploadVenue";
import CSVUploadUnit from "./pages/CSVUploadUnit";
import OTPVerification from "./pages/OTPVerification";
import ChangePassword from "./pages/ChangePassword";
import VenueUploadFail from "./pages/VenueUploadFail";
import UnitUploadFail from "./pages/UnitUploadFail";
import VenueUploadSucceed from "./pages/VenueUploadSucceed";
import UnitUploadSucceed from "./pages/UnitUploadSucceed";
import Manage from "./pages/Manage";
import CSVUploadCFS from "./pages/CSVUploadCFS";
import LogoutBufferPage from "./pages/LogoutBufferPage";
import ChangePasswordBufferPage from "./pages/ChangePasswordBufferPage";
import ScheduleByVenue from "./pages/scheduleByVenue";
import ScheduleByDay from "./pages/scheduleByDay";
import CSVUploadCohorts from "./pages/CSVUploadCohorts";
import CSVUploadDisciplines from "./pages/CSVUploadDisciplines";
import CSVUploadFaculties from "./pages/CSVUploadFaculties";
import CSVUploadStaff from "./pages/CSVUploadStaff";
import Pipeline from "./pages/Pipeline";
import PropertyManage from "./pages/PropertyManage";
import ScheduleByUnit from "./pages/scheduleByUnit";
import { TimetableProvider } from "./utils/TimetableContext";
import TimetableGenerated from "./pages/TimetableGenerated";
import ImportTimetable from "./pages/ImportTimetable";
import TimetableConfigurationDashboard from "./pages/TimetableConfigurationDashboard";
import InputTestDataPage from "./pages/InputTestDataPage";
import CSVUploadUnitSession from "./pages/CSVUploadUnitSession";
import ReviewResultsPage from "./pages/ReviewResultsPage";

function App() {
  return (
    <TimetableProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/registered" element={<RegisterSuccessful />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/forget-pwd" element={<PasswordRecovery />}></Route>
          <Route path="/change-pwd" element={<ChangePassword />}></Route>
          <Route path="/verify-otp" element={<OTPVerification />}></Route>
          <Route path="/reset-pwd" element={<PasswordReset />}></Route>
          <Route path="/pwd-recovered" element={<PasswordRecovered />}></Route>
          <Route path="/manage-property" element={<PropertyManage />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/profile" element={<UserProfile />}></Route>
          <Route path="/generate" element={<Generate />}></Route>
          <Route path="/venue-csv-upload" element={<CSVUploadVenue />}></Route>
          <Route path="/unit-csv-upload" element={<CSVUploadUnit />}></Route>
          <Route path="/cfs-csv-upload" element={<CSVUploadCFS />}></Route>
          <Route
            path="/input-test-data"
            element={<InputTestDataPage />}
          ></Route>
          <Route
            path="/cohorts-csv-upload"
            element={<CSVUploadCohorts />}
          ></Route>
          <Route
            path="/disciplines-csv-upload"
            element={<CSVUploadDisciplines />}
          ></Route>
          <Route
            path="/unit-session-csv-upload"
            element={<CSVUploadUnitSession />}
          ></Route>
          <Route
            path="/faculties-csv-upload"
            element={<CSVUploadFaculties />}
          ></Route>
          <Route path="/staff-csv-upload" element={<CSVUploadStaff />}></Route>
          <Route
            path="/venue-upload-fail"
            element={<VenueUploadFail />}
          ></Route>
          <Route path="/unit-upload-fail" element={<UnitUploadFail />}></Route>
          <Route path="/schedule-by-day" element={<ScheduleByDay />}></Route>
          <Route
            path="/schedule-by-venue"
            element={<ScheduleByVenue />}
          ></Route>
          <Route path="/schedule-by-unit" element={<ScheduleByUnit />} />
          <Route path="/manage" element={<Manage />}></Route>
          <Route path="/pipeline" element={<Pipeline />}></Route>
          <Route
            path="/logout-buffer-page"
            element={<LogoutBufferPage />}
          ></Route>
          <Route
            path="/change-password-buffer-page"
            element={<ChangePasswordBufferPage />}
          ></Route>
          <Route
            path="/venue-upload-succeed"
            element={<VenueUploadSucceed />}
          ></Route>
          <Route
            path="/unit-upload-succeed"
            element={<UnitUploadSucceed />}
          ></Route>
          <Route
            path="/timetable-generated"
            element={<TimetableGenerated />}
          ></Route>
          <Route path="/import-timetable" element={<ImportTimetable />}></Route>
          <Route
            path="/timetable-configuration"
            element={<TimetableConfigurationDashboard />}
          />
          <Route
            path="/review-results"
            element={<ReviewResultsPage />}
          ></Route>
          <Route path="*" element={<PageNotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </TimetableProvider>
  );
}

export default App;
