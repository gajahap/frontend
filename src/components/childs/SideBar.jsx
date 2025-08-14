import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import Time from "../childs/Time";
import { FaListAlt } from "react-icons/fa";

const SideBar = ({ user }) => {
  const path = window.location.pathname;

  return (
    <div
      style={{
        width: "250px", // Lebar sidebar
        backgroundColor: "#0047ab",
        paddingTop: "60px",
        minHeight: "100vh",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header Sidebar */}
      <div className="bg-primary-gradient-custom shadow p-4 text-white">
        <h1 className="mb-2">
          <Time />
        </h1>
        <p>Selamat datang!, {user?.username}</p>
      </div>

      {/* Menu Items */}
      <div className="p-3 flex-grow-1">
        <Row>
          <Col lg={12} className="mb-3">
            <a
              href="/"
              className={
                path === "/"
                  ? "bg-white text-primary-custom p-3 border-rounded d-flex align-items-center justify-content-center"
                  : "bg-primary-custom border-white border text-white p-3 border-rounded d-flex align-items-center justify-content-center"
              }
              style={{ height: "100%" }}
            >
              <Card.Body className="d-flex flex-column text-center">
                <FaListAlt className="m-auto" size={30} />
                <p className="m-auto font-size-sm">Dashboard</p>
              </Card.Body>
            </a>
          </Col>

          <Col lg={12} className="mb-3">
            <a
              href="/outstanding"
              className={
                path === "/outstanding"
                  ? "bg-white text-primary-custom p-3 border-rounded d-flex align-items-center justify-content-center"
                  : "bg-primary-custom border-white border text-white p-3 border-rounded d-flex align-items-center justify-content-center"
              }
              style={{ height: "100%" }}
            >
              <Card.Body className="d-flex flex-column text-center">
                <FaListAlt className="m-auto" size={30} />
                <p className="m-auto font-size-sm">Outstanding</p>
              </Card.Body>
            </a>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default SideBar;
