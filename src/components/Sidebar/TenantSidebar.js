import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Link, NavLink as NavLinkRRD, useLocation } from "react-router-dom";
import {
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  NavLink,
  Row,
} from "reactstrap";
import routes from "routes";
import "./style.css";
import Key from "../../assets/icons/AdminSidebar/Key.svg";
import DownArrow from "../../assets/icons/AdminSidebar/DownArrow.svg";
import Thumb from "../../assets/icons/AdminSidebar/Thumb.svg";
import Maintenance from "../../assets/icons/AdminSidebar/Maintenance.svg";

const Sidebar = ({ logo, isCollapse, toggleCollapse }) => {
  const location = useLocation();
  const createLinks = () => {
    const filteredRoutes = routes.filter(
      (prop) =>
        (prop.name === "DashBoard" ||
          prop.name === "Profile" ||
          prop.name === "Financial" ||
          (prop.name === "Work Order" && prop.path === "/tenantwork") ||
          prop.name === "Property") &&
        prop.layout === "/tenant"
    );
    return filteredRoutes.map((prop, key) => {
      const path = prop.layout === "/tenant" ? "/tenant" : "/tenant";
      const isActive = location.pathname === path + prop.path;
      return (
        <NavItem key={key}>
          <NavLink
            to={path + prop.path}
            tag={NavLinkRRD}
            style={{ justifyContent: isCollapse && "center" }}
            className="d-flex align-items-center"
          >
            <span
              style={{
                marginRight: !isCollapse && "20px",
                marginLeft: !isCollapse && "10px",
              }}
            >
              {isActive ? (
                <img src={prop.icon2} width={20} />
              ) : (
                <img src={prop.icon} width={20} />
              )}
            </span>
            {!isCollapse && <>{prop.name}</>}
          </NavLink>
        </NavItem>
      );
    });
  };

  return (
    <>
      <div className={!isCollapse ? "sidebar" : "sidebar-active"}>
        <Nav vertical>
          <Link
            to="/admin/tenantdashboard"
            style={{
              marginTop: "40px",
              marginBottom: "30px",
              justifyContent: isCollapse && "center",
              padding: "15px",
            }}
          >
            {isCollapse ? (
              <img src={logo.imgSrc2} width={60} />
            ) : (
              <img src={logo.imgSrc} width={250} />
            )}
          </Link>
          {createLinks()}
        </Nav>
        <span
          className={isCollapse ? "collapse-btn-active" : "collapse-btn"}
          onClick={(e) => {
            toggleCollapse();
          }}
        >
          {isCollapse ? (
            <FontAwesomeIcon icon={faArrowRight} />
          ) : (
            <FontAwesomeIcon icon={faArrowLeft} />
          )}
        </span>
      </div>
    </>
  );
};

export default Sidebar;
