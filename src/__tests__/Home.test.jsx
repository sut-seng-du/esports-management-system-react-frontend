import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../pages/Home';

describe('Home Component', () => {
  const mockSetRoute = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('navigates to announcements when "View Tournaments" is clicked', () => {
    render(<Home setRoute={mockSetRoute} />);
    const viewButton = screen.getByText(/View Tournaments/i);
    fireEvent.click(viewButton);
    expect(mockSetRoute).toHaveBeenCalledWith('announcements');
  });

  test('redirects to login when "Book Your RIG" is clicked and no token exists', () => {
    render(<Home setRoute={mockSetRoute} />);
    const bookButton = screen.getByText(/Book Your RIG/i);
    fireEvent.click(bookButton);
    expect(mockSetRoute).toHaveBeenCalledWith('login');
  });

  test('redirects to bookings when "Book Your RIG" is clicked and token exists', () => {
    localStorage.setItem('token', 'fake-token');
    render(<Home setRoute={mockSetRoute} />);
    const bookButton = screen.getByText(/Book Your RIG/i);
    fireEvent.click(bookButton);
    expect(mockSetRoute).toHaveBeenCalledWith('bookings');
  });
});
