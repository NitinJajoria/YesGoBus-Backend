import express from "express";
import {
  registerAgentController,
  loginAgentController,
  getAgentBookingsController,
  getAllAgentBookingsController,
  getBalanceAPIController,
  adminApproveAgentController,
  adminRejecteAgentController,
  getAllPendingAgentsControllr,
  getAllBookingsController,
  getAllBookingRefundsController,
  getAgentPerformanceReportController,
  verifyAgentCodeController,
  isAgentController,
  getAgentStatsController,
  updateAgentController,
  getAgentRemainingTicketByDayController,
  adminInactivateAgentController,
} from "../controllers/agents.controller.js";

const router = express.Router();

router.post("/register", registerAgentController);
router.post("/login", loginAgentController);
router.get("/getAgentBookings/:agentId", getAgentBookingsController);
router.get("/getAllAgentBookings", getAllAgentBookingsController);
router.get("/getBalance", getBalanceAPIController);
router.patch("/approveAgent/:agentId", adminApproveAgentController);
router.delete("/rejectAgent/:agentId", adminRejecteAgentController);
router.get("/getAllPendingAgents", getAllPendingAgentsControllr);
router.get("/getAllBookings/:agentId", getAllBookingsController);
router.get("/getAllBookingRefunds/:agentId", getAllBookingRefundsController);
router.get("/getAgentPerformanceReport", getAgentPerformanceReportController);
router.get("/verifyAgentCode/:agentCode", verifyAgentCodeController);
router.get("/isAgent/:userId", isAgentController);
router.get("/agentStats/:agentId", getAgentStatsController);
router.patch("/updateAgent/:agentId", updateAgentController);
router.get("/getAgentTicketLimit/:agentId", getAgentRemainingTicketByDayController);
router.patch("/deactivateAgent/:agentId", adminInactivateAgentController);

export default router;
