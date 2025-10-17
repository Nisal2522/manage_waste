import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MdDashboard,
  MdAnalytics,
  MdTrendingUp,
  MdTrendingDown,
  MdDownload,
  MdRefresh,
  MdFilterList,
  MdAssessment,
  MdScience,
  MdWarning,
  MdCheckCircle,
  MdInfo,
  MdBarChart,
  MdLocationOn,
  MdRecycling,
  MdSettings,
  MdFileDownload,
  MdPerson,
  MdStorage
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
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
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



  // Load initial data
  useEffect(() => {
    fetchAnalyticsData('operational', { 
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString()
    });
    // Only fetch district analysis if we have user data, otherwise skip to avoid 404s
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
        const response = await getDistrictAnalysis(params);
        if (response.success) {
          setDistrictAnalysisData(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch district analysis');
        }
      } catch (err) {
        if (err.response?.status === 404) {
          // API endpoint not available yet - use mock data
          setDistrictAnalysisData({
            districts: [
              { district: 'North District', avgFill: 75, totalBins: 120, highFillBins: 15, lowFillBins: 8 },
              { district: 'South District', avgFill: 62, totalBins: 85, highFillBins: 10, lowFillBins: 12 },
              { district: 'East District', avgFill: 48, totalBins: 95, highFillBins: 5, lowFillBins: 20 },
              { district: 'West District', avgFill: 55, totalBins: 110, highFillBins: 8, lowFillBins: 15 }
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
      // User analysis data loaded
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
      
      // Set mock data as fallback
      if (type === 'operational') {
        setAnalyticsData(prev => ({
          ...prev,
          [type]: {
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
          }
        }));
      } else if (type === 'financial') {
        setAnalyticsData(prev => ({
          ...prev,
          [type]: {
            totalRevenue: 125000,
            costRecovery: 78.5,
            averageInvoice: 45.2,
            outstandingPayments: 12500,
            rebateAmount: 8500,
            operationalCosts: 95000
          }
        }));
      }
    } finally {
      setLoading(false);
    }
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
        reportType: 'operational',
        format,
        startDate: dateRange === '30d' ? new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString() : null,
        endDate: new Date().toISOString()
      });
      
      if (response.success) {
        // Create download link
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = `operational_report.${format}`;
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
      {/* Enhanced User Analysis Section */}
      {userAnalysisData && (
        <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 backdrop-blur-sm border border-emerald-200/50 rounded-3xl p-8 shadow-2xl mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MdPerson className="text-white text-3xl" />
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-emerald-800 to-green-800 bg-clip-text text-transparent">User Analysis: {userAnalysisData.userName}</h3>
                <p className="text-lg text-emerald-600 font-medium">Fill levels by district analysis</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userAnalysisData.districtAnalysis.map((districtData, index) => (
              <div key={districtData.district} className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-emerald-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-emerald-800">{districtData.district}</h4>
                  <span className="text-sm font-semibold text-emerald-600 bg-emerald-100 px-4 py-2 rounded-full shadow-lg">{districtData.totalBins} bins</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-emerald-700">Avg Fill Level</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{districtData.averageFill}%</span>
                  </div>
                  <div className="w-full bg-emerald-200 rounded-full h-4 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-green-500 h-4 rounded-full transition-all duration-700 shadow-lg"
                      style={{ width: `${districtData.averageFill}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-3 bg-red-50 rounded-xl border border-red-200">
                      <div className="font-bold text-red-600 text-xl">
                        {districtData.bins.filter(bin => bin.currentFill > 80).length}
                      </div>
                      <div className="text-red-700 font-medium">High Fill</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
                      <div className="font-bold text-green-600 text-xl">
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

      {/* Enhanced District Analysis Summary */}
      {getDistrictData().length > 0 && (
        <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/50 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MdLocationOn className="text-white text-3xl" />
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">District Analysis Summary</h3>
                <p className="text-lg text-blue-600 font-medium">
                  Fill levels by district {userAnalysisData?.userName ? `- ${userAnalysisData.userName}` : '(System-wide)'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-xl">
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{getDistrictData().length}</div>
                <div className="text-sm font-semibold text-blue-700">Districts</div>
              </div>
              <div className="text-center p-6 bg-white/90 backdrop-blur-sm rounded-2xl border border-blue-200/50 shadow-xl">
                <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {getDistrictData()[0]?.averageFill || getDistrictData()[0]?.avgFill}%
                </div>
                <div className="text-sm font-semibold text-indigo-700">Highest Fill</div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {getDistrictData().slice(0, 3).map((districtData, index) => (
              <div key={districtData.district} className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-blue-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 transform hover:-translate-y-1">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-blue-800">{districtData.district}</h4>
                  <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-4 py-2 rounded-full shadow-lg">{districtData.totalBins || districtData.binCount} bins</span>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-700">Avg Fill</span>
                    <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{districtData.averageFill || districtData.avgFill}%</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-4 shadow-inner">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-4 rounded-full transition-all duration-700 shadow-lg"
                      style={{ width: `${districtData.averageFill || districtData.avgFill}%` }}
                    ></div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center p-3 bg-red-50 rounded-xl border border-red-200">
                      <div className="font-bold text-red-600 text-xl">
                        {districtData.bins ? districtData.bins.filter(bin => bin.currentFill > 80).length : districtData.highFillBins || 0}
                      </div>
                      <div className="text-red-700 font-medium">High Fill</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-xl border border-green-200">
                      <div className="font-bold text-green-600 text-xl">
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

      {/* Enhanced District Analysis Bar Chart */}
      {getDistrictData().length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                <MdBarChart className="text-white text-3xl" />
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">District Fill Level Bar Chart</h3>
                <p className="text-lg text-purple-600 font-medium">Visual representation of fill levels by district</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm font-medium">
              <div className="flex items-center space-x-2 bg-red-50 px-4 py-3 rounded-xl border border-red-200">
                <div className="w-5 h-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg"></div>
                <span className="text-red-700 font-semibold">High (&gt;80%)</span>
              </div>
              <div className="flex items-center space-x-2 bg-orange-50 px-4 py-3 rounded-xl border border-orange-200">
                <div className="w-5 h-5 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg"></div>
                <span className="text-orange-700 font-semibold">Medium (60-80%)</span>
              </div>
              <div className="flex items-center space-x-2 bg-blue-50 px-4 py-3 rounded-xl border border-blue-200">
                <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full shadow-lg"></div>
                <span className="text-blue-700 font-semibold">Low (40-60%)</span>
              </div>
              <div className="flex items-center space-x-2 bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                <div className="w-5 h-5 bg-gradient-to-r from-green-500 to-green-600 rounded-full shadow-lg"></div>
                <span className="text-green-700 font-semibold">Very Low (&lt;40%)</span>
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
    </div>
  );




  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 relative overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25px 25px, #059669 2px, transparent 0), radial-gradient(circle at 75px 75px, #10b981 2px, transparent 0)`,
          backgroundSize: '100px 100px'
        }}
      ></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-green-200/20 rounded-full blur-xl"></div>
      <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-emerald-200/20 rounded-full blur-xl"></div>

      <div className="relative z-10 p-3 md:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Enhanced Header - Mobile Responsive */}
        <div className="mb-6 md:mb-8 lg:mb-10 w-full">
          <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-800 to-green-800 bg-clip-text text-transparent mb-2 md:mb-3 tracking-tight">
                  Analytics Dashboard
                </h1>
                <p className="text-emerald-600 text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                  Comprehensive insights for waste management operations
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3 lg:gap-4 w-full lg:w-auto">
                <button 
                  type="button"
                  onClick={() => navigate('/admin/bins-analysis')}
                  className="group flex items-center justify-center space-x-2 md:space-x-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-4 md:px-6 lg:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform hover:-translate-y-0.5 text-sm md:text-base"
                >
                  <MdStorage className="text-lg md:text-xl group-hover:animate-pulse" />
                  <span className="hidden sm:inline">View Overview</span>
                  <span className="sm:hidden">Overview</span>
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    fetchAnalyticsData('operational', { 
                      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
                      endDate: new Date().toISOString()
                    });
                    fetchDistrictAnalysis();
                  }}
                  disabled={loading}
                  className="group flex items-center justify-center space-x-2 md:space-x-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 md:px-6 lg:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform hover:-translate-y-0.5 text-sm md:text-base"
                >
                  <MdRefresh className={`text-lg md:text-xl ${loading ? 'animate-spin' : 'group-hover:animate-pulse'}`} />
                  <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh Data'}</span>
                  <span className="sm:hidden">{loading ? '...' : 'Refresh'}</span>
                </button>
                <button 
                  type="button"
                  onClick={() => handleExportReport('PDF')}
                  className="group flex items-center justify-center space-x-2 md:space-x-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 md:px-6 lg:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform hover:-translate-y-0.5 text-sm md:text-base"
                >
                  <MdFileDownload className="text-lg md:text-xl group-hover:animate-pulse" />
                  <span className="hidden sm:inline">Export Report</span>
                  <span className="sm:hidden">Export</span>
                </button>
                <button 
                  type="button" 
                  className="group relative bg-white/90 backdrop-blur-sm border-2 border-emerald-300 p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-emerald-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 transform hover:-translate-y-0.5"
                >
                  <MdSettings className="text-emerald-600 text-lg md:text-xl group-hover:animate-spin" />
                </button>
              </div>
            </div>
          </div>
        </div>
          
        {/* Enhanced Content - Mobile Responsive */}
        {loading && (
          <div className="flex items-center justify-center py-8 md:py-12 lg:py-16">
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
                <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                <div className="text-center sm:text-left">
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-800 to-green-800 bg-clip-text text-transparent">Loading Analytics Data</h3>
                  <p className="text-emerald-600 text-sm md:text-base lg:text-lg">Fetching comprehensive insights...</p>
                </div>
              </div>
              <div className="mt-4 md:mt-6 w-48 md:w-64 h-1.5 md:h-2 bg-emerald-200 rounded-full mx-auto sm:mx-0">
                <div className="w-36 md:w-48 h-1.5 md:h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        )}

        {!loading && analyticsData.operational && (
          <>
            {renderOperationalMetrics()}
          </>
        )}
        
        {!loading && !analyticsData.operational && (
          <div className="flex items-center justify-center py-8 md:py-12 lg:py-16">
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl text-center">
              <div className="text-emerald-500 text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-6">📊</div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-800 to-green-800 bg-clip-text text-transparent mb-3 md:mb-4">No Data Available</h3>
              <p className="text-emerald-600 text-sm md:text-base lg:text-lg">Data will be loaded when you refresh or select a report type</p>
              <div className="mt-4 md:mt-6 w-36 md:w-48 h-1.5 md:h-2 bg-emerald-200 rounded-full mx-auto">
                <div className="w-18 md:w-24 h-1.5 md:h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
              </div>
            </div>
          </div>
        )}


        {/* Enhanced Simulation Mode Indicator - Mobile Responsive */}
        {simulationMode && (
          <div className="bg-gradient-to-r from-emerald-50/80 to-green-50/80 backdrop-blur-sm border border-emerald-300/50 rounded-2xl md:rounded-3xl p-4 md:p-6 mb-6 md:mb-8 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 md:space-x-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg">
                <MdScience className="text-white text-xl md:text-3xl" />
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-800 to-green-800 bg-clip-text text-transparent">What-if Simulation Active</h3>
                <p className="text-sm md:text-base lg:text-lg text-emerald-700 font-medium">You are viewing projected metrics under modified pricing policies.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;
