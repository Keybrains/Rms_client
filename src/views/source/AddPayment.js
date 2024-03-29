import React, { useState, useEffect } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import ClearIcon from "@mui/icons-material/Clear";
import swal from "sweetalert";
import { CardContent, Typography } from "@mui/material";
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
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
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
import CreditCardForm from "./CreditCardForm";
import AccountDialog from "components/AccountDialog";

const AddPayment = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const imageUrl = process.env.REACT_APP_IMAGE_URL;
  const { tenantId, entryIndex } = useParams();
  const { paymentId } = useParams();
  const [id, setId] = useState("");
  const [index, setIndex] = useState("");
  const [file, setFile] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [propertyData, setPropertyData] = useState([]);
  const [checkedCheckbox, setCheckedCheckbox] = useState();
  const [prodropdownOpen, setproDropdownOpen] = useState(false);
  const [recdropdownOpen, setrecDropdownOpen] = useState(false);
  const [rentAddress, setRentAddress] = useState([]);
  const [tenantid, setTenantid] = useState(""); // Add this line
  const [tenantentryIndex, setTenantentryindex] = useState(""); // Add this line
  const [printReceipt, setPrintReceipt] = useState(false);
  const [isModalsOpen, setIsModalsOpen] = useState(false);

  const toggle1 = () => setproDropdownOpen((prevState) => !prevState);
  const toggle2 = () => setrecDropdownOpen((prevState) => !prevState);

  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  const location = useLocation();
  const state = location.state && location.state;
  const paymentState = state;

  const openCardForm = () => {
    setIsModalsOpen(true);
  };

  const closeModals = () => {
    setIsModalsOpen(false);
    getCreditCard();
    getMultipleCustomerVault();
  };

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  // const [selectedPaymentType, setSelectedPaymentType] = useState("");
  // const handlePaymentTypeChange = (type) => {
  //   setSelectedPaymentType(type);
  //   generalledgerFormik.setFieldValue("paymentType", type);
  // };

  const [selectAccountDropDown, setSelectAccountDropDown] =
    React.useState(false);
  const [selectAccountLevelDropDown, setSelectAccountLevelDropDown] =
    React.useState(false);
  const [selectFundTypeDropDown, setSelectFundtypeDropDown] =
    React.useState(false);
  const [AddBankAccountDialogOpen, setAddBankAccountDialogOpen] =
    useState(false);
  const [accountTypeName, setAccountTypeName] = useState([]);
  const [accountNames, setAccountNames] = useState([]);
  const [toggleApiCall, setToggleApiCall] = useState(false);

  const toggle8 = () => setSelectAccountDropDown((prevState) => !prevState);
  const toggle10 = () => setSelectFundtypeDropDown((prevState) => !prevState);

  const [selectedAccount, setselectedAccount] = useState("");
  const hadleselectedAccount = (account) => {
    setselectedAccount(account);
    // localStorage.setItem("leasetype", leasetype);
  };

  const toggleAddBankDialog = () => {
    setAddBankAccountDialogOpen((prevState) => !prevState);
  };
  const handleCloseDialog = () => {
    setAddBankAccountDialogOpen(false);
  };

  const AddNewAccountName = async (accountName) => {
    toggleAddBankDialog();
    setAccountTypeName(accountName);
  };

  // const fetchingRecAccountNames = async () => {
  //   // console.log("fetching rec accounr names");
  //   fetch(`${baseUrl}/recurringAcc/find_accountname`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.statusCode === 200) {
  //         // console.log(data.data,'Data from adding the account'); // Add this line to check the data
  //         setRecAccountNames(data.data);
  //       } else {
  //         // Handle error
  //         console.error("Error:", data.message);
  //       }
  //     })
  //     .catch((error) => {
  //       // Handle network error
  //       console.error("Network error:", error);
  //     });
  // };

  // const fetchingOneTimeCharges = async () => {
  //   // console.log("fetcjhiine pne rime charges");
  //   fetch(`${baseUrl}/onetimecharge/find_accountname`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.statusCode === 200) {
  //         // console.log(data.data,'Data from adding the account'); // Add this line to check the data
  //         setOneTimeCharges(data.data);
  //       } else {
  //         // Handle error
  //         console.error("Error:", data.message);
  //       }
  //     });
  // };

  useEffect(() => {
      // Make an HTTP GET request to your Express API endpoint
      fetchingAccountNames();
    fetchingRecAccountNames();
    fetchingOneTimeCharges();
  }, [toggleDropdown]);

  useEffect(() => {
      // Make an HTTP GET request to your Express API endpoint
      fetchingAccountNames();
    fetchingRecAccountNames();
    fetchingOneTimeCharges();
  }, [toggleApiCall]);

  const [selectedProp, setSelectedProp] = useState("Select Payment Method");
  const handlePropSelection = (propertyType) => {
    setSelectedProp(propertyType);
    generalledgerFormik.setFieldValue("payment_type", propertyType);
  };
  const [selectedRec, setSelectedRec] = useState("Select Resident");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mail, setMail] = useState("");
  const [property, setProperty] = useState(null);

  // console.log(generalledgerFormik.values,'sdfyggvbhjnkml')
  const handleRecieverSelection = (property) => {
    // setProperty(property);
    setSelectedRec(`${property.tenant_firstName} ${property.tenant_lastName}`);
    setTenantid(property._id); // Set the selected tenant's ID
    setTenantentryindex(property.entryIndex); // Set the selected tenant's entry index
  };

  const navigate = useNavigate();

  const generalledgerFormik = useFormik({
    initialValues: {
      date: "",
      rental_adress: "",
      tenant_id: "",
      entryIndex: "",
      amount: "",
      payment_type: "",
      customer_vault_id: "",
      billing_id: "",
      creditcard_number: "",
      expiration_date: "",
      // cvv: "",
      tenant_firstName: "",
      tenant_lastName: "",
      email_name: "",
      memo: "",
      entries: [
        {
          paymentIndex: "",
          account: "",
          amount: "",
          balance: "",
        },
      ],
      attachment: "",
      total_amount: "",
      response: "",
      responsetext: "",
      authcode: "",
      transactionid: "",
      avsresponse: "",
      cvvresponse: "",
      type2: "",
      response_code: "",
      cc_type: "",
    },
    validationSchema: yup.object({
      date: yup.string().required("Required"),
      amount: yup.string().required("Required"),
      payment_type: yup.string().required("Required"),
      entries: yup.array().of(
        yup.object().shape({
          account: yup.string().required("Required"),
          // balance: yup.number().required("Required"),
          amount: yup.number().required("Required"),
        })
      ),
    }),
    onSubmit: (values) => {
      if (Number(generalledgerFormik.values.amount) === Number(total_amount)) {
        handleSubmit(values);
      }
    },
  });
  console.log("object", generalledgerFormik.values);

  const handleCloseButtonClick = () => {
    navigate(`/admin/rentrolldetail/${tenantId}/${entryIndex}?source=payment`);
  };

  const handleEditCloseButtonClick = () => {
    navigate(
      `/admin/rentrolldetail/${tenantid}/${tenantentryIndex}?source=payment`
    );
  };

  useEffect(() => {
    fetchTenantData();
    // Make an HTTP GET request to your Express API endpoint
    fetch(`${baseUrl}/tenant/tenant-name/tenant/${rentAddress}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setPropertyData(data.data);
        } else {
          // Handle error
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  }, [rentAddress]);

  const handleAccountSelection = (value, index) => {
    //console.log("Selected index:", index);

    const updatedEntries = [...generalledgerFormik.values.entries];
    //console.log("Current entries:", updatedEntries);

    if (updatedEntries[index]) {
      updatedEntries[index].account = value;
      generalledgerFormik.setValues({
        ...generalledgerFormik.values,
        entries: updatedEntries,
      });
    } else {
      console.error(`Invalid index: ${index}`);
    }
  };

  const handleAddRow = () => {
    const newEntry = {
      account: "",
      description: "",
      debit: "",
      credit: "",
      dropdownOpen: false,
    };
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      entries: [...generalledgerFormik.values.entries, newEntry],
    });
  };

  const toggleDropdown = (index) => {
    const updatedEntries = [...generalledgerFormik.values.entries];
    updatedEntries[index].dropdownOpen = !updatedEntries[index].dropdownOpen;
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      entries: updatedEntries,
    });
  };

  const toggleDropdownForFormik = (index) => {
    formikForAnotherData.setValues((prevValues) => {
      const updatedEntries = [...prevValues.entries];
      if (updatedEntries[index]) {
        updatedEntries[index].dropdownOpen =
          !updatedEntries[index].dropdownOpen;
      }
      return { ...prevValues, entries: updatedEntries };
    });
  };

  const handleRemoveRow = (index) => {
    const updatedEntries = [...generalledgerFormik.values.entries];
    updatedEntries.splice(index, 1); // Remove the entry at the specified index
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      entries: updatedEntries,
    });
  };

  const handleRemoveRow2 = (index) => {
    const updatedEntries = [...formikForAnotherData.values.entries];
    updatedEntries.splice(index, 1); // Remove the entry at the specified index
    formikForAnotherData.setValues({
      ...formikForAnotherData.values,
      entries: updatedEntries,
    });
  };

  const [tenantData, setTenantData] = useState([]);
  const [propertyId, setPropertyId] = useState("");
  // const [propertyData, setPropertyData] = useState([]);

  const fetchTenantData = async () => {
    fetch(`${baseUrl}/tenant/tenant_summary/${tenantId}/entry/${entryIndex}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          const tenantDatas = data.data;
          setTenantData(tenantDatas);
          const rentalAddress = tenantDatas.entries.rental_adress;
          // console.log(tenantDatas.entries.property_id, "propertyId");
          setSelectedRec(
            `${tenantDatas.tenant_firstName} ${tenantDatas.tenant_lastName}`
          );
          setFirstName(`${tenantDatas.tenant_firstName}`);
          setLastName(`${tenantDatas.tenant_lastName}`);
          setMail(`${tenantDatas.tenant_email}`);
          setTenantid(tenantDatas._id);
          getAllCharges(tenantDatas._id);
          setPropertyId(tenantDatas.entries.property_id);
          setRentAddress(rentalAddress);
          generalledgerFormik.setValues({
            ...generalledgerFormik.values,
            rental_adress: rentalAddress,
          });
        }
      });
  };

  // useEffect(() => {
  //   fetch(`${baseUrl}/addaccount/find_accountname`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       if (data.statusCode === 200) {
  //         setAccountData(data.data);
  //       } else {
  //         console.error("Error:", data.message);
  //       }
  //     })
  //     .catch((error) => {
  //       console.error("Network error:", error);
  //     });
  // }, [toggleDropdown]);

  if (generalledgerFormik.values.values) {
  }
  // console.log(property,'proeprty')
  const [loader, setLoader] = useState(false);

  const formatExpirationDate = (date) => {
    // Assuming date is in the format "MM/YYYY"
    const [month, year] = date.split("/");
    return `${month}${year}`;
  };

  const handleSubmit = async (values) => {
    setLoader(true);
    let nmiResponse;
    let status;
    const financialDate = new Date(values.date);
    const currentDate = new Date();

    // Extract year, month, and day components separately
    const financialYear = financialDate.getFullYear();
    const financialMonth = financialDate.getMonth() + 1; // Months are zero-based, so add 1
    const financialDay = financialDate.getDate();

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-based, so add 1
    const currentDay = currentDate.getDate();

    // Combine year, month, and day components into a string representation of the date
    const financialDateString =
      financialYear + "-" + financialMonth + "-" + financialDay;
    const currentDateString =
      currentYear + "-" + currentMonth + "-" + currentDay;

    if (Array.isArray(generalledgerFormik.values.attachment)) {
      for (const [
        index,
        files,
      ] of generalledgerFormik.values.attachment.entries()) {
        if (files.upload_file instanceof File) {
          console.log(files.upload_file, "myfile");

          const imageData = new FormData();
          imageData.append(`files`, files.upload_file);

          const url = `${imageUrl}/images/upload`;

          try {
            const result = await axios.post(url, imageData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            // Update the original array with the uploaded file URL
            generalledgerFormik.values.attachment[index].upload_file =
              result.data.files[0].url;
          } catch (error) {
            console.error(error);
          }
        } else {
          console.log(files.upload_file, "myfile2");
        }
      }
    } else {
      console.error("Attachment is not an array");
    }
    const rentalAddress = generalledgerFormik.values.rental_adress;
    values["total_amount"] = total_amount;

    const chargesData =
      formikForAnotherData?.length > 0 &&
      formikForAnotherData?.values?.entries?.map((entry) => ({
        account: entry.account,
        amount: parseFloat(entry.amount),
        total_amount: total_amount,
      }));

    const paymentData = generalledgerFormik.values.entries.map((entry) => ({
      account: entry.account,
      amount: parseFloat(entry.amount),
      total_amount: total_amount,
    }));

    const paymentEntry =
      chargesData?.length > 0 ? [...paymentData, ...chargesData] : paymentData;
    console.log("object", paymentEntry);
    const updatedValues = {
      date: values.date,
      amount: values.amount,
      payment_type: selectedProp,
      // cvv: values.cvv,
      tenant_firstName: selectedRec,
      attachment: generalledgerFormik.values.attachment,
      rental_adress: rentalAddress,
      tenant_id: tenantid,
      entryIndex: tenantentryIndex,
      memo: values.memo || "Payment",
      entries: paymentEntry,
    };
    try {
      const response = await axios.post(
        `${baseUrl}/payment/add_payment`,
        updatedValues
      );

      if (response.data.statusCode === 200) {
        if (selectedProp === "Credit Card") {
          try {
            const creditCardDetails = cardDetalis.find(
              (card) => card.billing_id === selectedCreditCard
            );

            if (creditCardDetails) {
              values.customer_vault_id = vaultId;
              values.billing_id = selectedCreditCard;
            } else {
              console.error(
                "Credit card details not found for selected card:",
                selectedCreditCard
              );
            }
            const url = `${baseUrl}/nmipayment/new-sale`;
            const postObject = {
              first_name: firstName,
              last_name: lastName,
              email_name: mail,
              customer_vault_id: values.customer_vault_id,
              billing_id: values.billing_id,
              surcharge: values.surcharge,
              amount: values.amount,
              // cvv: values.cvv,
              tenantId: tenantData._id,
              date: values.date,
              address1: rentalAddress,
            };

            const response = await axios.post(url, {
              paymentDetails: postObject,
            });
            if (response.data && response.data.statusCode === 100) {
              nmiResponse = response.data.data;
            } else {
              nmiResponse = response.data.data;
              console.error("Unexpected response format:", response.data.data);
              swal("", response.data.message, "error");
            }
          } catch (error) {
            console.log(error);
          }
        }

        const id = response.data.data._id;
        if (id) {
          const pdfResponse = await axios.get(
            `${baseUrl}/Payment/Payment_summary/${id}`,
            { responseType: "blob" }
          );
          if (pdfResponse.status === 200 && printReceipt) {
            const pdfBlob = pdfResponse.data;
            const pdfData = URL.createObjectURL(pdfBlob);
            const doc = new jsPDF();

            // Set custom styling
            doc.setFont("helvetica");
            doc.setFontSize(12);

            // Add the image
            doc.addImage(Img, "JPEG", 15, 20, 30, 15); // left margin topmargin width hetght

            // Add the payment receipt text
            doc.setFont("helvetica", "bold"); // Set font name and style to bold
            doc.setFontSize(16); // Increase the font size to 16
            doc.text("Payment Receipt", 90, 30);
            doc.setFont("helvetica", "normal"); // Reset font style to normal (optional)
            doc.setFontSize(12); // Reset the font size to its original size (optional)

            doc.setFont("helvetica", "bold"); // Set font name and style to bold for titles
            doc.text("Date:", 15, 60); // Title in bold
            doc.setFont("helvetica", "normal"); // Reset font style to normal for data
            doc.text(updatedValues.date, 28, 60); // Value in normal font

            doc.setFont("helvetica", "bold"); // Set font name and style to bold for titles
            doc.text("Tenant Name:", 15, 70); // Title in bold
            doc.setFont("helvetica", "normal"); // Reset font style to normal for data
            doc.text(selectedRec, 45, 70);

            doc.setFont("helvetica", "bold"); // Set font name and style to bold for titles
            doc.text("Payment Method:", 15, 80); // Title in bold
            doc.setFont("helvetica", "normal"); // Reset font style to normal for data
            doc.text(selectedProp, 52, 80);

            // doc.text("Tenant Name: " + selectedRec, 15, 70); // Title and data in normal font
            // doc.text("Payment Method: " + selectedProp, 15, 80);

            const headers = [
              {
                content: "Account",
                styles: {
                  fillColor: [211, 211, 211],
                  textColor: [255, 255, 255],
                },
              },
              {
                content: "Amount",
                styles: {
                  fillColor: [211, 211, 211],
                  textColor: [255, 255, 255],
                },
              },
            ];

            // Create data array with rows for "Account" and "Amount" values
            const data = updatedValues.entries.map((entry) => [
              entry.account,
              entry.amount,
            ]);

            // Add a separate row for "Total Amount"
            const totalAmount = parseFloat(
              updatedValues.entries[0].total_amount
            );
            data.push([
              { content: "Total Amount", styles: { fontStyle: "bold" } },
              { content: totalAmount, styles: { fontStyle: "bold" } },
            ]);

            const headStyles = {
              lineWidth: 0.01,
              lineColor: [0, 0, 0],
              fillColor: [19, 89, 160],
              textColor: [255, 255, 255],
              fontStyle: "bold",
            };

            doc.autoTable({
              head: [headers],
              body: data,
              startY: 90,
              theme: "striped",
              styles: { fontSize: 12 },
              headers: headStyles,
              margin: { top: 10, left: 10 },
            });

            // Add the PDF content
            doc.addImage(pdfData, "JPEG", 15, 110, 180, 100);

            // Save the PDF with a custom filename
            doc.save(`PaymentReceipt_${id}.pdf`);
          } else {
            if (!printReceipt) {
              // swal("Success!", "Payment added successfully", "success");
            } else {
              // swal("Error", "Failed to retrieve PDF summary", "error");
            }
          }
        } else {
          // swal("Error", "Failed to get 'id' from the response", "error");
        }
      } else {
        swal("Error", response.data.message, "error");
        console.error("Server Error:", response.data.message);
      }

      // calling api of payment and charge
      try {
        // console.log(formikForAnotherData.values, "formikForAnotherData in formik")
        selectedProp === "Credit Card" && financialDate > currentDate
          ? (status = "Pending")
          : (status = "Success");

        const chargesData1 =
          selectedProp === "Credit Card"
            ? formikForAnotherData?.values?.length !== 0
              ? formikForAnotherData?.values?.entries
                  ?.filter((entry) => parseFloat(entry.amount) !== 0)
                  ?.map((entry) => ({
                    type: "Payment",
                    account: entry.account,
                    amount: parseFloat(entry.amount),
                    payment_type: selectedProp,
                    rental_adress: rentAddress,
                    rent_cycle: "",
                    month_year:
                      values.date.slice(5, 7) + "-" + values.date.slice(0, 4),
                    date: values.date,
                    memo: values.charges_memo,
                    charges_attachment: generalledgerFormik.values.attachment,
                    tenant_id: tenantid,
                    entryIndex: entryIndex,
                    tenant_firstName: firstName,
                    tenant_lastName: lastName,
                    email_name: mail,
                    customer_vault_id: values.customer_vault_id,
                    billing_id: values.billing_id,
                    surcharge: values.surcharge,
                    total_amount: totalAmount1,
                    // Add NMI response data here
                    response: nmiResponse.response,
                    responsetext: nmiResponse.responsetext,
                    authcode: nmiResponse.authcode,
                    transactionid: nmiResponse.transactionid,
                    avsresponse: nmiResponse.avsresponse,
                    cvvresponse: nmiResponse.cvvresponse,
                    type2: nmiResponse.type,
                    response_code: nmiResponse.response_code,
                    cc_type: nmiResponse.cc_type,
                    cc_exp: nmiResponse.cc_exp,
                    cc_number: nmiResponse.cc_number,
                    status:
                      nmiResponse.response_code == 100 ? "Success" : "Failure",
                  }))
              : []
            : formikForAnotherData?.values?.length !== 0
            ? formikForAnotherData?.values?.entries
                ?.filter((entry) => parseFloat(entry.amount) !== 0)
                ?.map((entry) => ({
                  type: "Payment",
                  account: entry.account,
                  amount: parseFloat(entry.amount),
                  payment_type: selectedProp,
                  rental_adress: rentAddress,
                  rent_cycle: "",
                  month_year:
                    values.date.slice(5, 7) + "-" + values.date.slice(0, 4),
                  date: values.date,
                  memo: values.charges_memo,
                  charges_attachment: generalledgerFormik.values.attachment,
                  tenant_id: tenantid,
                  entryIndex: entryIndex,
                  tenant_firstName: firstName,
                  tenant_lastName: lastName,
                  email_name: mail,
                  status: status,
                  customer_vault_id: values.customer_vault_id,
                  billing_id: values.billing_id,
                  surcharge: values.surcharge,
                  total_amount: totalAmount1,
                }))
            : [];

        const paymentData =
          selectedProp === "Credit Card"
            ? generalledgerFormik?.values?.entries?.map((entry) => ({
                type: "Payment",
                account: entry.account,
                amount: parseFloat(entry.amount),
                rental_adress: rentAddress,
                rent_cycle: "",
                month_year:
                  values.date.slice(5, 7) + "-" + values.date.slice(0, 4),
                date: values.date,
                memo: values.charges_memo,
                payment_type: selectedProp,
                tenant_id: tenantid,
                entryIndex: entryIndex,
                charges_attachment: generalledgerFormik.values.attachment,
                tenant_firstName: firstName,
                tenant_lastName: lastName,
                email_name: mail,
                customer_vault_id: values.customer_vault_id,
                billing_id: values.billing_id,
                surcharge: values.surcharge,
                total_amount: totalAmount1,
                // Add NMI response data here
                response: nmiResponse.response,
                responsetext: nmiResponse.responsetext,
                authcode: nmiResponse.authcode,
                transactionid: nmiResponse.transactionid,
                avsresponse: nmiResponse.avsresponse,
                cvvresponse: nmiResponse.cvvresponse,
                type2: nmiResponse.type,
                response_code: nmiResponse.response_code,
                cc_type: nmiResponse.cc_type,
                cc_exp: nmiResponse.cc_exp,
                cc_number: nmiResponse.cc_number,
                status:
                  nmiResponse.response_code == 100 ? "Success" : "Failure",
              }))
            : generalledgerFormik?.values?.entries?.map((entry) => ({
                type: "Payment",
                account: entry.account,
                amount: parseFloat(entry.amount),
                rental_adress: rentAddress,
                rent_cycle: "",
                month_year:
                  values.date.slice(5, 7) + "-" + values.date.slice(0, 4),
                date: values.date,
                memo: values.charges_memo,
                payment_type: selectedProp,
                tenant_id: tenantid,
                entryIndex: entryIndex,
                charges_attachment: generalledgerFormik.values.attachment,
                tenant_firstName: firstName,
                tenant_lastName: lastName,
                email_name: mail,
                customer_vault_id: values.customer_vault_id,
                billing_id: values.billing_id,
                surcharge: values.surcharge,
                total_amount: totalAmount1,
                status: status,
              }));

        const paymentEntry =
          chargesData1?.length > 0
            ? [...paymentData, ...chargesData1]
            : paymentData;

        // Construct payment charge object
        const paymentObject =
          selectedProp === "Credit Card" &&
          financialDateString <= currentDateString
            ? {
                properties: {
                  rental_adress: rentalAddress,
                  property_id: propertyId,
                },
                unit: [
                  {
                    unit: (state && state.unit_name) || "",
                    unit_id: (state && state.unit_id) || "",
                    paymentAndCharges: paymentEntry,
                  },
                ],
              }
            : {
                properties: {
                  rental_adress: rentalAddress,
                  property_id: propertyId,
                },
                unit: [
                  {
                    unit: (state && state.unit_name) || "",
                    unit_id: (state && state.unit_id) || "",
                    paymentAndCharges: paymentEntry,
                  },
                ],
              };
        console.log("yash payment object", paymentObject);
        // Make API call to save payment charge
        const url = `${baseUrl}/payment_charge/payment_charge`;
        axios
          .post(url, paymentObject)
          .then((response) => {
            // Handle success response
            console.log(response);
            // Show success sweet alert
            swal("Success", "Payment Done successfully!", "success");
            navigate(
              `/admin/rentrolldetail/${tenantId}/${entryIndex}?source=payment`
            );
          })
          .catch((error) => {
            // Handle error response
            console.error("Error occurred:", error);
            // Show error sweet alert
            swal("Error", "Failed to Payment!", "error");
          });
      } catch (error) {
        console.error("Error in payment:", error);
        console.warn("error in payment status:", nmiResponse, error);
        // alert("Payment charge calling error...");
        if (error.response) {
          console.error("Response Data:", error.response.data);
        }
      }
    } catch (error) {
      // alert("error in payment charge");
      //console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
    setLoader(false);
  };

  const fileData = (files) => {
    //setImgLoader(true);
    // console.log(files, "file");
    const filesArray = [...files];

    if (filesArray.length <= 10 && file.length === 0) {
      const finalArray = [];
      // i want to loop and create object
      for (let i = 0; i < filesArray.length; i++) {
        const object = {
          upload_file: filesArray[i],
          upload_date: moment().format("YYYY-MM-DD"),
          upload_time: moment().format("HH:mm:ss"),
          upload_by: localStorage.getItem("user_id"),
          file_name: filesArray[i].name,
        };
        // Do something with the object... push it to final array
        finalArray.push(object);
      }
      setFile([...finalArray]);
      generalledgerFormik.setFieldValue("attachment", [...finalArray]);
    } else if (
      file.length >= 0 &&
      file.length <= 10 &&
      filesArray.length + file.length > 10
    ) {
      setFile([...file]);
      generalledgerFormik.setFieldValue("attachment", [...file]);
    } else {
      const finalArray = [];

      for (let i = 0; i < filesArray.length; i++) {
        const object = {
          upload_file: filesArray[i],
          upload_date: moment().format("YYYY-MM-DD"),
          upload_time: moment().format("HH:mm:ss"),
          upload_by: localStorage.getItem("user_id"),
          file_name: filesArray[i].name,
        };
        // Do something with the object... push it to final array
        finalArray.push(object);
      }
      setFile([...file, ...finalArray]);

      generalledgerFormik.setFieldValue("attachment", [...file, ...finalArray]);
    }
  };

  const deleteFile = (index) => {
    const newFile = [...file];
    newFile.splice(index, 1);
    setFile(newFile);
    generalledgerFormik.setFieldValue("attachment", newFile);
  };

  const handleOpenFile = (item) => {
    if (typeof item !== "string") {
      const url = URL.createObjectURL(item);
      window.open(url, "_blank");
    } else {
      window.open(item, "_blank");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/payment_charge/get_entry/${paymentId}`
        );
        if (response.data.statusCode === 200) {
          setFile(response.data.data.charges_attachment);
          generalledgerFormik.setValues({
            date: response.data.data.date,
            amount: response.data.data.amount,
            payment_type: response.data.data.payment_type,
            customer_vault_id: response.data.data.customer_vault_id,
            billing_id: response.data.data.billing_id,
            charges_attachment: response.data.data.charges_attachment,
            memo: response.data.data.memo,
            tenant_id: response.data.data.tenant_id,
            entryIndex: response.data.data.entryIndex,
            //tenant_firstName: response.data.data.tenant_firstName,
            entries: [
              {
                account: response.data.data.account || "",
                amount: response.data.data.amount || "",
                balance: response.data.data.amount || "",
              },
            ],
          });
          setTenantid(response.data.data.tenant_id);
          setTenantentryindex(response.data.data.entryIndex);
          setSelectedRec(
            `${response.data.data.tenant_firstName}  ${response.data.data.tenant_lastName}`
          );
          setSelectedCreditCard(response.data.data.billing_id);
          setSelectedProp(response.data.data.payment_type);
        } else {
          console.error("Error:", response.data.message);
        }
      } catch (error) {
        console.error("Network error:", error);
      }
    };

    fetchData();
  }, [paymentId]);

  const editpayment = async (id, values) => {
    const arrayOfNames = file.map((item) => item.name);
    const attachmentEntries =
      generalledgerFormik?.values?.attachment?.entries() || [];

    for (const [index, files] of attachmentEntries) {
      if (files.upload_file instanceof File) {
        const imageData = new FormData();
        imageData.append(`files`, files.upload_file);

        const url = `${imageUrl}/images/upload`;

        try {
          const result = await axios.post(url, imageData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
          // Update the original array with the uploaded file URL
          generalledgerFormik.values.attachment[index].upload_file =
            result.data.files[0].url;
        } catch (error) {
          console.error(error);
        }
      } else {
        console.log(files.upload_file, "myfile");
      }
    }
    const rentalAddress = generalledgerFormik.values.rental_adress;
    values["total_amount"] = total_amount;

    try {
      const updatedValues = {
        date: values.date,
        amount: values.amount,
        payment_type: selectedProp,
        //debitcard_number: values.debitcard_number,
        // tenant_firstName: selectedRec,
        // tenant_lastName: selectedRec,
        attachment: generalledgerFormik.values.attachment,
        rental_adress: rentalAddress,
        tenant_id: tenantid,
        entryIndex: tenantentryIndex,
        total_amount: totalAmount1,
        entries: generalledgerFormik.values.entries.map((entry) => ({
          account: entry.account,
          balance: parseFloat(entry.balance),
          amount: parseFloat(entry.amount),
          total_amount: totalAmount1,
          //total_amount: total_amount,
        })),
      };

      const putUrl = `${baseUrl}/payment_charge/edit_entry/${id}`;
      const response = await axios.put(putUrl, updatedValues);

      if (response.data.statusCode === 200) {
        swal("Success", "Payments Update Successfully", "success");
        navigate(
          `/admin/rentrolldetail/${tenantid}/${tenantentryIndex}?source=payment`
        );
      } else {
        swal("Error", response.data.message, "error");
        console.error("Server Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
  };

  const formikForAnotherData = useFormik({
    initialValues: {
      entries: {
        account: "",
        balance: 0,
        amount: 0,
      }, // Assuming entries is the name of your array
    },
  });

  const getAllCharges = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/payment_charge/financial_unit?rental_adress=${state.rental_adress}&property_id=${state.property_id}&unit=${state.unit_name}&tenant_id=${tenantId}`
      );
      if (response.data.statusCode === 200) {
        const allPaymentAndCharges = response.data.data.flatMap((item) =>
          item.unit.map((innerItem) => innerItem.paymentAndCharges)
        );
        const chargeData = allPaymentAndCharges[0].filter(
          (item) => item.type === "Charge"
        );
        const paymentData = allPaymentAndCharges[0].filter(
          (item) => item.type === "Payment"
        );
        const separatedChargeData = {};
        const separatedPaymentData = {};

        // Iterate over the chargeData and organize it based on charge_type
        chargeData.forEach((item) => {
          const { account } = item;
          if (!separatedChargeData[account]) {
            // If the array for charge_type doesn't exist, create it
            separatedChargeData[account] = [item];
          } else {
            // If the array for charge_type already exists, push the item to it
            separatedChargeData[account].push(item);
          }
        });
        paymentData.forEach((item) => {
          const { account } = item;
          if (!separatedPaymentData[account]) {
            // If the array for charge_type doesn't exist, create it
            separatedPaymentData[account] = [item];
          } else {
            // If the array for charge_type already exists, push the item to it
            separatedPaymentData[account].push(item);
          }
        });
        const combinedData = {};
        Object.keys(separatedChargeData).forEach((account) => {
          combinedData[account] = [
            ...(separatedChargeData[account] || []),
            ...(separatedPaymentData[account] || []),
          ];
        });
        const netAmounts = {};
        Object.keys(combinedData).forEach((account) => {
          netAmounts[account] = combinedData[account].reduce((total, entry) => {
            if (entry.type === "Payment") {
              return total + entry.amount;
            } else if (entry.type === "Charge") {
              return total - entry.amount;
            }
            return total;
          }, 0);
        });

        formikForAnotherData.setValues({
          entries: Object.keys(netAmounts)
            .filter((account) => netAmounts[account] < 0) // Filter out negative amounts
            .map((account) => ({
              account,
              balance: netAmounts[account],
              amount: 0,
            })),
        });
      } else {
        console.error("Server Error:", response.data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        console.error("Response Data:", error.response.data);
      }
    }
  };

  useEffect(() => {
    getAllCharges();
  }, []);

  const totalamount = () => {
    let amount = 0; // Initialize amount to 0
    generalledgerFormik.values.entries.forEach((entries) => {
      if (entries.amount) {
        amount += parseFloat(entries.amount);
      }
    });
    if (formikForAnotherData.values.entries.length > 0) {
      formikForAnotherData.values.entries.forEach((entries) => {
        if (entries.amount) {
          amount += parseFloat(entries.amount);
        }
      });
    }
    return amount;
  };

  let total_amount = totalamount();

  const amount = generalledgerFormik?.values?.amount;
  const difference =
    amount !== undefined && total_amount !== undefined
      ? Math.abs(amount - total_amount).toFixed(2)
      : 0;

  const popoverContent = (
    <Popover id="popover-content">
      <Popover.Content>
        The payment's amount must match the total applied to balance. The
        difference is {difference}
      </Popover.Content>
    </Popover>
  );

  const [oneTimeCharges, setOneTimeCharges] = useState([]);
  const [RecAccountNames, setRecAccountNames] = useState([]);

  const fetchingRecAccountNames = async () => {
    fetch(`${baseUrl}/recurringAcc/find_accountname`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setRecAccountNames(data.data);
        } else {
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        console.error("Network error:", error);
      });
  };

  const fetchingOneTimeCharges = async () => {
    fetch(`${baseUrl}/onetimecharge/find_accountname`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          setOneTimeCharges(data.data);
        } else {
          console.error("Error:", data.message);
        }
      });
  };
  const fetchingAccountNames = async () => {

    // console.log("fetching account names");
    fetch(`${baseUrl}/addaccount/find_accountname`)
      .then((response) => response.json())
      .then((data) => {
        if (data.statusCode === 200) {
          // console.log(data.data,'Data from adding the account'); // Add this line to check the data
          setAccountData(data.data);
          
        } else {
          // Handle error
          console.error("Error:", data.message);
        }
      })
      .catch((error) => {
        // Handle network error
        console.error("Network error:", error);
      });
  };

  useEffect(() => {
    fetchingAccountNames();
    fetchingRecAccountNames();
    fetchingOneTimeCharges();
  }, []);

  // const [loader, setLoader] = React.useState(true);
  const [cardLogo, setCardLogo] = useState("");

  const fetchCardLogo = async (cardType) => {
    try {
      if (!cardType) {
        throw new Error("Card type is undefined");
      }

      const response = await axios.get(
        `https://logo.clearbit.com/${cardType.toLowerCase()}.com`
      );
      setCardLogo(response.config.url);
    } catch (error) {
      // Handle error (e.g., card type not found)
      console.error("Error fetching card logo:", error);
      setCardLogo("");
    }
  };

  useEffect(() => {
    fetchCardLogo();
  }, []);

  const [totalAmount1, setTotalAmount1] = useState();
  const [surchargePercentage, setSurchargePercentage] = useState();
  // Calculate total amount after surcharge
  const calculateTotalAmount = () => {
    const amount = parseFloat(generalledgerFormik.values.amount) || 0;
    let totalAmount = amount;

    if (selectedProp === "Credit Card") {
      const surchargeAmount = (amount * surchargePercentage) / 100;
      generalledgerFormik.setFieldValue("surcharge", surchargeAmount);
      totalAmount += surchargeAmount;
    }
    return totalAmount;
  };

  useEffect(() => {
    const totalAmount = calculateTotalAmount();
    setTotalAmount1(totalAmount);
  }, [generalledgerFormik.values.amount, surchargePercentage, selectedProp]);

  const [customervault, setCustomervault] = useState([]);
  const [cardDetalis, setCardDetails] = useState([]);
  const [isBilling, setIsBilling] = useState(false);
  const [vaultId, setVaultId] = useState(false);
  const [paymentLoader, setPaymentLoader] = useState(false);
  const [selectedCreditCard, setSelectedCreditCard] = useState(null);

  const handleCreditCardSelection = (selectedCard) => {
    generalledgerFormik.setValues({
      ...generalledgerFormik.values,
      //customer_vault_id: selectedCard.customer_vault_id,
      billing_id: selectedCard.billing_id,
    });
    setSelectedCreditCard(selectedCard.billing_id);
  };

  const getCreditCard = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/creditcard/getCreditCards/${tenantId}`
      );
      setCustomervault(response.data);
      setVaultId(response.data.customer_vault_id);
      getMultipleCustomerVault(response.data.customer_vault_id);

      const hasCustomerVaultId = response.data.some(
        (card) => card.customer_vault_id
      );

      if (hasCustomerVaultId) {
        setIsBilling(true);
      } else {
        setIsBilling(false);
      }
    } catch (error) {
      console.error("Error fetching credit card details:", error);
      setIsBilling(false);
    }
  };

  const getMultipleCustomerVault = async (customerVaultIds) => {
    try {
      setPaymentLoader(true);
      if (customerVaultIds.length === 0) {
        setCardDetails([]);
        return;
      }

      const response = await axios.post(
        `${baseUrl}/nmipayment/get-billing-customer-vault`,
        {
          customer_vault_id: customerVaultIds,
        }
      );

      // Check if customer.billing is an array
      const billingData = response.data.data.customer.billing;

      if (Array.isArray(billingData)) {
        const extractedData = billingData.map((item) => ({
          billing_id: item["@attributes"].id,
          cc_number: item.cc_number,
          cc_exp: item.cc_exp,
          cc_type: item.cc_type,
          customer_vault_id: item.customer_vault_id,
        }));

        setPaymentLoader(false);
        setCardDetails(extractedData);
      } else if (billingData) {
        // If there's only one record, create an array with a single item
        const extractedData = [
          {
            billing_id: billingData["@attributes"].id,
            cc_number: billingData.cc_number,
            cc_exp: billingData.cc_exp,
            cc_type: billingData.cc_type,
            customer_vault_id: billingData.customer_vault_id,
          },
        ];

        setPaymentLoader(false);
        setCardDetails(extractedData);
        console.log("objectss", extractedData);
      } else {
        console.error(
          "Invalid response structure - customer.billing is not an array"
        );
        setPaymentLoader(false);
        setCardDetails([]);
      }
    } catch (error) {
      console.error("Error fetching multiple customer vault records:", error);
      setPaymentLoader(false);
    }
  };

  useEffect(() => {
    getCreditCard();
  }, [tenantId]);

  useEffect(() => {
    // Extract customer_vault_id values from cardDetails
    const customerVaultIds =
      customervault?.card_detail?.map((card) => card.billing_id) || [];

    if (customerVaultIds.length > 0) {
      // Call the API to get multiple customer vault records
      getMultipleCustomerVault(customerVaultIds);
    }
  }, [customervault]);

  // Fetch data from the API
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${baseUrl}/surcharge/surcharge/65c2286de41c9056bb233a85`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();
      if (data.data) {
        setSurchargePercentage(data.data.surcharge_percent);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

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
            <Card
              className="bg-secondary shadow"
              onSubmit={generalledgerFormik.handleSubmit}
            >
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">
                      {paymentId ? "Edit Payment" : "New Payment"}
                    </h3>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
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
                        {generalledgerFormik.touched.date &&
                        generalledgerFormik.errors.date ? (
                          <div style={{ color: "red" }}>
                            {generalledgerFormik.errors.date}
                          </div>
                        ) : null}
                      </FormGroup>
                    </Col>
                    {/* {console.log(formikForAnotherData.values.entries, "yash")} */}
                  </Row>
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
                          type="text"
                          id="amount"
                          placeholder="Enter amount"
                          name="amount"
                          onBlur={generalledgerFormik.handleBlur}
                          onWheel={(e) => e.preventDefault()}
                          onKeyDown={(event) => {
                            if (!/[0-9]/.test(event.key)) {
                              //event.preventDefault();
                            }
                          }}
                          onChange={(e) => {
                            const inputValue = e.target.value;
                            const numericValue = inputValue.replace(/\D/g, "");
                            generalledgerFormik.values.amount = numericValue;
                            generalledgerFormik.handleChange({
                              target: {
                                name: "amount",
                                value: numericValue,
                              },
                            });
                          }}
                          //-onChange={generalledgerFormik.handleChange}
                          value={generalledgerFormik.values.amount}
                          required
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
                          isOpen={prodropdownOpen}
                          toggle={toggle1}
                          disabled={paymentId}
                        >
                          <DropdownToggle caret style={{ width: "100%" }}>
                            {selectedProp
                              ? selectedProp
                              : "Select Payment Method"}
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
                              onClick={() => handlePropSelection("Credit Card")}
                            >
                              Credit Card
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handlePropSelection("Check")}
                            >
                              Check
                            </DropdownItem>
                            <DropdownItem
                              onClick={() => handlePropSelection("Cash")}
                            >
                              Cash
                            </DropdownItem>
                          </DropdownMenu>
                        </Dropdown>
                      </FormGroup>
                    </Col>
                    {/* <Col sm="12">
                      {selectedProp === "Credit Card" ? (
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
                                  type="text"
                                  id="amount"
                                  placeholder="Enter amount"
                                  name="amount"
                                  onBlur={generalledgerFormik.handleBlur}
                                  onWheel={(e) => e.preventDefault()}
                                  onKeyDown={(event) => {
                                    if (!/[0-9]/.test(event.key)) {
                                      //event.preventDefault();
                                    }
                                  }}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(
                                      /\D/g,
                                      ""
                                    );
                                    generalledgerFormik.values.amount =
                                      numericValue;
                                    generalledgerFormik.handleChange({
                                      target: {
                                        name: "amount",
                                        value: numericValue,
                                      },
                                    });
                                  }}
                                  //-onChange={generalledgerFormik.handleChange}
                                  value={generalledgerFormik.values.amount}
                                  required
                                />
                              </FormGroup>
                            </Col>
                          </Row>
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
                                    value={
                                      generalledgerFormik.values
                                        .creditcard_number
                                    }
                                    onBlur={generalledgerFormik.handleBlur}
                                    onChange={(e) => {
                                      const inputValue = e.target.value;
                                      const numericValue = inputValue.replace(
                                        /\D/g,
                                        ""
                                      ); // Remove non-numeric characters
                                      const limitValue = numericValue.slice(
                                        0,
                                        16
                                      ); // Limit to 12 digits
                                      // setLimitedValue(limitValue);
                                      // const formattedValue = formatCardNumber(limitValue);
                                      // e.target.value = formattedValue;
                                      // generalledgerFormik.handleChange(e);
                                      generalledgerFormik.setFieldValue(
                                        "creditcard_number",
                                        limitValue
                                      );
                                    }}
                                    required
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
                                  onBlur={generalledgerFormik.handleBlur}
                                  onChange={generalledgerFormik.handleChange}
                                  value={
                                    generalledgerFormik.values.expiration_date
                                  }
                                  placeholder="MM/YYYY"
                                  required
                                  onInput={(e) => {
                                    let inputValue = e.target.value;

                                    // Remove non-numeric characters
                                    const numericValue = inputValue.replace(
                                      /\D/g,
                                      ""
                                    );

                                    // Format the date as "MM/YYYY"
                                    if (numericValue.length > 2) {
                                      const month = numericValue.substring(
                                        0,
                                        2
                                      );
                                      const year = numericValue.substring(2, 6);
                                      e.target.value = `${month}/${year}`;
                                    } else {
                                      e.target.value = numericValue;
                                    }

                                    // Update the Formik values as strings
                                    generalledgerFormik.setFieldValue(
                                      "expiration_date",
                                      e.target.value
                                    );
                                  }}

                                  // onInput={(e) => {
                                  //   let inputValue = e.target.value;

                                  //   // Remove non-numeric characters
                                  //   const numericValue = inputValue.replace(
                                  //     /\D/g,
                                  //     ""
                                  //   );

                                  //   // Set the input value to the sanitized value (numeric only)
                                  //   e.target.value = numericValue;

                                  //   // Format the date as "MM/YYYY"
                                  //   if (numericValue.length > 2) {
                                  //     const month = numericValue.substring(
                                  //       0,
                                  //       2
                                  //     );
                                  //     const year = numericValue.substring(2, 6);
                                  //     e.target.value = `${month}/${year}`;
                                  //   }
                                  // }}
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
                                  onBlur={generalledgerFormik.handleBlur}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    if (/^\d{0,3}$/.test(inputValue)) {
                                      // Only allow up to 3 digits
                                      generalledgerFormik.handleChange(e);
                                    }
                                  }}
                                  value={generalledgerFormik.values.cvv}
                                  maxLength={3}
                                  required
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </>
                      ) : (
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
                                  type="text"
                                  id="amount"
                                  placeholder="Enter amount"
                                  name="amount"
                                  onBlur={generalledgerFormik.handleBlur}
                                  onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const numericValue = inputValue.replace(
                                      /\D/g,
                                      ""
                                    );
                                    generalledgerFormik.values.amount =
                                      numericValue;
                                    generalledgerFormik.handleChange({
                                      target: {
                                        name: "amount",
                                        value: numericValue,
                                      },
                                    });
                                  }}
                                  value={generalledgerFormik.values.amount}
                                  onWheel={(e) => e.preventDefault()} // Disable scroll wheel
                                  inputMode="numeric"
                                  required
                                />
                              </FormGroup>
                            </Col>
                          </Row>
                        </>
                      )}
                    </Col> */}
                  </Row>
                  <Row>
                    {selectedProp === "Credit Card" ? (
                      <>
                        {/* {refund === false ? ( */}

                        <Card
                          className="w-100 mt-3"
                          style={{ background: "#F4F6FF" }}
                        >
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                          >
                            Credit card transactions will charge{" "}
                            <strong style={{ color: "blue" }}>
                              {surchargePercentage}%
                            </strong>
                          </label>
                          <CardContent>
                            {/* Card Details */}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                              }}
                            >
                              <Typography
                                sx={{
                                  fontSize: 15,
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
                                    <th>Select</th>
                                    <th>Card Number</th>
                                    <th>Card Type</th>
                                    <th></th>
                                  </tr>
                                  {cardDetalis.map((item, index) => (
                                    <tr
                                      key={index}
                                      style={{ marginBottom: "10px" }}
                                    >
                                      <td>
                                        <input
                                          type="checkbox"
                                          checked={
                                            selectedCreditCard ==
                                            item.billing_id
                                          }
                                          onChange={() =>
                                            handleCreditCardSelection(item)
                                          }
                                        />
                                      </td>
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
                                          {item.cc_number}
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
                                          {item.cc_type}
                                          {item.cc_type && (
                                            <img
                                              src={`https://logo.clearbit.com/${item.cc_type.toLowerCase()}.com`}
                                              alt={`${item.cc_type} Logo`}
                                              style={{
                                                width: "20%",
                                                marginLeft: "10%",
                                              }}
                                            />
                                          )}
                                        </Typography>
                                      </td>
                                      {/* 
                                      {selectedCreditCard ===
                                        item.billing_id && (
                                        <td>
                                          <Row>
                                            <FormGroup>
                                              <label
                                                className="form-control-label"
                                                htmlFor="input-property"
                                              >
                                                CVV *
                                              </label>
                                              <Input
                                                type="number"
                                                id="cvv"
                                                placeholder="123"
                                                name="cvv"
                                                onBlur={
                                                  generalledgerFormik.handleBlur
                                                }
                                                onChange={(e) => {
                                                  const inputValue =
                                                    e.target.value;
                                                  if (
                                                    /^\d{0,3}$/.test(inputValue)
                                                  ) {
                                                    // Only allow up to 3 digits
                                                    generalledgerFormik.handleChange(
                                                      e
                                                    );
                                                  }
                                                }}
                                                value={
                                                  generalledgerFormik.values.cvv
                                                }
                                                required
                                                //disabled={refund === true}
                                              />
                                            </FormGroup>
                                          </Row>
                                        </td>
                                      )} */}
                                    </tr>
                                  ))}
                                </tbody>
                              </Table>
                            )}

                            {/* Add Credit Card Button */}
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                marginTop: "10px",
                              }}
                            >
                              <Button
                                color="primary"
                                onClick={() => {
                                  openCardForm();
                                }}
                                style={{
                                  background: "white",
                                  color: "#3B2F2F",
                                  marginRight: "10px",
                                }}
                              >
                                Add Credit Card
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                        {/* ) : (
                    ""
                  )} */}
                      </>
                    ) : selectedProp === "Check" ? (
                      <>
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-property"
                          >
                            Check Number *
                          </label>
                          <Input
                            type="text"
                            id="check_number"
                            placeholder="Enter check number"
                            name="check_number"
                            onBlur={generalledgerFormik.handleBlur}
                            onChange={generalledgerFormik.handleChange}
                            value={generalledgerFormik.values.check_number}
                            required
                          />
                        </FormGroup>
                      </>
                    ) : null}
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
                          isOpen={recdropdownOpen}
                          toggle={toggle2}
                          disabled={paymentId}
                        >
                          <DropdownToggle caret style={{ width: "100%" }}>
                            {selectedRec ? selectedRec : "Select Resident"}
                          </DropdownToggle>
                          <DropdownMenu
                            style={{
                              width: "100%",
                              maxHeight: "200px",
                              overflowY: "auto",
                              overflowX: "hidden",
                            }}
                          >
                            {propertyData.map((property, index) => (
                              <DropdownItem
                                key={index}
                                onClick={() =>
                                  handleRecieverSelection(property)
                                }
                              >
                                {`${property.tenant_firstName} ${property.tenant_lastName}`}
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
                          onBlur={generalledgerFormik.handleBlur}
                          onChange={generalledgerFormik.handleChange}
                          value={generalledgerFormik.values.memo}
                        />

                        {generalledgerFormik.touched.memo &&
                        generalledgerFormik.errors.memo ? (
                          <div style={{ color: "red" }}>
                            {generalledgerFormik.errors.memo}
                          </div>
                        ) : null}
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
                              {formikForAnotherData.values.entries.length > 0
                                ? formikForAnotherData.values?.entries?.map(
                                    (entries, index) => (
                                      <>
                                        <tr key={index}>
                                          <td>
                                            <Dropdown
                                              isOpen={
                                                entries && entries.dropdownOpen
                                              }
                                              toggle={() =>
                                                toggleDropdownForFormik(index)
                                              }
                                            >
                                              <DropdownToggle caret>
                                                {entries.account
                                                  ? entries.account
                                                  : "Select"}
                                              </DropdownToggle>
                                            </Dropdown>
                                          </td>
                                          <td>
                                            <Input
                                              className="form-control-alternative"
                                              id="input-unitadd"
                                              placeholder="$0.00"
                                              type="text"
                                              name={`entries[${index}].balance`}
                                              value={
                                                Math.abs(entries.balance) -
                                                entries.amount
                                              }
                                              readOnly
                                              onWheel={(e) =>
                                                e.preventDefault()
                                              }
                                              inputMode="numeric"
                                            />
                                          </td>
                                          <td>
                                            <Input
                                              className="form-control-alternative"
                                              id="input-unitadd"
                                              placeholder="$0.00"
                                              type="number"
                                              name={`entries[${index}].amount`}
                                              onBlur={
                                                formikForAnotherData.handleBlur
                                              }
                                              // only input number
                                              // onKeyDown={(event) => {
                                              //   event.preventDefault();
                                              // }}
                                              onChange={
                                                formikForAnotherData.handleChange
                                              }
                                              onInput={(e) => {
                                                const inputValue =
                                                  e.target.value;
                                                const numericValue =
                                                  inputValue.replace(/\D/g, "");
                                                e.target.value = numericValue;
                                              }}
                                              value={entries.amount}
                                            />
                                          </td>
                                          {console.log(
                                            formikForAnotherData.values,
                                            "yash"
                                          )}
                                          <td style={{ border: "none" }}>
                                            <ClearIcon
                                              type="button"
                                              style={{
                                                cursor: "pointer",
                                                padding: 0,
                                              }}
                                              onClick={() =>
                                                handleRemoveRow2(index)
                                              }
                                            >
                                              Remove
                                            </ClearIcon>
                                          </td>
                                        </tr>
                                      </>
                                    )
                                  )
                                : null}
                              <>
                                {generalledgerFormik.values.entries.map(
                                  (entries, index) => (
                                    <tr key={index}>
                                      <td>
                                        <Dropdown
                                          isOpen={entries.dropdownOpen}
                                          toggle={() => toggleDropdown(index)}
                                        >
                                          <DropdownToggle caret>
                                            {entries.account
                                              ? entries.account
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
                                              onClick={() =>
                                                handleAccountSelection(
                                                  "Last Month's Rent",
                                                  index
                                                )
                                              }
                                            >
                                              Last Month's Rent
                                            </DropdownItem>
                                            <DropdownItem
                                              onClick={() =>
                                                handleAccountSelection(
                                                  "Prepayments",
                                                  index
                                                )
                                              }
                                            >
                                              Prepayments
                                            </DropdownItem>
                                            <DropdownItem
                                              onClick={() =>
                                                handleAccountSelection(
                                                  "Security Deposit Liability",
                                                  index
                                                )
                                              }
                                            >
                                              Security Deposit Liability
                                            </DropdownItem>

                                            <DropdownItem
                                              header
                                              style={{ color: "blue" }}
                                            >
                                              Income Account
                                            </DropdownItem>
                                            {accountData?.map((item) => (
                                              <DropdownItem
                                                key={item._id}
                                                onClick={() =>
                                                  handleAccountSelection(
                                                    item.account_name,
                                                    index
                                                  )
                                                }
                                              >
                                                {item.account_name}
                                              </DropdownItem>
                                            ))}
                                            {RecAccountNames ? (
                                              <>
                                                <DropdownItem
                                                  header
                                                  style={{ color: "blue" }}
                                                >
                                                  Reccuring Charges
                                                </DropdownItem>
                                                {RecAccountNames?.map(
                                                  (item) => (
                                                    <DropdownItem
                                                      key={item._id}
                                                      onClick={() =>
                                                        handleAccountSelection(
                                                          item.account_name,
                                                          index
                                                        )
                                                      }
                                                    >
                                                      {item.account_name}
                                                    </DropdownItem>
                                                  )
                                                )}
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                            {oneTimeCharges ? (
                                              <>
                                                <DropdownItem
                                                  header
                                                  style={{ color: "blue" }}
                                                >
                                                  One Time Charges
                                                </DropdownItem>
                                                {oneTimeCharges?.map((item) => (
                                                  <DropdownItem
                                                    key={item._id}
                                                    onClick={() =>
                                                      handleAccountSelection(
                                                        item.account_name,
                                                        index
                                                      )
                                                    }
                                                  >
                                                    {item.account_name}
                                                  </DropdownItem>
                                                ))}
                                              </>
                                            ) : (
                                              <></>
                                            )}
                                            <DropdownItem
                                              onClick={() =>
                                                AddNewAccountName(
                                                  "recAccountName"
                                                )
                                              }
                                            >
                                              Add new account..
                                            </DropdownItem>
                                          </DropdownMenu>
                                        </Dropdown>
                                        {generalledgerFormik.touched.entries &&
                                        generalledgerFormik.touched.entries[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.entries &&
                                        generalledgerFormik.errors.entries[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.entries[
                                          index
                                        ].account ? (
                                          <div style={{ color: "red" }}>
                                            {
                                              generalledgerFormik.errors
                                                .entries[index].account
                                            }
                                          </div>
                                        ) : null}
                                        <AccountDialog
                                          AddBankAccountDialogOpen={
                                            AddBankAccountDialogOpen
                                          }
                                          handleCloseDialog={handleCloseDialog}
                                          selectAccountDropDown={
                                            selectAccountDropDown
                                          }
                                          toggle8={toggle8}
                                          setAddBankAccountDialogOpen={
                                            setAddBankAccountDialogOpen
                                          }
                                          toggle1={toggle1}
                                          selectAccountLevelDropDown={
                                            selectAccountLevelDropDown
                                          }
                                          selectFundTypeDropDown={
                                            selectFundTypeDropDown
                                          }
                                          toggle10={toggle10}
                                          selectedAccount={selectedAccount}
                                          accountTypeName={accountTypeName}
                                          setToggleApiCall={setToggleApiCall}
                                          toggleApiCall={toggleApiCall}
                                          hadleselectedAccount={
                                            hadleselectedAccount
                                          }
                                          // hadleselectedOneTimeAccount={hadleselectedOneTimeAccount}
                                          // hadleselectedRecuringAccount={hadleselectedRecuringAccount}
                                        />
                                      </td>
                                      <td>
                                        <Input
                                          className="form-control-alternative"
                                          id="input-unitadd"
                                          placeholder="$0.00"
                                          type="text"
                                          name={`entries[${index}].balance`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          onChange={
                                            generalledgerFormik.handleChange
                                          }
                                          value={entries.amount}
                                          readOnly
                                        />
                                      </td>
                                      <td>
                                        <Input
                                          className="form-control-alternative"
                                          id="input-unitadd"
                                          placeholder="$0.00"
                                          type="text"
                                          name={`entries[${index}].amount`}
                                          onBlur={
                                            generalledgerFormik.handleBlur
                                          }
                                          // only input number
                                          onChange={
                                            generalledgerFormik.handleChange
                                          }
                                          value={entries.amount}
                                          onInput={(e) => {
                                            const inputValue = e.target.value;
                                            const numericValue =
                                              inputValue.replace(/\D/g, ""); // Remove non-numeric characters
                                            e.target.value = numericValue;
                                          }}
                                        />
                                        {generalledgerFormik.touched.entries &&
                                        generalledgerFormik.touched.entries[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.entries &&
                                        generalledgerFormik.errors.entries[
                                          index
                                        ] &&
                                        generalledgerFormik.errors.entries[
                                          index
                                        ].amount ? (
                                          <div style={{ color: "red" }}>
                                            {
                                              generalledgerFormik.errors
                                                .entries[index].amount
                                            }
                                          </div>
                                        ) : null}
                                      </td>
                                      <td style={{ border: "none" }}>
                                        <ClearIcon
                                          type="button"
                                          style={{
                                            cursor: "pointer",
                                            padding: 0,
                                          }}
                                          onClick={() => handleRemoveRow(index)}
                                        >
                                          Remove
                                        </ClearIcon>
                                      </td>
                                    </tr>
                                  )
                                )}
                                <tr>
                                  <th>Total</th>
                                  {/* <th>{totalDebit.toFixed(2)}</th> */}
                                  <th
                                    style={{
                                      whiteSpace: "normal",
                                      wordWrap: "break-word",
                                    }}
                                  >
                                    {Number(
                                      generalledgerFormik.values.amount
                                    ) !== Number(total_amount) ? (
                                      <OverlayTrigger
                                        trigger="click"
                                        placement="top"
                                        overlay={popoverContent}
                                      >
                                        <span
                                          style={{
                                            cursor: "pointer",
                                            color: "red",
                                          }}
                                        >
                                          The payment's amount must match the
                                          total applied to balance. The
                                          difference is $
                                          {Math.abs(
                                            generalledgerFormik.values.amount -
                                              total_amount
                                          ).toFixed(2)}
                                        </span>
                                      </OverlayTrigger>
                                    ) : null}
                                  </th>
                                  <th>{total_amount.toFixed(2)}</th>
                                </tr>
                              </>
                            </tbody>
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

                            {generalledgerFormik.touched.attachment &&
                            generalledgerFormik.errors.attachment ? (
                              <div style={{ color: "red" }}>
                                {generalledgerFormik.errors.attachment}
                              </div>
                            ) : null}
                          </div>

                          <div className="d-flex ">
                            {file.length > 0 &&
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
                                    {file?.name?.file_name?.substr(0, 5) ||
                                      file?.file_name?.substr(0, 5)}
                                    {file?.name?.file_name?.length > 5
                                      ? "..."
                                      : null || file?.file_name?.length > 5
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
                        <Checkbox
                          name="print_receipt"
                          onChange={(e) => setPrintReceipt(e.target.checked)}
                        />
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
                    <div>
                      Total Amount to be Paid:{" "}
                      <strong style={{ color: "green" }}>
                        ${" "}
                        {totalAmount1 || generalledgerFormik.values.amount || 0}{" "}
                      </strong>
                    </div>
                  </Row>
                  <Row>
                    <Col lg="5">
                      <FormGroup>
                        {/* <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ background: "green", color: "white" }}
                          onClick={(e) => {
                            e.preventDefault();
                            generalledgerFormik.handleSubmit();
                          }}
                        >
                          Save Payment
                        </button> */}
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
                        ) : paymentId ? (
                          <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ background: "green", cursor: "pointer" }}
                            onClick={(e) => {
                              e.preventDefault();
                              editpayment(
                                paymentId,
                                generalledgerFormik.values
                              );
                            }}
                          >
                            Edit Payment
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
                            New Payment
                          </button>
                        )}
                        <Button
                          color="primary"
                          //  href="#rms"
                          className="btn btn-primary"
                          onClick={
                            paymentId
                              ? handleEditCloseButtonClick
                              : handleCloseButtonClick
                          }
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
      </Container>
      <Modal
        isOpen={isModalsOpen}
        toggle={closeModals}
        style={{ maxWidth: "1000px" }}
      >
        <ModalHeader toggle={closeModals} className="bg-secondary text-white">
          <strong style={{ fontSize: 18 }}>Add Credit Card</strong>
        </ModalHeader>
        <ModalBody>
          <CreditCardForm
            tenantId={tenantId}
            closeModal={closeModals}
            //getCreditCard={getCreditCard}
          />
        </ModalBody>
      </Modal>
    </>
  );
};

export default AddPayment;
