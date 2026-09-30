import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/index.js";

export async function listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        serviceId: true,
        displayName: true,
        role: { select: { name: true } },
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
}

export async function listRoles(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const roles = await prisma.role.findMany({ orderBy: { name: "asc" } });
    res.json({ success: true, data: roles });
  } catch (error) {
    next(error);
  }
}

export async function listAuditLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const search = req.query.search ? String(req.query.search) : undefined;

    const where: any = {};
    if (search) {
      where.OR = [
        { userName: { contains: search } },
        { action: { contains: search } },
        { resource: { contains: search } },
      ];
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: "desc" },
      take: 100,
    });

    const formatted = logs.map((l) => ({
      id: l.id,
      user: l.userName,
      action: l.action,
      resource: l.resource,
      timestamp: new Date(l.timestamp).toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
      }),
      result: l.result,
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    next(error);
  }
}
