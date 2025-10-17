import Collection from '../models/Collection.js';
import Invoice from '../models/Invoice.js';
import Rebate from '../models/Rebate.js';
import TruckRoute from '../models/TruckRoute.js';
import User from '../models/User.js';
import Bin from '../models/Bin.js';

// Get operational analytics
const getOperationalAnalytics = async (req, res) => {
  try {
    const { startDate, endDate, zone } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.collectionTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get waste by zone
    const wasteByZone = await Collection.aggregate([
      { $match: dateFilter },
      {
        $lookup: {
          from: 'bins',
          localField: 'bin',
          foreignField: '_id',
          as: 'binData'
        }
      },
      { $unwind: '$binData' },
      {
        $group: {
          _id: '$binData.address',
          totalWaste: { $sum: '$weight' },
          count: { $sum: 1 }
        }
      },
      { $sort: { totalWaste: -1 } }
    ]);

    // Get collection efficiency
    const totalCollections = await Collection.countDocuments(dateFilter);
    const completedCollections = await Collection.countDocuments({
      ...dateFilter,
      status: 'completed'
    });
    const collectionEfficiency = totalCollections > 0 ? (completedCollections / totalCollections) * 100 : 0;

    // Get system uptime (mock data for now)
    const systemUptime = 99.8;

    // Get active routes
    const activeRoutes = await TruckRoute.countDocuments({ status: 'active' });

    res.json({
      success: true,
      data: {
        wasteByZone,
        collectionEfficiency,
        systemUptime,
        activeRoutes,
        totalCollections,
        completedCollections
      }
    });
  } catch (error) {
    console.error('Error fetching operational analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch operational analytics',
      error: error.message
    });
  }
};

// Get financial analytics
const getFinancialAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get total revenue
    const revenueData = await Invoice.aggregate([
      { $match: { ...dateFilter, status: 'paid' } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          averageInvoice: { $avg: '$totalAmount' },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get outstanding payments
    const outstandingPayments = await Invoice.aggregate([
      { $match: { ...dateFilter, status: { $in: ['pending', 'overdue'] } } },
      {
        $group: {
          _id: null,
          totalOutstanding: { $sum: '$totalAmount' }
        }
      }
    ]);

    // Get rebate data
    const rebateData = await Rebate.aggregate([
      { $match: { ...dateFilter, status: 'paid' } },
      {
        $group: {
          _id: null,
          totalRebates: { $sum: '$amount' }
        }
      }
    ]);

    // Calculate cost recovery
    const totalRevenue = revenueData[0]?.totalRevenue || 0;
    const totalOutstanding = outstandingPayments[0]?.totalOutstanding || 0;
    const totalRebates = rebateData[0]?.totalRebates || 0;
    const operationalCosts = totalRevenue * 0.76; // Mock calculation
    const costRecovery = totalRevenue > 0 ? ((totalRevenue - totalRebates) / (totalRevenue + totalOutstanding)) * 100 : 0;

    res.json({
      success: true,
      data: {
        totalRevenue,
        averageInvoice: revenueData[0]?.averageInvoice || 0,
        outstandingPayments: totalOutstanding,
        rebateAmount: totalRebates,
        operationalCosts,
        costRecovery
      }
    });
  } catch (error) {
    console.error('Error fetching financial analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch financial analytics',
      error: error.message
    });
  }
};

// Get sustainability analytics
const getSustainabilityAnalytics = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get recycling rate
    const recyclingData = await Collection.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$wasteType',
          totalWeight: { $sum: '$weight' },
          count: { $sum: 1 }
        }
      }
    ]);

    const totalWaste = recyclingData.reduce((sum, item) => sum + item.totalWeight, 0);
    const recyclableWaste = recyclingData
      .filter(item => ['plastic', 'paper', 'glass'].includes(item._id))
      .reduce((sum, item) => sum + item.totalWeight, 0);
    const recyclingRate = totalWaste > 0 ? (recyclableWaste / totalWaste) * 100 : 0;

    // Get waste reduction (mock calculation)
    const wasteReduction = 15.2;

    // Get carbon footprint (mock calculation based on waste collected)
    const carbonFootprint = totalWaste * 0.5; // kg CO2 per kg waste

    // Get energy efficiency (mock data)
    const energyEfficiency = 87.3;

    // Get circular economy score (mock data)
    const circularEconomyScore = 82.1;

    res.json({
      success: true,
      data: {
        recyclingRate,
        wasteReduction,
        carbonFootprint,
        energyEfficiency,
        circularEconomyScore,
        totalWaste,
        recyclableWaste
      }
    });
  } catch (error) {
    console.error('Error fetching sustainability analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sustainability analytics',
      error: error.message
    });
  }
};

// Get route optimization data
const getRouteOptimization = async (req, res) => {
  try {
    const routes = await TruckRoute.find({ status: 'active' })
      .populate('driver', 'name email')
      .sort({ createdAt: -1 });

    const routeData = routes.map(route => ({
      id: route._id,
      name: route.name,
      distance: route.estimatedDistance,
      time: route.estimatedDuration,
      efficiency: route.optimizationScore || 75,
      driver: route.driver?.name || 'Unassigned',
      status: route.status
    }));

    res.json({
      success: true,
      data: {
        currentRoutes: routeData,
        totalRoutes: routes.length
      }
    });
  } catch (error) {
    console.error('Error fetching route optimization data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch route optimization data',
      error: error.message
    });
  }
};

// Optimize routes
const optimizeRoutes = async (req, res) => {
  try {
    const { routes, constraints } = req.body;
    
    // Mock optimization algorithm
    // In a real implementation, this would use algorithms like:
    // - Traveling Salesman Problem (TSP) solvers
    // - Vehicle Routing Problem (VRP) algorithms
    // - Genetic algorithms or simulated annealing
    
    const optimizedRoutes = routes.map(route => {
      // Simulate optimization improvements
      const distanceImprovement = 0.85 + Math.random() * 0.1; // 85-95% of original
      const timeImprovement = 0.8 + Math.random() * 0.15; // 80-95% of original
      const efficiencyImprovement = Math.min(route.efficiency + 10 + Math.random() * 10, 100);
      
      return {
        ...route,
        optimizedDistance: Math.round(route.distance * distanceImprovement * 100) / 100,
        optimizedTime: Math.round(route.time * timeImprovement),
        optimizedEfficiency: Math.round(efficiencyImprovement),
        savings: {
          distance: Math.round((route.distance - route.distance * distanceImprovement) * 100) / 100,
          time: Math.round(route.time - route.time * timeImprovement),
          fuel: Math.round((route.distance - route.distance * distanceImprovement) * 0.2 * 100) / 100,
          cost: Math.round((route.distance - route.distance * distanceImprovement) * 25)
        }
      };
    });

    // Calculate total savings
    const totalSavings = optimizedRoutes.reduce((acc, route) => ({
      distance: acc.distance + route.savings.distance,
      time: acc.time + route.savings.time,
      fuel: acc.fuel + route.savings.fuel,
      cost: acc.cost + route.savings.cost
    }), { distance: 0, time: 0, fuel: 0, cost: 0 });

    res.json({
      success: true,
      data: {
        optimizedRoutes,
        totalSavings,
        optimizationScore: Math.round(optimizedRoutes.reduce((acc, route) => acc + route.optimizedEfficiency, 0) / optimizedRoutes.length)
      }
    });
  } catch (error) {
    console.error('Error optimizing routes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to optimize routes',
      error: error.message
    });
  }
};

// Apply optimized routes
const applyOptimizedRoutes = async (req, res) => {
  try {
    const { optimizedRoutes } = req.body;
    
    // Update truck routes with optimized data
    const updatePromises = optimizedRoutes.map(route => 
      TruckRoute.findByIdAndUpdate(route.id, {
        estimatedDistance: route.optimizedDistance,
        estimatedDuration: route.optimizedTime,
        optimizationScore: route.optimizedEfficiency,
        isOptimized: true,
        previousRouteId: route.id
      })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Optimized routes have been applied successfully',
      data: {
        updatedRoutes: optimizedRoutes.length
      }
    });
  } catch (error) {
    console.error('Error applying optimized routes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to apply optimized routes',
      error: error.message
    });
  }
};

// What-if simulation
const runSimulation = async (req, res) => {
  try {
    const { simulationType, parameters } = req.body;
    
    let simulationResults = {};
    
    switch (simulationType) {
      case 'pricing_change':
        // Simulate pricing policy change
        const { newRate, wasteType } = parameters;
        const collections = await Collection.find({ wasteType });
        const currentRevenue = collections.reduce((sum, col) => sum + (col.weight * 2.5), 0);
        const newRevenue = collections.reduce((sum, col) => sum + (col.weight * newRate), 0);
        
        simulationResults = {
          currentRevenue,
          projectedRevenue: newRevenue,
          revenueChange: newRevenue - currentRevenue,
          percentageChange: ((newRevenue - currentRevenue) / currentRevenue) * 100
        };
        break;
        
      case 'route_optimization':
        // Simulate route optimization impact
        const routes = await TruckRoute.find({ status: 'active' });
        const totalDistance = routes.reduce((sum, route) => sum + route.estimatedDistance, 0);
        const optimizedDistance = totalDistance * 0.85; // 15% reduction
        
        simulationResults = {
          currentDistance: totalDistance,
          optimizedDistance,
          distanceSaved: totalDistance - optimizedDistance,
          fuelSaved: (totalDistance - optimizedDistance) * 0.2,
          costSaved: (totalDistance - optimizedDistance) * 25
        };
        break;
        
      default:
        throw new Error('Invalid simulation type');
    }

    res.json({
      success: true,
      data: simulationResults
    });
  } catch (error) {
    console.error('Error running simulation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to run simulation',
      error: error.message
    });
  }
};

// Get district analysis
const getDistrictAnalysis = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get bins grouped by district (extracted from address)
    const districtData = await Bin.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $cond: {
              if: { $regexMatch: { input: '$address', regex: /,\s*([^,]+)$/ } },
              then: { $arrayElemAt: [{ $split: ['$address', ','] }, -1] },
              else: 'Unknown District'
            }
          },
          totalBins: { $sum: 1 },
          totalFill: { $sum: '$currentFill' },
          avgFill: { $avg: '$currentFill' },
          highFillBins: {
            $sum: {
              $cond: [{ $gt: ['$currentFill', 80] }, 1, 0]
            }
          },
          lowFillBins: {
            $sum: {
              $cond: [{ $lt: ['$currentFill', 20] }, 1, 0]
            }
          },
          bins: {
            $push: {
              _id: '$_id',
              currentFill: '$currentFill',
              capacity: '$capacity',
              address: '$address'
            }
          }
        }
      },
      {
        $project: {
          district: '$_id',
          totalBins: 1,
          avgFill: { $round: ['$avgFill', 1] },
          highFillBins: 1,
          lowFillBins: 1,
          bins: 1,
          _id: 0
        }
      },
      { $sort: { avgFill: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        districts: districtData,
        totalDistricts: districtData.length,
        totalBins: districtData.reduce((sum, district) => sum + district.totalBins, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching district analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch district analysis',
      error: error.message
    });
  }
};

// Get district analysis by user
const getDistrictAnalysisByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { startDate, endDate } = req.query;
    
    const dateFilter = { user: userId };
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get user's bins grouped by district
    const districtData = await Bin.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $cond: {
              if: { $regexMatch: { input: '$address', regex: /,\s*([^,]+)$/ } },
              then: { $arrayElemAt: [{ $split: ['$address', ','] }, -1] },
              else: 'Unknown District'
            }
          },
          totalBins: { $sum: 1 },
          totalFill: { $sum: '$currentFill' },
          averageFill: { $avg: '$currentFill' },
          bins: {
            $push: {
              _id: '$_id',
              currentFill: '$currentFill',
              capacity: '$capacity',
              address: '$address'
            }
          }
        }
      },
      {
        $project: {
          district: '$_id',
          totalBins: 1,
          averageFill: { $round: ['$averageFill', 1] },
          bins: 1,
          _id: 0
        }
      },
      { $sort: { averageFill: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        districts: districtData,
        totalDistricts: districtData.length,
        totalBins: districtData.reduce((sum, district) => sum + district.totalBins, 0)
      }
    });
  } catch (error) {
    console.error('Error fetching user district analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user district analysis',
      error: error.message
    });
  }
};

// Get comprehensive bins analysis
const getBinsAnalysis = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get total bins count
    const totalBins = await Bin.countDocuments(dateFilter);
    
    // Get bins by status
    const binsByStatus = await Bin.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get bins by type
    const binsByType = await Bin.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: '$binType',
          count: { $sum: 1 },
          avgFill: { $avg: '$currentFill' },
          avgCapacity: { $avg: '$capacity' }
        }
      }
    ]);

    // Get fill level distribution
    const fillLevelDistribution = await Bin.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $switch: {
              branches: [
                { case: { $lte: ['$currentFill', 20] }, then: 'Very Low (0-20%)' },
                { case: { $lte: ['$currentFill', 40] }, then: 'Low (20-40%)' },
                { case: { $lte: ['$currentFill', 60] }, then: 'Medium (40-60%)' },
                { case: { $lte: ['$currentFill', 80] }, then: 'High (60-80%)' },
                { case: { $gt: ['$currentFill', 80] }, then: 'Very High (80-100%)' }
              ],
              default: 'Unknown'
            }
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Get bins by district (from address)
    const binsByDistrict = await Bin.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: {
            $cond: {
              if: { $regexMatch: { input: '$address', regex: /,\s*([^,]+)$/ } },
              then: { $arrayElemAt: [{ $split: ['$address', ','] }, -1] },
              else: 'Unknown District'
            }
          },
          totalBins: { $sum: 1 },
          avgFill: { $avg: '$currentFill' },
          avgCapacity: { $avg: '$capacity' },
          highFillBins: {
            $sum: { $cond: [{ $gt: ['$currentFill', 80] }, 1, 0] }
          },
          lowFillBins: {
            $sum: { $cond: [{ $lt: ['$currentFill', 20] }, 1, 0] }
          }
        }
      },
      { $sort: { avgFill: -1 } }
    ]);

    // Get recent bins (last 30 days)
    const recentBins = await Bin.find({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).sort({ createdAt: -1 }).limit(10);

    // Get bins needing collection (fill > 80%)
    const binsNeedingCollection = await Bin.find({
      currentFill: { $gt: 80 },
      status: 'active'
    }).countDocuments();

    // Get average metrics
    const avgMetrics = await Bin.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          avgFill: { $avg: '$currentFill' },
          avgCapacity: { $avg: '$capacity' },
          avgTemperature: { $avg: '$temperature' },
          avgHumidity: { $avg: '$humidity' }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalBins,
          binsNeedingCollection,
          avgFill: avgMetrics[0]?.avgFill || 0,
          avgCapacity: avgMetrics[0]?.avgCapacity || 0,
          avgTemperature: avgMetrics[0]?.avgTemperature || 0,
          avgHumidity: avgMetrics[0]?.avgHumidity || 0
        },
        binsByStatus,
        binsByType,
        fillLevelDistribution,
        binsByDistrict,
        recentBins: recentBins.map(bin => ({
          binId: bin.binId,
          binType: bin.binType,
          currentFill: bin.currentFill,
          capacity: bin.capacity,
          address: bin.address,
          status: bin.status,
          createdAt: bin.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching bins analysis:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch bins analysis',
      error: error.message
    });
  }
};

// Export analytics report
const exportReport = async (req, res) => {
  try {
    const { reportType, format, startDate, endDate } = req.query;
    
    // This would typically generate PDF/CSV reports
    // For now, return a success response
    res.json({
      success: true,
      message: `Report exported successfully`,
      data: {
        reportType,
        format,
        startDate,
        endDate,
        downloadUrl: `/reports/${reportType}_${Date.now()}.${format}`
      }
    });
  } catch (error) {
    console.error('Error exporting report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to export report',
      error: error.message
    });
  }
};

export {
  getOperationalAnalytics,
  getFinancialAnalytics,
  getSustainabilityAnalytics,
  getRouteOptimization,
  optimizeRoutes,
  applyOptimizedRoutes,
  runSimulation,
  getDistrictAnalysis,
  getDistrictAnalysisByUser,
  getBinsAnalysis,
  exportReport
};
