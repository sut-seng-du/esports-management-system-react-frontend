import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Announcements from '../pages/Announcements';
import api from '../api';

// Mock API
jest.mock('../api', () => ({
  get: jest.fn(),
}));

describe('Announcements Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockAnnouncements = [
    {
      id: 1,
      title: 'Summer Tournament',
      description: 'Join our epic summer tournament!',
      poster_image: 'image1.jpg',
      active: true,
      start_datetime: '2023-06-01T10:00:00Z',
      end_datetime: '2023-06-10T18:00:00Z',
    },
    {
      id: 2,
      title: 'Maintenance Update',
      description: 'System maintenance on Sunday.',
      poster_image: null,
      active: false,
      start_datetime: '2023-06-05T08:00:00Z',
      end_datetime: '2023-06-05T12:00:00Z',
    },
  ];

  test('renders announcements list after loading', async () => {
    api.get.mockResolvedValueOnce({ data: { data: mockAnnouncements } });

    render(<Announcements />);

    // Check loading skeleton
    expect(screen.getByText(/Fetching latest updates/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Summer Tournament')).toBeInTheDocument();
      expect(screen.getByText('Maintenance Update')).toBeInTheDocument();
    });

    expect(screen.getByText(/2 announcements/i)).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('INACTIVE')).toBeInTheDocument();
  });

  test('renders empty state when no announcements are returned', async () => {
    api.get.mockResolvedValueOnce({ data: { data: [] } });

    render(<Announcements />);

    await waitFor(() => {
      expect(screen.getByText(/No Announcements Yet/i)).toBeInTheDocument();
    });
  });

  test('handles API error and allows retry', async () => {
    api.get.mockRejectedValueOnce(new Error('Network Error'));

    render(<Announcements />);

    await waitFor(() => {
      expect(screen.getByText('Network Error')).toBeInTheDocument();
      expect(screen.getByText('Retry')).toBeInTheDocument();
    });

    // Mock successful retry
    api.get.mockResolvedValueOnce({ data: { data: [mockAnnouncements[0]] } });
    fireEvent.click(screen.getByText('Retry'));

    await waitFor(() => {
      expect(screen.getByText('Summer Tournament')).toBeInTheDocument();
      expect(screen.queryByText('Network Error')).not.toBeInTheDocument();
    });
  });

  test('updates active index on swiper slide change', async () => {
    api.get.mockResolvedValueOnce({ data: { data: mockAnnouncements } });

    render(<Announcements />);

    await waitFor(() => {
      expect(screen.getByText('1 / 2')).toBeInTheDocument();
    });

    // Trigger swiper slide change via mock onClick
    const swiper = screen.getByTestId('swiper-mock');
    fireEvent.click(swiper);

    await waitFor(() => {
      expect(screen.getByText('2 / 2')).toBeInTheDocument();
    });
  });
});
