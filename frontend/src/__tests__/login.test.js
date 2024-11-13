import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../pages/login/login';
import { BrowserRouter } from 'react-router-dom';

// Mocks
jest.mock('../common/authContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
  }),
}));

describe('Login Component', () => {
  test('renders login form and submits successfully', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Find input fields
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    // Enter valid email and password
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });

    // Mock fetch to simulate API call
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'mockToken', isAdmin: false }),
      })
    );

    // Click on submit
    fireEvent.click(submitButton);

    // Check that login was called and redirection is done
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/login'), expect.any(Object));
    });
  });

  test('shows error message on failed login', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );

    // Find input fields
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    // Enter valid email and password
    fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'WrongPassword' } });

    // Mock fetch to simulate failed API call
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        status: 401,
        json: () => Promise.resolve({ message: 'Incorrect password' }),
      })
    );

    // Click on submit
    fireEvent.click(submitButton);

    // Verify error message is displayed
    await waitFor(() => {
      const errorMessage = screen.getByText(/incorrect password/i);
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
