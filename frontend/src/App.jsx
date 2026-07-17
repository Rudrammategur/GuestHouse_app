import { BrowserRouter, Routes, Route } from "react-router-dom";

// Existing pages (unchanged)
import UserDashboard from "./pages/user/UserDashboard";
import TransportForm from "./pages/Transport/TransportForm";
import MyTransportBookings from "./pages/Transport/MyTransportBookings";
import MyRequests from "./pages/MyRequests";
import RequestTracking from "./pages/RequestTracking";
import MainDashboard from "./pages/dashboard/MainDashboard";
import TransportDashboard from "./pages/Transport/TransportDashboard";
import ApproverDashboard from "./pages/Approver/ApproverDashboard";
import ApproverRequestDetails from "./pages/Approver/ApproverRequestDetails";
import GHInchargeDashboard from "./pages/guesthouseIncharge/GHInchargeDashboard";
import GHAllocationPage from "./pages/guesthouseIncharge/GHAllocationPage";
import VerifierDashboard from "./pages/Verifier/VerifierDashboard";
import VerifierApplicationPage from "./pages/Verifier/VerifierApplicationPage";
import GuestHousePrintPage from "./components/Dashboard/GuestHousePrintPage";
import GHReceiptPage from "./pages/guesthouseIncharge/GHReceiptPage";
import UserSwitcher from "./components/UserSwitcher";
import GHCheckInDashboard from "./pages/guesthouseIncharge/GHCheckInDashboard";
import GHCheckInPage from "./pages/guesthouseIncharge/GHCheckInPage";
import GHCheckOutPage from "./pages/guesthouseIncharge/GHCheckOutPage";
import GHCheckOutDashboard from "./pages/guesthouseIncharge/GHCheckOutDashboard";
import ApproverApplicationPage from "./pages/Approver/ApproverApplicationPage";
import EmployeeDashboard from "./pages/GuestHouse/EmployeeDashboard";
import GuestHouseForm from "./pages/GuestHouse/GuestHouseForm";
import GuestHousePreview from "./pages/GuestHouse/GuestHousePreview";
import ApplicantApplicationPage from "./pages/guesthouse/ApplicantApplicationPage";
import MyGuestHouseBookings from "./pages/guesthouse/MyGuestHouseBookings";
import ReportViewer from "./pages/Admin/Reports/ReportViewer";
import WorkflowManagement from "./pages/Admin/WorkflowManagement";
import GHInchargeApplicationPage from "./pages/guesthouseIncharge/GHInchargeApplicationPage";
import AdminApplicationPage from "./pages/Admin/AdminApplicationPage";



import AdminLayout from "./components/Admin/AdminLayout";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminApplications from "./pages/Admin/AdminApplications";
import MastersDashboard from "./pages/Admin/MastersDashboard";
import UserManagement from "./pages/Admin/UserManagement";
import ReportsDashboard from "./pages/Admin/Reports/ReportsDashboard";
import AuditLogs from "./pages/Admin/AuditLogs";
import SystemSettings from "./pages/Admin/SystemSettings";
import RoomMaster from "./pages/Admin/RoomMaster";
import GuestHouseMaster from "./pages/Admin/guestHouseMaster";
import GuestTypeMaster from "./pages/Admin/GuestTypeMaster";
import RoomChargesMaster from "./pages/Admin/RoomChargesMaster";
import AdminRoomAvailability from "./pages/Admin/AdminRoomAvailability";

function App() {
  return (
    <BrowserRouter>
      <UserSwitcher />
      <Routes>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/my-requests" element={<MyRequests />} />
        <Route path="/tracking/:id" element={<RequestTracking />} />
        <Route path="/approver" element={<ApproverDashboard />} />
        <Route path="/approver/request/:id" element={<ApproverRequestDetails />} />
        <Route path="/approver/application/:bookingId" element={<ApproverApplicationPage />} />
        <Route path="/gh-incharge" element={<GHInchargeDashboard />} />
        <Route path="/guesthouse/allocation/:bookingId" element={<GHAllocationPage />} />
        <Route path="/verifier" element={<VerifierDashboard />} />
        <Route path="/verifier/application/:bookingId" element={<VerifierApplicationPage />} />
        <Route path="/guesthouse/print/:id" element={<GuestHousePrintPage />} />
        <Route path="/guesthouse/receipt/:bookingId" element={<GHReceiptPage />} />
        <Route path="/gh-incharge/checkins" element={<GHCheckInDashboard />} />
        <Route path="/gh-incharge/checkin/:bookingId" element={<GHCheckInPage />} />
        <Route path="/gh-incharge/checkout/:bookingId" element={<GHCheckOutPage />} />
        <Route path="/gh-incharge/checkouts" element={<GHCheckOutDashboard />} />
        <Route path="/admin/guesthouses" element={<GuestHouseMaster />} />
        <Route path="/admin/guest-types" element={<GuestTypeMaster />} />
        <Route path="/admin/room-charges" element={<RoomChargesMaster />} />
        <Route
    path="/ghincharge/application/:bookingId"
    element={<GHInchargeApplicationPage />}
/>
        {/* ===========================
   Guest House - Employee
=========================== */}

        <Route
          path="/guesthouse/dashboard"
          element={<EmployeeDashboard />}
        />

        <Route
          path="/guesthouse/apply"
          element={<GuestHouseForm />}
        />

        <Route
          path="/guesthouse/preview"
          element={<GuestHousePreview />}
        />

        <Route
    path="/guesthouse/application/:bookingId"
    element={<ApplicantApplicationPage />}
/>

        <Route
          path="/guesthouse/my-bookings"
          element={<MyGuestHouseBookings />}
        />


        <Route path="/admin" element={<AdminLayout />}>

          <Route
            index
            element={<AdminDashboard />}
          />

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="applications"
            element={<AdminApplications />}
          />

          <Route
            path="guesthouses"
            element={<MastersDashboard />}
          />

          <Route
    path="application/:bookingId"
    element={<AdminApplicationPage />}
/>

          <Route

path="workflow"

element={<WorkflowManagement />}

/>

          <Route
            path="users"
            element={<UserManagement />}
          />

          <Route path="/admin/reports"

            element={<ReportsDashboard />}

          />

          <Route

            path="/admin/reports/:reportType"

            element={<ReportViewer />}

          />

          <Route
            path="audit"
            element={<AuditLogs />}
          />

          <Route
            path="settings"
            element={<SystemSettings />}
          />

          <Route

            path="rooms"

            element={<RoomMaster />}

          />

        </Route>
        
        <Route path="/admin/room-availability" element={<AdminRoomAvailability />}/>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
