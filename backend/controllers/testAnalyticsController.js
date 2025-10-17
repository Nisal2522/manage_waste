// Simple test controller for analytics
export const getTestOperationalAnalytics = async (req, res) => {
  try {
    // Return mock data for testing
    const mockData = {
      wasteByZone: [
        { zone: 'North Zone', waste: 45.2, percentage: 28, color: '#3b82f6' },
        { zone: 'East Zone', waste: 38.7, percentage: 24, color: '#10b981' },
        { zone: 'South Zone', waste: 42.1, percentage: 26, color: '#f59e0b' },
        { zone: 'West Zone', waste: 35.8, percentage: 22, color: '#ef4444' }
      ],
      collectionEfficiency: 92.5,
      averageResponseTime: 1.2,
      systemUptime: 99.8,
      activeRoutes: 12,
      totalCollections: 2847,
      completedCollections: 2634
    };

    res.json({
      success: true,
      data: mockData
    });
  } catch (error) {
    console.error('Error in test operational analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch operational analytics',
      error: error.message
    });
  }
};

export const getTestFinancialAnalytics = async (req, res) => {
  try {
    const mockData = {
      totalRevenue: 125000,
      costRecovery: 78.5,
      averageInvoice: 45.2,
      outstandingPayments: 12500,
      rebateAmount: 8500,
      operationalCosts: 95000
    };

    res.json({
      success: true,
      data: mockData
    });
  } catch (error) {
    console.error('Error in test financial analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch financial analytics',
      error: error.message
    });
  }
};

export const getTestSustainabilityAnalytics = async (req, res) => {
  try {
    const mockData = {
      recyclingRate: 68.5,
      wasteReduction: 15.2,
      carbonFootprint: 245.8,
      energyEfficiency: 87.3,
      circularEconomyScore: 82.1
    };

    res.json({
      success: true,
      data: mockData
    });
  } catch (error) {
    console.error('Error in test sustainability analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sustainability analytics',
      error: error.message
    });
  }
};
