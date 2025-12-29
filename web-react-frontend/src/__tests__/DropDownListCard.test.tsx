import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DropDownListCard } from '../components/DropDownListCard';
import { useUserContext } from '../context/UserContext';

// MOCKS
const navigateMock = vi.fn();

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigateMock,
}));

vi.mock('../context/UserContext', () => ({
  useUserContext: vi.fn(),
}));

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});

const mockLogout = vi.fn();

// HELPERS
const renderComponent = ({
  user = { isAdmin: false },
}: {
  user?: any;
  loadingQuizzes?: boolean;
} = {}) => {
  (useUserContext as any).mockReturnValue({
    user,
    logout: mockLogout,
  });

  render(<DropDownListCard />);
};

// TESTS
describe('DropDownListCard', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders "Your results" link for non-admin user', () => {
    renderComponent();

    expect(screen.getByText('Your results')).toBeInTheDocument();
  });

  it('does not render "Your results" link for admin user', () => {
    renderComponent({
      user: { isAdmin: true },
    });

    expect(screen.queryByText('Your results')).not.toBeInTheDocument();
  });

  it('calls logout and navigate on Logout click', () => {
    renderComponent();

    const logoutLink = screen.getByText('Logout');
    fireEvent.click(logoutLink);

    expect(mockLogout).toHaveBeenCalledTimes(1);
    expect(navigateMock).toHaveBeenCalledWith('/Login');
  });

});
