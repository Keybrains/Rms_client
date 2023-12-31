// import React, { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import axios from "axios";
// import Cookies from "universal-cookie";
// import StaffHeader from "components/Headers/StaffHeader";
// import {
//   Button,
//   Card,
//   CardHeader,
//   Table,
//   Container,
//   Row,
//   Col,
// } from "reactstrap"; // Import other necessary components from 'reactstrap'
// import AgentHeader from "components/Headers/AgentHeader";
// import { jwtDecode } from "jwt-decode";


// const AgentProfile = () => {
    // const baseUrl = process.env.REACT_APP_BASE_URL;
//   const { id } = useParams();
//   //console.log(id);
//   const [agentDetails, setagentDetails] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();
  
//   let cookies = new Cookies();
//   const [accessType, setAccessType] = useState(null);

//   React.useEffect(() => {
//     if (localStorage.getItem("token")) {
//       const jwt = jwtDecode(localStorage.getItem("token"));
//       setAccessType(jwt.accessType);
//     } else {
//       navigate("/auth/login");
//     }
//   }, [navigate]);

//   useEffect(() => {
//     const getAgentData = async () => {
//       try {
//         if (!cookie_id) {
//           throw new Error("Agent     ID not found in cookies");
//         }

//         const response = await axios.get(
//           `${baseUrl}/addagent/agent_summary/${cookie_id}`
//         );
//         //console.log(response.data.data);
//         setagentDetails(response.data.data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching agent details:", error.message);
//         setError(error);
//         setLoading(false);
//       }
//     };

//     getAgentData();
//   }, [cookie_id, id]);

//   return (
//     <>
//       <AgentHeader />
//       {/* Page content */}
//       <Container className="mt--7" fluid>
//         <Row>
//           <Col>
//             <Card className="shadow" style={{ backgroundColor: "#FFFEFA" }}>
//               <CardHeader className="border-0">
//                 {/* <h3 className="mb-0">Summary </h3> */}
//               </CardHeader>
//               <div className="table-responsive">
//                 <Table
//                   className="align-items-center table-flush"
//                   responsive
//                   style={{ width: "100%" }}
//                 >
//                   <tbody>
//                     {loading ? (
//                       <tr>
//                         <td>Loading agent details...</td>
//                       </tr>
//                     ) : error ? (
//                       <tr>
//                         <td>Error: {error.message}</td>
//                       </tr>
//                     ) : agentDetails._id ? (
//                       <>
//                         <tr>
//                           <th
//                             colSpan="2"
//                             className="text-lg"
//                             style={{ color: "#3B2F2F" }}
//                           >
//                             Personal Details
//                           </th>
//                         </tr>
//                         <tr>
//                           <td className="font-weight-bold text-md">
//                             First Name:
//                           </td>
//                           <td>{agentDetails.agent_name}</td>
//                         </tr>
//                         <tr>
//                           <td className="font-weight-bold text-md">Phone:</td>
//                           <td>{agentDetails.agent_phoneNumber}</td>
//                         </tr>
//                         <tr>
//                           <td className="font-weight-bold text-md">Email:</td>
//                           <td>{agentDetails.agent_email}</td>
//                         </tr>
//                       </>
//                     ) : (
//                       <tr>
//                         <td>No agent details found.</td>
//                       </tr>
//                     )}
//                   </tbody>
//                 </Table>
//               </div>
//             </Card>
//           </Col>
//         </Row>
//       </Container>
//     </>
//   );
// };

// export default AgentProfile;
