// LoginPage - Login page container
import React from 'react';
import { LoginForm } from '../components/LoginForm.jsx';
import { PublicRoute } from '../components/PublicRoute.jsx';

export function LoginPage() {
  return (
    <PublicRoute>
      <LoginForm />
    </PublicRoute>
  );
}