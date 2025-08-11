import React from 'react'
import { Container, Breadcrumb } from 'react-bootstrap'


const Dashboard = ({ user }) => {
  return (
    <>
    <Container fluid className='py-4'>
        <Breadcrumb className='p-2 rounded'>
            <div className="white d-flex align-items-center">
                <Breadcrumb.Item className='text-primary-custom text-muted' href="/">Home</Breadcrumb.Item>
                <Breadcrumb.Item active className='text-primary-custom'>Dashboard</Breadcrumb.Item>
            </div>
        </Breadcrumb>
      <h1 className='text-primary-custom'>Dashboard</h1>
    </Container>
    </>
  )
}

export default Dashboard
