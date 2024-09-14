import Agent from "../modals/agents.modal.js";
import User from "../modals/user.modal.js";
import BusBooking from "../modals/busBooking.modal.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendSrsRequest, sendVrlRequest } from "./buBooking.service.js";
import { generateUserId } from "../utils/generateRandomNumber.js";

export const registerAgent = async (agentData) => {
  try {
    const existingUserAccount = await User.findOne({
      userId: agentData.userId,
    });
    if (!existingUserAccount) {
      return {
        status: 404,
        message: "Yesgobus account doesnot exists",
      };
    }
    const existingAgent = await Agent.findOne({
      $or: [
        { email: agentData.email },
        { phNum: agentData.phNum },
        { userId: agentData.userId },
      ],
    });
    if (!existingAgent) {
      const prevAgent = await Agent.findOne({}, { agentCode: 1 }, { sort: { createdAt: -1 } });
      const agentCode = generateUserId(
        prevAgent?.agentCode.length > 6 ? "BD0000" : prevAgent.agentCode
      );
      const hashedPassword = bcrypt.hashSync(agentData.password, 5);
      const newAgent = new Agent({
        ...agentData,
        password: hashedPassword,
        id: existingUserAccount._id,
        agentCode: agentCode.join(""),
      });
      await newAgent.save();
      return {
        status: 200,
        message: "Registration Successful",
        data: newAgent,
      };
    } else {
      return {
        status: 401,
        message: "Agent already exists",
      };
    }
  } catch (err) {
    return {
      status: 500,
      message: err,
    };
  }
};

export const loginAgent = async (emailMobile, password) => {
  try {
    const existingAgent = await Agent.findOne({
      $or: [{ email: emailMobile }, { phNum: emailMobile }],
      status: true,
    });

    // Check if the user is a master admin
    const isMasterAdmin =
      existingAgent.email === process.env.MASTER_ADMIN_EMAIL;

    if (!existingAgent && !isMasterAdmin) {
      return {
        status: 401,
        message: "Invalid credentials",
      };
    }

    const isPasswordValid = bcrypt.compareSync(
      password,
      existingAgent.password
    );
    if (!isPasswordValid) {
      return {
        status: 401,
        message: "Invalid password",
      };
    }
    existingAgent.password = "";
    if (existingAgent && !isMasterAdmin) {
      // For agent login
      const token = jwt.sign(
        { userId: existingAgent._id },
        process.env.JWT_KEY
      );

      return {
        status: 200,
        message: "Successfully logged in",
        token: token,
        isMasterAdmin,
        data: existingAgent,
      };
    } else if (isMasterAdmin) {
      // For master admin login
      const token = jwt.sign({ role: "masterAdmin" }, process.env.JWT_KEY);

      return {
        status: 200,
        message: "Successfully logged in as master admin",
        token: token,
        isMasterAdmin,
        data: existingAgent,
      };
    }
  } catch (err) {
    return {
      status: 500,
      message: err,
    };
  }
};

export const getAgentBookings = async (agentId, filter) => {
  try {
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return {
        status: 404,
        message: "Agent not found",
      };
    }
    const bookingCriteria = {
      $or: [
        { userId: agent.id },
        { agentCode: agent.agentCode },
      ],
      bookingStatus: "paid",
    };
    if (filter.fromDate && filter.toDate) {
      bookingCriteria.createdAt = {
        $gte: new Date(filter.fromDate),
        $lte: new Date(filter.toDate),
      };
    }
    const bookings = await BusBooking.find(bookingCriteria);
    return {
      status: 200,
      message: "Booking records retrived",
      data: bookings,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error",
    };
  }
};

export const getAllAgentsBookings = async () => {
  try {
    const agents = await Agent.find({ email: { $ne: "admin@yesgobus.com" } });
    const allBookings = await Promise.all(
      agents.map(async (agent) => {
        const bookings = await BusBooking.find({
          $or: [
            { userId: agent.id },
            { agentCode: agent.agentCode },
          ],
          bookingStatus: "paid",
        });
        return {
          agentName: agent.firstName + " " + agent.lastName,
          bookings: bookings,
          agentId: agent._id,
          userId: agent.userId,
        };
      })
    );

    return {
      status: 200,
      message: "Booking records retrieved",
      data: allBookings,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error",
    };
  }
};

export const getBalanceAPI = async () => {
  const url = `gds/api/get_balance.json`;
  const ticketSimplyResponse = await sendSrsRequest(url, "GET");
  const vrl_url = `GetCurrentAccountBalance`;
  const vrlResponse = await sendVrlRequest(vrl_url, {});
  return {
    ticketSimply: ticketSimplyResponse.data.result.balance_amount,
    vrl: vrlResponse.data.ITSCurrentAccountBAL[0].Balance,
  };
};

export const adminApproveAgent = async (agentId) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      agentId,
      { status: true },
      { new: true }
    );
    if (!agent) {
      return {
        status: 404,
        message: "Agent not found",
      };
    }
    return {
      status: 200,
      message: "Agent account activated",
      data: agent,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error",
    };
  }
};

export const adminRejectAgent = async (agentId) => {
  try {
    const agent = await Agent.findByIdAndDelete(agentId);
    if (!agent) {
      return {
        status: 404,
        message: "Agent not found",
      };
    }
    return {
      status: 200,
      message: "Agent rejected",
      data: agent,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error",
    };
  }
};

export const getAllPendingAgents = async () => {
  try {
    const agents = await Agent.find({ status: false });
    return {
      status: 200,
      message: "Agent details retrived",
      data: agents,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error",
    };
  }
};

export const getAllBookings = async (agentId, filter) => {
  try {
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return {
        status: 404,
        message: "Agent not found",
      };
    }

    const isMasterAdmin =
      agent.email === process.env.MASTER_ADMIN_EMAIL;

    if (!isMasterAdmin) {
      const bookingCriteria = {
        $or: [
          { userId: agent.id },
          { agentCode: agent.agentCode },
        ],
        bookingStatus: "paid",
      };
      if (filter.fromDate && filter.toDate) {
        bookingCriteria.createdAt = {
          $gte: new Date(filter.fromDate),
          $lte: new Date(filter.toDate),
        };
      }
      const bookings = await BusBooking.find(bookingCriteria);
      return {
        status: 200,
        message: "Bookings details retrived",
        data: bookings,
      };
    }

    const bookingCriteria = { bookingStatus: "paid" };
    if (filter.fromDate && filter.toDate) {
      bookingCriteria.createdAt = {
        $gte: new Date(filter.fromDate),
        $lte: new Date(filter.toDate),
      };
    }
    const bookings = await BusBooking.find(bookingCriteria).sort({
      createdAt: -1,
    });
    const agents = await Agent.find({ email: { $ne: "admin@yesgobus.com" } });
    const allBookings = bookings.map((booking) => {
      const bookedByAgent = agents.some((agent) => agent.userId === booking.userId) || booking.agentCode;
      return {
        ...booking._doc,
        bookedByAgent: bookedByAgent ? "Y" : "N",
      };
    });
    return {
      status: 200,
      message: "Bookings details retrived",
      data: allBookings,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error",
    };
  }
};

export const getAllBookingRefund = async (agentId, filter) => {
  try {
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return {
        status: 404,
        message: "Agent not found",
      };
    }

    const isMasterAdmin =
      agent.email === process.env.MASTER_ADMIN_EMAIL;

    if (!isMasterAdmin) {
      const bookingCriteria = {
        $or: [
          { userId: agent.id },
          { agentCode: agent.agentCode },
        ],
        bookingStatus: "cancelled",
      }
      if (filter.fromDate && filter.toDate) {
        bookingCriteria.createdAt = {
          $gte: new Date(filter.fromDate),
          $lte: new Date(filter.toDate),
        };
      }

      const bookings = await BusBooking.find(bookingCriteria);
      return {
        status: 200,
        message: "Bookings details retrived",
        data: bookings,
      };
    }
    const bookingCriteria = { bookingStatus: "cancelled" };
    if (filter.fromDate && filter.toDate) {
      bookingCriteria.createdAt = {
        $gte: new Date(filter.fromDate),
        $lte: new Date(filter.toDate),
      };
    }
    const bookings = await BusBooking.find(bookingCriteria).sort(
      { createdAt: -1 }
    );
    const agents = await Agent.find({ email: { $ne: "admin@yesgobus.com" } });
    const allBookings = bookings.map((booking) => {
      const bookedByAgent = agents.some((agent) => agent.userId === booking.userId) || booking.agentCode;
      return {
        ...booking._doc,
        bookedByAgent: bookedByAgent ? "Y" : "N",
      };
    });
    return {
      status: 200,
      message: "Bookings details retrived",
      data: allBookings,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error",
    };
  }
};

export const getAgentPerformanceReport = async (filter) => {
  try {
    const agentFilter = {
      email: { $ne: "admin@yesgobus.com" },
      status: true,
    };
    const agents = await Agent.find(agentFilter);

    const allBookings = await Promise.all(
      agents.map(async (agent) => {
        const bookingCriteria = {
          $or: [
            { userId: agent.id },
            { agentCode: agent.agentCode },
          ],
          bookingStatus: "paid",
        };

        if (filter.fromDate && filter.toDate) {
          bookingCriteria.createdAt = {
            $gte: new Date(filter.fromDate),
            $lte: new Date(filter.toDate),
          };
        }

        const bookings = await BusBooking.find(bookingCriteria);

        const totalRevenue = bookings.reduce(
          (sum, booking) => sum + booking.totalAmount,
          0
        );

        return {
          agentName: agent.firstName + " " + agent.lastName,
          bookingsMade: bookings.length,
          revenue: totalRevenue,
          agentId: agent._id,
          userId: agent.userId,
          email: agent.email,
          phone: agent.phNum,
          maxTicket: agent.maxTicket || 50,
          status: agent.status,
        };
      })
    );
    return {
      status: 200,
      message: "Booking records retrieved",
      data: allBookings,
    };
  } catch (error) {
    console.error(error);
    return {
      status: 500,
      message: error.message || "Internal Server Error",
    };
  }
};


export const verifyAgentCode = async (agentCode) => {
  try {
    const existingAgent = await Agent.findOne({ agentCode: agentCode });
    const checkLimit = await getAgentRemainingTicketByDay(existingAgent._id);

    if (existingAgent) {
      if (checkLimit.remainingLimit === 0) {
        return {
          status: 404,
          message: "Agent's Today's Max Limit Exceeded",
        };
      }
      return {
        status: 200,
        message: "Agent code verified successfully",
      };
    } else {
      return {
        status: 404,
        message: "Agent code not found",
      };
    }
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error",
    };
  }
};

export const isAgent = async (userId) => {
  try {
    const existingAgent = await Agent.findOne({ userId: userId, status: true });
    if (existingAgent) {
      const checkLimit = await getAgentRemainingTicketByDay(existingAgent._id);
      return {
        status: 200,
        isAgent: true,
        isBookable: checkLimit.remainingLimit !== 0,
        maxLimit: checkLimit.maxLimit,
      };
    }
    return {
      status: 200,
      isAgent: false,
      isBookable: true,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error",
    };
  }
};

export const getAgentStats = async (agentId) => {
  try {
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return {
        status: 404,
        message: "Agent not found",
      };
    }
    const bookings = await BusBooking.find({
      $or: [
        { userId: agent.id },
        { agentCode: agent.agentCode },
      ],
      bookingStatus: "paid",
    });
    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );

    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
    const lastYear = currentMonth === 1 ? currentYear - 1 : currentYear;

    const bookingsThisMonth = bookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt);
      const bookingMonth = bookingDate.getMonth() + 1;
      const bookingYear = bookingDate.getFullYear();
      return bookingMonth === currentMonth && bookingYear === currentYear;
    });

    const bookingsLastMonth = bookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt);
      const bookingMonth = bookingDate.getMonth() + 1;
      const bookingYear = bookingDate.getFullYear();
      return (
        (bookingMonth === lastMonth && bookingYear === currentYear) ||
        (bookingMonth === 12 && bookingYear === lastYear)
      );
    });

    const salesThisMonth = bookingsThisMonth.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );
    const salesLastMonth = bookingsLastMonth.reduce(
      (sum, booking) => sum + booking.totalAmount,
      0
    );

    return {
      status: 200,
      message: "Agent stats retrived",
      data: {
        totalBookings: bookings.length,
        bookingsThisMonth: bookingsThisMonth.length,
        bookingsLastMonth: bookingsLastMonth.length,
        salesThisMonth: salesThisMonth,
        salesLastMonth: salesLastMonth,
        totalAllTimeSales: totalRevenue,
      },
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error",
    };
  }
};

export const updateAgent = async (agentId, updateData) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      agentId,
      updateData,
      { new: true }
    );
    if (!agent) {
      return {
        status: 404,
        message: "Agent not found",
      };
    }
    return {
      status: 200,
      message: "Agent account updated",
      data: agent,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error",
    };
  }
};

export const getAgentRemainingTicketByDay = async (agentId) => {
  try {
    const agent = await Agent.findById(agentId);
    if (!agent) {
      return {
        status: 404,
        message: "Agent not found",
      };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const bookings = await BusBooking.find({
      $or: [
        { userId: agent.id },
        { agentCode: agent.agentCode },
      ],
      bookingStatus: "paid",
      createdAt: { $gte: today, $lt: tomorrow },
    });
    const remainingLimit = agent.maxTicket !== undefined ? Math.max(agent.maxTicket - bookings.length, 0) : Math.max(50 - bookings.length, 0);

    return {
      status: 200,
      message: "Agent booking limit retrieved",
      bookingsCount: bookings.length || 0,
      maxLimit: agent.maxTicket !== undefined ? agent.maxTicket : 50,
      remainingLimit: remainingLimit
    };

  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error",
    };
  }
}

export const adminInactivateAgent = async (agentId) => {
  try {
    const agent = await Agent.findByIdAndUpdate(
      agentId,
      { status: false },
      { new: true }
    );
    if (!agent) {
      return {
        status: 404,
        message: "Agent not found",
      };
    }
    return {
      status: 200,
      message: "Agent account deactivated",
      data: agent,
    };
  } catch (error) {
    return {
      status: 500,
      message: error.message || "Internal Server Error",
    };
  }
};
