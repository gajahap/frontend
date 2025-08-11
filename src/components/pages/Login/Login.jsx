import React, { useState, useContext } from 'react';
import { Container, Card, Form, Spinner } from 'react-bootstrap';
import { UserContext } from '../../../context/UserContext';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    force_login: true
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const [isLoading,setIsLoading] = useState(false);

  const { login } = useContext(UserContext);


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrors({});
    
    try {
      setIsLoading(true);
      await login(formData); // langsung pakai login dari context
      setMessage('Login berhasil!');
      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/'; // atau gunakan navigate() dari react-router
      }, 1000);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.errors || {});
        setMessage(error.response.data.message || 'Terjadi kesalahan.');
      } else {
        setMessage('Tidak dapat menghubungi server.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Container className='login-container'>
        <Card className="login-form border-primary-custom shadow-sm">
          <h2 className=" fw-bold login-title">Login duls ygy.</h2>
          <p className='text-muted'>Silakan masukan email dan password</p>
          {message && <p className={`login-message notification ${success ? 'notification-success' : 'notification-danger'}`}>{message}</p>}
          <Form  onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email :</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={errors.username ? 'input-error' : ''}
                required
              />
              {errors.username && <p className="error-text">{errors.username[0]}</p>}
            </div>

            <div className="form-group">
              <label>Password :</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? 'input-error' : ''}
                autoComplete="off"
                required
              />
              {errors.password && <p className="error-text">{errors.password[0]}</p>}
            </div>
            <button type="submit" className="button bg-primary-custom cl-white hv-shadow-primary">{isLoading ? <Spinner size="sm"/> : 'Login'}</button>
          </Form>
        </Card>
      </Container>
    </>


  );
};

export default Login;
