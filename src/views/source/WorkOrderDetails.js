import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Header from "components/Headers/Header";
import {
  Card,
  CardHeader,
  FormGroup,
  Container,
  Row,
  Col,
  Table,
  Button,
  Input,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Form,
} from "reactstrap";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendarAlt,
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { styled } from "@material-ui/core";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Modal,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";

const WorkOrderDetails = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageGetUrl = process.env.REACT_APP_IMAGE_GET_URL;
  const { workorder_id, admin } = useParams();
  const [outstandDetails, setoutstandDetails] = useState({});
  const [workOrderStatus, setWorkOrderStatus] = useState("");
  const [showTenantTable, setShowTenantTable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeButton, setActiveButton] = useState("Summary");
  const [updateButton, setUpdateButton] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState(null);
  let navigate = useNavigate();

  let cookies = new Cookies();

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      // setAccessType(jwt.accessType);
      setUser(jwt.userName);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);
  const handleUpdateButtonClick = () => {
    // Add any logic or state changes you need before opening the dialog
    setUpdateButton(true);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    // Add any logic or state changes you need when the dialog is closed
    setOpenDialog(false);
  };

  const getOutstandData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/work-order/workorder_details/${workorder_id}`
      );
      setoutstandDetails(response.data.data);
      setWorkOrderStatus(response.data.data);
      setLoading(false);
      setImageDetails(response.data.data.workOrderImage);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      setError(error);
      setLoading(false);
    }
  };

  // const getOutstandData = async () => {
  //   try {
  //     const response = await axios.get(
  //       `${baseUrl}/work-order/workorder_details/${workorder_id}`
  //     );
  //     setoutstandDetails(response.data.data);
  //     setWorkOrderStatus(response.data.data.workorder_status.reverse());
  //     setSelectedStatus(response.data.data.status);
  //     setSelecteduser(response.data.data.staffmember_name);
  //     updateWorkorderFormik.setValues({
  //       status: response.data.data.status,
  //       // staffmember_name: response.data.data.staffmember_name,
  //       due_date: response.data.data.due_date,
  //       assigned_to: response.data.data.staffmember_name,
  //       message: response.data.data.message ? response.data.data.message : "",
  //       statusUpdatedBy: response.data.data.statusUpdatedBy
  //         ? response.data.data.statusUpdatedBy
  //         : "Admin",
  //     });
  //     setLoading(false);
  //     setImageDetails(response.data.data.workOrderImage);
  //   } catch (error) {
  //     console.error("Error fetching tenant details:", error);
  //     setError(error);
  //     setLoading(false);
  //   }
  // };
  const SmallSummaryCard = ({ label, value, textTruncate }) => {
    return (
      <div className="small-summary-card p-3">
        <h6 className="text-uppercase text-muted mb-0">{label}</h6>
        <span
          className={`font-weight-bold ${textTruncate ? "text-truncate" : ""}`}
        >
          {value}
        </span>
      </div>
    );
  };
  const detailstyle = {
    fontSize: "15px",
    color: "#525f7f",
    fontWeight: 600,
  };

  const updateWorkorderFormik = useFormik({
    initialValues: {
      status: "",
      staffmember_name: "",
      due_date: "",
      // assigned_to: "",
      message: "",
      statusUpdatedBy: "",
    },
    onSubmit: (values) => {
      //console.log(values);
      // updateValues()
      // updateWorkorder(values);
    },
  });

  const updateValues = async () => {
    console.log(selectedStatus, "selected status");
    handleDialogClose();
    const formatedDate = updateWorkorderFormik.values.due_date
      ? new Date(updateWorkorderFormik.values.due_date)
          .toISOString()
          .split("T")[0]
      : "";
    await axios
      .put(`${baseUrl}/workorder/updateworkorder/${outstandDetails._id}`, {
        due_date: formatedDate,
        staffmember_name: selecteduser,
        message: updateWorkorderFormik.values.message,
        status: selectedStatus,
      })
      .then((res) => {
        console.log(res.data, "the wgike put");
        getOutstandData();
      })
      .catch((err) => {
        console.log(err);
      });

    await axios
      .put(`${baseUrl}/workorder/workorder/${outstandDetails._id}/status`, {
        statusUpdatedBy: user,
        status:
          selectedStatus !== outstandDetails.status ? selectedStatus : " ",
        due_date:
          formatedDate !== outstandDetails.due_date ? formatedDate : " ",
        staffmember_name:
          selecteduser !== outstandDetails.staffmember_name
            ? selecteduser
            : " ",
        // updateAt: updatedAt,
      })
      .then((res) => {
        console.log(res.data, "the status put");
        getOutstandData();
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // console.log(outstandDetails);

  // const handleMouseEnter = (buttonValue) => {
  //   setHoveredButton(buttonValue);
  // };

  // const handleMouseLeave = () => {
  //   setHoveredButton(null);
  // };

  const handleChange = () => {
    setShowTenantTable(!showTenantTable);
  };
  const [selectedStatus, setSelectedStatus] = useState("Select");
  const [statusdropdownOpen, setstatusdropdownOpen] = React.useState(false);
  const [userdropdownOpen, setuserdropdownOpen] = React.useState(false);
  const [selecteduser, setSelecteduser] = useState("Select");
  const [staffData, setstaffData] = useState([]);

  const toggle5 = () => setuserdropdownOpen((prevState) => !prevState);

  const toggle6 = () => setstatusdropdownOpen((prevState) => !prevState);

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    // WorkFormik.values.status = status;
  };

  const handleStaffSelect = (staff) => {
    setSelecteduser(staff);
    // WorkFormik.values.staffmember_name = staff;
  };

  function formatDateWithoutTime(dateString) {
    if (!dateString) return "";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${month}-${day}-${year}`;
  }

  React.useEffect(() => {
    getOutstandData();
    fetch(`${baseUrl}/addstaffmember/find_staffmember`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setstaffData(data.data);
        } else {
          // Handle error
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  }, [workorder_id]);

  const [propertyDetails, setPropertyDetails] = useState({});

  const getPropertyData = async () => {
    if (outstandDetails.rental_units === "") {
      try {
        const response = await axios.get(
          `${baseUrl}/propertyunit/property/${outstandDetails.rental_adress}`
        );
        setPropertyDetails(response.data[0]);
      } catch (error) {
        console.error("Error fetching tenant details:", error);
      }
    } else if (outstandDetails.rental_adress && outstandDetails.rental_units) {
      try {
        const response = await axios.get(
          `${baseUrl}/propertyunit/property/${outstandDetails.rental_adress}/${outstandDetails.rental_units}`
        );
        setPropertyDetails(response.data[0]);
      } catch (error) {
        console.error("Error fetching tenant details:", error);
      }
    }
  };

  React.useEffect(() => {
    getPropertyData();
  }, [outstandDetails]);

  const [imagedetails, setImageDetails] = useState([]);

  const [tenantsDetails, setTenantsDetails] = useState();

  const getTenantsData = async () => {
    try {
      const response = await axios.get(`${baseUrl}/tenant/findData`, {
        params: {
          rental_adress: propertyDetails?.rental_adress,
          rental_units: propertyDetails?.rental_units,
        },
      });
      response.data.map((data) => {
        data.entries.map((item) => {
          const currentDate = new Date();
          const sdate = new Date(item.start_date);
          const edate = new Date(item.end_date);

          // Compare the current date with start and end dates
          if (
            currentDate >= sdate &&
            currentDate < edate &&
            item.rental_adress === propertyDetails?.rental_adress &&
            item.rental_units === propertyDetails?.rental_units
          ) {
            // console.log('Response is OK');
            setTenantsDetails(data);
          }
        });
      });
    } catch (error) {
      console.error("Error fetching tenant details:", error);
      //setError(error);
    }
  };

  React.useEffect(() => {
    getTenantsData();
  }, [propertyDetails]);

  const tableHeaderStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    fontWeight: "bold",
    textAlign: "left",
  };

  const tableCellStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "left",
  };

  const tableFooterStyle = {
    border: "1px solid #ccc",
    padding: "8px",
    textAlign: "left",
  };

  const total = () => {
    let total = 0;
    outstandDetails?.partsandcharge_data?.map((item) => {
      total = total + item.amount;
    });
    return total;
  };

  const isBlobURL = (url) => {
    return url.startsWith("blob:");
  };

  return (
    <>
      <Header />
      {/* Page content */}
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              <h1 style={{ color: "white" }}>Work Order Details</h1>
            </FormGroup>
          </Col>
          <Col className="text-right">
            <Button
              color="primary"
              href="#rms"
              onClick={() => navigate(`/${admin}/Workorder`)}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Back
            </Button>
          </Col>
        </Row>
        <br />
        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <ToggleButtonGroup
                  color="primary"
                  // value={alignment}
                  exclusive
                  onChange={handleChange}
                  aria-label="Platform"
                >
                  <ToggleButton
                    value="Summary"
                    style={{
                      border: "none",
                      background: "none",
                      textTransform: "capitalize",
                      cursor: "pointer",
                      color: activeButton === "Summary" ? "blue" : "inherit",
                      // textDecoration: activeButton === 'Summary' ? 'underline' : 'none',
                    }}
                    // onMouseEnter={() => handleMouseEnter("Summary")}
                    // onMouseLeave={handleMouseLeave}
                    onClick={() => setActiveButton("Summary")}
                  >
                    Summary
                  </ToggleButton>

                  <ToggleButton
                    value="Task"
                    style={{
                      border: "none",
                      background: "none",
                      textTransform: "capitalize",
                      cursor: "pointer",
                      color: activeButton === "Task" ? "blue" : "inherit",
                      // textDecoration: activeButton === 'Task' ? 'underline' : 'none',
                    }}
                    // onMouseEnter={() => handleMouseEnter("Task")}
                    // onMouseLeave={handleMouseLeave}
                    onClick={() => setActiveButton("Task")}
                  >
                    Task
                  </ToggleButton>
                </ToggleButtonGroup>
              </CardHeader>
              <div className="table-responsive">
                {activeButton === "Summary" && (
                  <div className="container-fluid">
                    <Row className="mb-4">
                      <Col lg="8" md="12">
                        {loading ? (
                          <div>Loading Work Order details...</div>
                        ) : error ? (
                          <div>Error: {error.message}</div>
                        ) : outstandDetails?.workOrder_id ? (
                          <>
                            <Box
                              border="1px solid #ccc"
                              borderRadius="8px"
                              padding="16px"
                              maxWidth="700px"
                              margin="20px"
                            >
                              <Box
                                display="flex"
                                alignItems="center"
                                marginBottom="20px"
                              >
                                <Box
                                  width="40px"
                                  height="40px"
                                  display="flex"
                                  alignItems="center"
                                  justifyContent="center"
                                  backgroundColor="grey"
                                  borderRadius="8px"
                                  color="white"
                                  fontSize="24px"
                                  marginRight="16px"
                                >
                                  <AssignmentOutlinedIcon />
                                </Box>
                                <Box flex="1">
                                  <h2
                                    className="text text-lg"
                                    style={{ color: "blue" }}
                                  >
                                    {outstandDetails?.work_subject || "N/A"}
                                  </h2>
                                  <span>
                                    {outstandDetails?.property_data
                                      ?.rental_adress || "N/A"}
                                  </span>
                                </Box>
                              </Box>
                              <Box
                                display="flex"
                                flexDirection={{ xs: "column", md: "row" }}
                                alignItems="stretch"
                              >
                                {/* Left side */}
                                <Box
                                  flex="1"
                                  className={{ xs: "col-12", md: "col-7" }}
                                  marginBottom={{ xs: "20px", md: "0" }}
                                >
                                  <FormGroup marginBottom="20px">
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-property"
                                      style={{
                                        marginBottom: "10px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Description
                                    </label>
                                    <span
                                      style={{
                                        fontSize: "13px",
                                        display: "block",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {outstandDetails?.work_performed || "N/A"}
                                    </span>
                                  </FormGroup>
                                  <FormGroup marginBottom="20px">
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-property"
                                      style={{
                                        marginBottom: "10px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Permission to enter
                                    </label>
                                    <span
                                      style={{
                                        fontSize: "13px",
                                        display: "block",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {outstandDetails?.entry_allowed
                                        ? "Yes"
                                        : "No"}
                                    </span>
                                  </FormGroup>
                                  <FormGroup marginBottom="20px">
                                    <label
                                      className="form-control-label"
                                      htmlFor="input-property"
                                      style={{
                                        marginBottom: "10px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Vendor Notes
                                    </label>
                                    <span
                                      style={{
                                        fontSize: "13px",
                                        display: "block",
                                        marginTop: "5px",
                                      }}
                                    >
                                      {outstandDetails?.vendor_notes || "N/A"}
                                    </span>
                                  </FormGroup>
                                </Box>

                                {/* Right side */}

                                <Box flex="1" className="d-flex flex-column">
                                  <Row
                                    style={{
                                      border: "1px solid #ccc",
                                      borderRadius: "8px",
                                      margin: "15px auto",
                                      width: "100%",
                                    }}
                                  >
                                    <Col style={{ padding: "0 8px" }}>
                                      <SmallSummaryCard
                                        label="Status"
                                        value={outstandDetails?.status || "N/A"}
                                        textTruncate // add this prop to enable text truncation
                                      />
                                    </Col>
                                  </Row>
                                  <Row
                                    style={{
                                      border: "1px solid #ccc",
                                      borderRadius: "8px",
                                      margin: "15px auto",
                                      width: "100%",
                                    }}
                                  >
                                    <Col style={{ padding: "0 8px" }}>
                                      <SmallSummaryCard
                                        label="Due Date"
                                        value={outstandDetails?.date || "N/A"}
                                        textTruncate // add this prop to enable text truncation
                                      />
                                    </Col>
                                  </Row>
                                  <Row
                                    style={{
                                      border: "1px solid #ccc",
                                      borderRadius: "8px",
                                      margin: "15px auto",
                                      width: "100%",
                                    }}
                                  >
                                    <Col style={{ padding: "0 8px" }}>
                                      <SmallSummaryCard
                                        label="Assignees"
                                        value={
                                          outstandDetails?.staff_data
                                            .staffmember_name || "N/A"
                                        }
                                        textTruncate // add this prop to enable text truncation
                                      />
                                    </Col>
                                  </Row>
                                </Box>
                              </Box>
                            </Box>
                            {outstandDetails?.partsandcharge_data?.length > 0 &&
                            outstandDetails?.partsandcharge_data ? (
                              <Box
                                border="1px solid #ccc"
                                borderRadius="8px"
                                padding="16px"
                                maxWidth="700px"
                                margin="20px"
                                style={{
                                  marginRight: "auto",
                                  overflowX: "auto",
                                }} // Center the box horizontally
                              >
                                <h2
                                  className="text text-lg"
                                  style={{ color: "blue" }}
                                >
                                  Parts and Labor
                                </h2>
                                <Box overflowX="auto">
                                  <table
                                    style={{
                                      width: "100%",
                                      borderCollapse: "collapse",
                                    }}
                                  >
                                    <thead>
                                      <tr>
                                        <th style={tableHeaderStyle}>QTY</th>
                                        <th style={tableHeaderStyle}>
                                          ACCOUNT
                                        </th>
                                        <th style={tableHeaderStyle}>
                                          DESCRIPTION
                                        </th>
                                        <th style={tableHeaderStyle}>PRICE</th>
                                        <th style={tableHeaderStyle}>AMOUNT</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {/* Add your table rows dynamically here */}
                                      {outstandDetails?.partsandcharge_data?.map(
                                        (item, index) => (
                                          <tr key={index}>
                                            <td style={tableCellStyle}>
                                              {item.parts_quantity}
                                            </td>
                                            <td style={tableCellStyle}>
                                              {item.account}
                                            </td>
                                            <td style={tableCellStyle}>
                                              {item.description}
                                            </td>
                                            <td
                                              style={{
                                                ...tableCellStyle,
                                                textAlign: "right",
                                              }}
                                            >
                                              ${item.parts_price}
                                            </td>
                                            <td
                                              style={{
                                                ...tableCellStyle,
                                                textAlign: "right",
                                              }}
                                            >
                                              ${item.amount}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                    <tfoot>
                                      <tr>
                                        <td
                                          colSpan="4"
                                          style={tableHeaderStyle}
                                        >
                                          Total
                                        </td>
                                        <td
                                          style={{
                                            ...tableFooterStyle,
                                            textAlign: "right",
                                          }}
                                        >
                                          ${total()}
                                        </td>
                                      </tr>
                                    </tfoot>
                                  </table>
                                </Box>
                              </Box>
                            ) : null}
                            {/* <Grid
                              container
                              border="1px solid #ccc"
                              borderRadius="8px"
                              padding="16px"
                              maxWidth="700px"
                              margin="20px"
                              style={{
                                marginRight: "auto",
                                overflowX: "auto",
                              }} // Center the box horizontally
                            >
                              <Grid item xs={3} sm={3.5} md={3} lg={2} xl={2}>
                                <h2
                                  className="text-lg"
                                  style={{ color: "blue" }}
                                >
                                  Updates
                                </h2>
                              </Grid>

                              {outstandDetails?.workorder_status &&
                                outstandDetails?.workorder_status.length > 0 &&
                                workOrderStatus.map((item, index) => (
                                  <Grid item xs={12}>
                                    <Box
                                      padding="12px"
                                      maxWidth="700px"
                                      style={{
                                        marginLeft: "auto",
                                        marginRight: "auto",
                                        overflowX: "auto",
                                      }} // Center the box horizontally
                                    >
                                      <div
                                        style={{
                                          display: "flex",
                                          justifyContent: "space-between",
                                        }}
                                      >
                                        <div style={{ fontWeight: "bold" }}>
                                          {item.statusUpdatedBy}{" "}
                                          {item.createdAt
                                            ? "Created this work order"
                                            : "Updated this work order"}
                                          <span style={{ fontSize: "13px" }}>
                                            &nbsp;({item.updateAt})
                                          </span>
                                        </div>
                                      </div>
                                      <hr
                                        style={{
                                          marginTop: "0px",
                                          marginBottom: "0px",
                                        }}
                                      />

                                      {console.log(item, "item")}
                                      <Grid container>
                                        {!Object.keys(item).includes(
                                          "status"
                                        ) ||
                                        Object.keys(item).includes(
                                          "due_date"
                                        ) ||
                                        item.status !== (" " || "") ||
                                        item.due_date !== (" " || "") ||
                                        item.staffmember_name !==
                                          (" " || "") ? (
                                          <>
                                            <Grid
                                              item
                                              xs={4}
                                              style={
                                                !Object.keys(item).includes(
                                                  "status"
                                                ) ||
                                                item.status === (" " || null)
                                                  ? { display: "none" }
                                                  : { display: "block" }
                                              }
                                            >
                                              Status: {item.status}
                                            </Grid>
                                            <Grid
                                              itemx
                                              xs={4}
                                              style={
                                                !Object.keys(item).includes(
                                                  "due_date"
                                                ) ||
                                                item.due_date === (" " || null)
                                                  ? { display: "none" }
                                                  : { display: "block" }
                                              }
                                            >
                                              Due Date: {item.due_date}
                                            </Grid>
                                            <Grid
                                              item
                                              xs={4}
                                              style={{
                                                display:
                                                  item.staffmember_name &&
                                                  item.staffmember_name.trim() !==
                                                    ""
                                                    ? "block"
                                                    : "none",
                                              }}
                                            >
                                              Assigned To:{" "}
                                              {item.staffmember_name}
                                            </Grid>
                                          </>
                                        ) : (
                                          <>
                                            <Grid item>
                                              {" "}
                                              Work Order Is Updated
                                            </Grid>
                                          </>
                                        )}
                                      </Grid>
                                    </Box>
                                  </Grid>
                                ))}
                            </Grid> */}
                          </>
                        ) : (
                          <div>No details found.</div>
                        )}
                      </Col>
                      <Col lg="4" md="12">
                        {outstandDetails?.workOrder_id ? (
                          <Box
                            border="1px solid #ccc"
                            borderRadius="8px"
                            maxWidth="100%" // Use 100% to make it responsive
                            margin="20px"
                          >
                            <Box
                              borderBottom="1px solid #ccc"
                              style={{
                                minWidth: "100%",
                                padding: "16px 16px 5px 16px",
                                color: "#5e72e4",
                              }}
                            >
                              <h3 className="text" style={{ color: "blue" }}>
                                Contacts
                              </h3>
                            </Box>
                            <Box
                              borderBottom="1px solid #ccc"
                              style={{
                                display: "flex",
                                alignItems: "center",
                                minWidth: "100%",
                                padding: "16px 16px 5px 16px",
                              }}
                            >
                              <Box width="16px" marginRight="10px">
                                {/* SVG icon */}
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  fill="currentColor"
                                  className="bi bi-person-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                </svg>
                              </Box>
                              <Box
                                width="100%"
                                style={{ minWidth: "100%", padding: "0 16px" }}
                              >
                                <span style={detailstyle}>Vendor</span> <br />
                                <span>
                                  {outstandDetails?.vendor_data.vendor_name ||
                                    "N/A"}
                                </span>
                              </Box>
                            </Box>
                            {outstandDetails?.tenant_data &&
                            typeof outstandDetails?.tenant_data === "object" ? (
                              <Box
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  minWidth: "100%",
                                  padding: "16px 16px 5px 16px",
                                }}
                              >
                                <Box width="16px" marginRight="10px">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    fill="currentColor"
                                    className="bi bi-person-fill"
                                    viewBox="0 0 16 16"
                                  >
                                    <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                  </svg>
                                </Box>
                                <Box
                                  width="100%"
                                  style={{
                                    minWidth: "100%",
                                    padding: "0 16px",
                                  }}
                                >
                                  <span style={detailstyle}>Tenant</span> <br />
                                  <span>
                                    {outstandDetails?.tenant_data
                                      .tenant_firstName ? (
                                      <>
                                        {
                                          outstandDetails?.tenant_data
                                            .tenant_firstName
                                        }{" "}
                                        {
                                          outstandDetails?.tenant_data
                                            .tenant_lastName
                                        }
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                </Box>
                              </Box>
                            ) : null}
                          </Box>
                        ) : null}
                        {outstandDetails ? (
                          <>
                            <Box
                              border="1px solid #ccc"
                              borderRadius="8px"
                              maxWidth="100%" // Use 100% to make it responsive
                              margin="20px"
                              display="flex"
                              flexDirection="column"
                              alignItems="center" // Center content horizontally
                            >
                              <Box
                                borderBottom="1px solid #ccc"
                                style={{
                                  width: "100%",
                                  padding: "16px",
                                  textAlign: "left",
                                  color: "#5e72e4",
                                }}
                              >
                                <h3 className="text" style={{ color: "blue" }}>
                                  Property
                                </h3>
                              </Box>

                              <Box
                                style={{
                                  width: "100%",
                                  padding: "5px 16px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  width="100%"
                                  style={{
                                    minWidth: "100%",
                                    textAlign: "center",
                                  }}
                                >
                                  <span>
                                    {outstandDetails?.property_data
                                      ?.rental_adress || "N/A"}
                                    {outstandDetails?.property_data
                                      ?.rental_units ? (
                                      " (" +
                                      outstandDetails?.property_data
                                        ?.rental_units +
                                      ")"
                                    ) : (
                                      <></>
                                    )}
                                  </span>
                                </Box>
                              </Box>
                              <Box
                                style={{
                                  width: "100%",
                                  padding: "5px 16px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  width="100%"
                                  style={{
                                    minWidth: "100%",
                                    textAlign: "center",
                                  }}
                                >
                                  <span>
                                    {outstandDetails?.property_data
                                      ?.rental_city ? (
                                      <>
                                        {
                                          outstandDetails?.property_data
                                            ?.rental_city
                                        }
                                        ,
                                      </>
                                    ) : (
                                      ""
                                    )}{" "}
                                    {outstandDetails?.property_data
                                      ?.rental_state ? (
                                      <>
                                        {
                                          outstandDetails?.property_data
                                            ?.rental_state
                                        }
                                        ,
                                      </>
                                    ) : (
                                      ""
                                    )}{" "}
                                    <br />
                                    {outstandDetails?.property_data
                                      ?.rental_country ? (
                                      <>
                                        {
                                          outstandDetails?.property_data
                                            ?.rental_country
                                        }
                                        ,
                                      </>
                                    ) : (
                                      ""
                                    )}{" "}
                                    {outstandDetails?.property_data
                                      ?.rental_postcode ? (
                                      <>
                                        {
                                          outstandDetails?.property_data
                                            ?.rental_postcode
                                        }
                                        .
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                </Box>
                              </Box>
                            </Box>
                          </>
                        ) : (
                          <></>
                        )}
                      </Col>
                    </Row>
                  </div>
                )}

                {activeButton === "Task" && (
                  <div className="container-fluid">
                    <Row className="mb-4">
                      <Col lg="8" md="12">
                        <Box
                          border="1px solid #ccc"
                          borderRadius="8px"
                          padding="16px"
                          maxWidth="700px"
                          margin={"20px"}
                        >
                          <Row>
                            <Col lg="2">
                              <Box
                                width="40px"
                                height="40px"
                                display="flex"
                                alignItems="center"
                                justifyContent="center"
                                backgroundColor="grey"
                                borderRadius="8px"
                                color="white"
                                fontSize="24px"
                              >
                                <AssignmentOutlinedIcon />
                              </Box>
                            </Col>
                            <Col lg="8">
                              <span
                                style={{
                                  border: "2px solid",
                                  borderColor:
                                    outstandDetails?.priority === "High"
                                      ? "red"
                                      : outstandDetails?.priority === "Medium"
                                      ? "green"
                                      : outstandDetails?.priority === "Low"
                                      ? "#FFD700"
                                      : "inherit",
                                  borderRadius: "15px",
                                  padding: "2px",
                                  fontSize: "15px",
                                  color:
                                    outstandDetails?.priority === "High"
                                      ? "red"
                                      : outstandDetails?.priority === "Medium"
                                      ? "green"
                                      : outstandDetails?.priority === "Low"
                                      ? "#FFD700"
                                      : "inherit",
                                }}
                              >
                                &nbsp;{outstandDetails?.priority}&nbsp;
                              </span>
                              <h2 className="text-lg" style={{ color: "blue" }}>
                                {outstandDetails?.work_subject || "N/A"}
                              </h2>

                              <span className="">
                                {outstandDetails?.property_data
                                  ?.rental_adress || "N/A"}
                              </span>
                            </Col>
                          </Row>
                          <br />
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Description
                                </label>
                                <br />
                                <span style={{ fontSize: "13px" }}>
                                  {outstandDetails?.work_performed || "N/A"}
                                </span>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Status
                                </label>
                                <br />
                                <span style={{ fontSize: "13px" }}>
                                  {outstandDetails?.status || "N/A"}
                                </span>
                              </FormGroup>
                            </Col>

                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Due Date
                                </label>
                                <br />
                                <span style={{ fontSize: "13px" }}>
                                  {formatDateWithoutTime(
                                    outstandDetails?.date
                                  ) || "N/A"}
                                </span>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Assignees
                                </label>
                                <br />
                                <span style={{ fontSize: "13px" }}>
                                  {outstandDetails?.staff_data
                                    .staffmember_name || "N/A"}
                                </span>
                              </FormGroup>
                            </Col>
                            <Col lg="6">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Permission to enter
                                </label>
                                <br />
                                <span style={{ fontSize: "13px" }}>
                                  {outstandDetails?.entry_allowed
                                    ? "Yes"
                                    : "No"}{" "}
                                </span>
                              </FormGroup>
                            </Col>
                          </Row>
                        </Box>
                      </Col>

                      <Col lg="4" md="12">
                        {/* <Box
                      border="1px solid #ccc"
                      borderRadius="8px"
                      padding="16px"
                      maxWidth="1000px"
                      margin={"20px"}
                    > */}

                        {outstandDetails ? (
                          <>
                            <Box
                              border="1px solid #ccc"
                              borderRadius="8px"
                              maxWidth="100%" // Use 100% to make it responsive
                              margin="20px"
                              display="flex"
                              flexDirection="column"
                              alignItems="center" // Center content horizontally
                            >
                              <Box
                                borderBottom="1px solid #ccc"
                                style={{
                                  width: "100%",
                                  padding: "16px",
                                  textAlign: "left",
                                  color: "#5e72e4",
                                }}
                              >
                                <h2 className="text" style={{ color: "blue" }}>
                                  Images
                                </h2>
                              </Box>
                              {outstandDetails?.workOrder_images &&
                              outstandDetails?.workOrder_images.length > 0 ? (
                                <Box
                                  style={{
                                    width: "100%",
                                    padding: "16px",
                                    marginTop: "10px",
                                    display: "flex",
                                    flexWrap: "wrap",
                                    justifyContent: "center",
                                  }}
                                >
                                  {outstandDetails?.workOrder_images.map(
                                    (imageUrl, index) => (
                                      <Box
                                        key={index}
                                        width="48%"
                                        style={{
                                          minWidth: "48%",
                                          margin: "1%",
                                        }}
                                      >
                                        <img
                                          src={
                                            !isBlobURL(imageUrl)
                                              ? `${imageGetUrl}/${imageUrl}`
                                              : imageUrl
                                          }
                                          alt={`property ${index}`}
                                          style={{
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: "8px",
                                            border: "1px solid #ccc",
                                          }}
                                        />
                                      </Box>
                                    )
                                  )}
                                </Box>
                              ) : (
                                "No Images Attached"
                              )}
                              <br />
                              <Box
                                style={{
                                  width: "100%",
                                  padding: "5px 16px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  width="100%"
                                  style={{
                                    minWidth: "100%",
                                    textAlign: "center",
                                  }}
                                >
                                  <span>
                                    {outstandDetails?.property_data
                                      ?.rental_adress || "N/A"}{" "}
                                    (
                                    {outstandDetails?.unit_data?.rental_unit ||
                                      ""}
                                    )
                                  </span>
                                </Box>
                              </Box>
                              <Box
                                style={{
                                  width: "100%",
                                  padding: "5px 16px",
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <Box
                                  width="100%"
                                  style={{
                                    minWidth: "100%",
                                    textAlign: "center",
                                  }}
                                >
                                  <span>
                                    {outstandDetails?.property_data
                                      ?.rental_city ? (
                                      <>
                                        {
                                          outstandDetails?.property_data
                                            ?.rental_city
                                        }
                                        ,
                                      </>
                                    ) : (
                                      ""
                                    )}{" "}
                                    {outstandDetails?.property_data
                                      ?.rental_state ? (
                                      <>
                                        {
                                          outstandDetails?.property_data
                                            ?.rental_state
                                        }
                                        ,
                                      </>
                                    ) : (
                                      ""
                                    )}{" "}
                                    <br />
                                    {outstandDetails?.property_data
                                      ?.rental_country ? (
                                      <>
                                        {
                                          outstandDetails?.property_data
                                            ?.rental_country
                                        }
                                        ,
                                      </>
                                    ) : (
                                      ""
                                    )}{" "}
                                    {outstandDetails?.property_data
                                      ?.rental_postcode ? (
                                      <>
                                        {
                                          outstandDetails?.property_data
                                            ?.rental_postcode
                                        }
                                        .
                                      </>
                                    ) : (
                                      ""
                                    )}
                                  </span>
                                </Box>
                              </Box>
                            </Box>
                          </>
                        ) : (
                          <>No Details Found</>
                        )}
                      </Col>
                    </Row>
                  </div>
                )}
              </div>
              <br />
            </Card>
          </div>
        </Row>
        <br />
        <br />
      </Container>
    </>
  );
};

export default WorkOrderDetails;
