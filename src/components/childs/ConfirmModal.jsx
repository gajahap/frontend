import React from "react";
import { Modal, Button } from "react-bootstrap";
import { motion, AnimatePresence } from "framer-motion";
import { MdLogout } from "react-icons/md";

const ConfirmModal = ({ show, onHide, onConfirm, title, message }) => {
  return (
    <AnimatePresence>
      {show && (
        <Modal
          show={show}
          onHide={onHide}
          centered
          backdrop="static"
          keyboard={false}
          contentClassName="border-0 rounded-4 shadow-lg"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Modal.Header closeButton className="border-0 pb-0">
              <Modal.Title className="fw-bold text-danger">{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              <MdLogout size={50} className="text-danger mb-3" />
              <p className="fs-5">{message}</p>
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0 justify-content-center">
              <Button
                variant="secondary"
                onClick={onHide}
                className="px-4 rounded-pill"
              >
                Batal
              </Button>
              <Button
                variant="danger"
                onClick={() => onConfirm(true)}
                className="px-4 rounded-pill"
              >
                <MdLogout className="me-2" />
                Logout
              </Button>
            </Modal.Footer>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
