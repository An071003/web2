import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, createCheckoutSession } from "../controllers/payment.controller.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API endpoints for payment processing
 */

/**
 * @swagger
 * /api/payments/create-checkout-session:
 *   post:
 *     summary: Create a Stripe checkout session
 *     tags: [Payments]

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *                     quantity:
 *                       type: number
 *                     image:
 *                       type: string
 *                       format: uri
 *               couponCode:
 *                 type: string
 *                 description: Optional coupon code to apply discounts
 *     responses:
 *       200:
 *         description: Checkout session created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The ID of the Stripe checkout session
 *                 totalAmount:
 *                   type: number
 *                   description: Total amount to be paid (in dollars)
 *       400:
 *         description: Invalid request (e.g., empty products array)
 *       500:
 *         description: Error processing checkout
 */
router.post("/create-checkout-session", protectRoute, createCheckoutSession);

/**
 * @swagger
 * /api/payments/checkout-success:
 *   post:
 *     summary: Handle successful checkout and create an order
 *     tags: [Payments]

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sessionId:
 *                 type: string
 *                 description: The Stripe session ID from the successful checkout
 *     responses:
 *       200:
 *         description: Payment processed successfully, order created, and coupon deactivated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Indicates successful processing
 *                 message:
 *                   type: string
 *                   description: Details about the success
 *                 orderId:
 *                   type: string
 *                   description: The ID of the newly created order
 *       500:
 *         description: Error processing successful checkout
 */
router.post("/checkout-success", protectRoute, checkoutSuccess);

export default router;