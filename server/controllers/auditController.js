import { AuditLog, UserMySQLModel as User } from "../config/mysqlDB.js";

export const getAuditHistory = async (req, res) => {
  try {
    const { tableName, recordId } = req.params;

    const auditLogs = await AuditLog.findAll({
      where: {
        tableName,
        recordId,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "nameWithInitials"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    if (!auditLogs || auditLogs.length === 0) {
      return res.status(404).json({ message: "No audit history found" });
    }

    res.json(auditLogs);
  } catch (error) {
    console.error("Error fetching audit history:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
