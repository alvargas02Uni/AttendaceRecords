import React from 'react';
import { render, screen, act } from '@testing-library/react';
import AttendanceRecords from '../pages/dashboard/components/attendanceRecords';
import UserStatistics from '../pages/dashboard/components/userStatistics';

// Desactiva warnings en consola
beforeAll(() => {
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterAll(() => {
  console.warn.mockRestore();
});

describe('AttendanceRecords Component', () => {
  const mockAttendances = [
    { att_id: 1, user_name: 'John', user_surname: 'Doe', lab_name: 'Lab A', att_time: '2022-01-01T10:00:00Z', att_end_time: '2022-01-01T11:00:00Z' },
    { att_id: 2, user_name: 'Jane', user_surname: 'Smith', lab_name: 'Lab B', att_time: '2022-01-01T12:00:00Z', att_end_time: '2022-01-01T13:00:00Z' },
  ];

  test('renders AttendanceRecords with data', () => {
    render(<AttendanceRecords attendances={mockAttendances} loading={false} />);
    
    expect(screen.getByText(/Attendance Records/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/Lab A/i)).toBeInTheDocument();
    // Ajuste para la fecha de formato
    expect(screen.getByText((content) => content.includes('11:00:00 AM'))).toBeInTheDocument();
  });

  test('shows loading spinner when loading is true', () => {
    render(<AttendanceRecords attendances={[]} loading={true} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument(); // CircularProgress
  });
});

describe('UserStatistics Component', () => {
  const mockStatistics = {
    averageAge: 25,
    genderDistribution: { male: 10, female: 15, non_binary: 2 },
    nearPercentage: 60,
  };

  test('renders UserStatistics with statistics data', () => {
    render(<UserStatistics statistics={mockStatistics} totalUsers={27} />);

    expect(screen.getByText(/User Statistics/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Users/i)).toBeInTheDocument();
    expect(screen.getByText(/27/i)).toBeInTheDocument();
    expect(screen.getByText(/Average Age/i)).toBeInTheDocument();
    expect(screen.getByText(/25 years/i)).toBeInTheDocument();
    expect(screen.getByText(/Gender Distribution/i)).toBeInTheDocument();
    expect(screen.getByText(/Male: 10/i)).toBeInTheDocument();
    expect(screen.getByText(/Female: 15/i)).toBeInTheDocument();
    expect(screen.getByText(/Non-binary: 2/i)).toBeInTheDocument();
  });
});
