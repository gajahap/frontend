import React, { useState, useRef, useEffect, useContext } from 'react';
import { Container, Navbar, Nav, Card, Stack } from 'react-bootstrap';
import { CgProfile } from "react-icons/cg";
import { MdLogout } from "react-icons/md";
import { UserContext } from '../../context/UserContext';


const TopNavbar = ({user}) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { logout } = useContext(UserContext);

  const logoutModalRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (logoutModalRef.current && !logoutModalRef.current.contains(event.target)) {
        handleClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [logoutModalRef]);
  
  return (
    <>
        <Navbar className="bg-primary-custom text-white shadow" expand="lg">
            <Container fluid className='px-5'>
                <Navbar.Brand href="#home" className="text-white">
                Marketing  Apps 
                </Navbar.Brand>
                <Nav className='ms-auto'>
                    <Nav.Link onClick={show ? handleClose : handleShow} className="text-white">
                        <Stack direction='horizontal' gap={2}>
                            <CgProfile size={25} />
                            <span>{user?.username}</span>
                        </Stack>
                    </Nav.Link>
                </Nav>
            </Container>
        </Navbar>
        <div style={{ display: show ? "block" : "none" }} ref={logoutModalRef}>
            <Card style={{ width: '18rem', position: 'absolute', right: '10px', top: '50px', zIndex: '1000' }}>
                <Card.Body>
                    <Card.Title>{user?.username}</Card.Title>
                    <Card.Text>
                        {user?.email}
                    </Card.Text>
                    <button className='bg-danger-custom w-100 text-white'onClick={logout}> <MdLogout /> Logout</button>
                </Card.Body>
            </Card>
        </div>
    </>

  );
};

export default TopNavbar;

