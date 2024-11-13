import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Welcome to the Attendance Management System', () => {
  render(<App />);
  const welcomeText = screen.getByText(/Welcome to the Attendance Management System/i);
  expect(welcomeText).toBeInTheDocument();
});