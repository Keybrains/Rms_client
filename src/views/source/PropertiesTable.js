import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import swal from "sweetalert";
import { jwtDecode } from "jwt-decode";
import { RotatingLines } from "react-loader-spinner";

import {
  Card,
  CardHeader,
  Table,
  Container,
  FormGroup,
  Row,
  Button,
  Input,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Dropdown,
} from "reactstrap";
import Header from "components/Headers/Header";
import Cookies from "universal-cookie";

const PropertiesTables = () => {
  const navigate = useNavigate();
  const [rentalsData, setRentalsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(6);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);

  const navigateToPropDetails = (rentalId, entryIndex) => {
    const propDetailsURL = `/admin/PropDetails/${rentalId}/${entryIndex}`;
    window.location.href = propDetailsURL;
  };
 let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (cookies.get("token")) {
      const jwt = jwtDecode(cookies.get("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getRentalsData = async () => {
    try {
      const response = await axios.get(
        "https://propertymanager.cloudpress.host/api/rentals/rental"
      );
      console.log(response.data.data);

      setRentalsData(response.data.data);
      setTotalPages(Math.ceil(response.data.data.length / pageItem));
      setLoader(false);
    } catch (error) {
      console.error("Error fetching rental data:", error);
    }
  };

  const deleteRentals = (id, entryIndex) => {
    // Show a confirmation dialog to the user
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this rental property!",
      icon: "warning",
      buttons: ["Cancel", "Delete"],
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        axios
          .delete(
            `https://propertymanager.cloudpress.host/api/rentals/rental/${id}/entry/${entryIndex}`
          )
          .then((response) => {
            if (response.data.statusCode === 200) {
              swal(
                "Success!",
                "Rental property deleted successfully!",
                "success"
              );
              getRentalsData(); // Refresh your rentals data or perform other actions
            } else if (response.data.statusCode === 201) {
              swal(
                "Warning!",
                "Property already assigned to Tenant!",
                "warning"
              );
              getRentalsData();
            } else {
              swal("", response.data.message, "error");
            }
          })
          .catch((error) => {
            console.error("Error deleting rental property:", error);
          });
      } else {
        swal("Cancelled", "Rental property is safe :)", "info");
      }
    });
  };

  useEffect(() => {
    // Fetch initial data
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

  const editProperty = (id, propertyIndex) => {
    navigate(`/admin/rentals/${id}/${propertyIndex}`);
    console.log(id);
  };

  // const filterRentalsBySearch = () => {
  //   if (!searchQuery) {
  //     return rentalsData;
  //   }

  //   return rentalsData.filter((rental) => {
  //     const lowerCaseQuery = searchQuery.toLowerCase();
  //     return (
  //       rental.rental_adress.toLowerCase().includes(lowerCaseQuery) ||
  //       rental.property_type.toLowerCase().includes(lowerCaseQuery) ||
  //       `${rental.rentalOwner_firstName} ${rental.rentalOwner_lastName}`
  //         .toLowerCase()
  //         .includes(lowerCaseQuery) ||
  //       rental.rentalOwner_companyName.toLowerCase().includes(lowerCaseQuery) ||
  //       `${rental.rental_city}, ${rental.rental_country}`
  //         .toLowerCase()
  //         .includes(lowerCaseQuery) ||
  //       rental.rentalOwner_primaryEmail.toLowerCase().includes(lowerCaseQuery)
  //     );
  //   });
  // };

  const filterRentalsBySearch = () => {
    if (!searchQuery) {
      console.log(rentalsData, "rental from table of properties");
      return paginatedData;
    }

    // const lowerCaseQuery = searchQuery.toLowerCase();

    // return paginatedData.filter((rental) => {
    //   const matchesRentalAddress = rental.entries.some(
    //     (entry) =>
    //       entry.rental_adress &&
    //       entry.rental_adress.toLowerCase().includes(lowerCaseQuery)
    //   );

    //   const matchesPropertyType = rental.entries.some(
    //     (entry) =>
    //       entry.property_type &&
    //       entry.property_type.toLowerCase().includes(lowerCaseQuery)
    //   );

    //   const ownerFullName = `${rental.rentalOwner_firstName || ""} ${rental.rentalOwner_lastName || ""
    //     }`.toLowerCase();

    //   const matchesOwnerInfo =
    //     ownerFullName.includes(lowerCaseQuery) ||
    //     (rental.rentalOwner_companyName &&
    //       rental.rentalOwner_companyName
    //         .toLowerCase()
    //         .includes(lowerCaseQuery)) ||
    //     (rental.rentalOwner_primaryEmail &&
    //       rental.rentalOwner_primaryEmail
    //         .toLowerCase()
    //         .includes(lowerCaseQuery));

    //   const matchesCity = rental.entries.some(
    //     (entry) =>
    //       entry.rental_city &&
    //       entry.rental_city.toLowerCase().includes(lowerCaseQuery)
    //   );

    //   const matchesCountry = rental.entries.some(
    //     (entry) =>
    //       entry.rental_country &&
    //       entry.rental_country.toLowerCase().includes(lowerCaseQuery)
    //   );

    //   return (
    //     matchesRentalAddress ||
    //     matchesPropertyType ||
    //     matchesOwnerInfo ||
    //     matchesCity ||
    //     matchesCountry
    //   );
    // });
    return paginatedData.filter((tenant) => {
      const name =
        tenant.rentalOwner_firstName + " " + tenant.rentalOwner_lastName;
      const add =
        tenant.entries.rental_city + " " + tenant.entries.rental_country;
      console.log(tenant);
      return (
        tenant.entries.rental_adress
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tenant.entries.property_type
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tenant.entries.rental_city
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tenant.entries.rental_country
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tenant.rentalOwner_firstName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tenant.rentalOwner_lastName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tenant.rentalOwner_companyName
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        tenant.rentalOwner_primaryEmail
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        add.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  };
  console.log(filterRentalsBySearch(), "filterasdadasdasdasdasda");

  return (
    <>
      <Header />
      <Container className="mt--8" fluid>
        <Row>
          <Col xs="12" sm="6">
            <FormGroup>
              <h1 style={{ color: "white" }}>Properties</h1>
            </FormGroup>
          </Col>
          <Col className="text-right" xs="12" sm="6">
            <Button
              color="primary"
              href="#rms"
              onClick={() => navigate("/admin/rentals")}
              size="sm"
              style={{ background: "white", color: "blue" }}
            >
              Add New Property
            </Button>
          </Col>
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
                <CardHeader className="border-0">
                  <Row>
                    <Col xs="12" sm="6">
                      <FormGroup>
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
                      <th scope="col">Address</th>
                      <th scope="col">Property Type</th>
                      <th scope="col">Rental Owners</th>
                      <th scope="col">Rental Company Name</th>
                      <th scope="col">Locality</th>
                      <th scope="col">Primary Email</th>
                      <th scope="col">Phone Number</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {console.log(filterRentalsBySearch(), "filter")} */}
                    {/* {filterRentalsBySearch().map((rental) =>
                      rental.entries.map((property) => (
                        <tr
                          key={rental._id}
                          onClick={() =>
                            navigateToPropDetails(
                              rental._id,
                              property.entryIndex
                            )
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td>{property.rental_adress}</td>
                          <td>{property.property_type}</td>
                          <td>{`${rental.rentalOwner_firstName} ${rental.rentalOwner_lastName}`}</td>
                          <td>{rental.rentalOwner_companyName}</td>
                          <td>{`${property.rental_city}, ${property.rental_country}`}</td>
                          <td>{rental.rentalOwner_primaryEmail}</td>
                          <td>{rental.rentalOwner_phoneNumber}</td>
                          <td>
                            <div style={{ display: "flex", gap: "5px" }}>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteRentals(
                                    rental._id,
                                    property.entryIndex
                                  );
                                }}
                              >
                                <DeleteIcon />
                              </div>
                              &nbsp; &nbsp; &nbsp;
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editProperty(rental._id, property.entryIndex);
                                }}
                              >
                                <EditIcon />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )} */}
                    {filterRentalsBySearch()?.map((tenant) => (
                      <>
                        <tr
                          key={tenant._id}
                          onClick={() =>
                            navigateToPropDetails(
                              tenant._id,
                              tenant.entries.entry_id
                            )
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td>{tenant.entries.rental_adress}</td>
                          <td>{tenant.entries.property_type}</td>
                          <td>
                            {tenant.rentalOwner_firstName}{" "}
                            {tenant.rentalOwner_lastName}
                          </td>
                          <td>{tenant.rentalOwner_companyName}</td>
                          <td>{`${tenant.entries.rental_city}, ${tenant.entries.rental_country}`}</td>
                          <td>{tenant.rentalOwner_primaryEmail}</td>
                          <td>{tenant.rentalOwner_phoneNumber}</td>
                          {/* <td>{tenant.entries.entryIndex}</td>
                        <td>{tenant.entries.rental_adress}</td> */}
                          <td style={{}}>
                            <div style={{ display: "flex", gap: "5px" }}>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteRentals(
                                    tenant._id,
                                    tenant.entries.entryIndex
                                  );
                                  // console.log(entry.entryIndex,"dsgdg")
                                }}
                              >
                                <DeleteIcon />
                              </div>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editProperty(
                                    tenant._id,
                                    tenant.entries.entryIndex
                                  );
                                }}
                              >
                                <EditIcon />
                              </div>
                            </div>
                          </td>
                        </tr>
                        {/* <tr
                          key={rental._id}
                          onClick={() =>
                            navigateToPropDetails(
                              rental._id,
                              property.entryIndex
                            )
                          }
                          style={{ cursor: "pointer" }}
                        >
                          <td>{property.rental_adress}</td>
                          <td>{property.property_type}</td>
                          <td>{`${rental.rentalOwner_firstName} ${rental.rentalOwner_lastName}`}</td>
                          <td>{rental.rentalOwner_companyName}</td>
                          <td>{`${property.rental_city}, ${property.rental_country}`}</td>
                          <td>{rental.rentalOwner_primaryEmail}</td>
                          <td>{rental.rentalOwner_phoneNumber}</td>
                          <td>
                            <div style={{ display: "flex", gap: "5px" }}>
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteRentals(
                                    rental._id,
                                    property.entryIndex
                                  );
                                }}
                              >
                                <DeleteIcon />
                              </div>
                              &nbsp; &nbsp; &nbsp;
                              <div
                                style={{ cursor: "pointer" }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  editProperty(rental._id, property.entryIndex);
                                }}
                              >
                                <EditIcon />
                              </div>
                            </div>
                          </td>
                        </tr> */}
                      </>
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
                              setPageItem(6);
                              setCurrentPage(1);
                            }}
                          >
                            6
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setPageItem(12);
                              setCurrentPage(1);
                            }}
                          >
                            12
                          </DropdownItem>
                          <DropdownItem
                            onClick={() => {
                              setPageItem(18);
                              setCurrentPage(1);
                            }}
                          >
                            18
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
                          class="bi bi-caret-left"
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
                          class="bi bi-caret-right"
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
      </Container>
    </>
  );
};

export default PropertiesTables;
