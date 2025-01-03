import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { sendEmail } from "../utils/sendEmail.js";

const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
	await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60); // 7days
};

const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 15 * 60 * 1000, // 15 minutes
	});
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});
};

export const signup = async (req, res) => {
	const { email, password, name } = req.body;
	try {
		const userExists = await User.findOne({ email });

		if (userExists) {
			return res.status(400).json({ message: "User already exists" });
		}
		const user = await User.create({ name, email, password });

		// authenticate
		const { accessToken, refreshToken } = generateTokens(user._id);
		await storeRefreshToken(user._id, refreshToken);

		setCookies(res, accessToken, refreshToken);

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			role: user.role,
		});
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const login = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({ email });

		if (user && (await user.comparePassword(password))) {
			const { accessToken, refreshToken } = generateTokens(user._id);
			await storeRefreshToken(user._id, refreshToken);
			setCookies(res, accessToken, refreshToken);

			res.json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role,
			});
		} else {
			res.status(400).json({ message: "Invalid email or password" });
		}
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
	}
};

export const logout = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;
		if (refreshToken) {
			const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
			await redis.del(`refresh_token:${decoded.userId}`);
		}

		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// this will refresh the access token
export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken;

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" });
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
		const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

		if (storedToken !== refreshToken) {
			return res.status(401).json({ message: "Invalid refresh token" });
		}

		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000,
		});

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

export const getProfile = async (req, res) => {
	try {
		res.json(req.user);
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message });
	}
};

// Quên mật khẩu - gửi mã xác nhận
export const resetPassword = async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Email không tồn tại' });
        }

        // Create a password reset token (valid for 15 minutes)
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Create the password reset link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        // Create email content
        const emailMessage = `
            Bạn vừa yêu cầu đặt lại mật khẩu. Nhấn vào liên kết bên dưới để đặt lại mật khẩu:
            <a href="${resetLink}">${resetLink}</a>
            Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.
        `;

        // Send email with the reset link
        await sendEmail(email, 'Đặt lại mật khẩu', emailMessage);

        res.status(200).json({ message: 'Mã xác nhận đã được gửi đến email của bạn' });
    } catch (error) {
        console.log("Error during password reset process:", error.message);
        res.status(500).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: 'Email không tồn tại' });

        // Tạo token để đặt lại mật khẩu
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Tạo liên kết reset mật khẩu
        const resetLink = `http://localhost:3000/reset-password/${resetToken}`;

        // Nội dung email
        const emailMessage = `
            Bạn vừa yêu cầu đặt lại mật khẩu. Nhấn vào liên kết bên dưới để đặt lại mật khẩu:
            ${resetLink}
            Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này.
        `;

        // Gửi email
        sendEmail(email, 'Đặt lại mật khẩu', emailMessage);

        res.status(200).json({ message: 'Mã xác nhận đã được gửi đến email' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Đặt lại mật khẩu
export const changePassword = async (req, res) => {
    const { token, newPassword } = req.body;
	
    try {
        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(404).json({ message: 'Người dùng không tồn tại' });

        // Mã hóa mật khẩu mới và lưu vào cơ sở dữ liệu
        user.password = newPassword
        await user.save();

        res.status(200).json({ message: 'Đặt lại mật khẩu thành công' });
    } catch (error) {
        res.status(400).json({ message: 'Mã xác nhận không hợp lệ hoặc đã hết hạn' });
    }
};

// Kiểm tra email đặt lại mật khẩu còn hạn hay không
export const verifyResetToken = (req, res) => {
    const { token } = req.body; // Lấy token từ request body

    try {
        // Giải mã token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Kiểm tra token hợp lệ
        res.status(200).json({ valid: true, message: "Token is valid" }); // Token hợp lệ
    } catch (error) {
        res.status(400).json({ valid: false, message: "Mã xác nhận không hợp lệ hoặc đã hết hạn" });
    }
};

//Kiểm tra token
export const verifyToken = async (req, res) => {
	try {
		const token = req.cookies.accessToken;
		if (!token) {
			return res.status(401).json({ message: "No access token provided" });
		}

		const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
		const user = await User.findById(decoded.userId);
		if (!user) {
			return res.status(401).json({ message: "Invalid user" });
		}

		res.status(200).json({ message: "Token is valid", user });
	} catch (error) {
		res.status(401).json({ message: "Invalid or expired token" });
	}
};