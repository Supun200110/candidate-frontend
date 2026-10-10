import React from 'react';
import { Header } from '../components/Header';
import { RegistrationForm } from '../components/RegistrationForm';
import Login from './login';

export const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <Header />
      <Login />
     
    </div>
  );
};
