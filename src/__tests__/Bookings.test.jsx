import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Bookings from '../pages/Bookings';
// Mock api
jest.mock('../api', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  },
  API_BASE: '',
}));

import api from '../api';

describe('Bookings Component', () => {
  const mockBookings = [
    {
      id: 1,
      date: '2026-03-20',
      start_time: '12:00:00',
      end_time: '15:00:00',
      seats: ['PC-01'],
      confirmed: true
    }
  ];

  const mockSeats = [
    { id: 1, code: 'PC-01' },
    { id: 2, code: 'PC-02' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    api.get.mockImplementation((url) => {
      if (url === '/api/bookings') return Promise.resolve({ data: { data: mockBookings } });
      if (url === '/api/seats') return Promise.resolve({ data: { data: mockSeats } });
      if (url === '/api/bookings/availability') return Promise.resolve({ data: { occupied_seat_ids: [] } });
      return Promise.reject(new Error('not found'));
    });
  });

  test('renders bookings and seats after loading', async () => {
    render(<Bookings />);
    
    await waitFor(() => {
      expect(screen.getByText(/PC-01/)).toBeInTheDocument();
      expect(screen.getByText(/2026-03-20/)).toBeInTheDocument();
      // Ensure availability was also fetched
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/api/bookings/availability'), expect.anything());
    });
  });

  test('opens new booking modal when "New Booking" is clicked', async () => {
    render(<Bookings />);
    
    await waitFor(() => {
      expect(screen.getByText(/New Booking/i)).toBeInTheDocument();
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/api/bookings/availability'), expect.anything());
    });

    fireEvent.click(screen.getByText(/New Booking/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Create/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Date/i)).toBeInTheDocument();
    });
  });

  test('validates minimum duration (3 hours)', async () => {
    render(<Bookings />);
    
    await waitFor(() => {
      expect(screen.getByText(/New Booking/i)).toBeInTheDocument();
      expect(api.get).toHaveBeenCalledWith(expect.stringContaining('/api/bookings/availability'), expect.anything());
    });

    fireEvent.click(screen.getByText(/New Booking/i));
    
    await waitFor(() => {
      expect(screen.getByLabelText(/Start/i)).toBeInTheDocument();
    });

    // Set 1 hour duration
    fireEvent.change(screen.getByLabelText(/Start/i), { target: { value: '12:00' } });
    fireEvent.change(screen.getByLabelText(/End/i), { target: { value: '13:00' } });
    
    fireEvent.click(screen.getByText(/Create/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Minimum booking duration is 3 hours/i)).toBeInTheDocument();
    });
  });
});
