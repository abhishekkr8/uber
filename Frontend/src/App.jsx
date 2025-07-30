import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  GetStarted,
  UserLogin,
  CaptainLogin,
  UserHomeScreen,
  CaptainHomeScreen,
  UserProtectedWrapper,
  CaptainProtectedWrapper,
  UserSignup,
  CaptainSignup,
  RideHistory,
  UserEditProfile,
  CaptainEditProfile,
} from "./screens/";
import ChatScreen from "./screens/ChatScreen";
import VerifyEmail from "./screens/VerifyEmail";
import Error from "./screens/Error";
import ForgotPassword from "./screens/ForgotPassword";
import ResetPassword from "./screens/ResetPassword";

function App() {
  return (
    <div className="w-full h-dvh flex items-center">
      <div className="relative w-full sm:min-w-96 sm:w-96 h-full bg-white overflow-hidden">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GetStarted />} />
            <Route
              path="/home"
              element={
                <UserProtectedWrapper>
                  <UserHomeScreen />
                </UserProtectedWrapper>
              }
            />
            <Route path="/login" element={<UserLogin />} />
            <Route path="/signup" element={<UserSignup />} />
            <Route
              path="/user/edit-profile"
              element={
                <UserProtectedWrapper>
                  <UserEditProfile />
                </UserProtectedWrapper>
              }
            />
            <Route
              path="/user/rides"
              element={
                <UserProtectedWrapper>
                  <RideHistory />
                </UserProtectedWrapper>
              }
            />

            <Route
              path="/captain/home"
              element={
                <CaptainProtectedWrapper>
                  <CaptainHomeScreen />
                </CaptainProtectedWrapper>
              }
            />
            <Route path="/captain/login" element={<CaptainLogin />} />
            <Route path="/captain/signup" element={<CaptainSignup />} />
            <Route
              path="/captain/edit-profile"
              element={
                <CaptainProtectedWrapper>
                  <CaptainEditProfile />
                </CaptainProtectedWrapper>
              }
            />
            <Route
              path="/captain/rides"
              element={
                <CaptainProtectedWrapper>
                  <RideHistory />
                </CaptainProtectedWrapper>
              }
            />
            <Route path="/:userType/chat/:rideId" element={<ChatScreen />} />
            <Route path="/:userType/verify-email/" element={<VerifyEmail />} />
            <Route path="/:userType/forgot-password/" element={<ForgotPassword />} />
            <Route path="/:userType/reset-password/" element={<ResetPassword />} />
            
            <Route path="*" element={<Error />} />
          </Routes>
        </BrowserRouter>
      </div>
      <div className="hidden sm:block w-full h-full bg-[#eae1fe] overflow-hidden  select-none">
        <img
          className="h-full object-cover mx-auto  select-none "
          src="https://img.freepik.com/free-vector/taxi-app-service-concept_23-2148497472.jpg?semt=ais_hybrid"
          alt="Side image"
        />
      </div>
    </div>
  );
}

export default App;
