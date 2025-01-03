import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getCoupon, validateCoupon } from "../controllers/coupon.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: API endpoints for managing coupons
 */

/**
 * @swagger
 * /api/coupons:
 *   get:
 *     summary: Get the active coupon for the logged-in user
 *     tags: [Coupons]

 *     responses:
 *       200:
 *         description: Active coupon retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 code:
 *                   type: string
 *                 discountPercentage:
 *                   type: number
 *                 expirationDate:
 *                   type: string
 *                   format: date-time
 *                 isActive:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", protectRoute, getCoupon);

/**
 * @swagger
 * /api/coupons/validate:
 *   post:
 *     summary: Validate a coupon code
 *     tags: [Coupons]

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 description: The coupon code to validate
 *     responses:
 *       200:
 *         description: Coupon is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 code:
 *                   type: string
 *                 discountPercentage:
 *                   type: number
 *       404:
 *         description: Coupon not found or expired
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/validate", protectRoute, validateCoupon);

export default router;