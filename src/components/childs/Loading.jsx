import React from 'react';
import { Container, Spinner, Stack } from 'react-bootstrap';

const Loading = () => {
  return (
    <Container fluid className="d-flex justify-content-center align-items-center vh-100 bg-white">
        <Stack gap={2} direction='horizontal'>
            <Spinner animation="border" className='text-primary-custom' />
            <span className="text-primary-custom" style={{ fontSize: '1.5rem' }}>
                We are getting ready
                <span className="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                </span>
            </span>
        </Stack>
        <style>{`
  .loading-dots {
      margin-left: 5px;
  }
  .loading-dots span {
    opacity: 0;
    animation: blink 1.4s infinite both;
  }
  .loading-dots span:nth-child(1) {
    animation-delay: 0s;
  }
  .loading-dots span:nth-child(2) {
    animation-delay: 0.2s;
  }
  .loading-dots span:nth-child(3) {
    animation-delay: 0.4s;
  }
  @keyframes blink {
    0%, 20%, 100% {
      opacity: 0;
    }
    20%, 40% {
      opacity: 1;
    }
  }
`}</style>

    </Container>
  );
};

export default Loading;

