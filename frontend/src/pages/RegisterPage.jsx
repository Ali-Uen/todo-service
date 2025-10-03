// RegisterPage - Registration page container
import React from 'react';
import { RegisterForm } from '../components/RegisterForm.jsx';
import { PublicRoute } from '../components/PublicRoute.jsx';

export function RegisterPage() {
  return (
    <PublicRoute>
      <RegisterForm />
    </PublicRoute>
  );
}