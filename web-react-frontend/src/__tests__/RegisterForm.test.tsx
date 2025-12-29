import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RegisterForm } from '../components/RegisterForm';
import { registerUser, validateAndExtractImageFile } from '../services/UserService';
import { MIN_PASSWORD_LENGTH, MAX_PASSWORD_LENGTH } from '../config/constants';

// MOCKS
vi.mock('../services/UserService', () => ({
  registerUser: vi.fn(),
  validateAndExtractImageFile: vi.fn(),
}));

vi.mock('../components/ButtonWithText', () => ({
  default: ({ text, ...props }: any) => (
    <button {...props}>{text}</button>
  ),
}));

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(window, 'alert').mockImplementation(() => {});
});

// HELPERS
const fillForm = (password: string) => {
  fireEvent.change(screen.getByPlaceholderText('username'), {
    target: { value: 'testuser' },
  });

  fireEvent.change(screen.getByPlaceholderText('name@gmail.com'), {
    target: { value: 'test@gmail.com' },
  });

  fireEvent.change(screen.getByPlaceholderText('password'), {
    target: { value: password },
  });
};

// TESTS
describe('RegisterForm', () => {

  it('renders form fields and button', () => {
    render(<RegisterForm />);

    expect(screen.getByText('Register profile')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('name@gmail.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('password')).toBeInTheDocument();
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('shows alert if submitting without image', async () => {
    render(<RegisterForm />);

    fillForm('password123');

    fireEvent.click(screen.getByText('Register'));

    expect(window.alert).toHaveBeenCalledWith('Profile image is required.');
  });

  it('shows alert if password length is invalid', async () => {
    const file = new File(['img'], 'avatar.png', { type: 'image/png' });

    (validateAndExtractImageFile as any).mockReturnValue({
        valid: true,
        file,
        fileName: 'avatar.png',
    });

    render(<RegisterForm />);

    fillForm('12');

    // image
    fireEvent.change(screen.getByLabelText('Upload Image'), {
        target: {
            files: [file],
        },
    });

    fireEvent.click(screen.getByText('Register'));

    expect(window.alert).toHaveBeenCalledWith(`Password length must be between ${MIN_PASSWORD_LENGTH} and ${MAX_PASSWORD_LENGTH} characters!`);
  });

  it('shows alert if image validation fails', () => {
    (validateAndExtractImageFile as any).mockReturnValue({
      valid: false,
      error: 'Invalid image',
    });

    render(<RegisterForm />);

    const fileInput = screen.getByLabelText('Upload Image');

    fireEvent.change(fileInput, {
      target: {
        files: [new File(['bad'], 'bad.txt', { type: 'text/plain' })],
      },
    });

    expect(window.alert).toHaveBeenCalledWith('Invalid image');
  });

  it('submits form successfully and shows server message', async () => {
    const file = new File(['img'], 'avatar.png', { type: 'image/png' });

    (validateAndExtractImageFile as any).mockReturnValue({
      valid: true,
      file,
      fileName: 'avatar.png',
    });

    (registerUser as any).mockResolvedValue({
      message: 'User registered successfully',
    });

    render(<RegisterForm />);

    fillForm('password123');

    fireEvent.change(screen.getByLabelText('Upload Image'), {
      target: {
        files: [file],
      },
    });

    fireEvent.click(screen.getByText('Register'));

    expect(registerUser).toHaveBeenCalledTimes(1);

    expect(await screen.findByText('User registered successfully')).toBeInTheDocument();
  });

});
