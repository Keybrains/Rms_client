import React, { useState, useEffect } from "react";
import axios from "axios";
import RentalHeader from "components/Headers/PlanHeader";
import { Container, Row, Col, Button } from "reactstrap";

function Plans() {
  const [plans, setPlans] = useState([]);
  const baseUrl = process.env.REACT_APP_BASE_URL;

  useEffect(() => {
    // Fetch plans from the API using Axios
    axios.get(`${baseUrl}/plans/plans`)
      .then((response) => {
        // Reverse the order and set the plans state
        setPlans(response.data.data.reverse());
      })
      .catch((error) => {
        console.error("Error fetching plans:", error);
      });
  }, []);

  const FeaturesList = ({ features }) => {
    const [showAllFeatures, setShowAllFeatures] = useState(false);

    // Display the first four features by default
    const displayFeatures = showAllFeatures ? features : features.slice(0, 4);

    return (
      <>
        <ul>
          {displayFeatures.map((feature, index) => (
            <li key={index}>{feature.features}</li>
          ))}
        </ul>
        {!showAllFeatures && features.length > 4 && (
          <Button
            type="button"
            className="btn btn-link"
            onClick={() => setShowAllFeatures(true)}
          >
            Read More
          </Button>
        )}
      </>
    );
  };

  return (
    <>
      <RentalHeader />
      <Container fluid className="homee-section mt--9" id="home">
        <Row className="justify-content-center">
          {plans.map((plan) => (
            <Col
              key={plan._id}
              xs={12}
              md={4}
              lg={4}
              className="my-5 d-flex flex-column interactive-card"
              style={{ borderTopRightRadius: "30px" }}
            >
              <div
                className="card h-100 premium-cards"
                style={{ boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px" }}
              >
                <div className="card-header">
                  <b style={{ color: "rgb(10, 37, 59)" }}>
                    <i
                      className="fa-solid fa-calendar"
                      style={{ marginRight: "10px", fontSize: "20px" }}
                    ></i>
                    {plan.plan_name}
                  </b>
                </div>
                <div className="card-body">
                  <b className="mb-5" style={{ color: "#11cdef", fontSize:'20px' }}>
                  $ {plan.plan_price}.00
                  <span className="card-title" style={{ color: "#11cdef", fontSize:'13px' }}>
                     /month
                  </span></b>
                  <p className="">{plan.features[0]?.features}</p>
                  <hr />
                  <FeaturesList features={plan.features} />
                  <br />
                </div>
                <div className="text-center" style={{alignItems:'center'}}>
                <Button
                    type="button"
                    className="btn btn-secondary first-button"
                    onClick={("")}
                    style={{ background: "linear-gradient(87deg, #11cdef 0, #1171ef 100%)", color: "white",marginBottom:'10px'}}
                  >
                    Get Started
                  </Button>
                </div>

                <div className="card-footer text-muted text-center">
                  
                  <a href="#" style={{ fontSize: "12px" }}>
                    Terms and Conditions apply.
                  </a>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default Plans;