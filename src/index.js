
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";


import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import Tenant from "layouts/Tenant";
import Agent from "layouts/Agent";
import Staff from "layouts/Staff";
import Vendor from "layouts/Vendor";
import SuperAdmin from "../src/superadmin/layouts/SuperAdmin";
import Trial from "layouts/Trial";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/auth/*" element={<AuthLayout />} />
      <Route path="*" element={<Navigate to="/admin/index" replace />} />
      <Route path="/superadmin/*" element={<SuperAdmin />} />
      <Route path="/tenant/*" element={<Tenant />} />
      <Route path="/agent/*" element={<Agent/>} />
      <Route path="/staff/*" element={<Staff/>} />
      <Route path="/vendor/*" element={<Vendor/>} />
      <Route path="/trial/*" element={<Trial/>} />

    </Routes> 
  </BrowserRouter>
);


