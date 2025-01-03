import express from "express";
import { 
  addToCart, 
  getCartProducts, 
  removeAllFromCart, 
  updateQuantity 
} from "../controllers/cart.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API endpoints for managing the shopping cart
 */

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get all products in the cart
 *     tags: [Cart]

 *     responses:
 *       200:
 *         description: List of products in the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   price:
 *                     type: number
 *                   quantity:
 *                     type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get("/", protectRoute, getCartProducts);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add a product to the cart
 *     tags: [Cart]

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product added to the cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: List of product IDs in the cart
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/", protectRoute, addToCart);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Remove all products or a specific product from the cart
 *     tags: [Cart]

 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to remove (optional)
 *     responses:
 *       200:
 *         description: Product(s) removed from the cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: List of remaining product IDs in the cart
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.delete("/:id", protectRoute, removeAllFromCart);

/**
 * @swagger
 * /api/cart/{id}:
 *   put:
 *     summary: Update the quantity of a product in the cart
 *     tags: [Cart]

 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 description: The new quantity of the product
 *     responses:
 *       200:
 *         description: Product quantity updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: List of product IDs in the cart
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put("/:id", protectRoute, updateQuantity);

export default router;
