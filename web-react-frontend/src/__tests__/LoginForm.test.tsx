import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../components/LoginForm'; 
import { loginUser } from '../services/UserService';
import { useUserContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '../config/constants';

// MOCKS
vi.mock('../services/UserService', () => ({
  loginUser: vi.fn(),
}));

vi.mock('../context/UserContext', () => ({
  useUserContext: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('./ButtonWithText', () => ({
  default: ({ text, type }: any) => (
    <button type={type}>{text}</button>
  ),
}));

// HELPERS
const mockLogin = vi.fn();
const mockNavigate = vi.fn();

const renderComponent = (user: any = null) => {
  (useUserContext as any).mockReturnValue({
    user,
    login: mockLogin,
  });

  (useNavigate as any).mockReturnValue(mockNavigate);

  render(<LoginForm />);
};

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(window, 'alert').mockImplementation(() => {});
});

// TESTS
describe('LoginForm', () => {

  it('renders login form elements', () => {
    renderComponent();
    //const loginTexts = screen.getAllByText(/login/i);
    //expect(loginTexts.length).toBeGreaterThanOrEqual(2); //ako testiram zajedno heading i button
    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/username or email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/register here/i)).toBeInTheDocument();
  });

  it('updates inputs when user types', () => {
    renderComponent();

    const usernameInput = screen.getByLabelText(/username or email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    fireEvent.change(usernameInput, {
      target: { value: 'testuser' },
    });

    fireEvent.change(passwordInput, {
      target: { value: 'password123' },
    });

    expect(usernameInput).toHaveValue('testuser');
    expect(passwordInput).toHaveValue('password123');
  });

  it('shows alert and does not call loginUser if password is too short', async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/username or email/i), {
      target: { value: 'test' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'a'.repeat(MIN_PASSWORD_LENGTH - 1) },
    });

    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    expect(window.alert).toHaveBeenCalled();
    expect(loginUser).not.toHaveBeenCalled();
  });

  it('shows alert and does not call loginUser if password is too long', async () => {
    renderComponent();

    fireEvent.change(screen.getByLabelText(/username or email/i), {
      target: { value: 'test' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'a'.repeat(MAX_PASSWORD_LENGTH + 1) },
    });

    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    expect(window.alert).toHaveBeenCalled();
    expect(loginUser).not.toHaveBeenCalled();
  });

  it('calls loginUser and login() on successful submit', async () => {
    (loginUser as any).mockResolvedValue({
      userData: { username: 'test', isAdmin: false },
      userToken: 'token',
      refreshToken: 'refresh',
    });

    renderComponent();

    fireEvent.change(screen.getByLabelText(/username or email/i), {
      target: { value: 'test' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(loginUser).toHaveBeenCalledWith({
        usernameOrEmail: 'test',
        password: 'password123',
      });

      expect(mockLogin).toHaveBeenCalledWith(
        { username: 'test', isAdmin: false },
        'token',
        'refresh'
      );
    });
  });

  it('shows alert if loginUser throws error', async () => {
    (loginUser as any).mockRejectedValue(new Error('Invalid credentials'));

    renderComponent();

    fireEvent.change(screen.getByLabelText(/username or email/i), {
      target: { value: 'test' },
    });

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        'Error from server: Invalid credentials'
      );
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('navigates to admin page when logged user is admin', async () => {
    renderComponent({ isAdmin: true });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/AdminAllQuizzesPage');
    });
  });

  it('navigates to user page when logged user is not admin', async () => {
    renderComponent({ isAdmin: false });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/UserAllQuizzesPage');
    });
  });
});
