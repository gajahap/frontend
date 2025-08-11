import React, { useEffect, useState } from 'react';
import { Container, Card, Form } from 'react-bootstrap';
import axios from '../../../axiosConfig';// ← gunakan config yang sudah dibuat

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

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
      const response = await axios.post('/register', formData);
      setMessage('Register berhasil!');
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
      })

      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

      console.log('Success:', response.data);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data.error || {});
        setMessage(error.response.data.message || 'Terjadi kesalahan.');
      } else {
        setMessage('Tidak dapat menghubungi server.');
      }
    }
  };

  useEffect(() => {
    console.log(errors);
    
  }, [errors]);

  return (
    <Container className='register-container'>
    <Card className="register-form border-primary-custom shadow-sm">
      <h2 className=" fw-bold register-title">Register duls kaka.</h2>
      <p className='text-muted'>Silakan isi form berikut</p>
      {message && <p className={`register-message notification ${success ? 'notification-success' : 'notification-danger'}`}>{message}</p>}
      <Form  onSubmit={handleSubmit}>

        <div className="form-group">
          <label>Nama :</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
            required
          />
        </div>

        <div className="form-group">
          <label>Email :</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email && 'input-error'}
            required
          />
          {errors.email && <p className="error-text text-danger-custom">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Password :</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={errors.password && 'input-error'}
            required
          />
        </div>

        <div className="form-group">
          <label>Confirmed Password :</label>
          <input
            type="password"
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleChange} 
            className={errors.password_confirmation ? 'input-error' : ''}
            required
          />
          {errors.password && <p className="error-text text-danger-custom">{errors.password}</p>}
        </div>

        
        <button type="submit" className="button bg-primary-custom cl-white hv-shadow-primary">Submit</button>
      </Form>
    </Card>
  </Container>
  );
};

export default Register;
