import {
	Card,
	CardHeader,
	Table,
	Container,
	Row,
	Button,
	Col,
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Form,
	FormGroup,
	Label,
	Input,
	InputGroupAddon,
	InputGroup,
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from "reactstrap";
// core components
import * as yup from "yup";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import swal from "sweetalert";
import Checkbox from "@mui/material/Checkbox";
import { RotatingLines } from "react-loader-spinner";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

import Header from "components/Headers/Header";
import * as React from "react";
import axios from "axios";
import { useFormik } from "formik";
import Edit from "@mui/icons-material/Edit";
import { jwtDecode } from "jwt-decode";

const Applicants = () => {
	const { admin } = useParams()
	const baseUrl = process.env.REACT_APP_BASE_URL;
	const [rentalsData, setRentalsData] = useState([]);
	const [loader, setLoader] = useState(true);
	const [btnLoader, setBtnLoader] = useState(false)
	const [searchQuery, setSearchQuery] = useState("");
	const [currentPage, setCurrentPage] = React.useState(1);
	const [totalPages, setTotalPages] = React.useState(1);
	const [pageItem, setPageItem] = React.useState(10);
	const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
	const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);

	// Step 1: Create state to manage modal visibility
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedTenantData, setSelectedTenantData] = useState([]);
	const [selectedTenants, setSelectedTenants] = useState([]);

	const [propertyData, setPropertyData] = useState([]);
	const [unitData, setUnitData] = useState([]);
	const [selectedUnit, setSelectedUnit] = useState("");
	const [userdropdownOpen, setuserDropdownOpen] = React.useState(false);
	const [unitDropdownOpen, setUnitDropdownOpen] = useState(false);
	const [selectedPropertyType, setSelectedPropertyType] = useState("");
	const [selectedPropertyId, setselectedPropertyId] = useState("");
	const [searchQueryy, setSearchQueryy] = useState("");
	const [upArrow, setUpArrow] = useState([]);
	const [sortBy, setSortBy] = useState([]);

	const handleSearch = (e) => {
		setSearchQueryy(e.target.value);
	};
	const toggle9 = () => {
		setuserDropdownOpen((prevState) => !prevState);
	};

	const toggle10 = () => {
		setUnitDropdownOpen((prevState) => !prevState);
	};

	const fetchUnitsByProperty = async (propertyType) => {
		try {
			const response = await fetch(
				`${baseUrl}/propertyunit/rentals_property/${propertyType}`
			);
			const data = await response.json();
			// Ensure that units are extracted correctly and set as an array
			const units = data?.data || [];
			return units;
		} catch (error) {
			console.error("Error fetching units:", error);
			return [];
		}
	};
	const [ownerData, setOwnerData] = useState([]);
	// const [selectedOwner, setSelectedOwner] = useState(null);
	// Function to handle property selection

	const fetchUnitData = async (rental_id) => {
		try {

			const res = await axios.get(`${baseUrl}/unit/rental_unit/${rental_id}`);
			if (res.data.statusCode === 200) {
				const filteredData = res.data.data.filter(
					(item) => item.rental_unit !== ""
				);
				if (filteredData.length === 0) {
					applicantFormik.setFieldValue("unit_id", res.data.data[0].unit_id);
				}
				setUnitData(filteredData);

			} else if (res.data.statusCode === 201) {
				setUnitData([]);
			}
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	const handlePropertyTypeSelect = async (property) => {
		setSelectedPropertyType(property.rental_adress);
		setselectedPropertyId(property.rental_id);
		applicantFormik.setFieldValue("rental_adress", property.rental_adress);
		setSelectedUnit(""); // Reset selected unit when a new property is selected
		try {
			const units = await fetchUnitsByProperty(property.rental_adress);
			setOwnerData(property);
			// console.log(units, "units"); // Check the received units in the console
			setUnitData(units); // Set the received units in the unitData state

			fetchUnitData(property.rental_id)
		} catch (error) {
			console.error("Error handling selected property:", error);
		}
	};
	const [unitId, setUnitId] = useState(null);
	const handleUnitSelect = (selectedUnit) => {
		setSelectedUnit(selectedUnit.rental_unit_adress);
		setUnitId(selectedUnit.unit_id);
		applicantFormik.setFieldValue("rental_units", selectedUnit.rental_unit_adress); // Update the formik state here
	};

	// Step 2: Event handler to open the modal
	const openModal = () => {
		setIsModalOpen(true);
	};

	// Event handler to close the modal
	const closeModal = () => {
		setIsModalOpen(false);
	};

	const getRentalsData = async () => {
		try {
			const response = await axios.get(`${baseUrl}/applicant/applicant`);
			setTotalPages(Math.ceil(response.data.data.length / pageItem));
			setRentalsData(response.data.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	useEffect(() => {
		getRentalsData();
	}, [pageItem]);

	const startIndex = (currentPage - 1) * pageItem;
	const endIndex = currentPage * pageItem;
	var paginatedData;
	if (rentalsData) {
		paginatedData = rentalsData.slice(startIndex, endIndex);
	}
	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const [selectedRentalOwnerData, setSelectedRentalOwnerData] = useState([]);
	//console.log(selectedRentalOwnerData, "selectedRentalOwnerData");
	const [selectedrentalOwners, setSelectedrentalOwners] = useState([]);
	const [showRentalOwnerTable, setshowRentalOwnerTable] = useState(false);
	const [checkedCheckbox, setCheckedCheckbox] = useState();
	const [rentalownerData, setRentalownerData] = useState([]);


	const handleChange = () => {
		setshowRentalOwnerTable(!showRentalOwnerTable);
	};


	const handleCheckboxChange = (event, tenantInfo, mobileNumber) => {

		console.warn(tenantInfo, "tenantInfo")

		if (checkedCheckbox === mobileNumber) {
			// If the checkbox is already checked, uncheck it
			setCheckedCheckbox(null);
		} else {
			// Otherwise, check the checkbox
			setCheckedCheckbox(mobileNumber);
		}

		// Toggle the selected tenants in the state when their checkboxes are clicked
		if (event.target.checked) {
			setSelectedTenants([tenantInfo, ...selectedTenants]);
			applicantFormik.setValues({
				applicant_firstName: tenantInfo.applicant_firstName,
				applicant_lastName: tenantInfo.applicant_lastName || "",
				applicant_email: tenantInfo.applicant_email || "",
				tenant_mobileNumber: tenantInfo.applicant_phoneNumber || "",
				tenant_homeNumber: tenantInfo.applicant_homeNumber || "",
				tenant_workNumber: tenantInfo.applicant_telephoneNumber || "",
				tenant_businessNumber: tenantInfo.applicant_businessNumber || "",
			});
			setshowRentalOwnerTable(false);
			// //console.log(tenantInfo.applicant_firstName);
		} else {
			setSelectedTenants(
				selectedTenants.filter((tenant) => tenant !== tenantInfo)
			);
			applicantFormik.setValues({
				applicant_firstName: "",
				applicant_lastName: "",
				applicant_email: "",
				tenant_mobileNumber: "",
				tenant_homeNumber: "",
				tenant_workNumber: "",
			});
		}
	};

	let navigate = useNavigate();
	const handleCloseButtonClick = () => {
		navigate("../Agent");
	};

	let cookies = new Cookies();
	// Check Authe(token)
	// let chackAuth = async () => {
	// if (localStorage.getItem("token")) {
	// let authConfig = {
	// headers: {
	// Authorization: `Bearer ${localStorage.getItem("token")}`,
	// token: localStorage.getItem("token"),
	// },
	// };
	// // auth post method
	// let res = await axios.post(
	// "https://propertymanager.cloudpress.host/api/register/auth",
	// { purpose: "validate access" },
	// authConfig
	// );
	// if (res.data.statusCode !== 200) {
	// // localStorage.removeItem("token");
	// navigate("/auth/login");
	// }
	// } else {
	// navigate("/auth/login");
	// };
	// }

	// React.useEffect(() => {
	// chackAuth();
	// }, [localStorage.getItem("token")]);

	const [accessType, setAccessType] = useState(null);
	const [manager, setManager] = useState("");
	React.useEffect(() => {
		if (localStorage.getItem("token")) {
			const jwt = jwtDecode(localStorage.getItem("token"));
			setAccessType(jwt);
			setManager(jwt.userName);
		} else {
			navigate("/auth/login");
		}
	}, [navigate]);

	const applicantFormik = useFormik({
		initialValues: {
			applicant_firstName: "",
			applicant_lastName: "",
			applicant_email: "",
			tenant_mobileNumber: "",
			tenant_homeNumber: "",
			tenant_workNumber: "",
			tenant_businessNumber: "",
			tenant_faxPhoneNumber: "",
			rental_adress: "",
			rental_units: "",
			statusUpdatedBy: "",
		},
		validationSchema: yup.object({
			applicant_firstName: yup.string().required("Required"),
			applicant_lastName: yup.string().required("Required"),
			applicant_email: yup.string().required("Required"),
			tenant_mobileNumber: yup.string().required("Required"),
			rental_adress: yup.string().required("Required"),
		}),
		onSubmit: (values, action) => {
			handleFormSubmit(values, action);
			//console.log(values, "values");
		},
	});

	console.warn(applicantFormik.values, "applicantFormik")

	const handleFormSubmit = (values, action) => {
		setBtnLoader(true);
		try {

			const requestBody = {
				"applicant": {
					"applicant_firstName": values.applicant_firstName,
					"applicant_lastName": values.applicant_lastName,
					"applicant_email": values.applicant_email,
					"applicant_phoneNumber": values.tenant_mobileNumber,
					"applicant_homeNumber": values.tenant_homeNumber,
					"applicant_businessNumber": values.tenant_businessNumber,
					"applicant_telephoneNumber": values.tenant_faxPhoneNumber,
					"admin_id": accessType.admin_id
				},
				"lease": {
					"rental_id": selectedPropertyId,
					"unit_id": unitId,
					"admin_id": accessType.admin_id
				}
			}

			axios
				.post(`${baseUrl}/applicant/applicant`, requestBody)
				.then((response) => {
					if (response.status === 200) {
						closeModal();
						action.resetForm();
						swal("Success!", "Applicant Added Successfully", "success");
						navigate(`/${admin}/Applicants/${response.data.data.data.applicant_id}`);
						setSelectedPropertyType("");
						applicantFormik.setFieldValue("rental_adress", "");
					}
					else if (response.status === 201) {
						swal("Failed!", "Applicant number already exist in system", "warning");
					}

				})


				.catch((error) => {
					console.error("Error creating applicant:", error);
				});

			setBtnLoader(false);

		} catch (error) {

			setBtnLoader(false);
			console.error("error in submit applicant", error)
		}
	};


	//get data apis
	const fetchPropertyData = async () => {
		try {
			const res = await axios.get(
				`${baseUrl}/rentals/rentals/${accessType.admin_id}`
			);
			if (res.data.statusCode === 200) {
				setPropertyData(res.data.data);
			} else if (res.data.statusCode === 201) {
				setPropertyData([]);
			}
		} catch (error) {
			console.error("Error:", error.message);
		}
	};

	useEffect(() => {
		fetchPropertyData();
	}, [accessType]);

	// {
	// "_id": "65b8c5cc180af92ddad11619",
	// "applicant_id": "1706608076946",
	// "admin_id": "1705469527218",
	// "applicant_firstName": "John",
	// "applicant_lastName": "Doe",
	// "applicant_email": "john.doe@example.com",
	// "applicant_phoneNumber": 9999999999,
	// "applicant_homeNumber": 9876543210,
	// "applicant_businessNumber": 5678901234,
	// "applicant_telephoneNumber": 4567890123,
	// "createdAt": "2024-01-30 15:17:56",
	// "updatedAt": "2024-01-30 15:17:56",
	// "__v": 0
	// }

	const fetchExistingPropetiesData = async () => {
		// Make an HTTP GET request to your Express API endpoint
		fetch(`${baseUrl}/applicant/applicant/${accessType?.admin_id}`)
			.then((response) => response.json())
			.then((data) => {
				if (data.statusCode === 200) {
					setRentalownerData(data.data);
					// //console.log("here is my data", data.data);
				} else {
					// Handle error
					// console.error("Error:", data.message);
				}
			})
			.catch((error) => {
				// Handle network error
				console.error("Network error:", error);
			});
	};


	useEffect(() => {
		fetchExistingPropetiesData()
	}, [accessType]);

	const getApplicantData = () => {
		axios
			.get(`${baseUrl}/applicant/applicant_lease/${accessType?.admin_id}`)
			.then((response) => {
				console.log(response.data.data, "respones.data");
				setRentalsData(response.data.data);
				setLoader(false);
			})
			.catch((err) => {
				console.log(err);
				// setLoader(false);
			})
	};
	useEffect(() => {
		getApplicantData();
	}, [accessType, isModalOpen]);

	const deleteRentals = (id) => {
		// Show a confirmation dialog to the user
		swal({
			title: "Are you sure?",
			text: "Once deleted, you will not be able to recover this applicants!",
			icon: "warning",
			buttons: ["Cancel", "Delete"],
			dangerMode: true,
		}).then((willDelete) => {
			if (willDelete) {
				axios
					.delete(`${baseUrl}/applicant/applicant`, {
						data: { _id: id },
					})
					.then((response) => {
						if (response.data.statusCode === 200) {
							swal("Success!", "Applicants deleted successfully", "success");
							// getWorkData(); // Refresh your work order data or perform other actions
							// navigate(`admin/Applicants/${id}`);
							getApplicantData();
						} else {
							swal("", response.data.message, "error");
						}
					})
					.catch((error) => {
						console.error("Error deleting work order:", error);
					});
			} else {
				swal("Cancelled", "Applicants is safe :)", "info");
			}
		});
	};
	const filterApplicantsBySearch = () => {
		let filteredData = rentalsData;

		if (searchQuery) {
			filteredData = filteredData.filter((tenant) => {
				const isRentalAddressMatch = tenant.rental_adress
					.toLowerCase()
					.includes(searchQuery.toLowerCase());
				const isFirstNameMatch = (
					tenant.applicant_firstName +
					" " +
					tenant.applicant_lastName
				)
					.toLowerCase()
					.includes(searchQuery.toLowerCase());
				const isEmailMatch = tenant.applicant_email
					.toLowerCase()
					.includes(searchQuery.toLowerCase());
				return isRentalAddressMatch || isFirstNameMatch || isEmailMatch;
			});
		}

		if (upArrow.length > 0) {
			upArrow.forEach((sort) => {
				switch (sort) {
					case "rental_adress":
						filteredData.sort((a, b) =>
							a.rental_adress.localeCompare(b.rental_adress)
						);
						break;
					case "applicant_lastName":
						filteredData.sort((a, b) =>
							a.applicant_lastName.localeCompare(b.applicant_lastName)
						);
						break;
					case "applicant_firstName":
						filteredData.sort((a, b) =>
							a.applicant_firstName.localeCompare(b.applicant_firstName)
						);
						break;
					case "tenant_mobileNumber":
						filteredData.sort(
							(a, b) => a.tenant_mobileNumber - b.tenant_mobileNumber
						);
						break;
					case "applicant_email":
						filteredData.sort((a, b) =>
							a.applicant_email.localeCompare(b.applicant_email)
						);
						break;
					case "start_date":
						filteredData.sort(
							(a, b) => new Date(a.start_date) - new Date(b.start_date)
						);
						break;
					case "createAt":
						filteredData.sort(
							(a, b) => new Date(a.createAt) - new Date(b.createAt)
						);
						break;
					default:
						// If an unknown sort option is provided, do nothing
						break;
				}
			});
		}

		return filteredData;
	};

	const filterTenantsBySearchAndPage = () => {
		const filteredData = filterApplicantsBySearch();
		const paginatedData = filteredData.slice(startIndex, endIndex);
		return paginatedData;
	};
	const sortData = (value) => {
		if (!sortBy.includes(value)) {
			setSortBy([...sortBy, value]);
			setUpArrow([...upArrow, value]);
			filterTenantsBySearchAndPage();
		} else {
			setSortBy(sortBy.filter((sort) => sort !== value));
			setUpArrow(upArrow.filter((sort) => sort !== value));
			filterTenantsBySearchAndPage();
		}
		//console.log(value);
		// setOnClickUpArrow(!onClickUpArrow);
	};

	return (
		<>
			<Header />
			{/* Page content */}
			<Container className="mt--8" fluid>
				<Row>
					<Col xs="12" sm="6">
						<FormGroup>
							<h1 style={{ color: "white" }}>Applicants</h1>
						</FormGroup>
					</Col>
					<Col className="text-right" xs="12" sm="6">
						<Button
							color="primary"
							// href="#rms"
							onClick={openModal}
							size="sm"
							style={{ background: "white", color: "blue" }}
						>
							Add New Applicant
						</Button>
					</Col>
				</Row>
				<br />
				<Row>
					<div className="col">
						{!loader ? (
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
								<CardHeader className="border-0">
									<Row>
										<Col xs="12" sm="6">
											<FormGroup className="">
												<Input
													fullWidth
													type="text"
													placeholder="Search"
													value={searchQuery}
													onChange={(e) => setSearchQuery(e.target.value)}
													style={{
														width: "100%",
														maxWidth: "200px",
														minWidth: "200px",
													}}
												/>
											</FormGroup>
										</Col>
									</Row>
								</CardHeader>
								<Table className="align-items-center table-flush" responsive>
									<thead className="thead-light">
										<tr>
											<th scope="col">
												FirstName
												{sortBy.includes("applicant_firstName") ? (
													upArrow.includes("applicant_firstName") ? (
														<ArrowDownwardIcon
															onClick={() => sortData("applicant_firstName")}
														/>
													) : (
														<ArrowUpwardIcon
															onClick={() => sortData("applicant_firstName")}
														/>
													)
												) : (
													<ArrowUpwardIcon
														onClick={() => sortData("applicant_firstName")}
													/>
												)}
											</th>
											<th scope="col">
												LastName
												{sortBy.includes("applicant_lastName") ? (
													upArrow.includes("applicant_lastName") ? (
														<ArrowDownwardIcon
															onClick={() => sortData("applicant_lastName")}
														/>
													) : (
														<ArrowUpwardIcon
															onClick={() => sortData("applicant_lastName")}
														/>
													)
												) : (
													<ArrowUpwardIcon
														onClick={() => sortData("applicant_lastName")}
													/>
												)}
											</th>

											{/* <th scope="col">Listed</th> */}
											{/* <th scope="col">Unit</th> */}
											{/* <th scope="col">Phone</th> */}
											<th scope="col">
												Email
												{sortBy.includes("applicant_email") ? (
													upArrow.includes("applicant_email") ? (
														<ArrowDownwardIcon
															onClick={() => sortData("applicant_email")}
														/>
													) : (
														<ArrowUpwardIcon
															onClick={() => sortData("applicant_email")}
														/>
													)
												) : (
													<ArrowUpwardIcon
														onClick={() => sortData("applicant_email")}
													/>
												)}
											</th>
											<th scope="col">
												Phone Number
												{sortBy.includes("tenant_mobileNumber") ? (
													upArrow.includes("tenant_mobileNumber") ? (
														<ArrowDownwardIcon
															onClick={() => sortData("tenant_mobileNumber")}
														/>
													) : (
														<ArrowUpwardIcon
															onClick={() => sortData("tenant_mobileNumber")}
														/>
													)
												) : (
													<ArrowUpwardIcon
														onClick={() => sortData("tenant_mobileNumber")}
													/>
												)}
											</th>
											<th scope="col">
												Property
												{sortBy.includes("rental_adress") ? (
													upArrow.includes("rental_adress") ? (
														<ArrowDownwardIcon
															onClick={() => sortData("rental_adress")}
														/>
													) : (
														<ArrowUpwardIcon
															onClick={() => sortData("rental_adress")}
														/>
													)
												) : (
													<ArrowUpwardIcon
														onClick={() => sortData("rental_adress")}
													/>
												)}
											</th>
											<th scope="col">Status</th>
											<th scope="col">
												Created At
												{sortBy.includes("createAt") ? (
													upArrow.includes("createAt") ? (
														<ArrowDownwardIcon
															onClick={() => sortData("createAt")}
														/>
													) : (
														<ArrowUpwardIcon
															onClick={() => sortData("createAt")}
														/>
													)
												) : (
													<ArrowUpwardIcon
														onClick={() => sortData("createAt")}
													/>
												)}
											</th>
											<th scope="col">Updated At</th>
											<th scope="col">Actions</th>

											{/* <th scope="col">Last Updated</th> */}
											{/* <th scope="col">% complete</th> */}
										</tr>
									</thead>
									<tbody>
										{filterTenantsBySearchAndPage().map((applicant, index) => (
											<tr
												key={index}
												onClick={() =>
													navigate(`/${admin}/Applicants/${applicant._id}`)
												}
											>
												{console.log(applicant, "Applicant")}
												<td>{applicant.applicant_firstName}</td>
												<td>{applicant.applicant_lastName}</td>
												<td>{applicant.applicant_email}</td>
												<td>{applicant.applicant_phoneNumber}</td>
												<td>
													{applicant.rental_adress}{" "}
													{applicant.rental_units
														? " - " + applicant.rental_units
														: null}
												</td>

												<td>
													{applicant?.applicant_status[0]?.status ||
														"Undecided"}
												</td>
												<td>{applicant.createAt}</td>
												<td>{applicant.updateAt || " - "}</td>
												<td>
													<DeleteIcon
														onClick={(e) => {
															e.stopPropagation();
															deleteRentals(applicant._id);
														}}
													/>
													{/* <EditIcon
														onClick={() =>
															navigate(`/admin/Applicants/${applicant._id}`)
														}
													/> */}
												</td>
											</tr>
										))}
									</tbody>
								</Table>
								{paginatedData.length > 0 ? (
									<Row>
										<Col className="text-right m-3">
											<Dropdown isOpen={leasedropdownOpen} toggle={toggle2}>
												<DropdownToggle caret>{pageItem}</DropdownToggle>
												<DropdownMenu>
													<DropdownItem
														onClick={() => {
															setPageItem(10);
															setCurrentPage(1);
														}}
													>
														10
													</DropdownItem>
													<DropdownItem
														onClick={() => {
															setPageItem(25);
															setCurrentPage(1);
														}}
													>
														25
													</DropdownItem>
													<DropdownItem
														onClick={() => {
															setPageItem(50);
															setCurrentPage(1);
														}}
													>
														50
													</DropdownItem>
													<DropdownItem
														onClick={() => {
															setPageItem(100);
															setCurrentPage(1);
														}}
													>
														100
													</DropdownItem>
												</DropdownMenu>
											</Dropdown>
											<Button
												className="p-0"
												style={{ backgroundColor: "#d0d0d0" }}
												onClick={() => handlePageChange(currentPage - 1)}
												disabled={currentPage === 1}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													fill="currentColor"
													className="bi bi-caret-left"
													viewBox="0 0 16 16"
												>
													<path d="M10 12.796V3.204L4.519 8 10 12.796zm-.659.753-5.48-4.796a1 1 0 0 1 0-1.506l5.48-4.796A1 1 0 0 1 11 3.204v9.592a1 1 0 0 1-1.659.753z" />
												</svg>
											</Button>
											<span>
												Page {currentPage} of {totalPages}
											</span>{" "}
											<Button
												className="p-0"
												style={{ backgroundColor: "#d0d0d0" }}
												onClick={() => handlePageChange(currentPage + 1)}
												disabled={currentPage === totalPages}
											>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													width="20"
													height="20"
													fill="currentColor"
													className="bi bi-caret-right"
													viewBox="0 0 16 16"
												>
													<path d="M6 12.796V3.204L11.481 8 6 12.796zm.659.753 5.48-4.796a1 1 0 0 0 0-1.506L6.66 2.451C6.011 1.885 5 2.345 5 3.204v9.592a1 1 0 0 0 1.659.753z" />
												</svg>
											</Button>{" "}
										</Col>
									</Row>
								) : (
									<></>
								)}
							</Card>
						)}
					</div>
				</Row>
				<br />
				<br />
				<Modal isOpen={isModalOpen} toggle={closeModal}>
					<Form onSubmit={applicantFormik.handleSubmit}>
						<ModalHeader
							toggle={closeModal}
							className="bg-secondary text-white"
						>
							<strong style={{ fontSize: 18 }}>Add Applicant</strong>
						</ModalHeader>

						<ModalBody>
							<div>
								<div
									style={{
										display: "flex",
										alignItems: "center",
										paddingTop: "25px",
									}}
								>
									<Checkbox
										onChange={handleChange}
										style={{ marginRight: "10px" }}
										checked={showRentalOwnerTable === true}
									/>
									<label className="form-control-label">
										Choose an existing Applicant
									</label>
								</div>
								<br />
							</div>
							{showRentalOwnerTable && (
								<div
									style={{
										maxHeight: "400px",
										overflow: "hidden",
									}}
								>
									<Input
										type="text"
										placeholder="Search by first and last name"
										value={searchQueryy}
										onChange={handleSearch}
										style={{
											marginBottom: "10px",
											width: "100%",
											padding: "8px",
											border: "1px solid #ccc",
											borderRadius: "4px",
										}}
									/>
									<div
										style={{
											maxHeight: "calc(400px - 40px)",
											overflowY: "auto",
											border: "1px solid #ddd",
										}}
									>
										<table
											style={{
												width: "100%",
												borderCollapse: "collapse",
											}}
										>
											<thead>
												<tr>
													<th
														style={{
															padding: "15px",
														}}
													>
														Applicant Name
													</th>
													<th
														style={{
															padding: "15px",
														}}
													>
														Select
													</th>
												</tr>
											</thead>
											<tbody>
												{Array.isArray(rentalownerData) &&
													rentalownerData
														.filter((tenant) => {
															const fullName = `${tenant.applicant_firstName} ${tenant.applicant_lastName}`;
															return fullName
																.toLowerCase()
																.includes(searchQueryy.toLowerCase());
														})
														.map((tenant, index) => (
															<tr
																key={index}
																style={{
																	border: "1px solid #ddd",
																}}
															>
																<td
																	style={{
																		paddingLeft: "15px",
																		paddingTop: "15px",
																	}}
																>
																	<pre>
																		{tenant.applicant_firstName}&nbsp;
																		{tenant.applicant_lastName}
																		{`(${tenant.applicant_phoneNumber})`}
																	</pre>
																</td>
																<td
																	style={{
																		paddingLeft: "15px",
																		paddingTop: "15px",
																	}}
																>
																	{/* <FormControlLabel
																		control={ */}
																	<Checkbox
																		type="checkbox"
																		name="tenant"
																		id={tenant.applicant_phoneNumber}
																		checked={
																			tenant.applicant_phoneNumber ===
																			checkedCheckbox
																		}
																		onChange={(event) => {
																			setCheckedCheckbox(
																				tenant.applicant_phoneNumber
																			);
																			// const tenantInfo = `${tenant.applicant_firstName ||
																			// ""
																			// } ${tenant.applicant_lastName ||
																			// ""
																			// } ${tenant.applicant_phoneNumber ||
																			// ""
																			// } ${tenant.applicant_email ||
																			// ""
																			// }`;
																			const tenantInfo = {
																				applicant_phoneNumber:
																					tenant.applicant_phoneNumber,
																				applicant_firstName:
																					tenant.applicant_firstName,
																				applicant_lastName: tenant.applicant_lastName,
																				applicant_homeNumber:
																					tenant.applicant_homeNumber,
																				applicant_email: tenant.applicant_email,
																				applicant_businessNumber:
																					tenant.applicant_businessNumber,
																				applicant_telephoneNumber:
																					tenant.applicant_telephoneNumber,
																			};
																			handleCheckboxChange(
																				event,
																				tenantInfo,
																				tenant.applicant_phoneNumber
																			);
																		}}
																	/>
																</td>
															</tr>
														))}
											</tbody>
										</table>
									</div>
									<br />
								</div>
							)}
							{!showRentalOwnerTable && (
								<div>
									<Row>
										<Col>
											<FormGroup>
												<label
													className="form-control-label"
													htmlFor="input-property"
												>
													First Name *
												</label>
												<Input
													type="text"
													id="applicant_firstName"
													placeholder="First Name"
													name="applicant_firstName"
													onBlur={applicantFormik.handleBlur}
													onChange={applicantFormik.handleChange}
													value={applicantFormik.values.applicant_firstName}
													required
												/>
											</FormGroup>
										</Col>
										<Col>
											<FormGroup>
												<label
													className="form-control-label"
													htmlFor="input-property"
												>
													Last Name *
												</label>
												<Input
													type="text"
													id="applicant_lastName"
													placeholder="Enter last name"
													name="applicant_lastName"
													onBlur={applicantFormik.handleBlur}
													onChange={applicantFormik.handleChange}
													value={applicantFormik.values.applicant_lastName}
													required
												/>
											</FormGroup>
										</Col>
									</Row>
									<FormGroup>
										<label
											className="form-control-label"
											htmlFor="input-property"
										>
											Email *
										</label>
										<InputGroup>
											<InputGroupAddon addonType="prepend">
												<span className="input-group-text">
													<i className="fas fa-envelope"></i>
												</span>
											</InputGroupAddon>
											<Input
												type="text"
												id="applicant_email"
												placeholder="Enter Email"
												name="applicant_email"
												value={applicantFormik.values.applicant_email}
												onBlur={applicantFormik.handleBlur}
												onChange={applicantFormik.handleChange}
												required
											/>
										</InputGroup>
									</FormGroup>
									<FormGroup>
										<label
											className="form-control-label"
											htmlFor="input-property"
										>
											Mobile Number *
										</label>
										<InputGroup>
											<InputGroupAddon addonType="prepend">
												<span className="input-group-text">
													<i className="fas fa-mobile-alt"></i>
												</span>
											</InputGroupAddon>
											<Input
												type="tel" // Use type "tel" for mobile numbers
												id="tenant_mobileNumber"
												placeholder="Enter Mobile Number"
												name="tenant_mobileNumber"
												onBlur={applicantFormik.handleBlur}
												onChange={applicantFormik.handleChange}
												value={applicantFormik.values.tenant_mobileNumber}
												onInput={(e) => {
													const inputValue = e.target.value;
													const numericValue = inputValue.replace(/\D/g, ""); // Remove non-numeric characters
													e.target.value = numericValue;
												}}
												required
											/>
										</InputGroup>
									</FormGroup>
									<FormGroup>
										<InputGroup>
											<InputGroupAddon addonType="prepend">
												<span className="input-group-text">
													<i className="fas fa-home"></i>
												</span>
											</InputGroupAddon>
											<Input
												type="text"
												id="tenant_homeNumber"
												placeholder="Enter Home Number"
												value={applicantFormik.values.tenant_homeNumber}
												onBlur={applicantFormik.handleBlur}
												onChange={applicantFormik.handleChange}
												onInput={(e) => {
													const inputValue = e.target.value;
													const numericValue = inputValue.replace(/\D/g, ""); // Remove non-numeric characters
													e.target.value = numericValue;
												}}
											/>
										</InputGroup>
									</FormGroup>
									<FormGroup>
										<InputGroup>
											<InputGroupAddon addonType="prepend">
												<span className="input-group-text">
													<i className="fas fa-fax"></i>
												</span>
											</InputGroupAddon>
											<Input
												id="tenant_workNumber"
												type="text"
												placeholder="Enter Business Number"
												value={applicantFormik.values.tenant_businessNumber}
												onBlur={applicantFormik.handleBlur}
												onChange={applicantFormik.handleChange}
												onInput={(e) => {
													const inputValue = e.target.value;
													const numericValue = inputValue.replace(/\D/g, ""); // Remove non-numeric characters
													e.target.value = numericValue;
												}}
											/>
										</InputGroup>
									</FormGroup>
									<FormGroup>
										<InputGroup>
											<InputGroupAddon addonType="prepend">
												<span className="input-group-text">
													<i className="fas fa-fax"></i>
												</span>
											</InputGroupAddon>
											<Input
												type="text"
												id="tenant_workNumber"
												placeholder="Enter Telephone Number"
												value={applicantFormik.values.tenant_workNumber}
												onBlur={applicantFormik.handleBlur}
												onChange={applicantFormik.handleChange}
												onInput={(e) => {
													const inputValue = e.target.value;
													const numericValue = inputValue.replace(/\D/g, ""); // Remove non-numeric characters
													e.target.value = numericValue;
												}}
											/>
										</InputGroup>
									</FormGroup>

									<FormGroup>
										<label
											className="form-control-label"
											htmlFor="input-property"
										>
											Property *
										</label>
										{/* {//console.log(propertyData, "propertyData")} */}
										<FormGroup style={{ marginRight: "15px" }}>
											<Dropdown isOpen={userdropdownOpen} toggle={toggle9}>
												<DropdownToggle
													caret
													style={{ width: "100%", marginRight: "15px" }}
												>
													{selectedPropertyType
														? selectedPropertyType
														: "Select Property"}
												</DropdownToggle>
												<DropdownMenu
													style={{
														width: "100%",
														maxHeight: "200px",
														overflowY: "auto",
													}}
												>
													<DropdownItem disabled value="">Select</DropdownItem>
													{propertyData.map((property, index) => (
														<DropdownItem
															key={index}
															onClick={() => handlePropertyTypeSelect(property)}
														>
															{property.rental_adress}
														</DropdownItem>
													))}
												</DropdownMenu>
												{applicantFormik.errors &&
													applicantFormik.errors?.rental_adress &&
													applicantFormik.touched &&
													applicantFormik.touched?.rental_adress &&
													applicantFormik.values.rental_adress === "" ? (
													<div style={{ color: "red" }}>
														{applicantFormik.errors.rental_adress}
													</div>
												) : null}
											</Dropdown>
										</FormGroup>
									</FormGroup>
									{unitData.length != 0 && (
										<FormGroup>
											<label
												className="form-control-label"
												htmlFor="input-unit"
											>
												Unit *
											</label>
											<FormGroup style={{ marginLeft: "15px" }}>
												<Dropdown isOpen={unitDropdownOpen} toggle={toggle10}>
													<DropdownToggle caret>
														{selectedUnit ? selectedUnit : "Select Unit"}
													</DropdownToggle>
													<DropdownMenu>
														{unitData.length > 0 ? (
															unitData.map((unit, index) => (
																<DropdownItem
																	key={index}
																	onClick={() => handleUnitSelect(unit)}
																>
																	{unit.rental_unit_adress}
																</DropdownItem>
															))
														) : (
															<DropdownItem disabled>
																No units available
															</DropdownItem>
														)}
													</DropdownMenu>
													{applicantFormik.errors &&
														applicantFormik.errors?.rental_units &&
														applicantFormik.touched &&
														applicantFormik.touched?.rental_units &&
														applicantFormik.values.rental_units === "" ? (
														<div style={{ color: "red" }}>
															{applicantFormik.errors.rental_units}
														</div>
													) : null}
												</Dropdown>
											</FormGroup>
										</FormGroup>
									)}
								</div>
							)}
						</ModalBody>
						<ModalFooter>
							{btnLoader ? (
								<button
									type="submit"
									className="btn btn-primary"
									style={{ background: "green", cursor: "not-allowed" }}
									disabled
								>
									Loading...
								</button>
							) : (
								<Button color="success" type="submit">
									Create Applicant
								</Button>
							)}
							<Button onClick={closeModal}>Cancel</Button>
						</ModalFooter>
					</Form>
				</Modal>
			</Container>
		</>
	);
};

export default Applicants;
