import React from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import Time from '../childs/Time'
import { FaListAlt, FaTags, FaTrademark, FaCog } from 'react-icons/fa';
import Loading from '../childs/Loading';


const SideBar = ({ user }) => {

  const path = window.location.pathname;
  
  return (
    <>
    <Container fluid className='p-0 vh-100 bg-primary-custom'>
        <Container fluid className='bg-primary-gradient-custom shadow'>
            <Row>
            <Col className='p-5 text-white text-left' lg={12} md={12} sm={12}>
                <h1 className='text-white'><Time /></h1>
                <p className='text-white'>Selamat datang!, {user?.username}</p>
            </Col>
            </Row>
        </Container>
        <Container className='p-4 bg'>
            <Row> 
            <Col lg={12} md={4} sm={4} xs={4} className='mb-3'>
                <a href='/' className={path === '/' ? 'bg-white text-primary-custom p-3 border-rounded d-flex align-items-center justify-content-center' : 'bg-primary-custom border-white border text-white p-3 border-rounded d-flex align-items-center justify-content-center'} style={{height: '100%'}}>
                    <Card.Body className='d-flex flex-column text-center'>
                    <FaListAlt className='m-auto' size={30}/>
                    <p className='m-auto font-size-sm'>Dashboard</p>
                    </Card.Body>
                </a>
            </Col>
            <Col lg={12} md={4} sm={4} xs={4} className='mb-3'>
                <a href='/outstanding' className={path === '/outstanding' ? 'bg-white text-primary-custom p-3 border-rounded d-flex align-items-center justify-content-center' : 'bg-primary-custom border-white border text-white p-3 border-rounded d-flex align-items-center justify-content-center'} style={{height: '100%'}}>
                    <Card.Body className='d-flex flex-column text-center'>
                    <FaListAlt className='m-auto' size={30}/>
                    <p className='m-auto font-size-sm'>Outstanding</p>
                    </Card.Body>
                </a>
            </Col>
            </Row>
        </Container>
    </Container>
      
    </>
  )
}

export default SideBar;
