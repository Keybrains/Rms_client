import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Header from "components/Headers/Header";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { RotatingLines } from "react-loader-spinner";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  Container,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Table,
  ModalHeader,
  ModalBody,
  Modal,
} from "reactstrap";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import AssignmentIndIcon from "@mui/icons-material/AssignmentInd";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import MailIcon from "@mui/icons-material/Mail";
import HomeIcon from "@mui/icons-material/Home";
import { jwtDecode } from "jwt-decode";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { set } from "date-fns";
import swal from "sweetalert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  CardActions,
  CardContent,
  Checkbox,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { BloodtypeOutlined } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import DoneIcon from "@mui/icons-material/Done";
import jsPDF from "jspdf";
import Img from "assets/img/theme/team-4-800x800.jpg";
import { useLocation } from "react-router-dom";
import moment from "moment";
import "./Leaseing.css";
import CreditCardForm from "./CreditCardForm";

const RentRollDetail2 = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const { lease_id, admin } = useParams();
  const navigate = useNavigate();

  const [accessType, setAccessType] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  return (
    <div>
      <Header />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup className="">
              {loading ? (
                <tbody>
                  <tr>
                    <td></td>
                  </tr>
                </tbody>
              ) : (
                <>
                  <h1 style={{ color: "white" }}>
                    {/* {tenantDetails.tenant_firstName +
                      " " +
                      tenantDetails.tenant_lastName} */}
                  </h1>
                  <h5 style={{ color: "white" }}>
                    {/* {status} |{" "}
                    {tenantDetails._id
                      ? tenantDetails.entries.rental_adress
                      : " "}
                    {tenantDetails._id &&
                    tenantDetails.entries.rental_units !== undefined &&
                    tenantDetails.entries.rental_units !== ""
                      ? ` - ${tenantDetails.entries.rental_units}`
                      : ""} */}
                  </h5>
                </>
              )}
            </FormGroup>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              //  href="#rms"
              onClick={() => navigate("/admin/RentRoll")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Back
            </Button>
          </Col>
        </Row>
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0"></CardHeader>
              <Col>
                <TabContext value={value}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <TabList
                      onChange={(e, newValue) => handleChange(newValue)}
                      aria-label="lab API tabs example"
                      value={value}
                    >
                      <Tab
                        label="Summary"
                        value="Summary"
                        style={{ textTransform: "none" }}
                      />
                      <Tab
                        label="Financial"
                        value="Financial"
                        style={{ textTransform: "none" }}
                      />
                      <Tab
                        label="Tenant"
                        value="Tenant"
                        style={{ textTransform: "none" }}
                      />
                    </TabList>
                  </Box>
                  <TabPanel value="Summary">
                    <Row>
                      <div className="col">
                        <Card className="shadow">
                          <div className="table-responsive">
                            <div
                              className="row m-3"
                              style={{ overflow: "hidden" }}
                            >
                              <div className="col-md-8">
                                <div
                                  className="align-items-center table-flush"
                                  style={{ width: "100%" }}
                                >
                                  {loading ? (
                                    <tbody>
                                      <tr>
                                        <td>Loading tenant details...</td>
                                      </tr>
                                    </tbody>
                                  ) : error ? (
                                    <tbody>
                                      <tr>
                                        <td>Error: {error.message}</td>
                                      </tr>
                                    </tbody>
                                  ) : tenantDetails._id ? (
                                    <div className="w-100">
                                      <Row
                                        className="w-100 my-3"
                                        style={{
                                          fontSize: "18px",
                                          textTransform: "capitalize",
                                          color: "#5e72e4",
                                          fontWeight: "600",
                                          borderBottom: "1px solid #ddd",
                                        }}
                                      >
                                        <Col>Tenant Details</Col>
                                      </Row>
                                      <Row
                                        className="w-100 mb-1"
                                        style={{
                                          fontSize: "10px",
                                          textTransform: "uppercase",
                                          color: "#aaa",
                                        }}
                                      >
                                        <Col>Unit</Col>
                                        <Col>Rental Owner</Col>
                                        <Col>Tenant</Col>
                                      </Row>
                                      <Row
                                        className="w-100 mt-1 mb-5"
                                        style={{
                                          fontSize: "12px",
                                          textTransform: "capitalize",
                                          color: "#000",
                                        }}
                                      >
                                        <Col>
                                          {tenantDetails?.entries
                                            .rental_adress +
                                            " " +
                                            tenantDetails?.entries
                                              .rental_units || "N/A"}
                                        </Col>
                                        <Col>
                                          {tenantDetails.entries
                                            .rentalOwner_firstName
                                            ? tenantDetails.entries
                                                .rentalOwner_firstName +
                                              " " +
                                              tenantDetails.entries
                                                .rentalOwner_lastName
                                            : "N/A"}
                                        </Col>
                                        <Col>
                                          {tenantDetails?.tenant_firstName +
                                            " " +
                                            tenantDetails?.tenant_lastName ||
                                            "N/A"}
                                        </Col>
                                      </Row>
                                    </div>
                                  ) : (
                                    <tbody>
                                      <tr>
                                        <td>No tenant details found.</td>
                                      </tr>
                                    </tbody>
                                  )}
                                </div>
                                <div
                                  className="row mt-3"
                                  style={{ overflow: "auto" }}
                                >
                                  <Row
                                    className="w-100 my-3"
                                    style={{
                                      fontSize: "18px",
                                      textTransform: "capitalize",
                                      color: "#5e72e4",
                                      fontWeight: "600",
                                      borderBottom: "1px solid #ddd",
                                    }}
                                  >
                                    <Col>Lease Details</Col>
                                  </Row>
                                  <Row
                                    className="mb-1 m-0 p-0"
                                    style={{ fontSize: "12px", color: "#000" }}
                                  >
                                    <Table>
                                      <tbody
                                        className="tbbody p-0 m-0"
                                        style={{
                                          borderTopRightRadius: "5px",
                                          borderTopLeftRadius: "5px",
                                          borderBottomLeftRadius: "5px",
                                          borderBottomRightRadius: "5px",
                                        }}
                                      >
                                        <tr className="header">
                                          <th>Status</th>
                                          <th>Start - End</th>
                                          <th>Property</th>
                                          <th>Type</th>
                                          <th>Rent</th>
                                        </tr>
                                        {myData ? (
                                          <>
                                            {myData.map((item) => (
                                              <tr
                                                key={item._id}
                                                className="body"
                                              >
                                                <td>
                                                  {getStatus(
                                                    item.entries.start_date,
                                                    item.entries.end_date
                                                  )}
                                                </td>
                                                <td>
                                                  <Link
                                                    to={`/admin/rentrolldetail/${item._id}/${item.entries.entryIndex}`}
                                                  >
                                                    {formatDateWithoutTime(
                                                      item.entries.start_date
                                                    ) +
                                                      " To " +
                                                      formatDateWithoutTime(
                                                        item.entries.end_date
                                                      ) || "N/A"}
                                                  </Link>
                                                </td>
                                                <td>
                                                  {item.entries.rental_adress ||
                                                    "N/A"}
                                                </td>
                                                <td>
                                                  {item.entries.lease_type ||
                                                    "N/A"}
                                                </td>
                                                <td>{item.entries.amount}</td>
                                              </tr>
                                            ))}
                                          </>
                                        ) : null}
                                      </tbody>
                                    </Table>
                                  </Row>
                                </div>
                              </div>

                              <div className="col-md-4 mt-3">
                                <Card style={{ background: "#F4F6FF" }}>
                                  <CardContent>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                          fontWeight: "bold",
                                        }}
                                        color="text.secondary"
                                        gutterBottom
                                      >
                                        Credit balance:
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: 14,
                                          marginLeft: "10px",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {GeneralLedgerData &&
                                          GeneralLedgerData.paymentAndCharges &&
                                          GeneralLedgerData.paymentAndCharges
                                            .length > 0 &&
                                          "$" +
                                            Math.abs(
                                              GeneralLedgerData
                                                .paymentAndCharges[0].Total
                                            )}
                                      </Typography>
                                    </div>
                                    <hr
                                      style={{
                                        marginTop: "2px",
                                        marginBottom: "6px",
                                      }}
                                    />

                                    <>
                                      <div>
                                        <div className="entry-container">
                                          <div
                                            style={{
                                              display: "flex",
                                              flexDirection: "row",
                                              alignItems: "center",
                                              marginBottom: "5px",
                                            }}
                                          >
                                            <Typography
                                              sx={{
                                                fontSize: 14,
                                                fontWeight: "bold",
                                                marginRight: "10px",
                                              }}
                                              color="text.secondary"
                                              gutterBottom
                                            >
                                              Rent:
                                            </Typography>
                                            {myData1.map((item, index) => (
                                              <Typography
                                                key={index}
                                                sx={{
                                                  fontSize: 14,
                                                  fontWeight: "bold",
                                                  marginRight: "10px",
                                                }}
                                                color="text.secondary"
                                                gutterBottom
                                              >
                                                ${item.entries.amount}
                                              </Typography>
                                            ))}
                                          </div>
                                        </div>
                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            marginTop: "10px",
                                          }}
                                        >
                                          <Typography
                                            sx={{
                                              fontSize: 14,
                                              fontWeight: "bold",
                                            }}
                                            color="text.secondary"
                                            gutterBottom
                                          >
                                            Due date :
                                          </Typography>
                                          {myData1.map((item, index) => (
                                            <Typography
                                              key={index}
                                              sx={{
                                                fontSize: 14,
                                                fontWeight: "bold",
                                                marginRight: "10px",
                                              }}
                                              color="text.secondary"
                                              gutterBottom
                                            >
                                              {item.entries.nextDue_date}
                                            </Typography>
                                          ))}
                                        </div>
                                      </div>
                                    </>

                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <Button
                                        color="primary"
                                        onClick={() =>
                                          navigate(
                                            `/${admin}/AddPayment/${tenantId}/$}`
                                          )
                                        }
                                        style={{
                                          background: "white",
                                          color: "blue",
                                          marginRight: "10px",
                                        }}
                                      >
                                        Receive Payment
                                      </Button>
                                      {myData1.map((item, index) => (
                                        <Typography
                                          key={index}
                                          sx={{
                                            fontSize: 14,
                                            marginLeft: "10px",
                                            paddingTop: "10px",
                                            cursor: "pointer",
                                            color: "blue",
                                          }}
                                        >
                                          <Link
                                            to={`/${admin}/rentrolldetail/${tenantId}/$}?source=payment`}
                                            onClick={() =>
                                              setValue(`Financial`)
                                            }
                                          >
                                            Lease Ledger
                                          </Link>
                                        </Typography>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card
                                  className="w-100 mt-3"
                                  style={{ background: "#F4F6FF" }}
                                >
                                  <CardContent>
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: 18,
                                          fontWeight: "bold",
                                          fontFamily: "Arial",
                                          textTransform: "capitalize",
                                          marginRight: "10px",
                                        }}
                                        color="text.secondary"
                                        gutterBottom
                                      >
                                        Credit Cards
                                      </Typography>
                                    </div>
                                    {cardDetalis && cardDetalis.length > 0 && (
                                      <Table responsive>
                                        <tbody>
                                          <tr>
                                            <th>Card Number</th>
                                            <th>Expiration Date</th>
                                          </tr>
                                          {cardDetalis.map((item, index) => (
                                            <tr
                                              key={index}
                                              style={{ marginBottom: "10px" }}
                                            >
                                              <td>
                                                <Typography
                                                  sx={{
                                                    fontSize: 14,
                                                    fontWeight: "bold",
                                                    fontStyle: "italic",
                                                    fontFamily: "Arial",
                                                    textTransform: "capitalize",
                                                    marginRight: "10px",
                                                  }}
                                                  color="text.secondary"
                                                  gutterBottom
                                                >
                                                  {item.card_number.slice(
                                                    0,
                                                    4
                                                  ) +
                                                    "*".repeat(8) +
                                                    item.card_number.slice(-4)}
                                                </Typography>
                                              </td>
                                              <td>
                                                <Typography
                                                  sx={{
                                                    fontSize: 14,
                                                    marginRight: "10px",
                                                  }}
                                                  color="text.secondary"
                                                  gutterBottom
                                                >
                                                  {item.exp_date}
                                                </Typography>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </Table>
                                    )}

                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        marginTop: "10px",
                                      }}
                                    >
                                      <Button
                                        color="primary"
                                        onClick={() => openCardForm()}
                                        style={{
                                          background: "white",
                                          color: "blue",
                                          marginRight: "10px",
                                        }}
                                      >
                                        Add Credit Card
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </div>
                    </Row>
                  </TabPanel>
                  <TabPanel value="Financial">
                    <Container className="mt--10" fluid>
                      <Row>
                        <Col xs="12" sm="6">
                          <FormGroup>
                            <h3 style={{ color: "blue" }}>Lease Ledger</h3>
                          </FormGroup>
                        </Col>
                        <Col
                          className="d-flex justify-content-end"
                          xs="12"
                          sm="6"
                        >
                          <Button
                            color="primary"
                            ////  href="#rms"
                            onClick={() =>
                              navigate(`/admin/AddPayment/${tenantId}/$}`, {
                                state: {
                                  unit_name: unit,
                                  unit_id: unitId,
                                  property_id: propertyId,
                                  rental_adress: rental,
                                },
                              })
                            }
                            style={{
                              background: "white",
                              color: "blue",
                              marginRight: "10px",
                            }}
                          >
                            Receive Payment
                          </Button>
                          <Button
                            color="primary"
                            ////  href="#rms"
                            onClick={() =>
                              navigate(`/admin/AddCharge/${tenantId}/$}`, {
                                state: {
                                  unit_name: unit,
                                  unit_id: unitId,
                                  property_id: propertyId,
                                  rental_adress: rental,
                                },
                              })
                            }
                            style={{ background: "white", color: "blue" }}
                          >
                            Enter Charge
                          </Button>
                        </Col>
                      </Row>
                      <br />
                      <Row
                        style={{ display: "flex", justifyContent: "flex-end" }}
                      >
                        <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                          <DropdownToggle caret>Export</DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem
                              onClick={() => handleOptionClick("Last 30 days")}
                            >
                              Last 30 days
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handleOptionClick("Last 3 months")}
                            >
                              Last 3 months
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleOptionClick("Last 12 months")
                              }
                            >
                              Last 12 months
                            </DropdownItem>
                            <DropdownItem
                              onClick={() =>
                                handleOptionClick("All transactions")
                              }
                            >
                              All transactions
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </Row>
                      <br />
                      <Row>
                        <div className="col">
                          {loader ? (
                            <div className="d-flex flex-direction-row justify-content-center align-items-center p-5 m-5">
                              <RotatingLines
                                strokeColor="grey"
                                strokeWidth="5"
                                animationDuration="0.75"
                                width="50"
                                visible={loader}
                              />
                            </div>
                          ) : (
                            <Card className="shadow">
                              <CardHeader className="border-0"></CardHeader>

                              <Table
                                className="align-items-center table-flush"
                                responsive
                              >
                                <thead className="thead-light">
                                  <tr>
                                    <th scope="col">Date</th>
                                    <th scope="col">Type</th>
                                    <th scope="col">Account</th>
                                    <th scope="col">Memo</th>
                                    <th scope="col">Increase</th>
                                    <th scope="col">Decrease</th>
                                    <th scope="col">Balance</th>
                                    <th scope="col">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {GeneralLedgerData &&
                                    GeneralLedgerData?.paymentAndCharges?.map(
                                      (generalledger) => (
                                        <>
                                          {console.log(
                                            GeneralLedgerData,
                                            "GeneralLedgerData"
                                          )}
                                          <tr key={`${generalledger._id}`}>
                                            <td>{generalledger.date || "-"}</td>
                                            <td>{generalledger.type || "-"}</td>
                                            <td>
                                              {generalledger.account || "-"}
                                            </td>
                                            <td>{generalledger.memo || "-"}</td>
                                            <td>
                                              {generalledger.type === "Charge"
                                                ? "$" + generalledger.amount
                                                : "-"}
                                            </td>
                                            <td>
                                              {generalledger.type === "Payment"
                                                ? "$" + generalledger.amount
                                                : "-"}
                                            </td>
                                            <td>
                                              {generalledger.Total !== undefined
                                                ? generalledger.Total >= 0
                                                  ? `$${generalledger.Total}`
                                                  : `$(${Math.abs(
                                                      generalledger.Total
                                                    )})`
                                                : "0"}
                                              {/* {calculateBalance(
                                                  generalledger.type,
                                                  entry,
                                                  index
                                                )} */}
                                            </td>
                                            <td>
                                              <div
                                                style={{
                                                  display: "flex",
                                                  gap: "5px",
                                                }}
                                              >
                                                {generalledger.type ===
                                                  "Charge" && (
                                                  <div
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                  >
                                                    <DeleteIcon
                                                      onClick={() => {
                                                        console.log(
                                                          generalledger,
                                                          "geennennene"
                                                        );
                                                        deleteCharge(
                                                          generalledger._id
                                                        );
                                                      }}
                                                    />
                                                  </div>
                                                )}

                                                {generalledger.type ===
                                                  "Charge" && (
                                                  <div
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      editcharge(
                                                        generalledger._id
                                                      );
                                                    }}
                                                  >
                                                    <EditIcon />
                                                  </div>
                                                )}
                                                {generalledger.type ===
                                                  "Payment" && (
                                                  <div
                                                    style={{
                                                      cursor: "pointer",
                                                    }}
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      editpayment(
                                                        generalledger._id
                                                      );
                                                    }}
                                                  >
                                                    <EditIcon />
                                                  </div>
                                                )}
                                              </div>
                                            </td>
                                          </tr>
                                        </>
                                      )
                                    )}
                                </tbody>
                              </Table>
                            </Card>
                          )}
                        </div>
                      </Row>
                      <br />
                      <br />
                    </Container>
                  </TabPanel>
                  <TabPanel value="Tenant">
                    <CardHeader className="border-0">
                      <span>
                        <span>Property :</span>
                        <h2 style={{ color: "blue" }}>
                          {rental}
                          {unit && `- ${unit}`}
                        </h2>
                      </span>
                    </CardHeader>
                    <Row>
                      <Col>
                        {Array.isArray(rentaldata) ? (
                          <Grid container spacing={2}>
                            {console.log(rentaldata, "rentalsdat")}
                            {rentaldata.map((tenant, index) => (
                              <Grid item xs={12} sm={6} key={index}>
                                {tenant.entries.map((entry) => (
                                  <Box
                                    key={index}
                                    border="1px solid #ccc"
                                    borderRadius="8px"
                                    padding="16px"
                                    maxWidth="700px"
                                    margin="20px"
                                  >
                                    {!entry.moveout_notice_given_date ? (
                                      <div
                                        className="d-flex justify-content-end h5"
                                        onClick={handleMoveOutClick}
                                        style={{ cursor: "pointer" }}
                                      >
                                        <LogoutIcon fontSize="small" /> Move out
                                      </div>
                                    ) : (
                                      <div
                                        className="d-flex justify-content-end h5"
                                        // style={{ cursor: "pointer" }}
                                      >
                                        <DoneIcon fontSize="small" /> Move Out
                                      </div>
                                    )}

                                    <Modal
                                      show={showModal}
                                      onHide={handleModalClose}
                                    >
                                      <Modal.Header>
                                        <Modal.Title>
                                          Move out tenants
                                        </Modal.Title>
                                      </Modal.Header>
                                      <Modal.Body>
                                        <div>
                                          Select tenants to move out. If
                                          everyone is moving, the lease will end
                                          on the last move-out date. If some
                                          tenants are staying, you’ll need to
                                          renew the lease. Note: Renters
                                          insurance policies will be permanently
                                          deleted upon move-out.
                                        </div>
                                        <hr />
                                        {/* {rentaldata?.map((country) => ( */}
                                        <React.Fragment>
                                          <Table striped bordered responsive>
                                            <thead>
                                              <tr>
                                                <th>Address / Unit</th>
                                                <th>LEASE TYPE</th>
                                                <th>START - END</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {/* Example rows */}
                                              <tr>
                                                <td>
                                                  {entry.rental_adress
                                                    ? entry.rental_adress
                                                    : ""}{" "}
                                                  {entry.rental_units
                                                    ? entry.rental_units
                                                    : ""}
                                                </td>
                                                <td>Fixed</td>
                                                <td>
                                                  {entry.start_date
                                                    ? entry.start_date
                                                    : ""}{" "}
                                                  {entry.end_date
                                                    ? entry.end_date
                                                    : ""}
                                                </td>
                                              </tr>
                                              {/* Add more rows dynamically based on your data */}
                                            </tbody>
                                          </Table>
                                          <Table striped bordered responsive>
                                            <thead>
                                              <tr>
                                                <th>TENANT</th>
                                                <th>NOTICE GIVEN DATE</th>
                                                <th>MOVE-OUT DATE</th>
                                              </tr>
                                            </thead>
                                            <tbody>
                                              {/* Example rows */}
                                              <tr>
                                                <td>
                                                  {tenant.tenant_firstName +
                                                    " "}{" "}
                                                  {tenant.tenant_lastName}
                                                </td>
                                                <td>
                                                  <div className="col">
                                                    <input
                                                      type="date"
                                                      className="form-control"
                                                      placeholder="Notice Given Date"
                                                      value={noticeGivenDate}
                                                      // onChange={(e) =>
                                                      //   setMoveOutDate(
                                                      //     e.target.value
                                                      //   )
                                                      // }
                                                      onChange={(e) =>
                                                        setNoticeGivenDate(
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </td>
                                                <td>
                                                  <div className="col">
                                                    <input
                                                      type="date"
                                                      className="form-control"
                                                      placeholder="Move-out Date"
                                                      value={moveOutDate}
                                                      onChange={(e) =>
                                                        setMoveOutDate(
                                                          e.target.value
                                                        )
                                                      }
                                                    />
                                                  </div>
                                                </td>
                                              </tr>
                                              {/* Add more rows dynamically based on your data */}
                                            </tbody>
                                          </Table>
                                        </React.Fragment>
                                        {/* ))} */}
                                      </Modal.Body>
                                      <Modal.Footer>
                                        <Button
                                          style={{ backgroundColor: "#008000" }}
                                          onClick={handleMoveout}
                                        >
                                          Move out
                                        </Button>
                                        <Button
                                          style={{ backgroundColor: "#ffffff" }}
                                          onClick={handleModalClose}
                                        >
                                          Close
                                        </Button>
                                        {/* You can add additional buttons or actions as needed */}
                                      </Modal.Footer>
                                    </Modal>

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
                                          <AssignmentIndIcon />
                                        </Box>
                                      </Col>

                                      <Col lg="7">
                                        <div
                                          style={{
                                            color: "blue",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          {tenant.tenant_firstName || "N/A"}{" "}
                                          {tenant.tenant_lastName || "N/A"}
                                          <br></br>
                                          {entry.rental_adress}
                                          {entry.rental_units !== "" &&
                                          entry.rental_units !== undefined
                                            ? ` - ${entry.rental_units}`
                                            : null}
                                        </div>

                                        <div>
                                          {" "}
                                          {formatDateWithoutTime(
                                            entry.start_date
                                          ) || "N/A"}{" "}
                                          to{" "}
                                          {formatDateWithoutTime(
                                            entry.end_date
                                          ) || "N/A"}
                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            marginTop: "10px",
                                          }}
                                        >
                                          <Typography
                                            style={{
                                              paddingRight: "3px",
                                              fontSize: "2px",
                                              color: "black",
                                            }}
                                          >
                                            <PhoneAndroidIcon />
                                          </Typography>
                                          {tenant.tenant_mobileNumber || "N/A"}
                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            flexDirection: "row",
                                            marginTop: "10px",
                                          }}
                                        >
                                          <Typography
                                            style={{
                                              paddingRight: "3px",
                                              fontSize: "7px",
                                              color: "black",
                                            }}
                                          >
                                            <MailIcon />
                                          </Typography>
                                          {tenant.tenant_email || "N/A"}
                                        </div>
                                        <div
                                          style={
                                            entry.moveout_notice_given_date
                                              ? {
                                                  // display:"block",
                                                  display: "flex",
                                                  flexDirection: "row",
                                                  marginTop: "10px",
                                                }
                                              : {
                                                  display: "none",
                                                }
                                          }
                                        >
                                          <Typography
                                            style={{
                                              paddingRight: "3px",
                                              // fontSize: "7px",
                                              color: "black",
                                            }}
                                          >
                                            Notice date:
                                          </Typography>
                                          {entry.moveout_notice_given_date ||
                                            "N/A"}
                                        </div>
                                        <div
                                          style={
                                            entry.moveout_date
                                              ? {
                                                  // display:"block",
                                                  display: "flex",
                                                  flexDirection: "row",
                                                  marginTop: "10px",
                                                }
                                              : {
                                                  display: "none",
                                                }
                                          }
                                        >
                                          <Typography
                                            style={{
                                              paddingRight: "3px",
                                              // fontSize: "7px",
                                              color: "black",
                                            }}
                                          >
                                            Move out:
                                          </Typography>
                                          {entry.moveout_date || "N/A"}
                                        </div>
                                      </Col>
                                    </Row>
                                  </Box>
                                ))}
                              </Grid>
                            ))}
                          </Grid>
                        ) : (
                          <h3>No data available....</h3>
                        )}
                      </Col>
                      <Col xs="12" md="6" lg="4" xl="3">
                        <Card style={{ background: "#F4F6FF" }}>
                          <CardContent>
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  fontWeight: "bold",
                                }}
                                color="text.secondary"
                                gutterBottom
                              >
                                Credit balance:
                              </Typography>
                              <Typography
                                sx={{
                                  fontSize: 14,
                                  marginLeft: "10px",
                                  fontWeight: "bold",
                                }}
                              >
                                {console.log(
                                  GeneralLedgerData,
                                  "GeneralLeder Data"
                                )}
                                {GeneralLedgerData &&
                                  GeneralLedgerData.paymentAndCharges &&
                                  GeneralLedgerData.paymentAndCharges.length >
                                    0 &&
                                  "$" +
                                    Math.abs(
                                      GeneralLedgerData.paymentAndCharges[0]
                                        .Total
                                    )}
                              </Typography>
                            </div>
                            <hr
                              style={{
                                marginTop: "2px",
                                marginBottom: "6px",
                              }}
                            />
                            {/* Display entries data */}
                            {/* {paymentData.entries &&
                          paymentData.entries.length > 0 && ( */}
                            <>
                              <div>
                                {/* {paymentData.entries.map(
                                  (entry, index) => ( */}
                                <div className="entry-container">
                                  {/* <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      marginBottom: "5px",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                      }}
                                      color="text.secondary"
                                      gutterBottom
                                    >
                                      Prepayments:
                                    </Typography>
                                    <Typography sx={{ fontSize: 14 }}>
                                       entry.amount 
                                    </Typography>
                                  </div>
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      marginBottom: "5px",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                      }}
                                      color="text.secondary"
                                      gutterBottom
                                    >
                                      Deposite held:
                                    </Typography>
                                  </div> */}
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      marginBottom: "5px",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                      }}
                                      color="text.secondary"
                                      gutterBottom
                                    >
                                      Rent:
                                    </Typography>
                                    {myData1.map((item) => (
                                      <>
                                        <Typography
                                          sx={{
                                            fontSize: 14,
                                            fontWeight: "bold",
                                            marginRight: "10px",
                                          }}
                                          color="text.secondary"
                                          gutterBottom
                                        >
                                          ${item.entries.amount}
                                        </Typography>
                                      </>
                                    ))}
                                  </div>
                                </div>
                                {/* )
                                )} */}
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "row",
                                  marginTop: "10px",
                                }}
                              >
                                <Typography
                                  sx={{
                                    fontSize: 14,
                                    fontWeight: "bold",
                                  }}
                                  color="text.secondary"
                                  gutterBottom
                                >
                                  Due date :
                                </Typography>
                                {myData1.map((item) => (
                                  <>
                                    <Typography
                                      sx={{
                                        fontSize: 14,
                                        fontWeight: "bold",
                                        marginRight: "10px",
                                      }}
                                      color="text.secondary"
                                      gutterBottom
                                    >
                                      {item.entries.nextDue_date}
                                    </Typography>
                                  </>
                                ))}
                              </div>
                            </>
                            {/* )} */}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                marginTop: "10px",
                              }}
                            >
                              <Button
                                color="primary"
                                ////  href="#rms"
                                onClick={() =>
                                  navigate({
                                    state: {
                                      unit_name: unit,
                                      unit_id: unitId,
                                      property_id: propertyId,
                                      rental_adress: rental,
                                    },
                                  })
                                }
                                style={{
                                  background: "white",
                                  color: "blue",
                                  marginRight: "10px",
                                }}
                              >
                                Receive Payment
                              </Button>

                              {myData1.map((item) => (
                                <>
                                  <Typography
                                    sx={{
                                      fontSize: 14,
                                      marginLeft: "10px",
                                      paddingTop: "10px",
                                      cursor: "pointer",
                                      color: "blue",
                                    }}
                                    // onClick={() => handleChange("Financial")}
                                  >
                                    <Link
                                      to={`/admin/rentrolldetail/${tenantId}/?source=payment`}
                                      onClick={() => {
                                        setValue(`Financial`);
                                      }}
                                    >
                                      Lease Ledger
                                    </Link>
                                  </Typography>
                                </>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </Col>
                    </Row>
                    <Row></Row>
                  </TabPanel>
                </TabContext>
              </Col>
            </Card>
          </div>
        </Row>
        <br />
        <br />
      </Container>

      <Modal isOpen={isModalOpen} toggle={closeModal}>
        <ModalHeader toggle={closeModal} className="bg-secondary text-white">
          <strong style={{ fontSize: 18 }}>Add Credit Card</strong>
        </ModalHeader>
        <ModalBody>
          <CreditCardForm
            tenantId={tenantId}
            closeModal={closeModal}
            getCreditCard={getCreditCard}
          />
        </ModalBody>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default RentRollDetail2;
