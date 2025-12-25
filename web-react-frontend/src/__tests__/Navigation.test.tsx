import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Navigation } from '../components/Navigation';
import { useUserContext } from '../context/UserContext';


// MOCKS
vi.mock('../context/UserContext', () => ({
  useUserContext: vi.fn(),
}));

//Mock framer-motion da bi uklonio animacije
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children }: any) => <div>{children}</div>,
  },
}));

vi.mock('../components/PictureDropDownList', () => ({
  PictureDropDownList: () => <div data-testid="profile-dropdown" />,
}));

vi.mock('../images/logo.png', () => ({ default: 'logo-mock.png', }));

// HELPERS
const renderComponent = (user: any = null) => {
  (useUserContext as any).mockReturnValue({ user });
  render(<Navigation />);
};

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});

// TESTS
describe('Navigation', () => {

  it('renders logo and profile dropdown', () => {
    renderComponent();

    const logo = screen.getByAltText('Logo');
    const dropdown = screen.getByTestId('profile-dropdown');

    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', 'logo-mock.png');
    expect(dropdown).toBeInTheDocument();
  });

  it('renders admin navigation links when user is admin', () => {
    renderComponent({ isAdmin: true });

    expect(screen.getByText('All quizzes')).toBeInTheDocument();
    expect(screen.getByText('Users results')).toBeInTheDocument();
    expect(screen.getByText('Global ranglist')).toBeInTheDocument();
    expect(screen.getByText('Online quiz competition')).toBeInTheDocument();
  });

  it('does not render admin-only link for regular user', () => {
    renderComponent({ isAdmin: false });

    expect(screen.getByText('All quizzes')).toBeInTheDocument();
    expect(screen.getByText('Global ranglist')).toBeInTheDocument();
    expect(screen.getByText('Online quiz competition')).toBeInTheDocument();

    expect(screen.queryByText('Users results')).not.toBeInTheDocument();
  });

  it('renders user links when no user is logged in', () => {
    renderComponent(null);

    expect(screen.getByText('All quizzes')).toBeInTheDocument();
    expect(screen.getByText('Global ranglist')).toBeInTheDocument();
    expect(screen.getByText('Online quiz competition')).toBeInTheDocument();

    expect(screen.queryByText('Users results')).not.toBeInTheDocument();
  });

  it('has correct href attributes for admin links', () => {
    renderComponent({ isAdmin: true });

    expect(screen.getByText('All quizzes')).toHaveAttribute('href','../AdminAllQuizzes');

    expect(screen.getByText('Users results')).toHaveAttribute('href', '../UserQuizResults');
  });

  it('has correct href attributes for user links', () => {
    renderComponent({ isAdmin: false });

    expect(screen.getByText('All quizzes')).toHaveAttribute('href', '../UserAllQuizzes');
  });
});
