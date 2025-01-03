import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getFeaturedProducts,
  getProductsByCategory,
  getRecommendedProducts,
  toggleFeaturedProduct,
  updateProduct,
  searchProducts,
  filterProducts,
  getProductById,
} from "../controllers/product.controller.js";
import { adminRoute, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API endpoints for managing products
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]

 *     responses:
 *       200:
 *         description: A list of products
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
 */
router.get("/", protectRoute, adminRoute, getAllProducts);

/**
 * @swagger
 * /api/products/featured:
 *   get:
 *     summary: Get featured products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of featured products
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
 */
router.get("/featured", getFeaturedProducts);

/**
 * @swagger
 * /api/products/category/{category}:
 *   get:
 *     summary: Get products by category
 *     tags: [Products]
 *     parameters:
 *       - name: category
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The category of the products
 *     responses:
 *       200:
 *         description: A list of products in the category
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
 */
router.get("/category/:category", getProductsByCategory);

/**
 * @swagger
 * /api/products/recommendations:
 *   get:
 *     summary: Get recommended products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: A list of recommended products
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
 */
router.get("/recommendations", getRecommendedProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               brand:
 *                 type: string
 *               countInStock:
 *                 type: number
 *               isFeatured:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 */
router.post("/", protectRoute, adminRoute, createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   patch:
 *     summary: Toggle featured status of a product
 *     tags: [Products]

 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.patch("/:id", protectRoute, adminRoute, toggleFeaturedProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]

 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */
router.delete("/:id", protectRoute, adminRoute, deleteProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]

 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               brand:
 *                 type: string
 *               countInStock:
 *                 type: number
 *               isFeatured:
 *                 type: boolean
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 */
router.put("/:id", protectRoute, adminRoute, updateProduct);

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     summary: Search for products
 *     tags: [Products]
 *     parameters:
 *       - name: keyword
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         description: Keyword to search for
 *     responses:
 *       200:
 *         description: A list of products matching the keyword
 */
router.get("/search", searchProducts);

/**
 * @swagger
 * /api/products/filter:
 *   get:
 *     summary: Filter products
 *     tags: [Products]
 *     parameters:
 *       - name: brand
 *         in: query
 *         schema:
 *           type: string
 *       - name: category
 *         in: query
 *         schema:
 *           type: string
 *       - name: priceRange
 *         in: query
 *         schema:
 *           type: string
 *         description: Price range to filter by (e.g., below_1_million, 1_to_2_million, above_2_million)
 *     responses:
 *       200:
 *         description: A list of filtered products
 */
router.get("/filter", filterProducts);


/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by its ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The product ID
 *     responses:
 *       200:
 *         description: A product matching the provided ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 price:
 *                   type: number
 *                 description:
 *                   type: string
 *                 image:
 *                   type: string
 *                 category:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 countInStock:
 *                   type: number
 *                 isFeatured:
 *                   type: boolean
 *       404:
 *         description: Product not found
 */
router.get("/:id", protectRoute, getProductById);

export default router;