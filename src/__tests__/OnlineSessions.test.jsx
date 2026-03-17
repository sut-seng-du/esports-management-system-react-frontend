import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import OnlineSessions from '../pages/OnlineSessions';
import api from '../api';

// Mock API
jest.mock('../api', () => ({
  get: jest.fn(),
}));

// Mock asset
jest.mock('../assets/computer.png', () => 'computer.png');

describe('OnlineSessions Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const mockSeats = [
    { id: 1, code: 'PC-01', online: true, online_at: new Date().toISOString() },
    { id: 2, code: 'PC-02', online: false },
  ];

  test('renders seat status correctly', async () => {
    api.get.mockResolvedValueOnce({ data: { data: mockSeats } });

    render(<OnlineSessions />);

    await waitFor(() => {
      expect(screen.getByText('PC-01')).toBeInTheDocument();
      expect(screen.getByText('PC-02')).toBeInTheDocument();
    });

    // PC-01 is online (rendered with time ago in mock)
    expect(screen.getByText(/sec(s)? ago|Online/)).toBeInTheDocument();
    // PC-02 is offline
    expect(screen.getByText('Offline')).toBeInTheDocument();
  });

  test('polls API periodically', async () => {
    api.get.mockResolvedValue({ data: { data: [] } });

    render(<OnlineSessions />);

    await waitFor(() => {
        expect(api.get).toHaveBeenCalledTimes(1);
    });

    // Advance 10 seconds
    act(() => {
      jest.advanceTimersByTime(10000);
    });

    await waitFor(() => {
      expect(api.get).toHaveBeenCalledTimes(2);
    });
  });

  test('handles API error', async () => {
    api.get.mockRejectedValueOnce(new Error('Seats fetch failure'));

    render(<OnlineSessions />);

    await waitFor(() => {
      expect(screen.getByText('Seats fetch failure')).toBeInTheDocument();
    });
  });
});
