import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import { useEffect, useState } from "react";
import PrivateRoutes from "../components/PrivateRoutes";
import ProtectedRoute from "../components/ProtectedRoute";

// Admin Pages
import AdminLogin from "../Admin/AdminLogin";
import Dashboard from "../Admin/Dashboard";
import PageNotFound from "../Admin/PageNotFound";
import Create_Admin_User from "../Admin/settingsPages/Create_Admin_User";
import Create_Admin_Role from "../Admin/settingsPages/Create_Admin_Role";
import CategoryForm from "../Admin/settingsPages/CategoryForm";
import ManageAllowedCountries from "../Admin/settingsPages/ManageAllowedCountries";
import AllVenuesAdmin from "../Admin/Sidebarpages/Venue/AllVenues";
import AddVenueAdmin from "../Admin/Sidebarpages/Venue/AddVenue";
import EditVenueAdmin from "../Admin/Sidebarpages/EditVenue";
import ViewVenue from "../Admin/Sidebarpages/Venue/ViewVenue";
import Venuedetails from "../Admin/Sidebarpages/Venue/Venuedetails";
import AllEntertainerAdmin from "../Admin/Sidebarpages/AllEntertainer";
import ViewEntertainer from "../Admin/Sidebarpages/ViewEntertainer";
import AddEntertainer from "../Admin/Sidebarpages/AddEntertainer";
import EditEntertainer from "../Admin/Sidebarpages/EditEntertainer";
import AllUser from "../Admin/Sidebarpages/AllUser";
import EditUser from "../Admin/Sidebarpages/EditUser";
import AddUser from "../Admin/Sidebarpages/AddUser";
import AllUserCopy from "../Admin/Sidebarpages/AllUsercopy";
import CreateEvent from "../Admin/Sidebarpages/Events/CreateEvent";
import EventsList from "../Admin/Sidebarpages/Events/EventsList";
import ViewEventDetails from "../Admin/Sidebarpages/Events/ViewEventDetails";
import EditEvent from "../Admin/Sidebarpages/Events/EditEvent";

// User Pages (Venues & Entertainers)
import PublicHome from "../pages/Home";
import PublicSignup from "../pages/Signup";
import StatusVerification from "../pages/StatusVerification";
import ErrorPage from "../pages/ErrorPage";
import VenueDash from "../pages/Venue/VenueDash";
import VenueProfile from "../pages/Venue/VenueProfile";
import VenueCalendar from "../pages/Venue/VenueCalendar";
import AllEntertainer from "../pages/Venue/AllEntertainer";
import AllBookings from "../pages/Venue/AllBookings";
import EntertainerDetails from "../pages/Venue/EntertainerDetails";
import BookingPage from "../pages/Venue/BookingPage";
import EntertainerDash from "../pages/Entertainer/EntertainerDash";
import EntertainerProfile from "../pages/Entertainer/EntertainerProfile";
import BookingCalendar from "../pages/Entertainer/BookingCalendar";
import BookingRequest from "../pages/Entertainer/BookingRequest";
import AddVenue from "../pages/Venue/AddVenue";
import EditVenue from "../pages/Venue/EditVenue";
import AllVenues from "../pages/Venue/AllVenues";
import UserLogin from "../pages/Login";
import Login from "../pages/Login";
import AllInvoices from "../Admin/Sidebarpages/invoice/AllInvoices";
import Viewinvoice from "../Admin/Sidebarpages/invoice/Viewinvoice";
import ReportPage from "../Admin/Sidebarpages/Report/ReportPage";
import ContactPerson from "../pages/Venue/ContactPerson";
import WishlistPage from "../pages/Venue/WishlistPage";
import Events from "../pages/Venue/Events";
import VenueList from "../pages/Venue/VenueList";
import AddLocation from "../pages/Venue/AddLocation";
import AddEvents from "../pages/Venue/AddEvents";
import OtpVerification from "../pages/OtpVerification";
import ResetPassword from "../pages/ResetPassword";
import InvoicePage from "../pages/Venue/InvoicePage";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import TermsAndCondition from "../pages/TermsAndCondition";
import AddLocationVenue from "../pages/Venue/AddLocationVenue";
import EntertainerInvoice from "../pages/Entertainer/EntertainerInvoice";
import EntertainerEvents from "../pages/Entertainer/EntertainerEvents";
import EntertainerAvailability from "../pages/Entertainer/EntertainerAvailability";
import EntertainerReviews from "../pages/Entertainer/EntertainerReviews";
import EntertainerNotification from "../pages/Entertainer/EntertainerNotification";
import EntertainerGallery from "../pages/Entertainer/EntertainerGallery";
import EntertainerEventDetails from "../pages/Entertainer/EntertainerEventDetails";
import EntertainerInvoicePage from "../pages/Entertainer/EntertainerInvoicePage";
import VenueMessage from "../pages/Venue/VenueMessage";
const basename = import.meta.env.VITE_BASE || "/P/";
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes */}
      <Route path="/" element={<PublicHome />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup/venue" element={<PublicSignup />} />
      <Route path="/signup/entertainer" element={<PublicSignup />} />
      <Route path="/statusverification" element={<StatusVerification />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/otpverification" element={<OtpVerification />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms-and-conditions" element={<TermsAndCondition />} />


      {/* Protected User Routes (Venues & Entertainers) */}
      <Route element={<ProtectedRoute allowedRoles={["venue"]} />}>
        <Route path="/venue" element={<VenueDash />} />
        <Route path="/venue/profile" element={<VenueProfile />} />
        <Route path="/venue/entertainers" element={<AllEntertainer />} />
        <Route path="/venue/bookings" element={<AllBookings />} />
        <Route path="/venue/calendar" element={<VenueCalendar />} />
        <Route path="/venue/add" element={<AddVenue />} />
        <Route path="/venue/edit" element={<EditVenue />} />
        <Route path="/venue/venues" element={<AllVenues />} />
        <Route
          path="/venue/entertainerDetails"
          element={<EntertainerDetails />}
        />
        <Route path="/venue/bookingPage" element={<BookingPage />} />
        <Route path='/venue/contactPerson' element={<ContactPerson />} />
        <Route path='/venue/wishlist' element={<WishlistPage />} />
        <Route path='/venue/events' element={<Events />} />
        <Route path='/venue/locations' element={<VenueList />} />
        <Route path="/venue/addlocation" element={<AddLocation />} />
        <Route path='/venue/addevents' element={<AddEvents />} />
        <Route path='/venue/addvenuelocation' element={<AddLocationVenue />} />
        <Route path='/venue/invoices' element={<InvoicePage />} />
        <Route path='/venue/message' element={<VenueMessage />} />


      </Route>

      <Route element={<ProtectedRoute allowedRoles={["entertainer"]} />}>
        <Route path="/entertainer" element={<EntertainerDash />} />
        <Route path="/entertainer/profile" element={<EntertainerProfile />} />
        <Route
          path="/entertainer/bookingrequest"
          element={<BookingRequest />}
        />
        <Route path="/entertainer/calendar" element={<BookingCalendar />} />
        <Route path="/entertainer/invoice" element={<EntertainerInvoice />} />
        <Route path="/entertainer/events" element={<EntertainerEvents />} />
        <Route path="/entertainer/availabilityform" element={<EntertainerAvailability />} />
        <Route path="/entertainer/reviews" element={<EntertainerReviews />} />
        <Route path="/entertainer/notifications" element={<EntertainerNotification />} />
        <Route path="/entertainer/gallery" element={<EntertainerGallery />} />
        <Route path="/entertainer/events/details" element={<EntertainerEventDetails />} />
        <Route path="/entertainer/invoicepage" element={<EntertainerInvoicePage />} />





      </Route>

      {/* Admin Routes */}
      <Route element={<PrivateRoutes />}>
        <Route path="/admin/*">
          <Route index element={<Dashboard />} />
          <Route path="allVenues" element={<AllVenuesAdmin />} />
          <Route path="addvenue" element={<AddVenueAdmin />} />
          <Route path="editvenue" element={<EditVenueAdmin />} />
          <Route path="edituser" element={<EditUser />} />
          <Route path="viewvenue" element={<ViewVenue />} />
          <Route path="viewdetails" element={<Venuedetails />} />
          <Route path="addvenuelocation" element={<AddLocation />} />
          <Route path="viewentertainer" element={<ViewEntertainer />} />
          <Route path="editentertainer" element={<EditEntertainer />} />
          <Route path="addentertainer" element={<AddEntertainer />} />
          <Route path="alluser" element={<AllUser />} />
          <Route path="adduser" element={<AddUser />} />
          <Route path="allentertainer" element={<AllEntertainerAdmin />} />
          <Route path="createadminuser" element={<Create_Admin_User />} />
          <Route path="createadminrole" element={<Create_Admin_Role />} />
          <Route path="createcategory" element={<CategoryForm />} />
          <Route path="createevent" element={<CreateEvent />} />
          <Route path="allevents" element={<EventsList />} />
          <Route path="viewevent" element={<ViewEventDetails />} />
          <Route path="editevent" element={<EditEvent />} />
          <Route path="manageisallowed" element={<ManageAllowedCountries />} />
          <Route path="allusercopy" element={<AllUserCopy />} />
          <Route path="allinvoices" element={<AllInvoices />} />
          <Route path="viewinvoice" element={<Viewinvoice />} />
          <Route path="report" element={<ReportPage />} />
        </Route>
      </Route>

      {/* Catch-All Route */}
      <Route path="*" element={<PageNotFound />} />
    </>
  ),
  {
    basename,
    future: {
      v7_relativeSplatPath: true,
      v7_startTransition: true, // ✅ Fixes the warning
    },
  }
);

export default router;
