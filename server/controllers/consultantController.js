// server/controllers/consultantController.js
import WardRound from "../models/WardRound.js";
import DischargePlan from "../models/DischargePlan.js";
import TeachingNote from "../models/TeachingNote.js";
import Consultation from "../models/Consultation.js";
import ClinicalAudit from "../models/ClinicalAudit.js";
import Task from "../models/Task.js";
import { Op } from "sequelize";

// Get consultant dashboard overview stats
export const getDashboardStats = async (req, res) => {
  try {
    const consultantId = req.user.id;
    const today = new Date().toISOString().split("T")[0];

    // Today's ward rounds
    const todaysWardRounds = await WardRound.count({
      where: {
        consultantId,
        roundDate: today,
      },
    });

    // Patients for discharge
    const patientsForDischarge = await WardRound.count({
      where: {
        consultantId,
        patientStatus: "FOR_DISCHARGE",
        roundDate: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
    });

    // Pending consultations
    const pendingConsultations = await Consultation.count({
      where: {
        consultantId,
        status: { [Op.in]: ["PENDING", "ASSIGNED", "IN_PROGRESS"] },
      },
    });

    // Active discharge plans
    const activeDischargePlans = await DischargePlan.count({
      where: {
        consultantId,
        status: { [Op.in]: ["PLANNED", "PENDING_APPROVAL", "APPROVED"] },
      },
    });

    // Teaching sessions this month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    const teachingSessionsThisMonth = await TeachingNote.count({
      where: {
        consultantId,
        sessionDate: {
          [Op.gte]: firstDayOfMonth,
        },
      },
    });

    // Ongoing audits
    const ongoingAudits = await ClinicalAudit.count({
      where: {
        consultantId,
        status: { [Op.in]: ["PLANNING", "DATA_COLLECTION", "ANALYSIS"] },
      },
    });

    // Critical patients
    const criticalPatients = await WardRound.count({
      where: {
        consultantId,
        patientStatus: { [Op.in]: ["CRITICAL", "DETERIORATING"] },
        roundDate: {
          [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
        },
      },
    });

    // Pending tasks
    const pendingTasks = await Task.count({
      where: {
        assignedToId: consultantId,
        status: { [Op.in]: ["PENDING", "IN_PROGRESS"] },
      },
    });

    res.json({
      success: true,
      data: {
        todaysWardRounds,
        patientsForDischarge,
        pendingConsultations,
        activeDischargePlans,
        teachingSessionsThisMonth,
        ongoingAudits,
        criticalPatients,
        pendingTasks,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

// Get patients needing attention
export const getPatientsNeedingAttention = async (req, res) => {
  try {
    const consultantId = req.user.id;
    const { limit = 10 } = req.query;

    const wardRounds = await WardRound.findAll({
      where: {
        consultantId,
        patientStatus: {
          [Op.in]: ["CRITICAL", "DETERIORATING", "FOR_DISCHARGE"],
        },
        roundDate: {
          [Op.gte]: new Date(Date.now() - 48 * 60 * 60 * 1000), // Last 48 hours
        },
      },
      limit: parseInt(limit),
      order: [
        ["patientStatus", "ASC"], // CRITICAL first
        ["roundDate", "DESC"],
      ],
    });

    res.json({
      success: true,
      data: wardRounds,
      count: wardRounds.length,
    });
  } catch (error) {
    console.error("Error fetching patients needing attention:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch patients needing attention",
      error: error.message,
    });
  }
};

// Get recent activity summary

// Get recent activity feed
export const getRecentActivity = async (req, res) => {
  try {
    const consultantId = req.user.id;
    const { days = 7 } = req.query;

    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Recent ward rounds
    const recentWardRounds = await WardRound.count({
      where: {
        consultantId,
        roundDate: { [Op.gte]: startDate },
      },
    });

    // Recent teaching sessions
    const recentTeaching = await TeachingNote.count({
      where: {
        consultantId,
        sessionDate: { [Op.gte]: startDate },
      },
    });

    // Recent consultations completed
    const recentConsultations = await Consultation.count({
      where: {
        consultantId,
        completedDate: { [Op.gte]: startDate },
      },
    });

    // Patients discharged
    const patientsDischargedCount = await DischargePlan.count({
      where: {
        consultantId,
        status: "COMPLETED",
        actualDischargeDate: { [Op.gte]: startDate },
      },
    });

    res.json({
      success: true,
      data: {
        period: `Last ${days} days`,
        wardRounds: recentWardRounds,
        teachingSessions: recentTeaching,
        consultationsCompleted: recentConsultations,
        patientsDischargedCount,
      },
    });
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch recent activity",
      error: error.message,
    });
  }
};

// Get workload metrics
export const getWorkloadMetrics = async (req, res) => {
  try {
    const consultantId = req.user.id;

    // Active patients (from recent ward rounds)
    const activePatients = await WardRound.findAll({
      where: {
        consultantId,
        roundDate: {
          [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        },
      },
      attributes: ["patientId"],
      group: ["patientId"],
      raw: true,
    });

    const activePatientsCount = activePatients.length;

    // Pending tasks
    const pendingTasksCount = await Task.count({
      where: {
        createdById: consultantId,
        status: { [Op.in]: ["PENDING", "IN_PROGRESS"] },
      },
    });

    // Pending consultations
    const pendingConsultationsCount = await Consultation.count({
      where: {
        consultantId,
        status: { [Op.in]: ["PENDING", "ASSIGNED", "IN_PROGRESS"] },
      },
    });

    // Pending discharge approvals
    const pendingDischarges = await DischargePlan.count({
      where: {
        status: "PENDING_APPROVAL",
      },
    });

    // Calculate workload score (simple weighted sum)
    const workloadScore =
      activePatientsCount * 2 +
      pendingTasksCount * 1 +
      pendingConsultationsCount * 3 +
      pendingDischarges * 2;

    let workloadLevel = "LOW";
    if (workloadScore > 50) workloadLevel = "HIGH";
    else if (workloadScore > 25) workloadLevel = "MEDIUM";

    res.json({
      success: true,
      data: {
        activePatientsCount,
        pendingTasksCount,
        pendingConsultationsCount,
        pendingDischarges,
        workloadScore,
        workloadLevel,
      },
    });
  } catch (error) {
    console.error("Error fetching workload metrics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch workload metrics",
      error: error.message,
    });
  }
};

// Get upcoming discharges
export const getUpcomingDischarges = async (req, res) => {
  try {
    const { days = 7 } = req.query;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + parseInt(days));

    const upcomingDischarges = await DischargePlan.findAll({
      where: {
        status: { [Op.in]: ["PLANNED", "APPROVED"] },
        proposedDischargeDate: {
          [Op.between]: [new Date(), endDate],
        },
      },
      order: [["proposedDischargeDate", "ASC"]],
    });

    res.json({
      success: true,
      data: upcomingDischarges,
      count: upcomingDischarges.length,
    });
  } catch (error) {
    console.error("Error fetching upcoming discharges:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch upcoming discharges",
      error: error.message,
    });
  }
};

// Refresh all dashboard data
export const refreshAllData = async (req, res) => {
  try {
    // Call all stat functions and combine results
    const dashboardStats = await exports.getDashboardStats(req, {
      json: (data) => data,
    });
    const patientsNeedingAttention = await exports.getPatientsNeedingAttention(
      req,
      { json: (data) => data }
    );
    const recentActivity = await exports.getRecentActivity(req, {
      json: (data) => data,
    });
    const workloadMetrics = await exports.getWorkloadMetrics(req, {
      json: (data) => data,
    });

    res.json({
      success: true,
      data: {
        stats: dashboardStats.data,
        patientsNeedingAttention: patientsNeedingAttention.data,
        recentActivity: recentActivity.data,
        workloadMetrics: workloadMetrics.data,
      },
    });
  } catch (error) {
    console.error("Error refreshing dashboard data:", error);
    res.status(500).json({
      success: false,
      message: "Failed to refresh dashboard data",
      error: error.message,
    });
  }
};

export default {
  getDashboardStats,
  getPatientsNeedingAttention,
  getRecentActivity,
  getWorkloadMetrics,
  getUpcomingDischarges,
  refreshAllData,
};
