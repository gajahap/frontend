import React, { useState, useRef, useEffect, useContext } from "react";
import { Container, Navbar, Nav, Card, Stack } from "react-bootstrap";
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../axiosConfig";
import ConfirmModal from "./ConfirmModal";

const TopNavbar = ({ user }) => {
  const [show, setShow] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { logout } = useContext(UserContext);
  const logoutModalRef = useRef(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        logoutModalRef.current &&
        !logoutModalRef.current.contains(event.target)
      ) {
        handleClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogoutConfirm = (confirmed) => {
    setShowConfirmModal(false);
    if (confirmed) {
      axiosInstance
        .post("auth/logout")
        .then(() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <>
      <div style={{ overflowX: "auto" }}>
        <Navbar
          className="bg-primary-custom text-white shadow"
          expand="lg"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1050,
            minHeight: "60px",
            display: "flex",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Container fluid style={{ minWidth: "100%" }}>
            <Navbar.Brand href="#home" className="text-white">
              Marketing Apps
            </Navbar.Brand>
            <Nav className="ms-auto">
              <Nav.Link
                onClick={show ? handleClose : handleShow}
                className="text-white"
              >
                <Stack direction="horizontal" gap={2}>
                  <CgProfile size={25} />
                  <span>{user?.username}</span>
                </Stack>
              </Nav.Link>
            </Nav>
          </Container>
        </Navbar>
      </div>

      <div style={{ display: show ? "block" : "none" }} ref={logoutModalRef}>
        <Card
          style={{
            width: "18rem",
            position: "absolute",
            right: "10px",
            top: "50px",
            zIndex: "1000",
          }}
        >
          <Card.Body>
            <Card.Title>{user?.username}</Card.Title>
            <Card.Text>{user?.email}</Card.Text>
            <button
              className="bg-danger-custom w-100 text-white"
              onClick={() => setShowConfirmModal(true)}
            >
              <MdLogout /> Logout
            </button>
          </Card.Body>
        </Card>
      </div>

      <ConfirmModal
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari aplikasi Marketing?"
      />
    </>
  );
};

export default TopNavbar;
