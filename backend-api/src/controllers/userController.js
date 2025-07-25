const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const adminUserName = process.env.ADMIN_USERNAME;
    const adminPassWord = process.env.ADMIN_HASH_PASSWORD;
    const jwtSecret = process.env.JWT_SECRET;
    const jwtRefresh = process.env.JWT_REFRESH_SECRET;

    if (username !== adminUserName) {
      return res.status(400).json({ message: "Wrong username or password" });
    }
    const isMatch = await bcrypt.compare(password, adminPassWord);
    if (!isMatch) {
      return res.status(401).json({ message: "Password does not match" });
    } else {
      const access_token = jwt.sign({ username }, jwtSecret, {
        expiresIn: "1h",
      });
      const refresh_token = jwt.sign({ username }, jwtRefresh, {
        expiresIn: "1d",
      });

      res.cookie("refresh_token", refresh_token, {
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 1000 * 60 * 60 * 24, // cookie tồn tại 1 ngày
      });

      return res
        .status(200)
        .json({ message: "Login successfully!", access_token, refresh_token });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error Login" });
  }
};

const refreshToken = (req, res) => {
  const token = req.cookies.refresh_token;
  if (token) {
    jwt.verify(token, process.env.JWT_REFRESH_SECRET, (err, user) => {
      if (err) return res.sendStatus(403); // token sai hoặc hết hạn
      const newAccessToken = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      res.json({ accessToken: newAccessToken });
    });
  } else {
    return res.sendStatus(401);
  }
};

module.exports = {
  login,
  refreshToken,
};
