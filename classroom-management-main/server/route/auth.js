require("dotenv").config();
const argon2 = require("argon2");
const express = require("express");
const jwt = require("jsonwebtoken");
const db = require("../models");

const router = new express.Router();

const Account = db.account;

//@route POST /api/auth/register
//@desp register new account
//@public access
router.post("/register", async (req, res) => {
  const { username, password, fullname } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing any field!" });
  }

  try {
    const account = await Account.findOne({
      where: { username },
    });

    if (account) {
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }
    //all good
    const hashedPassword = await argon2.hash(password);
    //console.log(hashedPassword);
    await Account.create({
      username,
      password: hashedPassword,
      fullname: fullname || "",
    });
    res.json({
      success: true,
      message: "Account created",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
//@route POST /api/auth/login
//@desp login
//@public access
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing username or password!" });
  }
  try {
    const account = await Account.findOne({
      where: { username },
    });
    console.log("Tài khoản:", account);
    if (!account) {
      return res.status(400).json({
        success: false,
        message: "Username or password is not correct",
      });
    }
    const passwordValid = await argon2.verify(account.password, password);
    
    console.log("Mật khẩu đúng:", passwordValid);
    if (!passwordValid) {
      return res.status(400).json({
        success: false,
        message: "Username or password is not correct",
      });
    }
    //all good
    const accessToken = jwt.sign(
      { accountId: account.id, role: account.role },
      process.env.ACCESS_TOKEN_PRIVATE,
      {
        expiresIn: process.env.JWT_EXPIRES_IN + "s",
      }
    );

    res.json({
      success: true,
      message: "Login success",
      access_token: accessToken,
      expiresIn: process.env.JWT_EXPIRES_IN,
      role: account.role,
      fullname: account.fullname,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
