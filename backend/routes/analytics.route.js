import express from "express";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";
import { getAnalyticsData, getDailySalesData } from "../controllers/analytics.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: API endpoints for analytics and sales data
 */

/**
 * @swagger
 * /api/analytics:
 *   get:
 *     summary: Get analytics data and daily sales data
 *     tags: [Analytics]

 *     responses:
 *       200:
 *         description: Analytics data and daily sales data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 analyticsData:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: number
 *                       description: Total number of users
 *                     products:
 *                       type: number
 *                       description: Total number of products
 *                     totalSales:
 *                       type: number
 *                       description: Total number of sales
 *                     totalRevenue:
 *                       type: number
 *                       description: Total revenue generated
 *                 dailySalesData:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       date:
 *                         type: string
 *                         format: date
 *                         description: The date of the sales
 *                       sales:
 *                         type: number
 *                         description: Number of sales on that date
 *                       revenue:
 *                         type: number
 *                         description: Total revenue generated on that date
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", protectRoute, adminRoute, async (req, res) => {
	try {
		const analyticsData = await getAnalyticsData();

		const endDate = new Date();
		const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

		const dailySalesData = await getDailySalesData(startDate, endDate);

		res.json({
			analyticsData,
			dailySalesData,
		});
	} catch (error) {
		console.log("Error in analytics route", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
});

export default router;