import React from 'react';
import { Modal } from 'react-bootstrap';

const Notification = ({ show, onHide, message, variant }) => {
    const title = {
        success: 'Success',
        warning: 'Warning',
        danger: 'Error'
    }
    return (
        <Modal show={show} onHide={onHide} centered className='border-none'>
        <Modal.Header closeButton className={`bg-${variant}-custom text-white`}>
            <Modal.Title>{title[variant]}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {message}
        </Modal.Body>
        </Modal>
    );
};

export default Notification;
