import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import ButtonWithImage from '../components/ButtonWithImage';

// TESTS
describe('ButtonWithImage', () => {
  const defaultProps = {
    image: '/test-image.png',
    alt: 'test image',
    title: 'Test Button',
    widthImage: '30px',
    heightImage: '30px',
  };

  it('renders button and image', () => {
    render(<ButtonWithImage {...defaultProps} />);

    const button = screen.getByRole('button');
    const image = screen.getByAltText('test image');

    expect(button).toBeInTheDocument();
    expect(image).toBeInTheDocument();
  });

  it('sets image src, alt, title and styles correctly', () => {
    render(<ButtonWithImage {...defaultProps} />);

    const image = screen.getByAltText('test image') as HTMLImageElement;

    expect(image.src).toContain('/test-image.png');
    expect(image).toHaveAttribute('alt', 'test image');
    expect(image).toHaveAttribute('title', 'test image');
    expect(image).toHaveStyle({
      width: '30px',
      height: '30px',
    });
  });

  it('calls onClick when button is clicked', () => {
    const onClickMock = vi.fn();

    render(
      <ButtonWithImage
        {...defaultProps}
        onClick={onClickMock}
      />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('calls onClick1 with event when button is clicked', () => {
    const onClick1Mock = vi.fn();

    render(
      <ButtonWithImage
        {...defaultProps}
        onClick1={onClick1Mock}
      />
    );

    fireEvent.click(screen.getByRole('button'));

    expect(onClick1Mock).toHaveBeenCalledTimes(1);

    const event = onClick1Mock.mock.calls[0][0]; // mock.calls[poziv][argument] - Pozvana si ovog puta, sa ovim argumentima
    expect(event).toBeDefined(); //proverava da je nešto prosleđeno
    expect(event).toHaveProperty('target'); //proverava da event: ima target, što znači da je pravi React event
    expect(event).toHaveProperty('currentTarget'); //dodatna potvrda da je event: kliknut element (button) i React SyntheticEvent
  });

  it('calls both onClick and onClick1 if both are provided', () => {
    const onClickMock = vi.fn();
    const onClick1Mock = vi.fn();

    render(<ButtonWithImage {...defaultProps} onClick={onClickMock} onClick1={onClick1Mock}/>);

    fireEvent.click(screen.getByRole('button'));

    expect(onClickMock).toHaveBeenCalledTimes(1);
    expect(onClick1Mock).toHaveBeenCalledTimes(1);
  });

  it('sets button type correctly', () => {
    render(<ButtonWithImage {...defaultProps} type="submit"/>);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('defaults button type to "button" when not provided', () => {
    render(<ButtonWithImage {...defaultProps} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});
