import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroup,
  Container,
  Table,
  Row,
  Col,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
  Popover,
} from "reactstrap";
import PaymentHeader from "components/Headers/PaymentHeader";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import CloseIcon from "@mui/icons-material/Close";
import { Check, CheckBox } from "@mui/icons-material";
import Checkbox from "@mui/material/Checkbox";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { values } from "pdf-lib";
import Img from "assets/img/theme/team-4-800x800.jpg";
import "jspdf-autotable";
import Cookies from "universal-cookie";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { OverlayTrigger } from "react-bootstrap";

function AddPayment() {
  const [accessType, setAccessType] = useState(null);
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const { lease_id, admin, payment_id } = useParams();
  const [chargeData, setchargeData] = useState([]);
  const [tenantsData, setTenantsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loader, setLoader] = useState(false);

  const [recdropdownOpen, setrecDropdownOpen] = useState(false);
  const toggle2 = () => setrecDropdownOpen((prevState) => !prevState);

  const [tenantDropdownOpen, setDenantDropdownOpen] = useState(false);
  const toggle3 = () => setDenantDropdownOpen((prevState) => !prevState);

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedTenant, setSelectedTenant] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const generalledgerFormik = useFormik({
    initialValues: {
      payment_id: "",
      date: "",
      total_amount: "",
      payments_memo: "",
      payments: [
        {
          entry_id: "",
          account: "",
          amount: "",
          charge_type: "",
        },
      ],
      payments_attachment: [],
    },
    validationSchema: yup.object({
      date: yup.string().required("Required"),
      total_amount: yup.string().required("Required"),
      payments: yup.array().of(
        yup.object().shape({
          account: yup.string().required("Required"),
          amount: yup.number().required("Required"),
        })
      ),
    }),
    onSubmit: (values) => {
      if (Number(generalledgerFormik.values.total_amount) === Number(total)) {
        // handleSubmit(values);
      }
    },
  });

  const fetchchargeData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/charge/charges/${lease_id}`);
      setchargeData(response.data.totalCharges);
      const data = response.data.totalCharges.map((item) => {
        const myData = item.entry
          .filter((element) => element.charge_amount > 0)
          .map((element) => {
            const items = {
              account: element.account,
              balance: element.charge_amount,
              amount: 0,
              charge_type: element.charge_type,
              dropdownOpen: false,
            };
            return items;
          });
        console.log(myData, "paa");
        return myData;
      });

      console.log(data, "paas");
      generalledgerFormik.setValues({
        payments: [...data],
        payment_id: "",
        date: "",
        total_amount: 0,
        payments_memo: "",
        payments_attachment: [],
      });
    } catch (error) {
      console.error("Error fetching tenant details:", error);
    }
    setLoading(false);
  };

  const fetchtenantsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/leases/tenants/${lease_id}`);
      const uniqueTenantData = {};
      response.data.data.forEach((item) => {
        uniqueTenantData[item.tenant_id] = item;
      });

      const filteredData = Object.values(uniqueTenantData);
      setTenantsData(filteredData);
    } catch (error) {
      console.error("Error fetching tenant details:", error);
    }
    setLoading(false);
  };

  const [recAccounts, setRecAccounts] = useState([]);
  const [oneTimeAccounts, setoneTimeAccounts] = useState([]);
  const fetchAccounts = async () => {
    try {
      const res = await axios.get(
        `${baseUrl}/accounts/accounts/${accessType.admin_id}`
      );
      if (res.data.statusCode === 200) {
        const filteredData1 = res.data.data.filter(
          (item) => item.charge_type === "Recurring Charge"
        );
        const filteredData2 = res.data.data.filter(
          (item) => item.charge_type === "One Time Charge"
        );
        setRecAccounts(filteredData1);
        setoneTimeAccounts(filteredData2);
      } else if (res.data.statusCode === 201) {
        setRecAccounts();
        setoneTimeAccounts();
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  useEffect(() => {
    fetchtenantsData();
    fetchchargeData();
    fetchAccounts();
  }, [lease_id]);

  const [total, setTotal] = useState(0);
  const handleTotal = () => {
    let sum = 0;
    generalledgerFormik.values.payments?.forEach((element) => {
      sum += parseInt(Number(element.amount));
    });
    setTotal(sum);
  };

  useEffect(() => {
    handleTotal();
  }, [generalledgerFormik.values.payments]);

  const toggleDropdown = (index) => {
    const updatedCharges = [...generalledgerFormik.values.payments];
    updatedCharges[index].dropdownOpen = !updatedCharges[index].dropdownOpen;
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      payments: updatedCharges,
    });
  };

  const [tenantId, setTenantId] = useState("Select Resident");
  const handleRecieverSelection = (property) => {
    setSelectedTenant(
      `${property.tenant_firstName} ${property.tenant_lastName}`
    );
    setTenantId(property.tenant_id);
  };

  const handleAccountSelection = (value, index, chargeType) => {
    const updatedCharges = [...generalledgerFormik.values.payments];

    if (updatedCharges[index]) {
      updatedCharges[index].account = value;
      updatedCharges[index].charge_type = chargeType;
      generalledgerFormik.setValues({
        ...generalledgerFormik.values,
        payments: updatedCharges,
      });
    }
  };

  const handleAddRow = () => {
    const newCharges = {
      account: "",
      amount: "",
    };
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      payments: [...generalledgerFormik.values.payments, newCharges],
    });
  };

  const handleRemoveRow = (index) => {
    const updatedCharges = [...generalledgerFormik.values.payments];
    updatedCharges.splice(index, 1);
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      payments: updatedCharges,
    });
  };

  const [file, setFile] = useState([]);
  const fileData = (files) => {
    const filesArray = [...files];
    if (filesArray.length <= 10 && file.length === 0) {
      const finalArray = [];
      for (let i = 0; i < filesArray.length; i++) {
        const object = {
          upload_file: filesArray[i],
          upload_date: moment().format("YYYY-MM-DD"),
          upload_time: moment().format("HH:mm:ss"),
          upload_by: accessType?.first_name + " " + accessType?.last_name,
          file_name: filesArray[i].name,
        };
        finalArray.push(object);
      }
      setFile([...finalArray]);
    } else if (
      file.length >= 0 &&
      file.length <= 10 &&
      filesArray.length + file.length > 10
    ) {
      setFile([...file]);
    } else {
      const finalArray = [];

      for (let i = 0; i < filesArray.length; i++) {
        const object = {
          upload_file: filesArray[i],
          upload_date: moment().format("YYYY-MM-DD"),
          upload_time: moment().format("HH:mm:ss"),
          upload_by: accessType?.first_name + " " + accessType?.last_name,
          file_name: filesArray[i].name,
        };
        finalArray.push(object);
      }
      setFile([...file, ...finalArray]);
    }
  };

  const deleteFile = (index) => {
    const newFile = [...file];
    newFile.splice(index, 1);
    setFile(newFile);
    generalledgerFormik.setFieldValue("charges_attachment", newFile);
  };

  const handleOpenFile = (item) => {
    if (typeof item !== "string") {
      const url = URL.createObjectURL(item);
      window.open(url, "_blank");
    } else {
      window.open(
        `https://propertymanager.cloudpress.host/api/images/get-file/${item}`,
        "_blank"
      );
    }
  };

  const handleCloseButtonClick = () => {
    navigate(`/${admin}/rentrolldetail/${lease_id}`);
  };

  return (
    <>
      <PaymentHeader />
      <style>
        {`
            .custom-date-picker {
            background-color: white;
            }
        `}
      </style>
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-1" xl="12">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">payment</h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  {console.log("yash", generalledgerFormik.values)}
                  <Row>
                    <Col lg="2">
                      <label
                        className="form-control-label"
                        htmlFor="input-unitadd"
                      >
                        Payment for: {tenantsData.tenant_firstName}{" "}
                        {tenantsData.tenant_lastName}
                      </label>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Date
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-unitadd"
                          placeholder="3000"
                          type="date"
                          name="date"
                          onBlur={generalledgerFormik.handleBlur}
                          onChange={generalledgerFormik.handleChange}
                          value={generalledgerFormik.values.date}
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-property"
                        >
                          Payment Method
                        </label>
                        <br />
                        <Dropdown
                          isOpen={recdropdownOpen}
                          toggle={toggle2}
                          disabled={payment_id}
                        >
                          <DropdownToggle caret style={{ width: "100%" }}>
                            {selectedPaymentMethod
                              ? selectedPaymentMethod
                              : "Selcet Method"}
                          </DropdownToggle>
                          <DropdownMenu
                            style={{
                              width: "100%",
                              maxHeight: "200px",
                              overflowY: "auto",
                              overflowX: "hidden",
                            }}
                          >
                            <DropdownItem
                              onClick={() =>
                                setSelectedPaymentMethod("Credit Card")
                              }
                            >
                              Credit Card
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => setSelectedPaymentMethod("Cash")}
                            >
                              Cash
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
                    </Col>
                    <Col sm="12">
                      <>
                        <Row>
                          <Col sm="4">
                            <FormGroup>
                              <label
                                className="form-control-label"
                                htmlFor="input-property"
                              >
                                Amount *
                              </label>
                              <Input
                                type="number"
                                id="amount"
                                placeholder="Enter amount"
                                name="total_amount"
                                onBlur={generalledgerFormik.handleBlur}
                                onChange={generalledgerFormik.handleChange}
                                value={generalledgerFormik.values.total_amount}
                              />
                            </FormGroup>
                          </Col>
                        </Row>
                      </>
                      {selectedPaymentMethod === "Credit Card" ? (
                        <>
                          <Row>
                            <Col sm="4">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Card Number *
                                </label>
                                <InputGroup>
                                  <Input
                                    type="number"
                                    id="creditcard_number"
                                    placeholder="0000 0000 0000 0000"
                                    name="creditcard_number"
                                  />
                                </InputGroup>
                              </FormGroup>
                            </Col>
                          </Row>

                          <Row>
                            <Col sm="2">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Expiration Date *
                                </label>
                                <Input
                                  type="text"
                                  id="expiration_date"
                                  name="expiration_date"
                                />
                              </FormGroup>
                            </Col>
                            <Col sm="2">
                              <FormGroup>
                                <label
                                  className="form-control-label"
                                  htmlFor="input-property"
                                >
                                  Cvv *
                                </label>
                                <Input
                                  type="number"
                                  id="cvv"
                                  placeholder="XXX"
                                  name="cvv"
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </>
                      ) : (
                        ""
                      )}
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="2">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-property"
                        >
                          Recieved From
                        </label>
                        <br />
                        <Dropdown
                          isOpen={tenantDropdownOpen}
                          toggle={toggle3}
                          disabled={payment_id}
                        >
                          <DropdownToggle caret style={{ width: "100%" }}>
                            {selectedTenant
                              ? selectedTenant
                              : "Select Resident"}
                          </DropdownToggle>
                          <DropdownMenu
                            style={{
                              width: "100%",
                              maxHeight: "200px",
                              overflowY: "auto",
                              overflowX: "hidden",
                            }}
                          >
                            {tenantsData?.map((tenant, index) => (
                              <DropdownItem
                                key={index}
                                onClick={() => handleRecieverSelection(tenant)}
                              >
                                {`${tenant.tenant_firstName} ${tenant.tenant_lastName}`}
                              </DropdownItem>
                            ))}
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="3">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Memo
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-unitadd"
                          placeholder="if left blank, will show 'Payment'"
                          type="text"
                          name="memo"
                        />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col lg="12">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-unitadd"
                        >
                          Apply Payment to Balances
                        </label>
                        <div className="table-responsive">
                          <Table
                            className="table table-bordered"
                            style={{
                              borderCollapse: "collapse",
                              border: "1px solid #ddd",
                              overflow: "hidden",
                            }}
                          >
                            <thead>
                              <tr>
                                <th>Account</th>
                                <th>Balance</th>
                                <th>Amount</th>
                              </tr>
                            </thead>
                            <tbody>
                              <>
                                {generalledgerFormik.values.payments?.map(
                                  (payments, index) => (
                                    <tr key={index}>
                                      <td>
                                        <Dropdown
                                          isOpen={payments.dropdownOpen}
                                          toggle={() => toggleDropdown(index)}
                                        >
                                          <DropdownToggle caret>
                                            {payments.account
                                              ? payments.account
                                              : "Select"}
                                          </DropdownToggle>
                                          <DropdownMenu
                                            style={{
                                              zIndex: 999,
                                              maxHeight: "200px",
                                              overflowY: "auto",
                                            }}
                                          >
                                            <DropdownItem
                                              header
                                              style={{ color: "blue" }}
                                            >
                                              Liability Account
                                            </DropdownItem>
                                            <DropdownItem
                                              onClick={() => {
                                                handleAccountSelection(
                                                  "Last Month's Rent",
                                                  index,
                                                  "Liability Account"
                                                );
                                              }}
                                            >
                                              Last Month's Rent
                                            </DropdownItem>
                                            <DropdownItem
                                              onClick={() => {
                                                handleAccountSelection(
                                                  "Prepayments",
                                                  index,
                                                  "Liability Account"
                                                );
                                              }}
                                            >
                                              Prepayments
                                            </DropdownItem>
                                            <DropdownItem
                                              onClick={() => {
                                                handleAccountSelection(
                                                  "Security Deposit Liability",
                                                  index,
                                                  "Liability Account"
                                                );
                                              }}
                                            >
                                              Security Deposit Liability
                                            </DropdownItem>
                                            {recAccounts.length > 0 ? (
                                              <>
                                                <DropdownItem
                                                  header
                                                  style={{ color: "blue" }}
                                                >
                                                  Reccuring Charges
                                                </DropdownItem>
                                                {recAccounts?.map((item) => (
                                                  <DropdownItem
                                                    key={item._id}
                                                    onClick={() => {
                                                      handleAccountSelection(
                                                        item.account,
                                                        index,
                                                        "Recurring Charge"
                                                      );
                                                    }}
                                                  >
                                                    {item.account}
                                                  </DropdownItem>
                                                ))}
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                            {oneTimeAccounts.length > 0 ? (
                                              <>
                                                <DropdownItem
                                                  header
                                                  style={{ color: "blue" }}
                                                >
                                                  One Time Charges
                                                </DropdownItem>
                                                {oneTimeAccounts?.map(
                                                  (item) => (
                                                    <DropdownItem
                                                      key={item._id}
                                                      onClick={() => {
                                                        handleAccountSelection(
                                                          item.account,
                                                          index,
                                                          "One Time Charge"
                                                        );
                                                      }}
                                                    >
                                                      {item.account}
                                                    </DropdownItem>
                                                  )
                                                )}
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                          </DropdownMenu>
                                        </Dropdown>
                                      </td>
                                      <td>
                                        <Input
                                          className="form-control-alternative"
                                          id="input-unitadd"
                                          placeholder="$0.00"
                                          type="number"
                                          name={`payments[${index}].balance`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={
                                            generalledgerFormik.handleChange
                                          }
                                          value={payments.balance}
                                          readOnly
                                        />
                                      </td>
                                      <td>
                                        <Input
                                          className="form-control-alternative"
                                          id="input-unitadd"
                                          placeholder="$0.00"
                                          style={{ width: "80%" }}
                                          type="text"
                                          name={`payments[${index}].amount`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={(e) => {
                                            generalledgerFormik.handleChange(e);
                                          }}
                                          onInput={(e) => {
                                            const inputValue = e.target.value;
                                            const numericValue =
                                              inputValue.replace(/\D/g, "");
                                            e.target.value = numericValue;
                                          }}
                                          value={payments.amount}
                                        />
                                        {generalledgerFormik.touched.payments &&
                                        generalledgerFormik.touched.payments[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.payments &&
                                        generalledgerFormik.errors.payments[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.payments[
                                          index
                                        ].amount ? (
                                          <div style={{ color: "red" }}>
                                            {
                                              generalledgerFormik.errors
                                                .payments[index].amount
                                            }
                                          </div>
                                        ) : null}
                                      </td>
                                      {!payment_id && (
                                        <td>
                                          <ClearIcon
                                            type="button"
                                            style={{
                                              cursor: "pointer",
                                              padding: 0,
                                            }}
                                            onClick={() =>
                                              handleRemoveRow(index)
                                            }
                                          >
                                            Remove
                                          </ClearIcon>
                                        </td>
                                      )}
                                    </tr>
                                  )
                                )}
                                <tr>
                                  <th>Total</th>
                                  <th>{total.toFixed(2)}</th>
                                </tr>
                                {Number(
                                  generalledgerFormik.values.total_amount || 0
                                ) !== Number(total) ? (
                                  <tr>
                                    <th colSpan={2}>
                                      <span
                                        style={{
                                          cursor: "pointer",
                                          color: "red",
                                        }}
                                      >
                                        The payment's amount must match the
                                        total applied to balance. The difference
                                        is $
                                        {Math.abs(
                                          generalledgerFormik.values
                                            .total_amount - total
                                        ).toFixed(2)}
                                      </span>
                                    </th>
                                  </tr>
                                ) : null}
                              </>
                            </tbody>
                            {!payment_id && (
                              <tfoot>
                                <tr>
                                  <td colSpan="4">
                                    <Button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={handleAddRow}
                                    >
                                      Add Row
                                    </Button>
                                  </td>
                                </tr>
                              </tfoot>
                            )}
                          </Table>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="4">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Upload Files (Maximum of 10)
                        </label>

                        <div className="d-flex">
                          <div className="file-upload-wrapper">
                            <input
                              type="file"
                              className="form-control-file d-none"
                              accept="file/*"
                              name="upload_file"
                              id="upload_file"
                              multiple
                              onChange={(e) => fileData(e.target.files)}
                            />
                            <label for="upload_file" className="btn">
                              Choose Files
                            </label>
                          </div>

                          <div className="d-flex ">
                            {file?.length > 0 &&
                              file?.map((file, index) => (
                                <div
                                  key={index}
                                  style={{
                                    position: "relative",
                                    marginLeft: "50px",
                                  }}
                                >
                                  <p
                                    onClick={() =>
                                      handleOpenFile(
                                        file?.upload_file
                                          ? file?.upload_file
                                          : file?.name?.upload_file
                                      )
                                    }
                                    style={{ cursor: "pointer" }}
                                  >
                                    {file?.name?.file_name
                                      ? file?.name?.file_name?.substr(0, 5)
                                      : file?.file_name?.substr(0, 5)}
                                    {file?.name?.file_name
                                      ? file?.name?.file_name?.length > 5
                                        ? "..."
                                        : null
                                      : file?.file_name?.length > 5
                                      ? "..."
                                      : null}
                                  </p>
                                  <CloseIcon
                                    style={{
                                      cursor: "pointer",
                                      position: "absolute",
                                      left: "64px",
                                      top: "-2px",
                                    }}
                                    onClick={() => deleteFile(index)}
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="3">
                      <FormGroup>
                        <Checkbox name="print_receipt" />
                        <label
                          className="form-control-label"
                          htmlFor="input-address"
                        >
                          Print Receipt
                        </label>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg="5">
                      <FormGroup>
                        {loader ? (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{
                              background: "green",
                              cursor: "not-allowed",
                            }}
                            disabled
                          >
                            Loading...
                          </button>
                        ) : payment_id ? (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ background: "green", cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              // editCharge(generalledgerFormik.values);
                            }}
                          >
                            Edit Charge
                          </button>
                        ) : (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ background: "green", cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              generalledgerFormik.handleSubmit();
                            }}
                          >
                            Add Charge
                          </button>
                        )}

                        <Button
                          color="primary"
                          className="btn btn-primary"
                          onClick={handleCloseButtonClick}
                          style={{ background: "white", color: "black" }}
                        >
                          Cancel
                        </Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </>
  );
}

export default AddPayment;
