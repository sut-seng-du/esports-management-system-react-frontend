import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Nav from '../components/Nav';

describe('Nav Component', () => {
  const mockSetRoute = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  test('renders basic menu items', () => {
    render(<Nav route="home" setRoute={mockSetRoute} />);
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Pricing/i)).toBeInTheDocument();
    expect(screen.getByText(/Online PCs/i)).toBeInTheDocument();
  });

  test('shows Login when not authenticated', () => {
    render(<Nav route="home" setRoute={mockSetRoute} />);
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
  });

  test('shows Bookings and Logout when authenticated', () => {
    localStorage.setItem('token', 'fake-token');
    render(<Nav route="home" setRoute={mockSetRoute} />);
    expect(screen.getByText(/Bookings/i)).toBeInTheDocument();
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();
  });

  test('navigates when a menu item is clicked', () => {
    render(<Nav route="home" setRoute={mockSetRoute} />);
    const pricingButton = screen.getByText(/Pricing/i);
    fireEvent.click(pricingButton);
    expect(mockSetRoute).toHaveBeenCalledWith('pricing');
  });
});
