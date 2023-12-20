// reactstrap components
import React, { useState } from "react";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
} from "reactstrap";
import * as yup from "yup";
import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
import axios from "axios";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import { Typography, colors } from "@mui/material";
import swal from "sweetalert";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

const Login = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  let navigate = useNavigate();
  let cookies = new Cookies();
  const [isLoading, setIsLoading] = useState(false);

  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values) => {
    // cookies.remove("token");
    // cookies.remove("Tenant ID");
    try {
      setIsLoading(true);
      const adminRes = await axios.post(`${baseUrl}/register/login`, values);
      const tenantRes = await axios.post(`${baseUrl}/tenant/login`, {
        tenant_email: values.email,
        tenant_password: values.password,
      });
      const staffRes = await axios.post(`${baseUrl}/addstaffmember/login`, {
        staffmember_email: values.email,
        staffmember_password: values.password,
      });
      const vendorRes = await axios.post(`${baseUrl}/vendor/login`, {
        vendor_email: values.email,
        vendor_password: values.password,
      });
      if (adminRes.data.statusCode === 200) {
        swal("Success!", "Admin Login Successful!", "success").then((value) => {
          if (value) {
            cookies.set("token", adminRes.data.token);
            navigate("/admin/index");
          }
        });
      } else if (tenantRes.data.statusCode === 201) {
        const tenantData = tenantRes.data.data;
        console.log(tenantData, "tenantData");

        if (tenantData && tenantData._id) {
          swal("Success!", "Tenant Login Successful!", "success").then(
            (value) => {
              if (value) {
                cookies.set("token", tenantRes.data.token);
                cookies.set("Tenant ID", tenantData._id);
                localStorage.setItem("ID", tenantData._id);
                navigate("/tenant/tenantdashboard");
              }
            }
          );
        }
      } else if (staffRes.data.statusCode === 202) {
        const staffData = staffRes.data.data;
        console.log(staffData, "staffData");

        if (staffData && staffData._id) {
          swal("Success!", "Staff Login Successful!", "success").then(
            (value) => {
              if (value) {
                cookies.set("token", staffRes.data.token);
                cookies.set("Staff ID", staffData._id);
                localStorage.setItem("ID", staffData._id);
                navigate("/staff/staffdashboard");
              }
            }
          );
        }
      } else if (vendorRes.data.statusCode === 203) {
        const vendorData = vendorRes.data.data;
        console.log(vendorData, "vendorData");

        if (vendorData && vendorData._id) {
          swal("Success!", "Vendor Login Successful!", "success").then(
            (value) => {
              if (value) {
                cookies.set("token", vendorRes.data.token);
                cookies.set("Vendor ID", vendorData._id);
                localStorage.setItem("ID", vendorData._id);
                navigate("/vendor/vendordashboard");
              }
            }
          );
        }
      } else {
        swal("Error!", "Invalid Login Credentials", "error");
      }

      // const adminRes = await axios.post(`${baseUrl}/register/login`, values);

      // if (adminRes.data.statusCode === 200) {
      //   swal("Success!", "Admin Login Successful!", "success").then((value) => {
      //     if (value) {
      //       cookies.set("token", adminRes.data.token);
      //       navigate("/admin/index");
      //     }
      //   });
      // } else {
      //   const tenantRes = await axios.post(`${baseUrl}/tenant/login`, {
      //     tenant_email: values.email,
      //     tenant_password: values.password,
      //   });

      //   if (tenantRes.data.statusCode === 201) {
      //     const tenantData = tenantRes.data.data;
      //     console.log(tenantData, "tenantData")

      //     if (tenantData && tenantData._id) {
      //       swal("Success!", "Tenant Login Successful!", "success").then((value) => {
      //         if (value) {
      //           cookies.set("token", tenantRes.data.token);
      //           cookies.set("Tenant ID", tenantData._id);
      //           localStorage.setItem("ID", tenantData._id);
      //           navigate("/tenant/tenantdashboard");
      //         }
      //       });
      //     } else {
      //       swal("Error!", "Invalid tenant data", "error");
      //     }
      //   } else {
      //     const staffRes = await axios.post(`${baseUrl}/addstaffmember/login`, {
      //       staffmember_email: values.email,
      //       staffmember_password: values.password,
      //     });

      //     if (staffRes.data.statusCode === 202) {
      //       const staffData = staffRes.data.data;
      //       console.log(staffData, "staffData")

      //       if (staffData && staffData._id) {
      //         swal("Success!", "Staff Login Successful!", "success").then((value) => {
      //           if (value) {
      //             cookies.set("token", staffRes.data.token);
      //             cookies.set("Staff ID", staffData._id);
      //             localStorage.setItem("ID", staffData._id);
      //             navigate("/staff/staffdashboard");
      //           }
      //         });
      //       } else {
      //         swal("Error!", "Invalid staff data", "error");
      //       }
      //     } else {
      //       const vendorRes = await axios.post(`${baseUrl}/vendor/login`, {
      //         vendor_email: values.email,
      //         vendor_password: values.password,
      //       });

      //       if (vendorRes.data.statusCode === 203) {
      //         const vendorData = vendorRes.data.data;
      //         console.log(vendorData, "vendorData")

      //         if (vendorData && vendorData._id) {
      //           swal("Success!", "Vendor Login Successful!", "success").then((value) => {
      //             if (value) {
      //               cookies.set("token", vendorRes.data.token);
      //               cookies.set("Vendor ID", vendorData._id);
      //               localStorage.setItem("ID", vendorData._id);
      //               navigate("/vendor/vendordashboard");
      //             }
      //           });
      //         } else {
      //           swal("Error!", "Invalid vendor data", "error");
      //         }
      //       } else {
      //         swal("Error!", "Invalid credentials", "error");
      //       }
      //     }
      //   }
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  let loginFormik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup.string().required("Required"),
      password: yup
        .string()
        .required("No Password Provided")
        .min(8, "Password is too short")
        .matches(
          /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
          "Must Contain One Uppercase, One Lowercase, One Number and one special case Character"
        ),
    }),
    onSubmit: (values) => {
      handleSubmit(values);
    },
  });

  return (
    <>
      <Col lg="5" md="7">
        <Card
          className="bg-secondary shadow border-0"
          onSubmit={loginFormik.handleSubmit}
        >
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center text-muted mb-4">
              <small>Sign in with your credentials</small>
            </div>
            <Form role="form">
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-email-83" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Email"
                    type="email"
                    autoComplete="new-email"
                    name="email"
                    onBlur={loginFormik.handleBlur}
                    onChange={loginFormik.handleChange}
                    value={loginFormik.values.email}
                  />
                </InputGroup>
                {loginFormik.touched.email && loginFormik.errors.email ? (
                  <Typography variant="caption" style={{ color: "red" }}>
                    {loginFormik.errors.email}
                  </Typography>
                ) : null}
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText>
                      <i className="ni ni-lock-circle-open" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    id="standard-adornment-password"
                    autoComplete="new-password"
                    name="password"
                    placeholder="Password"
                    type={showPassword ? "text" : "password"}
                    onBlur={loginFormik.handleBlur}
                    onChange={loginFormik.handleChange}
                    value={loginFormik.values.password}
                  />

                  <IconButton
                    type="button"
                    style={{ padding: "7px" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {<VisibilityIcon />}
                  </IconButton>
                </InputGroup>
                {loginFormik.touched.password && loginFormik.errors.password ? (
                  <Typography variant="caption" style={{ color: "red" }}>
                    {loginFormik.errors.password}
                  </Typography>
                ) : null}
              </FormGroup>

              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                {/* <label
                  className="custom-control-label"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">Remember me</span>
                </label> */}
              </div>
              <div className="text-center">
                {/* <Button className="my-4" color="primary" type="button">
                    Sign in
                  </Button> */}

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  color="primary"
                >
                  {isLoading ? <CircularProgress size={24} /> : "Login"}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        {/* <Row className="mt-3">
            <Col xs="6">
              <a
                className="text-light"
                href="#rms"
                onClick={(e) => e.preventDefault()}
              >
                <small>Forgot password?</small>
              </a>
            </Col>
            <Col className="text-right" xs="6">
              <a
                className="text-light"
                href="#rms"
                onClick={(e) => e.preventDefault()}
              >
                <small>Create new account</small>
              </a>
            </Col>
          </Row> */}
      </Col>
    </>
  );
};

export default Login;
