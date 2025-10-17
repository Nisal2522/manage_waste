import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdArrowBack, 
  MdRefresh, 
  MdDelete, 
  MdLocationOn, 
  MdStorage, 
  MdThermostat, 
  MdWaterDrop,
  MdTrendingUp,
  MdTrendingDown,
  MdWarning,
  MdCheckCircle,
  MdInfo,
  MdLocalShipping,
  MdAttachMoney,
  MdPictureAsPdf
} from 'react-icons/md';
import { getBinsAnalysis } from '../../../utils/api.jsx';

const BinsAnalysis = () => {
  const navigate = useNavigate();
  const [binsData, setBinsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('30d');
  const [reportType, setReportType] = useState('operational');
  const [isExporting, setIsExporting] = useState(false);

  const reportTypes = [
    { id: 'operational', name: 'Operational', icon: <MdLocalShipping />, color: '#3b82f6' },
    { id: 'financial', name: 'Financial', icon: <MdAttachMoney />, color: '#10b981' }
  ];

  useEffect(() => {
    fetchBinsData();
  }, [dateRange]);

  const fetchBinsData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (dateRange === '30d') {
        params.startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
        params.endDate = new Date().toISOString();
      }
      
      const response = await getBinsAnalysis(params);
      if (response.success) {
        setBinsData(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch bins data');
      }
    } catch (err) {
      console.error('Error fetching bins data:', err);
      setError(err.message || 'Failed to fetch bins data');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/admin/analytics');
  };

  const handleExportToPDF = async () => {
    try {
      setIsExporting(true);
      
      // Import jsPDF and html2canvas dynamically
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - (2 * margin);
      
      let currentY = margin;

      // Helper function to convert hex to RGB
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };

      // Helper function to add a new page if needed
      const checkNewPage = (requiredHeight) => {
        if (currentY + requiredHeight > pageHeight - margin) {
          pdf.addPage();
          currentY = margin;
          return true;
        }
        return false;
      };

      // Helper function to draw a line
      const drawLine = (y, color = '#E5E7EB') => {
        const rgb = hexToRgb(color);
        if (rgb) {
          pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
        } else {
          pdf.setDrawColor(229, 231, 235); // Default gray
        }
        pdf.setLineWidth(0.5);
        pdf.line(margin, y, pageWidth - margin, y);
      };

      // Helper function to add text with proper formatting
      const addText = (text, x, y, options = {}) => {
        const { fontSize = 12, fontStyle = 'normal', color = '#000000', align = 'left' } = options;
        pdf.setFontSize(fontSize);
        pdf.setFont(undefined, fontStyle);
        
        // Convert hex color to RGB for setTextColor
        const rgb = hexToRgb(color);
        if (rgb) {
          pdf.setTextColor(rgb.r, rgb.g, rgb.b);
        } else {
          pdf.setTextColor(0, 0, 0); // Default to black
        }
        
        pdf.text(String(text), x, y, { align });
      };

      // Helper function to add a colored box
      const addColoredBox = (x, y, width, height, color, text, textColor = '#FFFFFF') => {
        const rgb = hexToRgb(color);
        if (rgb) {
          pdf.setFillColor(rgb.r, rgb.g, rgb.b);
        }
        pdf.rect(x, y, width, height, 'F');
        addText(String(text), x + width/2, y + height/2 + 2, { 
          fontSize: 10, 
          fontStyle: 'bold', 
          color: textColor, 
          align: 'center' 
        });
      };

      // 1. HEADER SECTION
      pdf.setFillColor(16, 185, 129); // Emerald green
      pdf.rect(0, 0, pageWidth, 35, 'F');
      
      // Company/System Name
      addText('WASTE MANAGEMENT SYSTEM', margin, 15, { 
        fontSize: 18, 
        fontStyle: 'bold', 
        color: '#FFFFFF' 
      });
      
      // Report Title
      addText('BINS ANALYSIS REPORT', margin, 25, { 
        fontSize: 14, 
        fontStyle: 'normal', 
        color: '#FFFFFF' 
      });

      currentY = 45;

      // 2. REPORT METADATA
      addText('Report Information', margin, currentY, { 
        fontSize: 14, 
        fontStyle: 'bold', 
        color: '#059669' 
      });
      currentY += 8;
      
      drawLine(currentY, '#E5E7EB');
      currentY += 5;

      const reportDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      const reportTime = new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });

      addText(`Generated On: ${reportDate} at ${reportTime}`, margin, currentY, { fontSize: 10 });
      currentY += 5;
      addText(`Report Type: ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Analysis`, margin, currentY, { fontSize: 10 });
      currentY += 5;
      addText(`Date Range: ${dateRange === '30d' ? 'Last 30 Days' : 'All Time'}`, margin, currentY, { fontSize: 10 });
      currentY += 5;
      addText(`Total Bins Analyzed: ${binsData?.summary?.totalBins || 'N/A'}`, margin, currentY, { fontSize: 10 });
      
      currentY += 15;

      // 3. EXECUTIVE SUMMARY
      addText('Executive Summary', margin, currentY, { 
        fontSize: 14, 
        fontStyle: 'bold', 
        color: '#059669' 
      });
      currentY += 8;
      
      drawLine(currentY, '#E5E7EB');
      currentY += 10;

      if (binsData?.summary) {
        const summary = binsData.summary;
        
        // Summary metrics in a table format
        const metrics = [
          { label: 'Total Bins', value: summary.totalBins, color: '#10B981' },
          { label: 'Need Collection', value: summary.binsNeedingCollection, color: '#EF4444' },
          { label: 'Average Fill Level', value: `${summary.avgFill.toFixed(1)}%`, color: '#3B82F6' },
          { label: 'Average Capacity', value: `${summary.avgCapacity.toFixed(0)}L`, color: '#8B5CF6' }
        ];

        const boxWidth = (contentWidth - 15) / 4;
        const boxHeight = 25;

        checkNewPage(boxHeight + 10);

        metrics.forEach((metric, index) => {
          const x = margin + (index * (boxWidth + 5));
          addColoredBox(x, currentY, boxWidth, boxHeight, metric.color, metric.value, '#FFFFFF');
          addText(metric.label, x + boxWidth/2, currentY + boxHeight + 5, { 
            fontSize: 8, 
            align: 'center', 
            color: '#6B7280' 
          });
        });

        currentY += boxHeight + 15;
      }

      // 4. DETAILED ANALYSIS
      currentY += 10;
      addText('Detailed Analysis', margin, currentY, { 
        fontSize: 14, 
        fontStyle: 'bold', 
        color: '#059669' 
      });
      currentY += 8;
      
      drawLine(currentY, '#E5E7EB');
      currentY += 10;

      // Fill Level Distribution
      if (binsData?.fillLevelDistribution) {
        checkNewPage(40);
        addText('Fill Level Distribution', margin, currentY, { 
          fontSize: 12, 
          fontStyle: 'bold', 
          color: '#374151' 
        });
        currentY += 8;

        binsData.fillLevelDistribution.forEach((item, index) => {
          checkNewPage(8);
          const percentage = ((item.count / binsData.summary.totalBins) * 100).toFixed(1);
          addText(`${item._id}: ${item.count} bins (${percentage}%)`, margin + 10, currentY, { fontSize: 10 });
          currentY += 6;
        });
        currentY += 10;
      }

      // Bins by Type
      if (binsData?.binsByType) {
        checkNewPage(40);
        addText('Bins by Type', margin, currentY, { 
          fontSize: 12, 
          fontStyle: 'bold', 
          color: '#374151' 
        });
        currentY += 8;

        binsData.binsByType.forEach((item, index) => {
          checkNewPage(12);
          addText(`${item._id}:`, margin + 10, currentY, { fontSize: 10, fontStyle: 'bold' });
          currentY += 5;
          addText(`  • Count: ${item.count} bins`, margin + 15, currentY, { fontSize: 9 });
          currentY += 4;
          addText(`  • Avg Fill: ${item.avgFill.toFixed(1)}%`, margin + 15, currentY, { fontSize: 9 });
          currentY += 4;
          addText(`  • Avg Capacity: ${item.avgCapacity.toFixed(0)}L`, margin + 15, currentY, { fontSize: 9 });
          currentY += 8;
        });
        currentY += 10;
      }

      // District Analysis
      if (binsData?.binsByDistrict) {
        checkNewPage(50);
        addText('District Analysis', margin, currentY, { 
          fontSize: 12, 
          fontStyle: 'bold', 
          color: '#374151' 
        });
        currentY += 8;

        binsData.binsByDistrict.forEach((district, index) => {
          checkNewPage(20);
          addText(`${district._id} District:`, margin + 10, currentY, { fontSize: 10, fontStyle: 'bold' });
          currentY += 5;
          addText(`  • Total Bins: ${district.totalBins}`, margin + 15, currentY, { fontSize: 9 });
          currentY += 4;
          addText(`  • Average Fill: ${district.avgFill.toFixed(1)}%`, margin + 15, currentY, { fontSize: 9 });
          currentY += 4;
          addText(`  • High Fill Bins: ${district.highFillBins}`, margin + 15, currentY, { fontSize: 9 });
          currentY += 4;
          addText(`  • Low Fill Bins: ${district.lowFillBins}`, margin + 15, currentY, { fontSize: 9 });
          currentY += 8;
        });
      }

      // 5. FOOTER
      const totalPages = pdf.internal.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        
        // Footer line
        pdf.setDrawColor('#E5E7EB');
        pdf.setLineWidth(0.5);
        pdf.line(margin, pageHeight - 20, pageWidth - margin, pageHeight - 20);
        
        // Page number
        addText(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 10, { 
          fontSize: 9, 
          align: 'right', 
          color: '#6B7280' 
        });
        
        // Footer text
        addText('Generated by Waste Management System', margin, pageHeight - 10, { 
          fontSize: 9, 
          color: '#6B7280' 
        });
      }

      const fileName = `Bins_Analysis_${reportType.charAt(0).toUpperCase() + reportType.slice(1)}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

      alert('Professional PDF report generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const getFillLevelColor = (fillLevel) => {
    if (fillLevel > 80) return 'text-red-600 bg-red-50';
    if (fillLevel > 60) return 'text-orange-600 bg-orange-50';
    if (fillLevel > 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50';
      case 'inactive': return 'text-gray-600 bg-gray-50';
      case 'maintenance': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 flex items-center justify-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-green-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-emerald-200/20 rounded-full blur-xl"></div>
        
        <div className="text-center relative z-10">
          <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-3xl p-12 shadow-2xl">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-emerald-200 border-t-emerald-600 mx-auto mb-6"></div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-800 to-green-800 bg-clip-text text-transparent mb-2">Loading Bins Analysis</h2>
            <p className="text-emerald-600 text-lg">Fetching comprehensive bin data...</p>
            <div className="mt-6 w-48 h-2 bg-emerald-200 rounded-full mx-auto">
              <div className="w-32 h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 flex items-center justify-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-red-200/20 to-orange-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-pink-200/20 to-red-200/20 rounded-full blur-xl"></div>
        
        <div className="text-center relative z-10">
          <div className="bg-white/80 backdrop-blur-sm border border-red-200/50 rounded-3xl p-12 shadow-2xl">
            <div className="text-red-500 text-8xl mb-6">⚠️</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-red-700 to-orange-700 bg-clip-text text-transparent mb-4">Error Loading Data</h2>
            <p className="text-red-600 text-lg mb-6">{error}</p>
            <button
              onClick={fetchBinsData}
              className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-8 py-4 rounded-2xl hover:from-red-700 hover:to-orange-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform hover:-translate-y-0.5"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!binsData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-gradient-to-br from-gray-200/20 to-slate-200/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-gray-200/20 rounded-full blur-xl"></div>
        
        <div className="text-center relative z-10">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-12 shadow-2xl">
            <div className="text-gray-500 text-8xl mb-6">📊</div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-700 to-slate-700 bg-clip-text text-transparent mb-4">No Data Available</h2>
            <p className="text-gray-600 text-lg">No bins data found in the system.</p>
            <div className="mt-6 w-48 h-2 bg-gray-200 rounded-full mx-auto">
              <div className="w-24 h-2 bg-gradient-to-r from-gray-400 to-slate-400 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10">
        {/* Enhanced Header */}
        <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-3xl p-8 shadow-2xl mx-6 mt-6 mb-8">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center space-x-6">
              <button
                onClick={handleBack}
                className="group flex items-center space-x-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-6 py-3 rounded-2xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform hover:-translate-y-0.5"
              >
                <MdArrowBack className="text-xl group-hover:animate-pulse" />
                <span>Back to Analytics</span>
              </button>
              
              <div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-800 to-green-800 bg-clip-text text-transparent mb-2 tracking-tight">
                  Bins Analysis
                </h1>
                <p className="text-emerald-600 text-xl font-medium">
                  Comprehensive analysis of all bins in the system
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-6 py-3 border-2 border-emerald-200 rounded-2xl bg-white/90 backdrop-blur-sm text-emerald-700 font-semibold focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <option value="30d">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
              
              <button
                onClick={fetchBinsData}
                disabled={loading}
                className="group flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform hover:-translate-y-0.5"
              >
                <MdRefresh className={`text-xl ${loading ? 'animate-spin' : 'group-hover:animate-pulse'}`} />
                <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
              </button>

              <button
                onClick={handleExportToPDF}
                disabled={isExporting || !binsData}
                className="group flex items-center space-x-3 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-2xl hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform hover:-translate-y-0.5"
              >
                <MdPictureAsPdf className={`text-xl ${isExporting ? 'animate-pulse' : 'group-hover:animate-bounce'}`} />
                <span>{isExporting ? 'Generating PDF...' : 'Export PDF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Report Type Selection */}
        <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-3xl shadow-2xl mx-6 mt-8 overflow-hidden">
          <div className="flex">
            {reportTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setReportType(type.id)}
                className={`group flex items-center space-x-3 px-8 py-6 text-lg font-bold transition-all duration-300 border-b-4 relative ${
                  reportType === type.id
                    ? 'text-emerald-800 border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 shadow-lg transform scale-105'
                    : 'text-gray-600 border-transparent hover:text-emerald-700 hover:bg-emerald-50/50 hover:scale-105'
                }`}
              >
                <span className={`transition-all duration-300 ${reportType === type.id ? 'text-emerald-600' : 'text-gray-500 group-hover:text-emerald-500'}`}>
                  {type.icon}
                </span>
                <span>{type.name}</span>
                {reportType === type.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 rounded-t-3xl"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on selected tab */}
        <div id="bins-analysis-content">
        {reportType === 'operational' && (
          <>
            {/* Enhanced Summary Cards */}
            <div className="flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl">
              {/* Total Bins Card */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-green-600 text-sm font-semibold mb-1">Total Bins</h3>
                    <p className="text-4xl font-bold text-green-600">{binsData.summary.totalBins}</p>
                    <p className="text-green-600 text-xs mt-1">Active in system</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-xl">
                    <MdStorage className="text-2xl text-green-600" />
                  </div>
                </div>
                <div className="w-full bg-green-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                </div>
              </div>

              {/* Need Collection Card */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-red-600 text-sm font-semibold mb-1">Need Collection</h3>
                    <p className="text-4xl font-bold text-red-600">{binsData.summary.binsNeedingCollection}</p>
                    <p className="text-red-600 text-xs mt-1">High fill level</p>
                  </div>
                  <div className="bg-red-100 p-3 rounded-xl">
                    <MdWarning className="text-2xl text-red-600" />
                  </div>
                </div>
                <div className="w-full bg-red-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.max((binsData.summary.binsNeedingCollection / binsData.summary.totalBins) * 100, 5)}%` }}></div>
                </div>
              </div>

              {/* Avg Fill Level Card */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-blue-600 text-sm font-semibold mb-1">Avg Fill Level</h3>
                    <p className="text-4xl font-bold text-blue-600">{binsData.summary.avgFill.toFixed(1)}%</p>
                    <p className="text-blue-600 text-xs mt-1">System average</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-xl">
                    <MdTrendingUp className="text-2xl text-blue-600" />
                  </div>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${binsData.summary.avgFill}%` }}></div>
                </div>
              </div>

              {/* Avg Capacity Card */}
              <div className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-purple-600 text-sm font-semibold mb-1">Avg Capacity</h3>
                    <p className="text-4xl font-bold text-purple-600">{binsData.summary.avgCapacity.toFixed(0)}L</p>
                    <p className="text-purple-600 text-xs mt-1">Per bin</p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-xl">
                    <MdStorage className="text-2xl text-purple-600" />
                  </div>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '69%' }}></div>
                </div>
              </div>
              </div>
            </div>

            {/* Enhanced Charts and Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mx-6 mt-8">
              {/* Fill Level Distribution */}
              <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-br from-emerald-500 to-green-500 p-3 rounded-2xl">
                    <MdTrendingUp className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-800 to-green-800 bg-clip-text text-transparent">Fill Level Distribution</h3>
                </div>
                <div className="space-y-4">
                  {binsData.fillLevelDistribution.map((item, index) => (
                    <div key={index} className="group flex items-center justify-between p-5 bg-gradient-to-r from-emerald-50/80 to-green-50/80 rounded-2xl border border-emerald-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="flex items-center space-x-4">
                        <div className={`w-5 h-5 rounded-full shadow-lg ${
                          item._id.includes('Very High') ? 'bg-gradient-to-r from-red-500 to-red-600' :
                          item._id.includes('High') ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                          item._id.includes('Medium') ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                          item._id.includes('Low') ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'
                        }`}></div>
                        <span className="font-semibold text-emerald-800">{item._id}</span>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-32 bg-emerald-200 rounded-full h-4 shadow-inner">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-green-500 h-4 rounded-full transition-all duration-700 shadow-lg"
                            style={{ width: `${(item.count / binsData.summary.totalBins) * 100}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-emerald-800 w-12 text-right text-lg">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bins by Type */}
              <div className="bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-3 rounded-2xl">
                    <MdStorage className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Bins by Type</h3>
                </div>
                <div className="space-y-4">
                  {binsData.binsByType.map((item, index) => (
                    <div key={index} className="group p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-bold text-blue-800 text-lg">{item._id}</h4>
                        <span className="text-blue-600 font-semibold bg-blue-100 px-3 py-1 rounded-full">{item.count} bins</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="bg-white/60 p-3 rounded-xl">
                          <span className="text-blue-600 font-medium">Avg Fill: </span>
                          <span className="font-bold text-blue-800">{item.avgFill.toFixed(1)}%</span>
                        </div>
                        <div className="bg-white/60 p-3 rounded-xl">
                          <span className="text-blue-600 font-medium">Avg Capacity: </span>
                          <span className="font-bold text-blue-800">{item.avgCapacity.toFixed(0)}L</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced District Analysis */}
            <div className="bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-3xl p-8 shadow-2xl mx-6 mt-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-3 rounded-2xl">
                  <MdLocationOn className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">District Analysis</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {binsData.binsByDistrict.map((district, index) => (
                  <div key={index} className="group p-6 bg-gradient-to-br from-purple-50/80 to-pink-50/80 rounded-2xl border border-purple-200/50 hover:shadow-xl transition-all duration-500 hover:scale-105 transform hover:-translate-y-1">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl">
                        <MdLocationOn className="text-white text-lg" />
                      </div>
                      <h4 className="font-bold text-purple-800 text-lg">{district._id}</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl">
                        <span className="text-purple-600 font-medium">Total Bins:</span>
                        <span className="font-bold text-purple-800 text-lg">{district.totalBins}</span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-white/60 p-3 rounded-xl">
                        <span className="text-purple-600 font-medium">Avg Fill:</span>
                        <span className={`font-bold ${getFillLevelColor(district.avgFill)} px-3 py-1 rounded-full`}>
                          {district.avgFill.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-red-50 p-3 rounded-xl border border-red-200">
                          <div className="text-red-600 text-sm font-medium">High Fill</div>
                          <div className="font-bold text-red-800 text-lg">{district.highFillBins}</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-xl border border-green-200">
                          <div className="text-green-600 text-sm font-medium">Low Fill</div>
                          <div className="font-bold text-green-800 text-lg">{district.lowFillBins}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Recent Bins */}
            <div className="bg-white/80 backdrop-blur-sm border border-indigo-200/50 rounded-3xl p-8 shadow-2xl mx-6 mt-8 mb-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-2xl">
                  <MdStorage className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-800 to-purple-800 bg-clip-text text-transparent">Recent Bins (Last 30 Days)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-indigo-200">
                      <th className="text-left py-4 px-6 text-indigo-700 font-bold text-lg">Bin ID</th>
                      <th className="text-left py-4 px-6 text-indigo-700 font-bold text-lg">Type</th>
                      <th className="text-left py-4 px-6 text-indigo-700 font-bold text-lg">Fill Level</th>
                      <th className="text-left py-4 px-6 text-indigo-700 font-bold text-lg">Capacity</th>
                      <th className="text-left py-4 px-6 text-indigo-700 font-bold text-lg">Status</th>
                      <th className="text-left py-4 px-6 text-indigo-700 font-bold text-lg">Address</th>
                      <th className="text-left py-4 px-6 text-indigo-700 font-bold text-lg">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {binsData.recentBins.map((bin, index) => (
                      <tr key={index} className="border-b border-indigo-100 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300 group">
                        <td className="py-4 px-6 font-bold text-indigo-800 group-hover:text-indigo-900">{bin.binId}</td>
                        <td className="py-4 px-6 text-indigo-700 group-hover:text-indigo-800">{bin.binType}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-indigo-200 rounded-full h-4 shadow-inner">
                              <div
                                className={`h-4 rounded-full transition-all duration-700 shadow-lg ${
                                  bin.currentFill > 80 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                  bin.currentFill > 60 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                  bin.currentFill > 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                  'bg-gradient-to-r from-green-500 to-green-600'
                                }`}
                                style={{ width: `${bin.currentFill}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm font-bold ${getFillLevelColor(bin.currentFill)} px-3 py-1 rounded-full`}>
                              {bin.currentFill}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-indigo-700 group-hover:text-indigo-800 font-semibold">{bin.capacity}L</td>
                        <td className="py-4 px-6">
                          <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusColor(bin.status)} shadow-lg`}>
                            {bin.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-indigo-700 max-w-xs truncate group-hover:text-indigo-800">{bin.address}</td>
                        <td className="py-4 px-6 text-indigo-700 group-hover:text-indigo-800 font-semibold">
                          {new Date(bin.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {reportType === 'financial' && (
          <div className="mx-6 mt-8">
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-emerald-500 to-green-500 p-3 rounded-2xl">
                  <MdAttachMoney className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-emerald-800 to-green-800 bg-clip-text text-transparent">Financial Analysis</h3>
              </div>
              <div className="text-center py-16">
                <div className="text-8xl mb-6">💰</div>
                <h4 className="text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent mb-4">Financial Data Coming Soon</h4>
                <p className="text-emerald-600 text-xl">Financial analytics for bins will be available in a future update.</p>
                <div className="mt-8 w-32 h-2 bg-emerald-200 rounded-full mx-auto">
                  <div className="w-24 h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default BinsAnalysis;
