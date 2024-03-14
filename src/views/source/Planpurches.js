import React, { useState, useEffect } from "react";
import RentalHeader from "components/Headers/PlanHeader";
import {
  Container,
  Row,
  Col,
  Button,
  Input,
  FormGroup,
  Form,
} from "reactstrap";
import "./plan.css";
import axios from "axios";
import creditCardType from "credit-card-type";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import { FormHelperText, InputAdornment, OutlinedInput } from "@mui/material";

function Planpurches() {
  const [Continue, setContinue] = useState(false);
  const { admin } = useParams();
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [accessType, setAccessType] = useState(null);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      console.log(jwt, "jwt");
      setAccessType(jwt);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);
  console.log(accessType, "accesstype");

  const location = useLocation();
  const receivedData = location.state?.plan || "No data received";
  console.log("receivedData", receivedData);
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched data:", data);
        const statesList = data.map((country) => country.subregion);
        const countriesList = data.map((country) => country.name.common);
        const uniqueStates = Array.from(new Set(statesList));
        const uniqueCountries = Array.from(new Set(countriesList));
        setStates(uniqueStates);
        setCountries(uniqueCountries);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);
  const [cardLogo, setCardLogo] = useState({});
  const setCardNumber = async (cur_val) => {
    try {
      const sanitizedValue = cur_val.replace(/\D/g, "");
      const cardType = creditCardType(sanitizedValue)[0];
      if (cardType && cardType.type) {
        const response = await axios.get(
          `https://logo.clearbit.com/${cardType.type.toLowerCase()}.com`
        );
        if (response.status === 200) {
          setCardLogo(response.config.url);
        } else {
          setCardLogo("");
        }
        planPurchaseFormik.setFieldValue("card_type", cardType.type);
      } else {
        planPurchaseFormik.setFieldValue("card_type", " ");
        setCardLogo("");
      }
    } catch (error) {
      console.error("Error fetching name:", error);
    }
  };
  console.log(cardLogo, "cardLogo");

  const planPurchaseFormik = useFormik({
    initialValues: {
      street_address: "",
      city: "",
      state: "",
      postal_code: "",
      country: "",
      card_type: "",
      card_number: "",
      expiration_month: "",
      expiration_year: "",
      cvv: "",
      cardholder_name: "",
    },
    validationSchema: Yup.object().shape({}),

    onSubmit: (values) => {
      planPurchaseFormik.resetForm();
      console.log(receivedData, "receivedData");
      setContinue(true);
      console.log(values, "values");
      handleSubmit(values);
    },
  });
  console.log(planPurchaseFormik.values, "planPurchaseFormik");

  const handleSubmit = async (values) => {
    const addSubObject = {
      admin_id: accessType.admin_id,
      plan_id: receivedData?.plan_id,
      plan_amount: receivedData?.plan_price,
      purchase_date: moment().format("YYYY-MM-DD"),
      expiration_date: values.expiration_month + "/" + values.expiration_year,
      plan_duration_months: receivedData?.billing_interval,
      status: "",
      address: values.street_address,
      city: values.city,
      state: values.state,
      postal_code: values.postal_code,
      country: values.country,
      card_type: values.card_type,
      card_number: values.card_number,
      cvv: values.cvv,
      cardholder_name: values.cardholder_name,
      is_active: true,
    };

    const nmiObject = {
      planId: receivedData?.plan_id,
      ccnumber: values.card_number,
      ccexp: values.expiration_month + "/" + values.expiration_year,
      first_name: accessType?.first_name,
      last_name: accessType?.last_name,
      address: values.street_address,
      email: accessType?.email,
      city: values.city,
      state: values.state,
      zip: values.postal_code,
    };
    await axios
      .post(`${baseUrl}/nmipayment/custom-add-subscription`, nmiObject)
      .then(async (res) => {
        console.log(res, "res");
        if (res.data.status === 200) {
          await axios
            .post(`${baseUrl}/purchase/purchase`, addSubObject)
            .then((resp) => {
              if (resp.data.statusCode === 200) {
                console.log(resp, "res");
                navigate(`/${admin}/index`);
                toast.success(resp.data.message, {
                  position: "top-center",
                  autoClose: 1000,
                });
              } else {
                toast.error(resp.data.message, {
                  position: "top-center",
                });
              }
            })
            .catch((err) => {
              console.log(err, "err");
              toast.error(err.data.message, {
                position: "top-center",
                autoClose: 1000,
              });
            });
        }
      });
  };
  const billingIntervalNumber = parseInt(receivedData.billing_interval);

  const currentDate = new Date();

  const endDate = new Date(currentDate);
  endDate.setMonth(currentDate.getMonth() + billingIntervalNumber);

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const planDuration = `Plan - ${formatDate(currentDate)} to ${formatDate(
    endDate
  )}`;

  console.log(planDuration);

  const calculateTotal = (data) => {
    if (data.is_annual_discount && data.annual_discount) {
      const discountAmount = (data.plan_price * data.annual_discount) / 100;
      return data.plan_price - discountAmount;
    }
    return data.plan_price;
  };

  const total = calculateTotal(receivedData);

  console.log(total);
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString().padStart(2, "0"),
    label: (i + 1).toString().padStart(2, "0"),
  }));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 12 }, (_, i) => ({
    value: currentYear + i,
    label: currentYear + i,
  }));
  const discountAmount =
    (receivedData.plan_price * receivedData.annual_discount) / 100;

  return (
    <>
      <RentalHeader />
      <Container fluid className="mt--7" id="home">
        <Row className=" justify-content-center">
          <Col
            xs={12}
            md={12}
            lg={12}
            className="my-5 d-flex flex-column interactive-card"
            style={{ borderTopRightRadius: "30px" }}
          >
            <div className="">
              <div
                className="homee-section card h-100 premium-cards "
                style={{
                  boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
                }}
              >
                <div className=" card-body mb-5">
                  <div className="homee-section">
                    <b style={{ color: "rgb(10, 37, 59)" }}>
                      <h2>1. Enter the company Address</h2>
                    </b>
                    <p>
                      Enter the company’s headquarters to ensure accurate tax
                      information.
                    </p>
                    <Form
                      onSubmit={(event) => {
                        event.preventDefault();
                        setContinue(true);
                      }}
                    >
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-member"
                        >
                          STREET ADDRESS
                        </label>
                        <Input
                          type="textarea"
                          className="mb-1 "
                          style={{ width: "60%" }}
                          // type="text"
                          required
                          onChange={planPurchaseFormik.handleChange}
                          value={planPurchaseFormik.values.street_address}
                          onBlur={planPurchaseFormik.handleBlur}
                          name="street_address"
                          id="street_address"
                        />
                      </FormGroup>
                      <div className="d-flex">
                        <FormGroup className="">
                          <label
                            className="form-control-label"
                            htmlFor="input-member"
                          >
                            CITY
                          </label>

                          <Input
                            className="mb-1"
                            style={{ width: "80%" }}
                            type="text"
                            required
                            onChange={planPurchaseFormik.handleChange}
                            value={planPurchaseFormik.values.city}
                            onBlur={planPurchaseFormik.handleBlur}
                            name="city"
                            id="city"
                          />
                        </FormGroup>
                        <FormGroup className="">
                          <label
                            className="form-control-label"
                            htmlFor="input-member"
                          >
                            STATE
                          </label>

                          <Input
                            className="mb-1"
                            style={{ width: "78%" }}
                            type="text"
                            required
                            onChange={planPurchaseFormik.handleChange}
                            value={planPurchaseFormik.values.state}
                            onBlur={planPurchaseFormik.handleBlur}
                            name="state"
                            id="state"
                          />
                        </FormGroup>

                        <FormGroup className="">
                          <label
                            className="form-control-label"
                            htmlFor="input-text"
                          >
                            Postal Code
                          </label>

                          <Input
                            className="mb-1"
                            style={{ width: "80%" }}
                            type="text"
                            required
                            name="postal_code"
                            id="postal_code"
                            onChange={planPurchaseFormik.handleChange}
                            value={planPurchaseFormik.values.postal_code}
                            onBlur={planPurchaseFormik.handleBlur}
                            onInput={(e) => {
                              const inputValue = e.target.value;
                              const numericValue = inputValue.replace(
                                /\D/g,
                                ""
                              );
                              e.target.value = numericValue;
                            }}
                          />
                        </FormGroup>
                      </div>
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-member"
                        >
                          COUNTRY
                        </label>
                        <Input
                          className="mb-1 add"
                          style={{
                            width: "60%",
                            backgroundColor: "#f8f9fa",
                            borderColor: "#ced4da",
                            borderRadius: "0.375rem",
                            color: "#495057",
                            padding: "0.375rem 0.75rem",
                            fontSize: "1rem",
                            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                          }}
                          type="select"
                          required
                          onChange={planPurchaseFormik.handleChange}
                          value={planPurchaseFormik.values.country}
                          onBlur={planPurchaseFormik.handleBlur}
                          name="country"
                          id="country"
                        >
                          <option value="">Select Country</option>
                          {countries.map((country, index) => (
                            <option key={index} value={country}>
                              {country}
                            </option>
                          ))}
                        </Input>
                      </FormGroup>

                      <Button
                        size="sm"
                        style={{
                          background: "black",
                          color: "white",
                          width: "100px",
                          height: "50px",
                          background:
                            "linear-gradient(87deg, #11cdef 0, #1171ef 100%)",
                        }}
                        className="mb-5"
                      >
                        Continue
                      </Button>
                    </Form>
                    {Continue === true ? (
                      <>
                        <b style={{ color: "rgb(10, 37, 59)" }}>
                          <h2>
                            2. Review subscription & enter payment information
                          </h2>
                        </b>

                        <div
                          className="card  premium-cards"
                          style={{
                            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                            width: "90%",
                          }}
                        >
                          <div
                            className=" card-body "
                            style={{ paddingLeft: "30px", color: "black" }}
                          >
                            <b style={{ color: "rgb(10, 37, 59)" }}>
                              Subtotal
                              <hr />
                            </b>
                            <div className="d-flex justify-content-between">
                              <p>Plan Price:</p>
                              <p>{receivedData.plan_price}</p>
                            </div>
                            <div className="d-flex justify-content-between">
                              {receivedData.is_annual_discount === true ? (
                                <p>
                                  {receivedData.billing_interval} - Annual
                                  Subscription{" "}
                                  <span style={{ fontWeight: "bold" }}>
                                    {receivedData.annual_discount}% Discount
                                  </span>
                                </p>
                              ) : (
                                <p>
                                  {receivedData.billing_interval} Subscription
                                </p>
                              )}
                              {receivedData.is_annual_discount === true ? (
                                <p>
                                  <p>{discountAmount}</p>
                                </p>
                              ) : (
                                <p></p>
                              )}
                            </div>
                            <p className="mb-5">{planDuration}</p>
                            <div className="d-flex justify-content-between">
                              <p style={{ fontWeight: "bolder" }}>TOTAL:</p>
                              <p
                                style={{
                                  // paddingLeft: "84%",
                                  fontWeight: "bolder",
                                }}
                              >
                                {total}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div
                          className="card  premium-cards"
                          style={{
                            boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
                            width: "90%",
                            marginTop: "30px",
                          }}
                        >
                          <div
                            className=" card-body"
                            style={{ paddingLeft: "30px", color: "black" }}
                          >
                            <b style={{ color: "rgb(10, 37, 59)" }}>
                              Payment information
                              <hr />
                            </b>
                            <Form
                              onSubmit={(event) => {
                                event.preventDefault();
                                planPurchaseFormik.handleSubmit();
                              }}
                            >
                              {/* <div className="d-flex carddd">
                                <label
                                  className="form-control-label  mb-3"
                                  htmlFor="input-member"
                                >
                                  Card type
                                </label>
                                <Input
                                  className="mb-3"
                                  style={{ width: "50%", marginLeft: "77px" }}
                                  type="text"
                                  required
                                  onChange={planPurchaseFormik.handleChange}
                                  value={planPurchaseFormik.values.card_type}
                                  id="card_type"
                                  name="card_type"
                                  onBlur={planPurchaseFormik.handleBlur}
                                  disabled
                                />
                              </div> */}
                              <div className="d-flex carddd">
                                <label
                                  className="form-control-label mb-3"
                                  htmlFor="input-member"
                                >
                                  Card Number
                                </label>

                                <OutlinedInput
                                  className="mb-3"
                                  onChange={(e) => {
                                    const inputValue = e.target.value.slice(
                                      0,
                                      16
                                    );
                                    setCardNumber(inputValue);
                                    planPurchaseFormik.setFieldValue(
                                      "card_number",
                                      inputValue
                                    );
                                  }}
                                  style={{ width: "50%", marginLeft: "49px" }}
                                  type="number"
                                  required
                                  value={planPurchaseFormik.values.card_number}
                                  id="card_number"
                                  name="card_number"
                                  size="small"
                                  onBlur={planPurchaseFormik.handleBlur}
                                  endAdornment={
                                    <InputAdornment position="end">
                                      {planPurchaseFormik.values.card_number &&
                                        cardLogo && (
                                          <img
                                            src={cardLogo}
                                            height="40px"
                                            width="40px"
                                            style={{ borderRadius: "30px" }}
                                            alt="mastercard"
                                          />
                                        )}
                                    </InputAdornment>
                                  }
                                />
                              </div>
                              <div className="d-flex carddd">
                                <label
                                  className="form-control-label "
                                  htmlFor="input-member"
                                >
                                  Expiration Date
                                </label>
                                <div className="d-flex">
                                  <Input
                                    className="mb-3 dateyear"
                                    onChange={planPurchaseFormik.handleChange}
                                    name="expiration_month"
                                    id="expiration_month"
                                    value={
                                      planPurchaseFormik.values.expiration_month
                                    }
                                    onBlur={planPurchaseFormik.handleBlur}
                                    style={{
                                      width: "100%",
                                      marginLeft: "36px",
                                    }}
                                    type="select"
                                    required
                                  >
                                    <option value="">-Month-</option>
                                    {monthOptions.map((month) => (
                                      <option
                                        key={month.value}
                                        value={month.value}
                                      >
                                        {month.label}
                                      </option>
                                    ))}
                                  </Input>
                                  <p
                                    style={{
                                      paddingLeft: "18px",
                                      paddingRight: "18px",
                                      paddingTop: "5px",
                                    }}
                                  >
                                    /
                                  </p>
                                  <Input
                                    className="mb-3 dateyear"
                                    style={{ width: "100%" }}
                                    type="select"
                                    name="expiration_year"
                                    id="expiration_year"
                                    value={
                                      planPurchaseFormik.values.expiration_year
                                    }
                                    onBlur={planPurchaseFormik.handleBlur}
                                    onChange={planPurchaseFormik.handleChange}
                                    required
                                  >
                                    <option value="">-Year-</option>
                                    {yearOptions.map((year) => (
                                      <option
                                        key={year.value}
                                        value={year.value}
                                      >
                                        {year.label}
                                      </option>
                                    ))}
                                  </Input>
                                </div>
                              </div>
                              <div className="d-flex carddd">
                                <label
                                  className="form-control-label"
                                  htmlFor="input-member"
                                >
                                  CVV{" "}
                                </label>
                                <Input
                                  id="cvv"
                                  name="cvv"
                                  onChange={planPurchaseFormik.handleChange}
                                  onBlur={planPurchaseFormik.handleBlur}
                                  value={planPurchaseFormik.values.cvv}
                                  maxLength={4}
                                  onInput={(e) =>
                                    (e.target.value = e.target.value
                                      .replace(/[^0-9]/g, "")
                                      .replace(/(\..*)\./g, "$1"))
                                  }
                                  className="mb-3"
                                  style={{ width: "50%", marginLeft: "113px" }}
                                  type="text"
                                  required
                                />
                              </div>
                              <div className="d-flex carddd">
                                <label
                                  className="form-control-label "
                                  htmlFor="input-member"
                                >
                                  Cardholder Name{" "}
                                </label>
                                <Input
                                  className="mb-3"
                                  style={{ width: "50%", marginLeft: "20px" }}
                                  type="text"
                                  required
                                  id="cardholder_name"
                                  name="cardholder_name"
                                  onChange={planPurchaseFormik.handleChange}
                                  onBlur={planPurchaseFormik.handleBlur}
                                  value={
                                    planPurchaseFormik.values.cardholder_name
                                  }
                                />
                              </div>
                              <Button
                                size="sm"
                                type="submit"
                                style={{
                                  background: "black",
                                  color: "white",
                                  width: "100px",
                                  height: "50px",
                                  justifyContent: "center",
                                  marginTop: "40px",
                                  background:
                                    "linear-gradient(87deg, #11cdef 0, #1171ef 100%)",
                                }}
                                className="mb-5 justify-content-center"
                              >
                                Submit
                              </Button>
                            </Form>
                          </div>
                        </div>
                      </>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </>
  );
}

export default Planpurches;
