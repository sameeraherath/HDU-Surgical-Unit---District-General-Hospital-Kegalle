import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import BedCard from '../BedCard';

// Create a test theme
const theme = createTheme();

// Mock the CriticalFactorsForm component
vi.mock('../components/CriticalFactorsForm', () => ({
  default: ({ open, onClose, patientId, bedNumber }) => (
    <div data-testid="critical-factors-form">
      {open && (
        <div>
          <span>Critical Factors Form</span>
          <span>Patient ID: {patientId}</span>
          <span>Bed Number: {bedNumber}</span>
          <button onClick={onClose}>Close</button>
        </div>
      )}
    </div>
  )
}));

// Helper function to render component with theme
const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

describe('BedCard Component', () => {
  const mockAssignBed = vi.fn();
  const mockDeassignBed = vi.fn();

  const defaultProps = {
    assignBed: mockAssignBed,
    deassignBed: mockDeassignBed
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Available Bed', () => {
    const availableBed = {
      id: 1,
      bedNumber: 'B1',
      patientId: null
    };

    it('renders bed information correctly', () => {
      renderWithTheme(<BedCard bed={availableBed} {...defaultProps} />);
      
      expect(screen.getByText('Bed B1')).toBeInTheDocument();
      expect(screen.getByText('No patient assigned')).toBeInTheDocument();
    });

    it('shows assign patient button for available bed', () => {
      renderWithTheme(<BedCard bed={availableBed} {...defaultProps} />);
      
      const assignButton = screen.getByText('Assign Patient');
      expect(assignButton).toBeInTheDocument();
    });

    it('calls assignBed when assign button is clicked', () => {
      renderWithTheme(<BedCard bed={availableBed} {...defaultProps} />);
      
      const assignButton = screen.getByText('Assign Patient');
      fireEvent.click(assignButton);
      
      expect(mockAssignBed).toHaveBeenCalledWith(availableBed);
    });

    it('does not show deassign or vitals buttons for available bed', () => {
      renderWithTheme(<BedCard bed={availableBed} {...defaultProps} />);
      
      expect(screen.queryByText('Deassign Patient')).not.toBeInTheDocument();
      expect(screen.queryByText('Record Vitals')).not.toBeInTheDocument();
    });
  });

  describe('Occupied Bed', () => {
    const occupiedBed = {
      id: 2,
      bedNumber: 'B2',
      patientId: 123
    };

    it('renders occupied bed information correctly', () => {
      renderWithTheme(<BedCard bed={occupiedBed} {...defaultProps} />);
      
      expect(screen.getByText('Bed B2')).toBeInTheDocument();
      expect(screen.getByText('Patient ID: 123')).toBeInTheDocument();
    });

    it('shows deassign and vitals buttons for occupied bed', () => {
      renderWithTheme(<BedCard bed={occupiedBed} {...defaultProps} />);
      
      expect(screen.getByText('Deassign Patient')).toBeInTheDocument();
      expect(screen.getByText('Record Vitals')).toBeInTheDocument();
    });

    it('does not show assign button for occupied bed', () => {
      renderWithTheme(<BedCard bed={occupiedBed} {...defaultProps} />);
      
      expect(screen.queryByText('Assign Patient')).not.toBeInTheDocument();
    });

    it('opens confirmation dialog when deassign button is clicked', () => {
      renderWithTheme(<BedCard bed={occupiedBed} {...defaultProps} />);
      
      const deassignButton = screen.getByText('Deassign Patient');
      fireEvent.click(deassignButton);
      
      expect(screen.getByText('Confirm Deassign')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to deassign this bed from Patient ID 123?')).toBeInTheDocument();
    });

    it('calls deassignBed when confirmation is clicked', async () => {
      renderWithTheme(<BedCard bed={occupiedBed} {...defaultProps} />);
      
      // Click deassign button
      const deassignButton = screen.getByText('Deassign Patient');
      fireEvent.click(deassignButton);
      
      // Click confirm button
      const confirmButton = screen.getByText('Confirm Deassign');
      fireEvent.click(confirmButton);
      
      expect(mockDeassignBed).toHaveBeenCalledWith(occupiedBed.id);
    });

    it('closes confirmation dialog when cancel is clicked', () => {
      renderWithTheme(<BedCard bed={occupiedBed} {...defaultProps} />);
      
      // Click deassign button
      const deassignButton = screen.getByText('Deassign Patient');
      fireEvent.click(deassignButton);
      
      // Click cancel button
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
      
      expect(screen.queryByText('Confirm Deassign')).not.toBeInTheDocument();
      expect(mockDeassignBed).not.toHaveBeenCalled();
    });

    it('opens vitals form when record vitals button is clicked', () => {
      renderWithTheme(<BedCard bed={occupiedBed} {...defaultProps} />);
      
      const vitalsButton = screen.getByText('Record Vitals');
      fireEvent.click(vitalsButton);
      
      expect(screen.getByTestId('critical-factors-form')).toBeInTheDocument();
      expect(screen.getByText('Critical Factors Form')).toBeInTheDocument();
      expect(screen.getByText('Patient ID: 123')).toBeInTheDocument();
      expect(screen.getByText('Bed Number: B2')).toBeInTheDocument();
    });

    it('closes vitals form when close button is clicked', () => {
      renderWithTheme(<BedCard bed={occupiedBed} {...defaultProps} />);
      
      // Open vitals form
      const vitalsButton = screen.getByText('Record Vitals');
      fireEvent.click(vitalsButton);
      
      // Close vitals form
      const closeButton = screen.getByText('Close');
      fireEvent.click(closeButton);
      
      expect(screen.queryByText('Critical Factors Form')).not.toBeInTheDocument();
    });
  });

  describe('Bed with Critical Status', () => {
    const criticalBed = {
      id: 3,
      bedNumber: 'B3',
      patientId: 456,
      criticalStatus: true
    };

    it('renders critical bed correctly', () => {
      renderWithTheme(<BedCard bed={criticalBed} {...defaultProps} />);
      
      expect(screen.getByText('Bed B3')).toBeInTheDocument();
      expect(screen.getByText('Patient ID: 456')).toBeInTheDocument();
    });

    it('shows record vitals button for critical bed', () => {
      renderWithTheme(<BedCard bed={criticalBed} {...defaultProps} />);
      
      expect(screen.getByText('Record Vitals')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles bed with undefined patientId', () => {
      const bedWithUndefinedPatient = {
        id: 4,
        bedNumber: 'B4',
        patientId: undefined
      };

      renderWithTheme(<BedCard bed={bedWithUndefinedPatient} {...defaultProps} />);
      
      expect(screen.getByText('Bed B4')).toBeInTheDocument();
      expect(screen.getByText('No patient assigned')).toBeInTheDocument();
    });

    it('handles bed with null patientId', () => {
      const bedWithNullPatient = {
        id: 5,
        bedNumber: 'B5',
        patientId: null
      };

      renderWithTheme(<BedCard bed={bedWithNullPatient} {...defaultProps} />);
      
      expect(screen.getByText('Bed B5')).toBeInTheDocument();
      expect(screen.getByText('No patient assigned')).toBeInTheDocument();
    });

    it('handles missing bed number', () => {
      const bedWithoutNumber = {
        id: 6,
        bedNumber: '',
        patientId: null
      };

      renderWithTheme(<BedCard bed={bedWithoutNumber} {...defaultProps} />);
      
      expect(screen.getByText('Bed ')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    const occupiedBed = {
      id: 7,
      bedNumber: 'B7',
      patientId: 789
    };

    it('has proper button labels', () => {
      renderWithTheme(<BedCard bed={occupiedBed} {...defaultProps} />);
      
      const deassignButton = screen.getByText('Deassign Patient');
      const vitalsButton = screen.getByText('Record Vitals');
      
      expect(deassignButton).toBeInTheDocument();
      expect(vitalsButton).toBeInTheDocument();
    });

    it('has proper dialog titles', () => {
      renderWithTheme(<BedCard bed={occupiedBed} {...defaultProps} />);
      
      // Open deassign dialog
      const deassignButton = screen.getByText('Deassign Patient');
      fireEvent.click(deassignButton);
      
      expect(screen.getByText('Confirm Deassign')).toBeInTheDocument();
    });
  });
});
