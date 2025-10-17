import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MdArrowBack, 
  MdRefresh, 
  MdLocationOn, 
  MdStorage, 
  MdTrendingUp,
  MdWarning,
  MdLocalShipping,
  MdAttachMoney,
  MdPictureAsPdf
} from 'react-icons/md';
import { getBinsAnalysis } from '../../../utils/api.jsx';

// Constants
const DATE_RANGES = {
  LAST_30_DAYS: '30d',
  ALL_TIME: 'all'
};

const REPORT_TYPES = {
  OPERATIONAL: 'operational',
  FINANCIAL: 'financial'
};

const FILL_LEVEL_THRESHOLDS = {
  HIGH: 80,
  MEDIUM: 60,
  LOW: 40
};

const PDF_CONFIG = {
  MARGIN: 20,
  HEADER_HEIGHT: 40,
  FOOTER_HEIGHT: 25,
  BOX_HEIGHT: 25,
  CHART_HEIGHT: 60,
  FONT_SIZES: {
    TITLE: 24,
    LARGE: 18,
    MEDIUM: 14,
    SMALL: 12,
    TINY: 11,
    MICRO: 9,
    NANO: 10
  },
  COLORS: {
    PRIMARY: '#059669',
    SECONDARY: '#10B981',
    SUCCESS: '#10B981',
    WARNING: '#EF4444',
    INFO: '#3B82F6',
    PURPLE: '#8B5CF6',
    GRAY: '#6B7280',
    LIGHT_GRAY: '#E5E7EB',
    DARK_GRAY: '#374151',
    WHITE: '#FFFFFF',
    BLACK: '#000000'
  },
  BRANDING: {
    COMPANY_NAME: 'WASTE MANAGEMENT SYSTEM',
    REPORT_TITLE: 'COMPREHENSIVE BINS ANALYSIS REPORT',
    TAGLINE: 'Smart Waste Management Solutions'
  }
};

const REPORT_TYPE_CONFIG = [
  { 
    id: REPORT_TYPES.OPERATIONAL, 
    name: 'Operational', 
    icon: <MdLocalShipping />, 
    color: PDF_CONFIG.COLORS.INFO 
  },
  { 
    id: REPORT_TYPES.FINANCIAL, 
    name: 'Financial', 
    icon: <MdAttachMoney />, 
    color: PDF_CONFIG.COLORS.SUCCESS 
  }
];

// Utility Functions
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const calculatePercentage = (value, total) => {
  return total > 0 ? ((value / total) * 100).toFixed(1) : '0.0';
};

const getFillLevelColor = (fillLevel) => {
  if (fillLevel > FILL_LEVEL_THRESHOLDS.HIGH) return 'text-red-600 bg-red-50';
  if (fillLevel > FILL_LEVEL_THRESHOLDS.MEDIUM) return 'text-orange-600 bg-orange-50';
  if (fillLevel > FILL_LEVEL_THRESHOLDS.LOW) return 'text-yellow-600 bg-yellow-50';
  return 'text-green-600 bg-green-50';
};

const getStatusColor = (status) => {
  const statusColors = {
    active: 'text-green-600 bg-green-50',
    inactive: 'text-gray-600 bg-gray-50',
    maintenance: 'text-orange-600 bg-orange-50'
  };
  return statusColors[status] || 'text-gray-600 bg-gray-50';
};

const getDateRangeParams = (dateRange) => {
  if (dateRange === DATE_RANGES.LAST_30_DAYS) {
    return {
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString()
    };
  }
  return {};
};

const BinsAnalysis = () => {
  const navigate = useNavigate();
  const [binsData, setBinsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState(DATE_RANGES.LAST_30_DAYS);
  const [reportType, setReportType] = useState(REPORT_TYPES.OPERATIONAL);
  const [isExporting, setIsExporting] = useState(false);

  // PDF Generation Utilities
  // Helper function to convert hex to RGB (moved to component scope)
  const hexToRgb = useCallback((hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }, []);

  const generatePDF = useCallback(async (binsData, reportType, dateRange) => {
    const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
      import('jspdf'),
      import('html2canvas')
    ]);

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = PDF_CONFIG.MARGIN;
    const contentWidth = pageWidth - (2 * margin);
    
    let currentY = margin;

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
    const drawLine = (y, color = PDF_CONFIG.COLORS.LIGHT_GRAY) => {
      const rgb = hexToRgb(color);
      if (rgb) {
        pdf.setDrawColor(rgb.r, rgb.g, rgb.b);
      } else {
        pdf.setDrawColor(229, 231, 235);
      }
      pdf.setLineWidth(0.5);
      pdf.line(margin, y, pageWidth - margin, y);
    };

    // Helper function to add text with proper formatting
    const addText = (text, x, y, options = {}) => {
      const { fontSize = PDF_CONFIG.FONT_SIZES.SMALL, fontStyle = 'normal', color = '#000000', align = 'left' } = options;
      pdf.setFontSize(fontSize);
      pdf.setFont(undefined, fontStyle);
      
      const rgb = hexToRgb(color);
      if (rgb) {
        pdf.setTextColor(rgb.r, rgb.g, rgb.b);
      } else {
        pdf.setTextColor(0, 0, 0);
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
        fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
        fontStyle: 'bold', 
        color: textColor, 
        align: 'center' 
      });
    };

    // Generate PDF content
    generatePDFContent(pdf, binsData, reportType, dateRange, {
      pageWidth, pageHeight, margin, contentWidth, currentY,
      checkNewPage, drawLine, addText, addColoredBox, hexToRgb
    });

    return pdf;
  }, [hexToRgb]);

  const generatePDFContent = (pdf, binsData, reportType, dateRange, helpers) => {
    const { pageWidth, pageHeight, margin, contentWidth, checkNewPage, drawLine, addText, addColoredBox, hexToRgb } = helpers;
    let y = margin;

    // Ensure binsData has default structure if missing
    const safeBinsData = binsData || {
      summary: { totalBins: 0, binsNeedingCollection: 0, avgFill: 0, avgCapacity: 0 },
      fillLevelDistribution: [],
      binsByType: [],
      binsByDistrict: [],
      recentBins: []
    };

    // Helper function to add professional section header
    const addSectionHeader = (title, yPos) => {
      checkNewPage(25);
      
      // Add section background
      pdf.setFillColor(245, 247, 250);
      pdf.rect(margin - 5, yPos - 5, contentWidth + 10, 20, 'F');
      
      addText(title, margin, yPos + 8, { 
        fontSize: PDF_CONFIG.FONT_SIZES.MEDIUM, 
        fontStyle: 'bold', 
        color: PDF_CONFIG.COLORS.PRIMARY 
      });
      
      // Add decorative line
      pdf.setDrawColor(16, 185, 129);
      pdf.setLineWidth(2);
      pdf.line(margin, yPos + 12, margin + 50, yPos + 12);
      
      yPos += 20;
      return yPos;
    };

    // Helper function to add professional subsection
    const addSubsection = (title, yPos) => {
      checkNewPage(18);
      addText(title, margin + 10, yPos, { 
        fontSize: PDF_CONFIG.FONT_SIZES.SMALL, 
        fontStyle: 'bold', 
        color: PDF_CONFIG.COLORS.DARK_GRAY 
      });
      
      // Add subtle underline
      pdf.setDrawColor(209, 213, 219);
      pdf.setLineWidth(0.5);
      pdf.line(margin + 10, yPos + 2, margin + 10 + (title.length * 3), yPos + 2);
      
      yPos += 10;
      return yPos;
    };

    // Helper function to add professional table with improved clarity
    const addTable = (headers, rows, startY, tableWidth = contentWidth) => {
      const rowHeight = 10; // Increased row height for better readability
      const colWidth = tableWidth / headers.length;
      
      // Table header with better styling
      pdf.setFillColor(16, 185, 129);
      pdf.rect(margin, startY, tableWidth, rowHeight, 'F');
      
      // Add border to table
      pdf.setDrawColor(209, 213, 219);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, startY, tableWidth, rowHeight + (rows.length * rowHeight), 'S');
      
      headers.forEach((header, index) => {
        addText(header, margin + (index * colWidth) + 3, startY + 6, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          fontStyle: 'bold', 
          color: PDF_CONFIG.COLORS.WHITE 
        });
      });
      
      let currentY = startY + rowHeight;
      
      rows.forEach((row, rowIndex) => {
        // Alternate row colors for better readability
        if (rowIndex % 2 === 0) {
          pdf.setFillColor(249, 250, 251);
          pdf.rect(margin, currentY, tableWidth, rowHeight, 'F');
        } else {
          pdf.setFillColor(255, 255, 255);
          pdf.rect(margin, currentY, tableWidth, rowHeight, 'F');
        }
        
        // Add row borders
        pdf.setDrawColor(229, 231, 235);
        pdf.setLineWidth(0.3);
        pdf.line(margin, currentY, margin + tableWidth, currentY);
        
        row.forEach((cell, colIndex) => {
          addText(cell, margin + (colIndex * colWidth) + 3, currentY + 6, { 
            fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
            color: PDF_CONFIG.COLORS.DARK_GRAY 
          });
        });
        
        currentY += rowHeight;
      });
      
      return currentY + 15; // Increased spacing after table
    };

    // Professional Header Section
    pdf.setFillColor(16, 185, 129);
    pdf.rect(0, 0, pageWidth, PDF_CONFIG.HEADER_HEIGHT, 'F');
    
    // Company logo area (placeholder)
    pdf.setFillColor(255, 255, 255);
    pdf.rect(margin, 8, 24, 24, 'F');
    addText('WMS', margin + 8, 20, { 
      fontSize: PDF_CONFIG.FONT_SIZES.SMALL, 
      fontStyle: 'bold', 
      color: PDF_CONFIG.COLORS.PRIMARY 
    });
    
    addText(PDF_CONFIG.BRANDING.COMPANY_NAME, margin + 30, 15, { 
      fontSize: PDF_CONFIG.FONT_SIZES.LARGE, 
      fontStyle: 'bold', 
      color: PDF_CONFIG.COLORS.WHITE 
    });
    
    addText(PDF_CONFIG.BRANDING.REPORT_TITLE, margin + 30, 25, { 
      fontSize: PDF_CONFIG.FONT_SIZES.MEDIUM, 
      fontStyle: 'normal', 
      color: PDF_CONFIG.COLORS.WHITE 
    });
    
    addText(PDF_CONFIG.BRANDING.TAGLINE, margin + 30, 32, { 
      fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
      fontStyle: 'italic', 
      color: PDF_CONFIG.COLORS.WHITE 
    });

    y = 50;

    // Professional Report Metadata
    y = addSectionHeader('Report Information', y);

    const reportDate = formatDate(new Date());
    const reportTime = formatTime(new Date());

    // Create metadata table
    const metadataRows = [
      [`Generated On:`, `${reportDate} at ${reportTime}`],
      [`Report Type:`, `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Analysis`],
      [`Date Range:`, `${dateRange === DATE_RANGES.LAST_30_DAYS ? 'Last 30 Days' : 'All Time'}`],
      [`Total Bins Analyzed:`, `${safeBinsData?.summary?.totalBins || 'N/A'}`],
      [`Report ID:`, `WMS-${reportType.toUpperCase()}-${new Date().toISOString().split('T')[0]}`],
      [`Generated By:`, `Waste Management System`]
    ];

    y = addTable(['Field', 'Value'], metadataRows, y, contentWidth * 0.8);
    y += 10;

    // Professional Executive Summary
    y = addSectionHeader('Executive Summary', y);

    if (safeBinsData?.summary) {
      const summary = binsData.summary;
      
      // Add summary description
      addText('This report provides a comprehensive analysis of the waste management system\'s bin infrastructure,', margin, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
        color: PDF_CONFIG.COLORS.DARK_GRAY 
      });
      y += 5;
      addText('including performance metrics, distribution analysis, and operational insights.', margin, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
        color: PDF_CONFIG.COLORS.DARK_GRAY 
      });
      y += 15;

      // Professional KPI Cards
      const metrics = [
        { 
          label: 'Total Bins', 
          value: summary.totalBins, 
          color: PDF_CONFIG.COLORS.SUCCESS,
          icon: '📊',
          description: 'Active bins in system'
        },
        { 
          label: 'Need Collection', 
          value: summary.binsNeedingCollection, 
          color: PDF_CONFIG.COLORS.WARNING,
          icon: '⚠️',
          description: 'High fill level bins'
        },
        { 
          label: 'Avg Fill Level', 
          value: `${summary.avgFill.toFixed(1)}%`, 
          color: PDF_CONFIG.COLORS.INFO,
          icon: '📈',
          description: 'System average'
        },
        { 
          label: 'Avg Capacity', 
          value: `${summary.avgCapacity.toFixed(0)}L`, 
          color: PDF_CONFIG.COLORS.PURPLE,
          icon: '🗑️',
          description: 'Per bin capacity'
        }
      ];

      const boxWidth = (contentWidth - 15) / 4;
      const boxHeight = 35;

      checkNewPage(boxHeight + 15);

      metrics.forEach((metric, index) => {
        const x = margin + (index * (boxWidth + 5));
        
        // Card background with shadow effect
        pdf.setFillColor(255, 255, 255);
        pdf.rect(x, y, boxWidth, boxHeight, 'F');
        pdf.setDrawColor(229, 231, 235);
        pdf.setLineWidth(1);
        pdf.rect(x, y, boxWidth, boxHeight, 'S');
        
        // Colored header
        const rgb = hexToRgb(metric.color);
        if (rgb) {
          pdf.setFillColor(rgb.r, rgb.g, rgb.b);
        }
        pdf.rect(x, y, boxWidth, 12, 'F');
        
        // Icon and title
        addText(metric.icon, x + 3, y + 8, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          color: PDF_CONFIG.COLORS.WHITE 
        });
        addText(metric.label, x + 12, y + 8, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          fontStyle: 'bold', 
          color: PDF_CONFIG.COLORS.WHITE 
        });
        
        // Value
        addText(metric.value, x + boxWidth/2, y + 22, { 
          fontSize: PDF_CONFIG.FONT_SIZES.MEDIUM, 
          fontStyle: 'bold', 
          color: metric.color,
          align: 'center'
        });
        
        // Description
        addText(metric.description, x + boxWidth/2, y + 30, { 
          fontSize: PDF_CONFIG.FONT_SIZES.MICRO, 
          color: PDF_CONFIG.COLORS.GRAY,
          align: 'center'
        });
      });

      y += boxHeight + 20;
    }

    // Detailed Analysis Section
    y = addSectionHeader('Detailed Analysis', y);

    // Fill Level Distribution with Professional Chart
    if (safeBinsData?.fillLevelDistribution) {
      y = addSubsection('Fill Level Distribution', y);

      // Create distribution table
      const distributionRows = binsData.fillLevelDistribution.map(item => {
        const percentage = calculatePercentage(item.count, safeBinsData.summary.totalBins);
        return [item._id, `${item.count} bins`, `${percentage}%`];
      });

      y = addTable(['Fill Level Category', 'Count', 'Percentage'], distributionRows, y);
      y += 10;
    }

    // Bins by Type with Professional Table
    if (safeBinsData?.binsByType) {
      y = addSubsection('Bins by Type Analysis', y);

      const typeRows = binsData.binsByType.map(item => [
        item._id,
        `${item.count} bins`,
        `${item.avgFill.toFixed(1)}%`,
        `${item.avgCapacity.toFixed(0)}L`
      ]);

      y = addTable(['Bin Type', 'Count', 'Avg Fill Level', 'Avg Capacity'], typeRows, y);
      y += 10;
    }

    // District Analysis with Professional Summary and Table
    if (safeBinsData?.binsByDistrict) {
      y = addSubsection('District Performance Analysis', y);

      // Add district summary insights
      const totalDistricts = binsData.binsByDistrict.length;
      const totalBinsAcrossDistricts = binsData.binsByDistrict.reduce((sum, district) => sum + district.totalBins, 0);
      const avgFillAcrossDistricts = binsData.binsByDistrict.reduce((sum, district) => sum + district.avgFill, 0) / totalDistricts;
      
      addText(`Analysis covers ${totalDistricts} districts with ${totalBinsAcrossDistricts} total bins.`, margin, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
        color: PDF_CONFIG.COLORS.DARK_GRAY 
      });
      y += 5;
      addText(`System-wide average fill level: ${avgFillAcrossDistricts.toFixed(1)}%`, margin, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
        color: PDF_CONFIG.COLORS.DARK_GRAY 
      });
      y += 10;

      // Find best and worst performing districts
      const bestDistrict = binsData.binsByDistrict.reduce((best, district) => 
        district.avgFill > best.avgFill ? district : best
      );
      const worstDistrict = binsData.binsByDistrict.reduce((worst, district) => 
        district.avgFill < worst.avgFill ? district : worst
      );

      // Add performance highlights
      addText('Performance Highlights:', margin, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
        fontStyle: 'bold',
        color: PDF_CONFIG.COLORS.PRIMARY
      });
      y += 5;
      addText(`• Best Performing: ${bestDistrict._id} District (${bestDistrict.avgFill.toFixed(1)}% fill level)`, margin + 10, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
        color: PDF_CONFIG.COLORS.SUCCESS
      });
      y += 4;
      addText(`• Needs Attention: ${worstDistrict._id} District (${worstDistrict.avgFill.toFixed(1)}% fill level)`, margin + 10, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
        color: PDF_CONFIG.COLORS.WARNING
      });
      y += 10;

      const districtRows = binsData.binsByDistrict.map(district => [
        `${district._id} District`,
        `${district.totalBins} bins`,
        `${district.avgFill.toFixed(1)}%`,
        `${district.highFillBins}`,
        `${district.lowFillBins}`
      ]);

      y = addTable(['District', 'Total Bins', 'Avg Fill Level', 'High Fill', 'Low Fill'], districtRows, y);
      y += 10;
    }

    // Recent Bins Summary with Professional Table
    if (safeBinsData?.recentBins && binsData.recentBins.length > 0) {
      y = addSubsection('Recent Bins Activity (Last 30 Days)', y);

      // Show first 8 recent bins in table format
      const recentBinsToShow = binsData.recentBins.slice(0, 8);
      
      const recentBinsRows = recentBinsToShow.map(bin => [
        bin.binId,
        bin.binType,
        `${bin.currentFill}%`,
        `${bin.capacity}L`,
        bin.status,
        formatDate(bin.createdAt)
      ]);

      y = addTable(['Bin ID', 'Type', 'Fill Level', 'Capacity', 'Status', 'Created'], recentBinsRows, y);

      if (binsData.recentBins.length > 8) {
        addText(`Note: Showing 8 of ${binsData.recentBins.length} recent bins`, margin, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          fontStyle: 'italic',
          color: PDF_CONFIG.COLORS.GRAY
        });
        y += 8;
      }
      y += 10;
    }

    // Comprehensive System Summary Section
    y = addSectionHeader('Comprehensive System Summary', y);

    // Overall System Performance
    if (safeBinsData?.summary) {
      const summary = binsData.summary;
      
      addText('System Performance Overview:', margin, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.SMALL, 
        fontStyle: 'bold',
        color: PDF_CONFIG.COLORS.PRIMARY
      });
      y += 8;

      const systemMetrics = [
        [`Total Active Bins:`, `${summary.totalBins} bins`],
        [`Bins Requiring Collection:`, `${summary.binsNeedingCollection} bins`],
        [`Collection Efficiency:`, `${((summary.totalBins - summary.binsNeedingCollection) / summary.totalBins * 100).toFixed(1)}%`],
        [`Average Fill Level:`, `${summary.avgFill.toFixed(1)}%`],
        [`Average Bin Capacity:`, `${summary.avgCapacity.toFixed(0)}L`],
        [`System Utilization:`, `${(summary.avgFill / 100 * summary.avgCapacity).toFixed(1)}L average waste per bin`]
      ];

      y = addTable(['Metric', 'Value'], systemMetrics, y, contentWidth * 0.7);
      y += 10;
    }

    // Fill Level Distribution Summary
    if (safeBinsData?.fillLevelDistribution) {
      addText('Fill Level Distribution Summary:', margin, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.SMALL, 
        fontStyle: 'bold',
        color: PDF_CONFIG.COLORS.PRIMARY
      });
      y += 8;

      const distributionSummary = binsData.fillLevelDistribution.map(item => {
        const percentage = calculatePercentage(item.count, safeBinsData.summary.totalBins);
        return [`${item._id}:`, `${item.count} bins (${percentage}%)`];
      });

      y = addTable(['Fill Level Category', 'Distribution'], distributionSummary, y, contentWidth * 0.7);
      y += 10;
    }

    // Bin Types Summary
    if (safeBinsData?.binsByType) {
      addText('Bin Types Performance Summary:', margin, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.SMALL, 
        fontStyle: 'bold',
        color: PDF_CONFIG.COLORS.PRIMARY
      });
      y += 8;

      const typeSummary = binsData.binsByType.map(item => [
        `${item._id}:`,
        `${item.count} bins`,
        `${item.avgFill.toFixed(1)}% fill`,
        `${item.avgCapacity.toFixed(0)}L capacity`
      ]);

      y = addTable(['Bin Type', 'Count', 'Avg Fill', 'Capacity'], typeSummary, y);
      y += 10;
    }

    // District Performance Summary
    if (safeBinsData?.binsByDistrict) {
      addText('District Performance Summary:', margin, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.SMALL, 
        fontStyle: 'bold',
        color: PDF_CONFIG.COLORS.PRIMARY
      });
      y += 8;

      const districtSummary = binsData.binsByDistrict.map(district => [
        `${district._id}:`,
        `${district.totalBins} bins`,
        `${district.avgFill.toFixed(1)}% fill`,
        `${district.highFillBins} high`,
        `${district.lowFillBins} low`
      ]);

      y = addTable(['District', 'Total Bins', 'Avg Fill', 'High Fill', 'Low Fill'], districtSummary, y);
      y += 10;
    }

    // Recent Activity Summary
    if (safeBinsData?.recentBins && binsData.recentBins.length > 0) {
      addText('Recent Activity Summary (Last 30 Days):', margin, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.SMALL, 
        fontStyle: 'bold',
        color: PDF_CONFIG.COLORS.PRIMARY
      });
      y += 8;

      const recentActivitySummary = [
        [`Total Recent Bins:`, `${binsData.recentBins.length} bins`],
        [`Average Fill Level:`, `${(binsData.recentBins.reduce((sum, bin) => sum + bin.currentFill, 0) / binsData.recentBins.length).toFixed(1)}%`],
        [`Average Capacity:`, `${(binsData.recentBins.reduce((sum, bin) => sum + bin.capacity, 0) / binsData.recentBins.length).toFixed(0)}L`],
        [`Active Status:`, `${binsData.recentBins.filter(bin => bin.status === 'active').length} bins`],
        [`Maintenance Required:`, `${binsData.recentBins.filter(bin => bin.status === 'maintenance').length} bins`]
      ];

      y = addTable(['Activity Metric', 'Value'], recentActivitySummary, y, contentWidth * 0.7);
      y += 10;
    }

    // Visual Analysis Section - Fill Level Distribution Chart
    if (safeBinsData?.fillLevelDistribution) {
      y = addSectionHeader('Visual Analysis - Fill Level Distribution', y);

      addText('Detailed breakdown of bins by fill level categories with visual representation:', margin, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
        color: PDF_CONFIG.COLORS.DARK_GRAY 
      });
      y += 8;

      binsData.fillLevelDistribution.forEach((item, index) => {
        checkNewPage(12);
        const percentage = calculatePercentage(item.count, safeBinsData.summary.totalBins);
        
        // Add visual bar representation
        const barWidth = (percentage / 100) * 100; // Scale to 100mm max width
        const barHeight = 6;
        
        // Bar background
        pdf.setFillColor(229, 231, 235);
        pdf.rect(margin + 10, y, 100, barHeight, 'F');
        
        // Colored bar based on fill level
        let barColor = [16, 185, 129]; // Default green
        if (item._id.includes('Very High')) barColor = [239, 68, 68]; // Red
        else if (item._id.includes('High')) barColor = [245, 158, 11]; // Orange
        else if (item._id.includes('Medium')) barColor = [234, 179, 8]; // Yellow
        else if (item._id.includes('Low')) barColor = [34, 197, 94]; // Green
        
        pdf.setFillColor(barColor[0], barColor[1], barColor[2]);
        pdf.rect(margin + 10, y, barWidth, barHeight, 'F');
        
        // Category label and stats
        addText(`${item._id}:`, margin + 10, y + 8, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          fontStyle: 'bold',
          color: PDF_CONFIG.COLORS.DARK_GRAY
        });
        
        addText(`${item.count} bins (${percentage}%)`, margin + 120, y + 8, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          color: PDF_CONFIG.COLORS.DARK_GRAY
        });
        
        y += 15;
      });
      y += 10;
    }

    // Visual Analysis Section - Bins by Type Chart
    if (safeBinsData?.binsByType) {
      y = addSectionHeader('Visual Analysis - Bins by Type Performance', y);

      addText('Performance metrics for each bin type with capacity and fill level analysis:', margin, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
        color: PDF_CONFIG.COLORS.DARK_GRAY 
      });
      y += 8;

      binsData.binsByType.forEach((item, index) => {
        checkNewPage(20);
        
        // Type header
        addText(`${item._id} Type Analysis:`, margin + 10, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          fontStyle: 'bold',
          color: PDF_CONFIG.COLORS.PRIMARY
        });
        y += 6;
        
        // Performance metrics
        addText(`  • Total Count: ${item.count} bins`, margin + 15, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          color: PDF_CONFIG.COLORS.DARK_GRAY
        });
        y += 4;
        addText(`  • Average Fill Level: ${item.avgFill.toFixed(1)}%`, margin + 15, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          color: PDF_CONFIG.COLORS.DARK_GRAY
        });
        y += 4;
        addText(`  • Average Capacity: ${item.avgCapacity.toFixed(0)}L`, margin + 15, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          color: PDF_CONFIG.COLORS.DARK_GRAY
        });
        y += 4;
        addText(`  • Utilization Rate: ${(item.avgFill / 100 * item.avgCapacity).toFixed(1)}L average waste`, margin + 15, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          color: PDF_CONFIG.COLORS.DARK_GRAY
        });
        y += 8;
      });
      y += 10;
    }

    // Visual Analysis Section - District Performance Chart
    if (safeBinsData?.binsByDistrict) {
      y = addSectionHeader('Visual Analysis - District Performance Overview', y);

      addText('Comprehensive district analysis with performance indicators:', margin, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
        color: PDF_CONFIG.COLORS.DARK_GRAY 
      });
      y += 8;

      binsData.binsByDistrict.forEach((district, index) => {
        checkNewPage(25);
        
        // District header with performance indicator
        const performanceColor = district.avgFill > 70 ? PDF_CONFIG.COLORS.WARNING : 
                                district.avgFill < 30 ? PDF_CONFIG.COLORS.SUCCESS : PDF_CONFIG.COLORS.INFO;
        
        addText(`${district._id} District Performance:`, margin + 10, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          fontStyle: 'bold',
          color: PDF_CONFIG.COLORS.PRIMARY
        });
        y += 6;
        
        // District metrics
        addText(`  • Total Bins: ${district.totalBins} bins`, margin + 15, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          color: PDF_CONFIG.COLORS.DARK_GRAY
        });
        y += 4;
        addText(`  • Average Fill Level: ${district.avgFill.toFixed(1)}%`, margin + 15, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          color: performanceColor
        });
        y += 4;
        addText(`  • High Fill Bins: ${district.highFillBins} (${calculatePercentage(district.highFillBins, district.totalBins)}%)`, margin + 15, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          color: PDF_CONFIG.COLORS.WARNING
        });
        y += 4;
        addText(`  • Low Fill Bins: ${district.lowFillBins} (${calculatePercentage(district.lowFillBins, district.totalBins)}%)`, margin + 15, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          color: PDF_CONFIG.COLORS.SUCCESS
        });
        y += 4;
        addText(`  • Efficiency Rating: ${district.avgFill > 70 ? 'High Activity' : district.avgFill < 30 ? 'Low Activity' : 'Moderate Activity'}`, margin + 15, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          color: PDF_CONFIG.COLORS.DARK_GRAY
        });
        y += 8;
      });
      y += 10;
    }

    // Visual Analysis Section - Recent Bins Activity
    if (safeBinsData?.recentBins && binsData.recentBins.length > 0) {
      y = addSectionHeader('Visual Analysis - Recent Bins Activity (Last 30 Days)', y);

      addText('Detailed analysis of recently added bins with performance indicators:', margin, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
        color: PDF_CONFIG.COLORS.DARK_GRAY 
      });
      y += 8;

      // Show first 10 recent bins with detailed analysis
      const recentBinsToShow = binsData.recentBins.slice(0, 10);
      
      recentBinsToShow.forEach((bin, index) => {
        checkNewPage(18);
        
        // Bin header
        addText(`${bin.binId} - ${bin.binType}:`, margin + 10, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          fontStyle: 'bold',
          color: PDF_CONFIG.COLORS.PRIMARY
        });
        y += 5;
        
        // Bin details
        addText(`  • Fill Level: ${bin.currentFill}%`, margin + 15, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          color: bin.currentFill > 80 ? PDF_CONFIG.COLORS.WARNING : PDF_CONFIG.COLORS.DARK_GRAY
        });
        y += 4;
        addText(`  • Capacity: ${bin.capacity}L`, margin + 15, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          color: PDF_CONFIG.COLORS.DARK_GRAY
        });
        y += 4;
        addText(`  • Status: ${bin.status}`, margin + 15, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          color: bin.status === 'active' ? PDF_CONFIG.COLORS.SUCCESS : PDF_CONFIG.COLORS.WARNING
        });
        y += 4;
        addText(`  • Address: ${bin.address}`, margin + 15, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          color: PDF_CONFIG.COLORS.DARK_GRAY
        });
        y += 4;
        addText(`  • Created: ${formatDate(bin.createdAt)}`, margin + 15, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          color: PDF_CONFIG.COLORS.DARK_GRAY
        });
        y += 6;
      });

      if (binsData.recentBins.length > 10) {
        addText(`Note: Showing 10 of ${binsData.recentBins.length} recent bins for detailed analysis`, margin, y, { 
          fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
          fontStyle: 'italic',
          color: PDF_CONFIG.COLORS.GRAY
        });
        y += 8;
      }
      y += 10;
    }

    // Professional Key Insights Section
    y = addSectionHeader('Strategic Insights & Recommendations', y);

    const insights = generateInsights(binsData);
    
    // Add insights in professional format
    addText('Based on the comprehensive analysis of the waste management system, the following insights', margin, y, { 
      fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
      color: PDF_CONFIG.COLORS.DARK_GRAY 
    });
    y += 5;
    addText('and recommendations have been identified to optimize operational efficiency:', margin, y, { 
      fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
      color: PDF_CONFIG.COLORS.DARK_GRAY 
    });
    y += 10;

    insights.forEach((insight, index) => {
      checkNewPage(10);
      
      // Add insight with professional bullet point
      pdf.setFillColor(16, 185, 129);
      pdf.circle(margin + 5, y + 2, 1.5, 'F');
      
      addText(insight, margin + 12, y, { 
        fontSize: PDF_CONFIG.FONT_SIZES.TINY,
        color: PDF_CONFIG.COLORS.DARK_GRAY
      });
      y += 7;
    });

    y += 15;

    // Complete Data Summary Section
    y = addSectionHeader('Complete Data Summary', y);

    // Add comprehensive data overview
    addText('This section provides a complete overview of all data points analyzed in this report:', margin, y, { 
      fontSize: PDF_CONFIG.FONT_SIZES.TINY, 
      color: PDF_CONFIG.COLORS.DARK_GRAY 
    });
    y += 8;

    // Data completeness summary
    const dataCompleteness = [
      [`Summary Data:`, safeBinsData?.summary ? 'Available' : 'Not Available'],
      [`Fill Level Distribution:`, safeBinsData?.fillLevelDistribution ? `${binsData.fillLevelDistribution.length} categories` : 'Not Available'],
      [`Bin Types Analysis:`, safeBinsData?.binsByType ? `${binsData.binsByType.length} types` : 'Not Available'],
      [`District Analysis:`, safeBinsData?.binsByDistrict ? `${binsData.binsByDistrict.length} districts` : 'Not Available'],
      [`Recent Bins Data:`, safeBinsData?.recentBins ? `${binsData.recentBins.length} recent bins` : 'Not Available'],
      [`Report Type:`, reportType.charAt(0).toUpperCase() + reportType.slice(1)],
      [`Date Range:`, dateRange === DATE_RANGES.LAST_30_DAYS ? 'Last 30 Days' : 'All Time'],
      [`Generated At:`, new Date().toLocaleString()]
    ];

    y = addTable(['Data Category', 'Status'], dataCompleteness, y, contentWidth * 0.8);
    y += 15;

    // Add professional disclaimer
    y = addSectionHeader('Report Disclaimer', y);
    
    addText('This report is generated automatically by the Waste Management System and contains', margin, y, { 
      fontSize: PDF_CONFIG.FONT_SIZES.MICRO, 
      color: PDF_CONFIG.COLORS.GRAY 
    });
    y += 4;
    addText('real-time data analysis. For questions or clarifications, please contact the system administrator.', margin, y, { 
      fontSize: PDF_CONFIG.FONT_SIZES.MICRO, 
      color: PDF_CONFIG.COLORS.GRAY 
    });

    // Add professional footer
    addProfessionalFooter(pdf, pageWidth, pageHeight, margin);
  };

  const generateInsights = (binsData) => {
    const insights = [];
    
    // Ensure binsData has default structure if missing
    const safeBinsData = binsData || {
      summary: { totalBins: 0, binsNeedingCollection: 0, avgFill: 0, avgCapacity: 0 },
      fillLevelDistribution: [],
      binsByType: [],
      binsByDistrict: [],
      recentBins: []
    };
    
    if (!safeBinsData?.summary) return insights;

    const { summary } = safeBinsData;
    
    // Fill level insights
    if (summary.avgFill > 70) {
      insights.push(`High average fill level (${summary.avgFill.toFixed(1)}%) indicates efficient waste collection or high waste generation`);
    } else if (summary.avgFill < 30) {
      insights.push(`Low average fill level (${summary.avgFill.toFixed(1)}%) suggests potential over-collection or underutilization`);
    }

    // Collection needs insights
    if (summary.binsNeedingCollection > 0) {
      const percentage = calculatePercentage(summary.binsNeedingCollection, summary.totalBins);
      insights.push(`${summary.binsNeedingCollection} bins (${percentage}%) require immediate collection attention`);
    } else {
      insights.push('All bins are within acceptable fill levels - excellent collection efficiency');
    }

    // Capacity insights
    if (summary.avgCapacity > 100) {
      insights.push(`Large capacity bins (avg ${summary.avgCapacity.toFixed(0)}L) may be suitable for high-traffic areas`);
    } else if (summary.avgCapacity < 50) {
      insights.push(`Small capacity bins (avg ${summary.avgCapacity.toFixed(0)}L) may need more frequent collection`);
    }

    // District insights with comprehensive analysis
    if (safeBinsData?.binsByDistrict) {
      const districtWithHighestFill = safeBinsData.binsByDistrict.reduce((max, district) => 
        district.avgFill > max.avgFill ? district : max
      );
      const districtWithLowestFill = safeBinsData.binsByDistrict.reduce((min, district) => 
        district.avgFill < min.avgFill ? district : min
      );
      
      const totalDistricts = safeBinsData.binsByDistrict.length;
      const totalBinsAcrossDistricts = safeBinsData.binsByDistrict.reduce((sum, district) => sum + district.totalBins, 0);
      const avgFillAcrossDistricts = safeBinsData.binsByDistrict.reduce((sum, district) => sum + district.avgFill, 0) / totalDistricts;
      
      insights.push(`District Analysis: ${totalDistricts} districts managing ${totalBinsAcrossDistricts} bins with ${avgFillAcrossDistricts.toFixed(1)}% average fill level`);
      insights.push(`Best Performing District: ${districtWithHighestFill._id} (${districtWithHighestFill.avgFill.toFixed(1)}% fill level)`);
      insights.push(`District Needing Attention: ${districtWithLowestFill._id} (${districtWithLowestFill.avgFill.toFixed(1)}% fill level)`);
      
      // Add district efficiency analysis
      const highFillDistricts = safeBinsData.binsByDistrict.filter(d => d.avgFill > 70).length;
      const lowFillDistricts = safeBinsData.binsByDistrict.filter(d => d.avgFill < 30).length;
      
      if (highFillDistricts > 0) {
        insights.push(`${highFillDistricts} district(s) operating at high fill levels (>70%) - consider increased collection frequency`);
      }
      if (lowFillDistricts > 0) {
        insights.push(`${lowFillDistricts} district(s) operating at low fill levels (<30%) - potential over-collection or underutilization`);
      }
    }

    // Type insights
    if (safeBinsData?.binsByType) {
      const mostUsedType = safeBinsData.binsByType.reduce((max, type) => 
        type.count > max.count ? type : max
      );
      insights.push(`${mostUsedType._id} bins are the most common type (${mostUsedType.count} bins)`);
    }

    return insights;
  };

  const addProfessionalFooter = (pdf, pageWidth, pageHeight, margin) => {
    const totalPages = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      // Professional footer background
      pdf.setFillColor(249, 250, 251);
      pdf.rect(0, pageHeight - PDF_CONFIG.FOOTER_HEIGHT, pageWidth, PDF_CONFIG.FOOTER_HEIGHT, 'F');
      
      // Footer border
      pdf.setDrawColor(229, 231, 235);
      pdf.setLineWidth(1);
      pdf.line(0, pageHeight - PDF_CONFIG.FOOTER_HEIGHT, pageWidth, pageHeight - PDF_CONFIG.FOOTER_HEIGHT);
      
      // Company branding
      pdf.setFontSize(PDF_CONFIG.FONT_SIZES.MICRO);
      pdf.setTextColor(16, 185, 129);
      pdf.text('Waste Management System', margin, pageHeight - 15);
      
      // Page number with professional styling
      pdf.setTextColor(107, 114, 128);
      pdf.text(`Page ${i} of ${totalPages}`, pageWidth - margin, pageHeight - 15, { align: 'right' });
      
      // Generation timestamp
      pdf.setFontSize(PDF_CONFIG.FONT_SIZES.MICRO);
      pdf.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
      
      // Copyright notice
      pdf.setFontSize(PDF_CONFIG.FONT_SIZES.MICRO);
      pdf.text('© 2024 Waste Management System. All rights reserved.', margin, pageHeight - 8);
      
      // Confidentiality notice
      pdf.text('CONFIDENTIAL - For internal use only', pageWidth - margin, pageHeight - 8, { align: 'right' });
    }
  };

  const addFooter = (pdf, pageWidth, pageHeight, margin) => {
    addProfessionalFooter(pdf, pageWidth, pageHeight, margin);
  };

  useEffect(() => {
    fetchBinsData();
  }, [dateRange]);

  const fetchBinsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = getDateRangeParams(dateRange);
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
  }, [dateRange]);

  const handleBack = useCallback(() => {
    navigate('/admin/analytics');
  }, [navigate]);

  const handleExportToPDF = useCallback(async () => {
    try {
      setIsExporting(true);
      
      // Check if binsData is available
      if (!binsData) {
        alert('No data available to generate PDF. Please wait for data to load.');
        return;
      }
      
      console.log('Generating PDF with data:', binsData);
      console.log('Report type:', reportType);
      console.log('Date range:', dateRange);
      
      const pdf = await generatePDF(binsData, reportType, dateRange);
      const fileName = `Bins_Analysis_${reportType.charAt(0).toUpperCase() + reportType.slice(1)}_${new Date().toISOString().split('T')[0]}.pdf`;
      
      console.log('PDF generated successfully, saving as:', fileName);
      pdf.save(fileName);

      alert('Professional PDF report generated successfully! Check your downloads folder.');
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  }, [binsData, reportType, dateRange, generatePDF]);

  // Memoized computed values
  const summaryMetrics = useMemo(() => {
    if (!binsData?.summary) return [];
    
    const { summary } = binsData;
    return [
      { label: 'Total Bins', value: summary.totalBins, color: PDF_CONFIG.COLORS.SUCCESS },
      { label: 'Need Collection', value: summary.binsNeedingCollection, color: PDF_CONFIG.COLORS.WARNING },
      { label: 'Average Fill Level', value: `${summary.avgFill.toFixed(1)}%`, color: PDF_CONFIG.COLORS.INFO },
      { label: 'Average Capacity', value: `${summary.avgCapacity.toFixed(0)}L`, color: PDF_CONFIG.COLORS.PURPLE }
    ];
  }, [binsData?.summary]);

  const dateRangeLabel = useMemo(() => {
    return dateRange === DATE_RANGES.LAST_30_DAYS ? 'Last 30 Days' : 'All Time';
  }, [dateRange]);

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
        {/* Enhanced Header - Mobile Responsive */}
        <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-2xl mx-3 md:mx-6 mt-4 md:mt-6 mb-6 md:mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 lg:gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6 w-full lg:w-auto">
              <button
                onClick={handleBack}
                className="group flex items-center space-x-2 md:space-x-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl hover:from-emerald-700 hover:to-green-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform hover:-translate-y-0.5 text-sm md:text-base"
              >
                <MdArrowBack className="text-lg md:text-xl group-hover:animate-pulse" />
                <span className="hidden sm:inline">Back to Analytics</span>
                <span className="sm:hidden">Back</span>
              </button>
              
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-800 to-green-800 bg-clip-text text-transparent mb-1 md:mb-2 tracking-tight">
                  Bins Analysis
                </h1>
                <p className="text-emerald-600 text-sm sm:text-base md:text-lg lg:text-xl font-medium">
                  Comprehensive analysis of all bins in the system
                </p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 md:gap-4 w-full lg:w-auto">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 md:px-6 py-2 md:py-3 border-2 border-emerald-200 rounded-xl md:rounded-2xl bg-white/90 backdrop-blur-sm text-emerald-700 font-semibold focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all duration-300 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                <option value={DATE_RANGES.LAST_30_DAYS}>Last 30 Days</option>
                <option value={DATE_RANGES.ALL_TIME}>All Time</option>
              </select>
              
              <button
                onClick={fetchBinsData}
                disabled={loading}
                className="group flex items-center justify-center space-x-2 md:space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform hover:-translate-y-0.5 text-sm md:text-base"
              >
                <MdRefresh className={`text-lg md:text-xl ${loading ? 'animate-spin' : 'group-hover:animate-pulse'}`} />
                <span className="hidden sm:inline">{loading ? 'Refreshing...' : 'Refresh'}</span>
                <span className="sm:hidden">{loading ? '...' : 'Refresh'}</span>
              </button>

              <button
                onClick={handleExportToPDF}
                disabled={isExporting}
                className="group flex items-center justify-center space-x-2 md:space-x-3 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl hover:from-red-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105 transform hover:-translate-y-0.5 text-sm md:text-base"
              >
                <MdPictureAsPdf className={`text-lg md:text-xl ${isExporting ? 'animate-pulse' : 'group-hover:animate-bounce'}`} />
                <span className="hidden sm:inline">{isExporting ? 'Generating PDF...' : 'Export PDF'}</span>
                <span className="sm:hidden">{isExporting ? 'PDF...' : 'PDF'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Enhanced Report Type Selection - Mobile Responsive */}
        <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl md:rounded-3xl shadow-2xl mx-3 md:mx-6 mt-6 md:mt-8 overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            {REPORT_TYPE_CONFIG.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setReportType(type.id)}
                className={`group flex items-center justify-center sm:justify-start space-x-2 md:space-x-3 px-4 md:px-8 py-4 md:py-6 text-sm md:text-lg font-bold transition-all duration-300 border-b-4 sm:border-b-4 border-r-0 sm:border-r-0 relative flex-1 ${
                  reportType === type.id
                    ? 'text-emerald-800 border-emerald-500 bg-gradient-to-r from-emerald-50 to-green-50 shadow-lg transform scale-105'
                    : 'text-gray-600 border-transparent hover:text-emerald-700 hover:bg-emerald-50/50 hover:scale-105'
                }`}
              >
                <span className={`text-lg md:text-xl transition-all duration-300 ${reportType === type.id ? 'text-emerald-600' : 'text-gray-500 group-hover:text-emerald-500'}`}>
                  {type.icon}
                </span>
                <span className="hidden sm:inline">{type.name}</span>
                <span className="sm:hidden text-xs">{type.name}</span>
                {reportType === type.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/10 to-green-400/10 rounded-t-2xl md:rounded-t-3xl"></div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on selected tab */}
        <div id="bins-analysis-content">
        {reportType === REPORT_TYPES.OPERATIONAL && (
          <>
            {/* Enhanced Summary Cards - Mobile Responsive */}
            <div className="flex justify-center">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl w-full px-3 md:px-0">
                {summaryMetrics.map((metric, index) => {
                  const cardConfig = [
                    { 
                      title: 'Total Bins', 
                      subtitle: 'Active in system', 
                      icon: <MdStorage className="text-2xl" />,
                      progressWidth: '100%',
                      cardBg: 'bg-gradient-to-br from-green-50 to-emerald-50',
                      borderColor: 'border-green-200',
                      textColor: 'text-green-700',
                      valueColor: 'text-green-800',
                      iconBg: 'bg-gradient-to-br from-green-500 to-emerald-500',
                      iconColor: 'text-white',
                      progressBg: 'bg-green-200',
                      progressFill: 'bg-gradient-to-r from-green-500 to-emerald-500'
                    },
                    { 
                      title: 'Need Collection', 
                      subtitle: 'High fill level', 
                      icon: <MdWarning className="text-2xl" />,
                      progressWidth: `${Math.max((binsData.summary.binsNeedingCollection / binsData.summary.totalBins) * 100, 5)}%`,
                      cardBg: 'bg-gradient-to-br from-red-50 to-orange-50',
                      borderColor: 'border-red-200',
                      textColor: 'text-red-700',
                      valueColor: 'text-red-800',
                      iconBg: 'bg-gradient-to-br from-red-500 to-orange-500',
                      iconColor: 'text-white',
                      progressBg: 'bg-red-200',
                      progressFill: 'bg-gradient-to-r from-red-500 to-orange-500'
                    },
                    { 
                      title: 'Avg Fill Level', 
                      subtitle: 'System average', 
                      icon: <MdTrendingUp className="text-2xl" />,
                      progressWidth: `${binsData.summary.avgFill}%`,
                      cardBg: 'bg-gradient-to-br from-blue-50 to-indigo-50',
                      borderColor: 'border-blue-200',
                      textColor: 'text-blue-700',
                      valueColor: 'text-blue-800',
                      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-500',
                      iconColor: 'text-white',
                      progressBg: 'bg-blue-200',
                      progressFill: 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    },
                    { 
                      title: 'Avg Capacity', 
                      subtitle: 'Per bin', 
                      icon: <MdStorage className="text-2xl" />,
                      progressWidth: '69%',
                      cardBg: 'bg-gradient-to-br from-purple-50 to-pink-50',
                      borderColor: 'border-purple-200',
                      textColor: 'text-purple-700',
                      valueColor: 'text-purple-800',
                      iconBg: 'bg-gradient-to-br from-purple-500 to-pink-500',
                      iconColor: 'text-white',
                      progressBg: 'bg-purple-200',
                      progressFill: 'bg-gradient-to-r from-purple-500 to-pink-500'
                    }
                  ];
                  
                  const config = cardConfig[index];
                  
                  return (
                    <div key={metric.label} className={`group ${config.cardBg} border-2 ${config.borderColor} rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1`}>
                      <div className="flex items-center justify-between mb-3 md:mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className={`${config.textColor} text-xs md:text-sm font-semibold mb-1`}>{config.title}</h3>
                          <p className={`text-2xl md:text-3xl lg:text-4xl font-bold ${config.valueColor}`}>{metric.value}</p>
                          <p className={`${config.textColor} text-xs mt-1`}>{config.subtitle}</p>
                        </div>
                        <div className={`${config.iconBg} p-2 md:p-3 rounded-lg md:rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0 ml-2`}>
                          <div className={`${config.iconColor} text-lg md:text-2xl`}>
                            {config.icon}
                          </div>
                        </div>
                      </div>
                      <div className={`w-full ${config.progressBg} rounded-full h-1.5 md:h-2 shadow-inner`}>
                        <div className={`${config.progressFill} h-1.5 md:h-2 rounded-full shadow-sm transition-all duration-700`} style={{ width: config.progressWidth }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Charts and Analysis - Mobile Responsive */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8 mx-3 md:mx-6 mt-6 md:mt-8">
              {/* Fill Level Distribution */}
              <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
                  <div className="bg-gradient-to-br from-emerald-500 to-green-500 p-2 md:p-3 rounded-xl md:rounded-2xl">
                    <MdTrendingUp className="text-white text-lg md:text-2xl" />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-800 to-green-800 bg-clip-text text-transparent">Fill Level Distribution</h3>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {binsData.fillLevelDistribution.map((item, index) => (
                    <div key={index} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-5 bg-gradient-to-r from-emerald-50/80 to-green-50/80 rounded-xl md:rounded-2xl border border-emerald-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105 gap-3 sm:gap-0">
                      <div className="flex items-center space-x-3 md:space-x-4 w-full sm:w-auto">
                        <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full shadow-lg ${
                          item._id.includes('Very High') ? 'bg-gradient-to-r from-red-500 to-red-600' :
                          item._id.includes('High') ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                          item._id.includes('Medium') ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                          item._id.includes('Low') ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gradient-to-r from-gray-500 to-gray-600'
                        }`}></div>
                        <span className="font-semibold text-emerald-800 text-sm md:text-base">{item._id}</span>
                      </div>
                      <div className="flex items-center space-x-3 md:space-x-4 w-full sm:w-auto">
                        <div className="w-24 md:w-32 bg-emerald-200 rounded-full h-3 md:h-4 shadow-inner flex-1 sm:flex-none">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-green-500 h-3 md:h-4 rounded-full transition-all duration-700 shadow-lg"
                            style={{ width: `${calculatePercentage(item.count, binsData.summary.totalBins)}%` }}
                          ></div>
                        </div>
                        <span className="font-bold text-emerald-800 w-12 text-right text-sm md:text-lg">{item.count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bins by Type */}
              <div className="bg-white/80 backdrop-blur-sm border border-blue-200/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl hover:shadow-3xl transition-all duration-500">
                <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-indigo-500 p-2 md:p-3 rounded-xl md:rounded-2xl">
                    <MdStorage className="text-white text-lg md:text-2xl" />
                  </div>
                  <h3 className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Bins by Type</h3>
                </div>
                <div className="space-y-3 md:space-y-4">
                  {binsData.binsByType.map((item, index) => (
                    <div key={index} className="group p-3 md:p-5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-xl md:rounded-2xl border border-blue-200/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                        <h4 className="font-bold text-blue-800 text-base md:text-lg">{item._id}</h4>
                        <span className="text-blue-600 font-semibold bg-blue-100 px-2 md:px-3 py-1 rounded-full text-sm md:text-base">{item.count} bins</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-sm">
                        <div className="bg-white/60 p-2 md:p-3 rounded-lg md:rounded-xl">
                          <span className="text-blue-600 font-medium">Avg Fill: </span>
                          <span className="font-bold text-blue-800">{item.avgFill.toFixed(1)}%</span>
                        </div>
                        <div className="bg-white/60 p-2 md:p-3 rounded-lg md:rounded-xl">
                          <span className="text-blue-600 font-medium">Avg Capacity: </span>
                          <span className="font-bold text-blue-800">{item.avgCapacity.toFixed(0)}L</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Enhanced District Analysis - Mobile Responsive */}
            <div className="bg-white/80 backdrop-blur-sm border border-purple-200/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl mx-3 md:mx-6 mt-6 md:mt-8">
              <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 md:p-3 rounded-xl md:rounded-2xl">
                  <MdLocationOn className="text-white text-lg md:text-2xl" />
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-purple-800 to-pink-800 bg-clip-text text-transparent">District Analysis</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {binsData.binsByDistrict.map((district, index) => (
                  <div key={index} className="group p-4 md:p-6 bg-gradient-to-br from-purple-50/80 to-pink-50/80 rounded-xl md:rounded-2xl border border-purple-200/50 hover:shadow-xl transition-all duration-500 hover:scale-105 transform hover:-translate-y-1">
                    <div className="flex items-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                      <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-1.5 md:p-2 rounded-lg md:rounded-xl">
                        <MdLocationOn className="text-white text-sm md:text-lg" />
                      </div>
                      <h4 className="font-bold text-purple-800 text-sm md:text-base lg:text-lg">{district._id}</h4>
                    </div>
                    
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex justify-between items-center bg-white/60 p-2 md:p-3 rounded-lg md:rounded-xl">
                        <span className="text-purple-600 font-medium text-xs md:text-sm">Total Bins:</span>
                        <span className="font-bold text-purple-800 text-sm md:text-base lg:text-lg">{district.totalBins}</span>
                      </div>
                      
                      <div className="flex justify-between items-center bg-white/60 p-2 md:p-3 rounded-lg md:rounded-xl">
                        <span className="text-purple-600 font-medium text-xs md:text-sm">Avg Fill:</span>
                        <span className={`font-bold ${getFillLevelColor(district.avgFill)} px-2 md:px-3 py-1 rounded-full text-xs md:text-sm`}>
                          {district.avgFill.toFixed(1)}%
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 md:gap-3">
                        <div className="bg-red-50 p-2 md:p-3 rounded-lg md:rounded-xl border border-red-200">
                          <div className="text-red-600 text-xs md:text-sm font-medium">High Fill</div>
                          <div className="font-bold text-red-800 text-sm md:text-base lg:text-lg">{district.highFillBins}</div>
                        </div>
                        <div className="bg-green-50 p-2 md:p-3 rounded-lg md:rounded-xl border border-green-200">
                          <div className="text-green-600 text-xs md:text-sm font-medium">Low Fill</div>
                          <div className="font-bold text-green-800 text-sm md:text-base lg:text-lg">{district.lowFillBins}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Recent Bins - Mobile Responsive */}
            <div className="bg-white/80 backdrop-blur-sm border border-indigo-200/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl mx-3 md:mx-6 mt-6 md:mt-8 mb-6 md:mb-8">
              <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-2 md:p-3 rounded-xl md:rounded-2xl">
                  <MdStorage className="text-white text-lg md:text-2xl" />
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-indigo-800 to-purple-800 bg-clip-text text-transparent">Recent Bins (Last 30 Days)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b-2 border-indigo-200">
                      <th className="text-left py-3 md:py-4 px-3 md:px-6 text-indigo-700 font-bold text-sm md:text-base lg:text-lg">Bin ID</th>
                      <th className="text-left py-3 md:py-4 px-3 md:px-6 text-indigo-700 font-bold text-sm md:text-base lg:text-lg">Type</th>
                      <th className="text-left py-3 md:py-4 px-3 md:px-6 text-indigo-700 font-bold text-sm md:text-base lg:text-lg">Fill Level</th>
                      <th className="text-left py-3 md:py-4 px-3 md:px-6 text-indigo-700 font-bold text-sm md:text-base lg:text-lg">Capacity</th>
                      <th className="text-left py-3 md:py-4 px-3 md:px-6 text-indigo-700 font-bold text-sm md:text-base lg:text-lg">Status</th>
                      <th className="text-left py-3 md:py-4 px-3 md:px-6 text-indigo-700 font-bold text-sm md:text-base lg:text-lg">Address</th>
                      <th className="text-left py-3 md:py-4 px-3 md:px-6 text-indigo-700 font-bold text-sm md:text-base lg:text-lg">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {binsData.recentBins.map((bin, index) => (
                      <tr key={index} className="border-b border-indigo-100 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-300 group">
                        <td className="py-3 md:py-4 px-3 md:px-6 font-bold text-indigo-800 group-hover:text-indigo-900 text-xs md:text-sm">{bin.binId}</td>
                        <td className="py-3 md:py-4 px-3 md:px-6 text-indigo-700 group-hover:text-indigo-800 text-xs md:text-sm">{bin.binType}</td>
                        <td className="py-3 md:py-4 px-3 md:px-6">
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <div className="w-16 md:w-24 bg-indigo-200 rounded-full h-3 md:h-4 shadow-inner">
                              <div
                                className={`h-3 md:h-4 rounded-full transition-all duration-700 shadow-lg ${
                                  bin.currentFill > 80 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                                  bin.currentFill > 60 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                                  bin.currentFill > 40 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                  'bg-gradient-to-r from-green-500 to-green-600'
                                }`}
                                style={{ width: `${bin.currentFill}%` }}
                              ></div>
                            </div>
                            <span className={`text-xs md:text-sm font-bold ${getFillLevelColor(bin.currentFill)} px-2 md:px-3 py-1 rounded-full`}>
                              {bin.currentFill}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-6 text-indigo-700 group-hover:text-indigo-800 font-semibold text-xs md:text-sm">{bin.capacity}L</td>
                        <td className="py-3 md:py-4 px-3 md:px-6">
                          <span className={`px-2 md:px-4 py-1 md:py-2 rounded-full text-xs md:text-sm font-bold ${getStatusColor(bin.status)} shadow-lg`}>
                            {bin.status}
                          </span>
                        </td>
                        <td className="py-3 md:py-4 px-3 md:px-6 text-indigo-700 max-w-xs truncate group-hover:text-indigo-800 text-xs md:text-sm">{bin.address}</td>
                        <td className="py-3 md:py-4 px-3 md:px-6 text-indigo-700 group-hover:text-indigo-800 font-semibold text-xs md:text-sm">
                          {formatDate(bin.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {reportType === REPORT_TYPES.FINANCIAL && (
          <div className="mx-3 md:mx-6 mt-6 md:mt-8">
            <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl md:rounded-3xl p-4 md:p-6 lg:p-8 shadow-2xl">
              <div className="flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6">
                <div className="bg-gradient-to-br from-emerald-500 to-green-500 p-2 md:p-3 rounded-xl md:rounded-2xl">
                  <MdAttachMoney className="text-white text-lg md:text-2xl" />
                </div>
                <h3 className="text-lg md:text-xl lg:text-2xl font-bold bg-gradient-to-r from-emerald-800 to-green-800 bg-clip-text text-transparent">Financial Analysis</h3>
              </div>
              <div className="text-center py-8 md:py-16">
                <div className="text-4xl md:text-6xl lg:text-8xl mb-4 md:mb-6">💰</div>
                <h4 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent mb-3 md:mb-4">Financial Data Coming Soon</h4>
                <p className="text-emerald-600 text-sm md:text-base lg:text-xl">Financial analytics for bins will be available in a future update.</p>
                <div className="mt-6 md:mt-8 w-24 md:w-32 h-1.5 md:h-2 bg-emerald-200 rounded-full mx-auto">
                  <div className="w-16 md:w-24 h-1.5 md:h-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
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
