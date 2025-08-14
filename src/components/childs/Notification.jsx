import React from "react";
import { Modal } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";

const Notification = ({ show, onHide, message, variant }) => {
  const title = {
    success: "Success",
    warning: "Perhatian !!!",
    danger: "Error",
  };

  return (
    <AnimatePresence>
      {show && (
        <Modal
          show={show}
          onHide={onHide}
          centered
          backdropClassName="backdrop-dark"
          dialogClassName="modern-dialog"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <Modal.Header
              closeButton
              className={`bg-${variant}-custom text-white rounded-top`}
            >
              <Modal.Title>{title[variant]}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">{message}</Modal.Body>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default Notification;
