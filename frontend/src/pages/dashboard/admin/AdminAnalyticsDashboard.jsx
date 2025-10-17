import React, { useState, useEffect } from 'react';
import {
  MdDashboard,
  MdAnalytics,
  MdTrendingUp,
  MdTrendingDown,
  MdDownload,
  MdRefresh,
  MdFilterList,
  MdLocalShipping,
  MdAssessment,
  MdScience,
  MdWarning,
  MdCheckCircle,
  MdInfo,
  MdBarChart,
  MdLocationOn,
  MdAttachMoney,
  MdRecycling,
  MdSettings,
  MdFileDownload,
  MdPerson
} from 'react-icons/md';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useLocation } from 'react-router-dom';
import { 
  getOperationalAnalytics, 
  getFinancialAnalytics, 
  runSimulation,
  exportAnalyticsReport,
  getDistrictAnalysis,
  getDistrictAnalysisByUser
} from '../../../utils/api.jsx';

const AdminAnalyticsDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [reportType, setReportType] = useState('operational');
  const [dateRange, setDateRange] = useState('30d');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [simulationMode, setSimulationMode] = useState(false);
  
  // User analysis data from UserAnalytics page
  const [userAnalysisData, setUserAnalysisData] = useState(null);
  
  // District analysis data from backend
  const [districtAnalysisData, setDistrictAnalysisData] = useState(null);
  const [districtLoading, setDistrictLoading] = useState(false);
  const [districtError, setDistrictError] = useState(null);

  // Real data state
  const [analyticsData, setAnalyticsData] = useState({
    operational: null,
    financial: null,
    sustainability: null
  });


  const reportTypes = [
    { id: 'operational', name: 'Operational', icon: <MdLocalShipping />, color: '#3b82f6' },
    { id: 'financial', name: 'Financial', icon: <MdAttachMoney />, color: '#10b981' }
  ];

  // Load initial data
  useEffect(() => {
    fetchAnalyticsData('operational', { 
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString()
    });
    // Only fetch district analysis if backend supports it
    // fetchDistrictAnalysis();
  }, []);

  // Fetch district analysis from backend
  const fetchDistrictAnalysis = async () => {
    try {
      setDistrictLoading(true);
      setDistrictError(null);
      
      // Check if we have user analysis data first
      if (userAnalysisData?.districtAnalysis?.length > 0) {
        setDistrictAnalysisData(userAnalysisData.districtAnalysis);
        return;
      }
      
      const params = {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString()
      };
      
      try {
        const data = await getDistrictAnalysis(params);
        setDistrictAnalysisData(data);
      } catch (err) {
        if (err.response?.status === 404) {
          // API endpoint not available yet - use mock data
          setDistrictAnalysisData({
            districts: [
              { name: 'North District', fillLevel: 75, totalBins: 120 },
              { name: 'South District', fillLevel: 62, totalBins: 85 },
              { name: 'East District', fillLevel: 48, totalBins: 95 },
              { name: 'West District', fillLevel: 55, totalBins: 110 }
            ]
          });
        } else {
          throw err; // Re-throw other errors
        }
      }
    } catch (err) {
      if (err.code === 'ERR_NETWORK') {
        console.error('Network error fetching district analysis:', err);
        setDistrictError('Network error. Please check your connection and try again.');
      } else if (err.response?.status !== 404) {
        // Don't log 404s as they're handled above
        console.error('Error fetching district analysis:', err);
        setDistrictError('Error loading analytics data. Please try again later.');
      }
    } finally {
      setDistrictLoading(false);
    }
  };

  // Capture user analysis data from navigation
  useEffect(() => {
    if (location.state?.userAnalysis) {
      setUserAnalysisData(location.state.userAnalysis);
      setReportType('operational'); // Switch to operational tab to show user analysis
    }
  }, [location.state]);

  // Helper function to get district data (from user analysis or backend)
  const getDistrictData = () => {
    if (userAnalysisData?.districtAnalysis?.length > 0) {
      return userAnalysisData.districtAnalysis;
    }
    if (districtAnalysisData?.districts?.length > 0) {
      return districtAnalysisData.districts;
    }
    return [];
  };

  // Fetch analytics data
  const fetchAnalyticsData = async (type, filters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      let response;
      switch (type) {
        case 'operational':
          response = await getOperationalAnalytics(filters);
          break;
        case 'financial':
          response = await getFinancialAnalytics(filters);
          break;
        default:
          throw new Error('Invalid report type');
      }
      
      if (response.success) {
        setAnalyticsData(prev => ({
          ...prev,
          [type]: response.data
        }));
      } else {
        throw new Error(response.message || 'Failed to fetch analytics data');
      }
    } catch (err) {
      console.error('Error fetching analytics data:', err);
      setError(err.message || 'Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  const handleReportTypeChange = (type) => {
    setReportType(type);
    fetchAnalyticsData(type, { 
      startDate: dateRange === '30d' ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() : null,
      endDate: new Date().toISOString()
    });
  };


  const handleSimulation = async () => {
    try {
      if (!simulationMode) {
        setLoading(true);
        const response = await runSimulation({
          simulationType: 'pricing_change',
          parameters: {
            newRate: 3.5,
            wasteType: 'mixed'
          }
        });
        
        if (response.success) {
          setAnalyticsData(prev => ({
            ...prev,
            financial: {
              ...prev.financial,
              ...response.data
            }
          }));
          setSimulationMode(true);
        }
      } else {
        // Reset to original data
        fetchAnalyticsData('financial');
        setSimulationMode(false);
      }
    } catch (err) {
      console.error('Error running simulation:', err);
      setError(err.message || 'Failed to run simulation');
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (format) => {
    try {
      setLoading(true);
      const response = await exportAnalyticsReport({
        reportType,
        format,
        startDate: dateRange === '30d' ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        endDate: new Date().toISOString()
      });
      
      if (response.success) {
        // Create download link
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = `${reportType}_report.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        throw new Error(response.message || 'Export failed');
      }
    } catch (err) {
      console.error('Error exporting report:', err);
      setError(err.message || 'Failed to export report');
    } finally {
      setLoading(false);
    }
  };


  const renderOperationalMetrics = () => (
    <div className="space-y-6">
      {/* User Analysis Section */}
      {userAnalysisData && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 shadow-lg mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MdPerson className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-800">User Analysis: {userAnalysisData.userName}</h3>
                <p className="text-lg text-green-600 font-medium">Fill levels by district analysis</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userAnalysisData.districtAnalysis.map((districtData, index) => (
              <div key={districtData.district} className="bg-white rounded-xl p-6 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-green-800">{districtData.district}</h4>
                  <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">{districtData.totalBins} bins</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-700">Avg Fill Level</span>
                    <span className="text-2xl font-bold text-green-600">{districtData.averageFill}%</span>
                  </div>
                  <div className="w-full bg-green-100 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${districtData.averageFill}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <div className="font-bold text-red-600 text-lg">
                        {districtData.bins.filter(bin => bin.currentFill > 80).length}
                      </div>
                      <div className="text-red-700 font-medium">High Fill</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="font-bold text-green-600 text-lg">
                        {districtData.bins.filter(bin => bin.currentFill < 20).length}
                      </div>
                      <div className="text-green-700 font-medium">Low Fill</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* District Analysis Summary */}
      {getDistrictData().length > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MdLocationOn className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-800">District Analysis Summary</h3>
                <p className="text-lg text-green-600 font-medium">
                  Fill levels by district {userAnalysisData?.userName ? `- ${userAnalysisData.userName}` : '(System-wide)'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center p-4 bg-white rounded-xl border-2 border-green-200">
                <div className="text-3xl font-bold text-green-600">{getDistrictData().length}</div>
                <div className="text-sm font-semibold text-green-700">Districts</div>
              </div>
              <div className="text-center p-4 bg-white rounded-xl border-2 border-green-200">
                <div className="text-3xl font-bold text-emerald-600">
                  {getDistrictData()[0]?.averageFill || getDistrictData()[0]?.avgFill}%
                </div>
                <div className="text-sm font-semibold text-emerald-700">Highest Fill</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getDistrictData().slice(0, 3).map((districtData, index) => (
              <div key={districtData.district} className="bg-white rounded-xl p-6 border-2 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-bold text-green-800">{districtData.district}</h4>
                  <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">{districtData.totalBins || districtData.binCount} bins</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-green-700">Avg Fill</span>
                    <span className="text-2xl font-bold text-green-600">{districtData.averageFill || districtData.avgFill}%</span>
                  </div>
                  <div className="w-full bg-green-100 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${districtData.averageFill || districtData.avgFill}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-2 bg-red-50 rounded-lg">
                      <div className="font-bold text-red-600 text-lg">
                        {districtData.bins ? districtData.bins.filter(bin => bin.currentFill > 80).length : districtData.highFillBins || 0}
                      </div>
                      <div className="text-red-700 font-medium">High Fill</div>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded-lg">
                      <div className="font-bold text-green-600 text-lg">
                        {districtData.bins ? districtData.bins.filter(bin => bin.currentFill < 20).length : districtData.lowFillBins || 0}
                      </div>
                      <div className="text-green-700 font-medium">Low Fill</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* District Analysis Bar Chart */}
      {getDistrictData().length > 0 && (
        <div className="bg-white rounded-2xl border-2 border-green-200 p-8 mb-8 shadow-lg">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MdBarChart className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-800">District Fill Level Bar Chart</h3>
                <p className="text-lg text-green-600 font-medium">Visual representation of fill levels by district</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm font-medium">
              <div className="flex items-center space-x-2 bg-red-50 px-3 py-2 rounded-lg">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="text-red-700">High (&gt;80%)</span>
              </div>
              <div className="flex items-center space-x-2 bg-orange-50 px-3 py-2 rounded-lg">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-orange-700">Medium (60-80%)</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-blue-700">Low (40-60%)</span>
              </div>
              <div className="flex items-center space-x-2 bg-green-50 px-3 py-2 rounded-lg">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-green-700">Very Low (&lt;40%)</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            {getDistrictData().map((districtData, index) => {
              const fillLevel = parseFloat(districtData.averageFill || districtData.avgFill);
              const barColor = fillLevel > 80 ? '#ef4444' : 
                             fillLevel > 60 ? '#f59e0b' : 
                             fillLevel > 40 ? '#3b82f6' : '#10b981';
              const barHeight = Math.max((fillLevel / 100) * 200, 20); // Minimum 20px height
              
              return (
                <div key={districtData.district} className="flex items-center space-x-6 p-4 bg-green-50 rounded-xl border-2 border-green-100">
                  <div className="w-32 text-lg font-bold text-green-800 truncate" title={districtData.district}>
                    {districtData.district}
                  </div>
                  <div className="flex-1 relative">
                    <div className="w-full bg-green-100 rounded-xl h-10 flex items-center shadow-inner">
                      <div 
                        className="rounded-xl transition-all duration-500 flex items-center justify-end pr-3 shadow-lg"
                        style={{ 
                          width: `${fillLevel}%`,
                          height: '100%',
                          backgroundColor: barColor
                        }}
                      >
                        <span className="text-white text-sm font-bold">
                          {fillLevel}%
                        </span>
                      </div>
                    </div>
                    <div className="absolute -bottom-8 left-0 text-sm font-semibold text-green-600">
                      {districtData.totalBins || districtData.binCount} bins
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <div className="text-lg font-bold text-green-800">{fillLevel}%</div>
                    <div className="text-sm font-medium text-green-600">
                      {districtData.bins ? 
                        `${districtData.bins.filter(bin => bin.currentFill > 80).length}H / ${districtData.bins.filter(bin => bin.currentFill < 20).length}L` :
                        `${districtData.highFillBins || 0}H / ${districtData.lowFillBins || 0}L`
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* District Analysis Section */}
        <div className="bg-white rounded-2xl border-2 border-green-200 p-8 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-green-800">District Fill Level Analysis</h3>
            <button className="p-3 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-xl transition-all duration-300 border-2 border-green-200 hover:border-green-300">
              <MdFilterList className="text-xl" />
            </button>
          </div>
        <div className="space-y-6">
            {getDistrictData().length > 0 ? (
              getDistrictData().map((districtData) => (
                <div key={districtData.district || `district-${districtData.id}`} className="p-4 bg-green-50 rounded-xl border-2 border-green-100">
              <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-green-800">{districtData.district}</span>
                    <div className="flex items-center space-x-3">
                      <span className="text-xl font-bold text-green-600">{districtData.averageFill || districtData.avgFill}%</span>
                      <span className="text-sm font-semibold text-green-600 bg-green-100 px-3 py-1 rounded-full">({districtData.totalBins || districtData.binCount} bins)</span>
                    </div>
                  </div>
                  <div className="w-full bg-green-100 rounded-full h-3 mb-3">
                    <div 
                      className="h-3 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${districtData.averageFill || districtData.avgFill}%`,
                        backgroundColor: (districtData.averageFill || districtData.avgFill) > 80 ? '#ef4444' : 
                                     (districtData.averageFill || districtData.avgFill) > 60 ? '#f59e0b' : 
                                     (districtData.averageFill || districtData.avgFill) > 40 ? '#3b82f6' : '#10b981'
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-red-600">High Fill: {districtData.bins ? districtData.bins.filter(bin => bin.currentFill > 80).length : districtData.highFillBins || 0}</span>
                    <span className="text-green-600">Low Fill: {districtData.bins ? districtData.bins.filter(bin => bin.currentFill < 20).length : districtData.lowFillBins || 0}</span>
                  </div>
                </div>
              ))
            ) : (
            <div className="text-center py-12">
                {districtLoading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-green-200 border-t-green-600 mb-6"></div>
                    <div className="text-xl mb-3 font-semibold text-green-700">Loading district analysis...</div>
                    <div className="text-lg text-green-600">Fetching data from backend</div>
                  </div>
                ) : districtError ? (
                  <div>
                    <div className="text-xl mb-3 font-bold text-red-600">Error loading district analysis</div>
                    <div className="text-lg text-red-500 mb-6">{districtError}</div>
                    <button 
                      type="button"
                      onClick={fetchDistrictAnalysis}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                      Retry
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="text-xl mb-3 font-bold text-green-600">No district analysis available</div>
                    <div className="text-lg mb-6 text-green-500">Export user analysis from User Analytics page or try backend data</div>
                    <button 
                      type="button"
                      onClick={fetchDistrictAnalysis}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
                    >
                      Try Backend Data
                    </button>
                  </div>
                )}
              </div>
          )}
        </div>
      </div>


      </div>
    </div>
  );

  const renderFinancialMetrics = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Revenue Overview */}
      <div className="bg-white rounded-2xl border-2 border-green-200 p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-green-800 mb-6">Revenue Overview</h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center p-6 bg-green-50 rounded-xl border-2 border-green-200">
            <span className="text-lg font-semibold text-green-800">Total Revenue</span>
            <span className="text-2xl font-bold text-green-900">${analyticsData.financial?.totalRevenue?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between items-center p-6 bg-blue-50 rounded-xl border-2 border-blue-200">
            <span className="text-lg font-semibold text-blue-800">Cost Recovery</span>
            <span className="text-2xl font-bold text-blue-900">{analyticsData.financial?.costRecovery || 0}%</span>
          </div>
          <div className="flex justify-between items-center p-6 bg-yellow-50 rounded-xl border-2 border-yellow-200">
            <span className="text-lg font-semibold text-yellow-800">Avg Invoice</span>
            <span className="text-2xl font-bold text-yellow-900">${analyticsData.financial?.averageInvoice || 0}</span>
          </div>
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="bg-white rounded-2xl border-2 border-green-200 p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-green-800 mb-6">Cost Analysis</h3>
        <div className="space-y-6">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
            <span className="text-lg font-semibold text-gray-700">Operational Costs</span>
            <span className="text-xl font-bold text-gray-900">${analyticsData.financial?.operationalCosts?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-red-50 rounded-xl border-2 border-red-200">
            <span className="text-lg font-semibold text-red-700">Outstanding Payments</span>
            <span className="text-xl font-bold text-red-600">${analyticsData.financial?.outstandingPayments?.toLocaleString() || 0}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border-2 border-green-200">
            <span className="text-lg font-semibold text-green-700">Rebate Amount</span>
            <span className="text-xl font-bold text-green-600">${analyticsData.financial?.rebateAmount?.toLocaleString() || 0}</span>
          </div>
          <div className="mt-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-semibold text-green-700">Cost Recovery Progress</span>
              <span className="text-xl font-bold text-green-600">{analyticsData.financial?.costRecovery || 0}%</span>
            </div>
            <div className="w-full bg-green-100 rounded-full h-4">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${analyticsData.financial?.costRecovery || 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );



  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none z-0"
           style={{
             backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
             backgroundSize: '40px 40px'
           }}
      />

      <div className="relative z-10 p-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 w-full">
          <div className="bg-white border-2 border-green-200 rounded-2xl p-8 shadow-lg">
            <div className="flex justify-between items-center flex-wrap gap-6">
              <div>
                <h1 className="text-5xl font-bold text-green-800 mb-3 tracking-tight">
                  Analytics Dashboard
                </h1>
                <p className="text-green-600 text-xl font-medium">
                  Comprehensive insights for waste management operations
                </p>
              </div>
              
              <div className="flex gap-4">
                <button 
                  type="button"
                  onClick={() => handleExportReport('PDF')}
                  className="flex items-center space-x-3 bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <MdFileDownload className="text-xl" />
                  <span>Export Report</span>
                </button>
                <button 
                  type="button" 
                  className="relative bg-white border-2 border-green-300 p-4 rounded-xl hover:bg-green-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <MdSettings className="text-green-600 text-xl" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Report Type Selection */}
        <div className="bg-white rounded-2xl border-2 border-green-200 shadow-lg mb-8 overflow-hidden">
          <div className="border-b-2 border-green-100">
            <div className="flex">
              {reportTypes.map((type) => (
                <button
                  type="button"
                  key={type.id}
                  onClick={() => handleReportTypeChange(type.id)}
                  className={`flex items-center space-x-3 px-8 py-6 text-lg font-bold transition-all duration-300 border-b-4 ${
                    reportType === type.id
                      ? 'text-green-800 border-green-500 bg-green-50 shadow-lg'
                      : 'text-green-600 border-transparent hover:text-green-800 hover:bg-green-50 hover:border-green-300'
                  }`}
                >
                  <span className="text-2xl">{type.icon}</span>
                  <span>{type.name}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab Content */}
          <div className="p-8">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
                  <span className="text-green-700 font-semibold text-lg">Loading analytics data...</span>
                </div>
              </div>
            )}

            {!loading && analyticsData[reportType] && (
              <>
                {reportType === 'operational' && renderOperationalMetrics()}
                {reportType === 'financial' && renderFinancialMetrics()}
              </>
            )}
            
            {!loading && !analyticsData[reportType] && (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="text-green-600 text-xl mb-3 font-semibold">No data available</div>
                  <div className="text-green-500 text-lg">Data will be loaded when you select a report type</div>
                </div>
              </div>
            )}
          </div>
        </div>


        {/* Simulation Mode Indicator */}
        {simulationMode && (
          <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 mb-8 shadow-lg">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <MdScience className="text-green-600 text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-800">What-if Simulation Active</h3>
                <p className="text-lg text-green-700 font-medium">You are viewing projected metrics under modified pricing policies.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;
