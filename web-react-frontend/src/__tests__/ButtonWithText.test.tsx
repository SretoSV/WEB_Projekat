import { render, screen, fireEvent } from '@testing-library/react';
import ButtonWithText from '../components/ButtonWithText';
import { vi } from 'vitest';

// TESTS
describe('ButtonWithText', () => {
  it('renders button with provided text', () => {
    render(<ButtonWithText text="Click me" />);

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    const onClickMock = vi.fn();

    render(<ButtonWithText text="Click me" onClick={onClickMock} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onClickMock).toHaveBeenCalledTimes(1);
  });

  it('calls onClick1 when onClick is not provided', () => {
    const onClick1Mock = vi.fn();

    render(<ButtonWithText text="Click me" onClick1={onClick1Mock} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick1Mock).toHaveBeenCalledTimes(1);
  });

  it('prioritizes onClick over onClick1 if both are provided', () => {
    const onClickMock = vi.fn();
    const onClick1Mock = vi.fn();

    render(<ButtonWithText text="Click me" onClick={onClickMock} onClick1={onClick1Mock}/>);

    fireEvent.click(screen.getByRole('button'));

    expect(onClickMock).toHaveBeenCalledTimes(1);
    expect(onClick1Mock).not.toHaveBeenCalled();
  });

  it('sets button type correctly', () => {
    render(<ButtonWithText text="Submit" type="submit" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('defaults type to "button" when not provided', () => {
    render(<ButtonWithText text="Default" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });
});
