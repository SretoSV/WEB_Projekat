import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PictureDropDownList } from '../components/PictureDropDownList';
import { useUserContext } from '../context/UserContext';

// MOCKS
vi.mock('../context/UserContext', () => ({
  useUserContext: vi.fn(),
}));

vi.mock('../components/DropDownListCard', () => ({
  DropDownListCard: () => (
    <div data-testid="dropdown-card">Dropdown content</div>
  ),
}));

vi.mock('../images/placeHolder.png', () => ({ default: 'placeholder-mock.png', }));

// HELPERS
const renderComponent = (user: any = null) => {
  (useUserContext as any).mockReturnValue({ user });
  render(<PictureDropDownList />);
};

// SETUP
beforeEach(() => {
  vi.clearAllMocks();
});

// TESTS
describe('PictureDropDownList', () => {

  it('renders placeholder image when user has no profile image', () => {
    renderComponent({ username: 'TestUser' });

    const image = screen.getByAltText('ProfilePicture');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'placeholder-mock.png');
  });

  it('renders user profile image when profileImage exists', () => {
    renderComponent({
      username: 'TestUser',
      profileImage: 'BASE64IMAGE',
    });

    const image = screen.getByAltText('ProfilePicture');

    expect(image).toHaveAttribute(
      'src',
      'data:image/png;base64,BASE64IMAGE'
    );
  });

  it('renders username', () => {
    renderComponent({ username: 'TestUser' });

    expect(screen.getByText('TestUser')).toBeInTheDocument();
  });

  it('does not render dropdown card initially', () => {
    renderComponent({ username: 'TestUser' });

    expect(
      screen.queryByTestId('dropdown-card')
    ).not.toBeInTheDocument();
  });

  it('toggles dropdown when profile image is clicked', () => {
    renderComponent({ username: 'TestUser' });

    const image = screen.getByAltText('ProfilePicture');

    // Open dropdown
    fireEvent.click(image);
    expect(screen.getByTestId('dropdown-card')).toBeInTheDocument();

    // Close dropdown
    fireEvent.click(image);
    expect(
      screen.queryByTestId('dropdown-card')
    ).not.toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', () => {
    renderComponent({ username: 'TestUser' });

    const image = screen.getByAltText('ProfilePicture');

    // Open dropdown
    fireEvent.click(image);
    expect(screen.getByTestId('dropdown-card')).toBeInTheDocument();

    // Click outside (document)
    fireEvent.click(document);

    expect(
      screen.queryByTestId('dropdown-card')
    ).not.toBeInTheDocument();
  });
});
