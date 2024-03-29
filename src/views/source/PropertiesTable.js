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
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const PropertiesTables = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const [rentalsData, setRentalsData] = useState([]);
  const [search, setSearch] = React.useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const toggle3 = () => setSearch((prevState) => !prevState);
  const [loader, setLoader] = useState(true);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [pageItem, setPageItem] = React.useState(10);
  const [leasedropdownOpen, setLeaseDropdownOpen] = React.useState(false);
  const toggle2 = () => setLeaseDropdownOpen((prevState) => !prevState);
  // const [onClickUpArrow, setOnClickUpArrow] = useState(false);
  const [upArrow, setUpArrow] = useState([]);
  const [sortBy, setSortBy] = useState([]);
  // const [onClickDownArrow, setOnClickDownArrow] = useState(false);

  const navigateToPropDetails = (rentalId, entryIndex) => {
    const propDetailsURL = `/admin/PropDetails/${rentalId}/${entryIndex}`;

    // window.location.href = propDetailsURL;
    navigate(propDetailsURL);
  };
  let cookies = new Cookies();
  const [accessType, setAccessType] = useState(null);

  React.useEffect(() => {
    if (localStorage.getItem("token")) {
      const jwt = jwtDecode(localStorage.getItem("token"));
      setAccessType(jwt.accessType);
    } else {
      navigate("/auth/login");
    }
  }, [navigate]);

  const getRentalsData = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/rentals/rental`
      );

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
            `${baseUrl}/rentals/rental/${id}/entry/${entryIndex}`
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
    //console.log(propertyIndex, "ropeorjjhbuijo");
    navigate(`/admin/rentals/${id}/${propertyIndex}`);
    //console.log(id);
  };

  // const filterRentalsBySearch = () => {
  //   if (!searchQuery) {
  //     return rentalsData;
  //   }

  //   return rentalsData.filter((rental) => {
  //    
   const lowerCaseQuery = searchQuery.toLowerCase();
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
    let filteredData = rentalsData;
    if (searchQuery) {
      const lowerCaseSearchQuery = searchQuery.toLowerCase();
      filteredData = filteredData.filter((tenant) => {
        const name = `${tenant?.rentalOwner_firstName} ${tenant?.rentalOwner_lastName}`;
        const address = `${tenant?.entries?.rental_adress} ${tenant?.entries?.rental_city} ${tenant?.entries?.rental_country}`;
        return (
          tenant?.entries?.rental_adress?.toLowerCase().includes(lowerCaseSearchQuery) ||
          tenant?.entries?.type?.toLowerCase().includes(lowerCaseSearchQuery) ||
          tenant?.entries?.property_type?.toLowerCase().includes(lowerCaseSearchQuery) ||
          tenant?.entries?.rental_city?.toLowerCase().includes(lowerCaseSearchQuery) ||
          tenant?.entries?.rental_country?.toLowerCase().includes(lowerCaseSearchQuery) ||
          tenant?.rentalOwner_firstName?.toLowerCase().includes(lowerCaseSearchQuery) ||
          tenant?.rentalOwner_lastName?.toLowerCase().includes(lowerCaseSearchQuery) ||
          tenant?.rentalOwner_companyName?.toLowerCase().includes(lowerCaseSearchQuery) ||
          tenant?.rentalOwner_primaryEmail?.toLowerCase().includes(lowerCaseSearchQuery) ||
          name?.toLowerCase().includes(lowerCaseSearchQuery) ||
          address?.toLowerCase().includes(lowerCaseSearchQuery)
        );
      });
    } 
    if (searchQuery2) {
      const lowerCaseSearchQuery = searchQuery2.toLowerCase();
      filteredData = filteredData.filter((property) => {
        const isPropertyTypeMatch = property.entries.type && property.entries.type.toLowerCase().includes(lowerCaseSearchQuery);
        const isPropertySubTypeMatch = property.entries.property_type && property.entries.property_type.toLowerCase().includes(lowerCaseSearchQuery);
        return isPropertyTypeMatch || isPropertySubTypeMatch;
      });
    }
    console.log(filteredData,"vvvv")
    if (upArrow.length > 0) {
      const sortingArrows = upArrow.length > 0 ? upArrow : null;
      sortingArrows.forEach((sort) => {
        switch (sort) {
          case "rental_adress":
            filteredData.sort((a, b) => {
              const comparison = a.entries.rental_adress.localeCompare(b.entries.rental_adress);
              return upArrow.includes("rental_adress") ? comparison : -comparison;
            });
            break;
          case "type":
            filteredData.sort((a, b) => {
              const comparison = a.entries.type.localeCompare(b.entries.type);
              return upArrow.includes("type") ? comparison : -comparison;
            });
            break;
          case "property_type":
            filteredData.sort((a, b) => {
              const comparison = a.entries.property_type.localeCompare(b.entries.property_type);
              return upArrow.includes("property_type") ? comparison : -comparison;
            });
            break;
          case "rental_city":
            filteredData.sort((a, b) => {
              const comparison = a.entries.rental_city.localeCompare(b.entries.rental_city);
              return upArrow.includes("rental_city") ? comparison : -comparison;
            });
            break;
          case "rentalOwner_firstName":
            filteredData.sort((a, b) => {
              const comparison = a.rentalOwner_firstName.localeCompare(b.rentalOwner_firstName);
              return upArrow.includes("rentalOwner_firstName") ? comparison : -comparison;
            });
            break;
          case "rentalOwner_companyName":
            filteredData.sort((a, b) => {
              const comparison = a.rentalOwner_companyName.localeCompare(b.rentalOwner_companyName);
              return upArrow.includes("rentalOwner_companyName") ? comparison : -comparison;
            });
            break;
          case "rentalOwner_primaryEmail":
            filteredData.sort((a, b) => {
              const comparison = a.rentalOwner_primaryEmail.localeCompare(b.rentalOwner_primaryEmail);
              return upArrow.includes("rentalOwner_primaryEmail") ? comparison : -comparison;
            });
            break;
          case "rentalOwner_phoneNumber":
            filteredData.sort((a, b) => {
              const comparison = a.rentalOwner_phoneNumber - b.rentalOwner_phoneNumber;
              return upArrow.includes("rentalOwner_phoneNumber") ? comparison : -comparison;
            });
            break;
          case "createdAt":
            filteredData.sort((a, b) => {
              const dateA = new Date(a.entries.createdAt);
              const dateB = new Date(b.entries.createdAt);
              const comparison = dateA - dateB;
              return upArrow.includes("createdAt") ? comparison : -comparison;
            });

            break;
          case "updatedAt":
            filteredData.sort((a, b) => {
              const comparison = new Date(a.updateAt) - new Date(b.updateAt);
              return upArrow.includes("updatedAt") ? comparison : -comparison;
            });
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
    const filteredData = filterRentalsBySearch();
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
  //console.log(sortBy, "sortBy");

  useEffect(() => {
    // setLoader(false);
    // filterRentalsBySearch(); 
    getRentalsData();
  }, [upArrow, sortBy]);

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
              //  href="#rms"
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
                  <Row className="d-flex">
                    <FormGroup className="mr-sm-2">
                      <Input
                        fullWidth
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setSearchQuery2("") }}
                        style={{
                          width: "100%",
                          maxWidth: "200px",
                          minWidth: "200px",
                          border: "1px solid #ced4da", // Border color similar to the input
                        }}
                      />
                    </FormGroup>
                    <FormGroup className="mr-sm-2">
                      <Dropdown isOpen={search} toggle={toggle3}>
                        <DropdownToggle caret style={{ boxShadow: "none", border: "1px solid #ced4da", maxWidth: "200px", minWidth: "200px" }}>
                          {searchQuery2 ? searchQuery ? "Select Type" : searchQuery2 : "Select Type"}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem onClick={() => { setSearchQuery2("Residential"); setSearchQuery("") }}>Residential</DropdownItem>
                          <DropdownItem onClick={() => { setSearchQuery2("Commercial"); setSearchQuery("") }}>Commercial</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </FormGroup>
                  </Row>
                </CardHeader>
                <Table className="align-items-center table-flush" responsive>
                  <thead className="thead-light">
                    <tr>
                      <th scope="col">
                        Property{" "}
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
                      <th scope="col">
                        Property Type{" "}
                        {sortBy.includes("type") ? (
                          upArrow.includes("type") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("type")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("type")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("type")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        Property Sub Type{" "}
                        {sortBy.includes("property_type") ? (
                          upArrow.includes("property_type") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("property_type")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("property_type")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("property_type")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        Rental Owners Name{" "}
                        {sortBy.includes("rentalOwner_firstName") ? (
                          upArrow.includes("rentalOwner_firstName") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("rentalOwner_firstName")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("rentalOwner_firstName")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("rentalOwner_firstName")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        Rental Company Name{" "}
                        {sortBy.includes("rentalOwner_companyName") ? (
                          upArrow.includes("rentalOwner_companyName") ? (
                            <ArrowDownwardIcon
                              onClick={() =>
                                sortData("rentalOwner_companyName")
                              }
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() =>
                                sortData("rentalOwner_companyName")
                              }
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("rentalOwner_companyName")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        Locality{" "}
                        {sortBy.includes("rental_city") ? (
                          upArrow.includes("rental_city") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("rental_city")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("rental_city")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("rental_city")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        Primary Email{" "}
                        {sortBy.includes("rentalOwner_primaryEmail") ? (
                          upArrow.includes("rentalOwner_primaryEmail") ? (
                            <ArrowDownwardIcon
                              onClick={() =>
                                sortData("rentalOwner_primaryEmail")
                              }
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() =>
                                sortData("rentalOwner_primaryEmail")
                              }
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("rentalOwner_primaryEmail")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        Phone Number
                        {sortBy.includes("rentalOwner_phoneNumber") ? (
                          upArrow.includes("rentalOwner_phoneNumber") ? (
                            <ArrowDownwardIcon
                              onClick={() =>
                                sortData("rentalOwner_phoneNumber")
                              }
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() =>
                                sortData("rentalOwner_phoneNumber")
                              }
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("rentalOwner_phoneNumber")}
                          />
                        )}
                      </th>
                      <th scope="col">
                        Created At{" "}
                        {sortBy.includes("createdAt") ? (
                          upArrow.includes("createdAt") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("createdAt")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("createdAt")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("createdAt")} />
                        )}
                      </th>
                      <th>
                        Last Updated At{" "}
                        {sortBy.includes("updatedAt") ? (
                          upArrow.includes("updatedAt") ? (
                            <ArrowDownwardIcon
                              onClick={() => sortData("updatedAt")}
                            />
                          ) : (
                            <ArrowUpwardIcon
                              onClick={() => sortData("updatedAt")}
                            />
                          )
                        ) : (
                          <ArrowUpwardIcon
                            onClick={() => sortData("updatedAt")}
                          />
                        )}
                      </th>

                      {/* <th scope="col">Created On</th> */}
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {//console.log(filterRentalsBySearch(), "filter")} */}
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
                    {filterTenantsBySearchAndPage()?.map((tenant) => (
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
                          <td>{tenant.entries.type}</td>
                          <td>{tenant.entries.property_type}</td>
                          <td>
                            {tenant.rentalOwner_firstName}{" "}
                            {tenant.rentalOwner_lastName}
                          </td>
                          <td>{tenant.rentalOwner_companyName}</td>
                          <td>{`${tenant.entries.rental_city}, ${tenant.entries.rental_country}`}</td>
                          <td>{tenant.rentalOwner_primaryEmail}</td>
                          <td>{tenant.rentalOwner_phoneNumber}</td>
                          <td>{tenant.entries.createdAt}</td>
                          <td>{tenant.entries.updateAt ? tenant.entries.updateAt : "-"}</td>
                          {/* <td>{tenant.entries.createdAt}</td> */}
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
                                  // //console.log(entry.entryIndex,"dsgdg")
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
      </Container>
    </>
  );
};

export default PropertiesTables;
