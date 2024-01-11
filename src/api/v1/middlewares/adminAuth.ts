import { prisma } from "../../../services/prisma";
import { Request, Response, NextFunction } from "express";

const adminAuth = (hierarchyNumber: number) => async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.user;


	const actualUser = await prisma.user.findFirst({
		where: {
			id: id as number,
		},
		include: {
			hierarchy: true
		}
	});

	// 1 - dev, 2 - master, 3 - admin, 4 - employee
	if (!actualUser || !actualUser.hierarchy || actualUser.hierarchy.id > hierarchyNumber) {
		return res.status(403).json({ message: "Acesso negado." });
	}

	if (!actualUser) {
		return res.status(403).json({ message: "Acesso negado." });
	}

	req.user.hierarchy_id = actualUser.hierarchy.id;
	next();
};

export default adminAuth;
