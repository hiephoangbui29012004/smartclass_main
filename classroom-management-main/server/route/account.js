require("dotenv").config();
const path = require("path");
const nodeExcel = require("excel-export");

const express = require("express");
const router = new express.Router();
const db = require("../models");
const argon2 = require("argon2");
const Account = db.account;

//@route get /api/account/export
//@desp export to excel
//@private access
router.get("/export/", async (req, res) => {
  const { accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  try {
    const account = await Account.findAll();
    let conf = {};
    conf.name = "mysheet";

    conf.cols = [
      { caption: "username", type: "string" },
      { caption: "fullname", type: "string" },
      { caption: "role", type: "number" },
      { caption: "email", type: "string" },
    ];
    conf.rows = account.map((item) => {
      return [item.username, item.fullname, item.role, item.email];
    });
    const excel = nodeExcel.execute(conf);
    res.setHeader("Content-Type", "application/vnd.openxmlformats");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Accounts.xlsx"
    );
    res.end(excel, "binary");
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route get /api/account/
//@desp get all account
//@private access
router.get("/", async (req, res) => {
  const { accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  try {
    const account = await Account.findAll();
    res.json({
      success: true,
      message: "Success",
      data: account,
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route put /api/account/:useId
//@desp update account by id
//@private access
router.post("/", async (req, res) => {
  const { username, password, fullname, role, email, accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
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
    await Account.create({
      username,
      password: hashedPassword,
      fullname: fullname || "",
      role: role || 1,
      email: email || "",
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

//@route get /api/account/:useId
//@desp get account by id
//@private access
// Trong hàm resetPassword ở backend của bạn
router.put("/reset-password/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // ... (tạo mật khẩu mới và hash)
    const newPassword = generateRandomPassword(12); // Hàm tạo password của bạn
    const hashedPassword = await argon2.hash(newPassword);

    // ĐIỂM CỰC KỲ QUAN TRỌNG: ĐẢM BẢO CÓ 'await' VÀ KIỂM TRA KẾT QUẢ
    const [rowsAffected] = await Account.update(
      { password: hashedPassword },
      { where: { id: id } }
    );

    console.log(`Updated ${rowsAffected} rows for user ID: ${id}`); // Log số hàng bị ảnh hưởng

    if (rowsAffected === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy tài khoản để đặt lại mật khẩu." });
    }

    return res.json({
      success: true,
      message: "Đặt lại mật khẩu thành công",
      data: { newPassword: newPassword }, // Trả về mật khẩu chưa hash cho frontend
    });
  } catch (error) {
    console.error("Lỗi khi đặt lại mật khẩu:", error);
    return res.status(500).json({ error: "Lỗi server nội bộ khi đặt lại mật khẩu." });
  }
});


//@route delete /api/account/:useId
//@desp delete account by id
//@private access
router.delete("/:useId", async (req, res) => {
  const { accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  try {
    await Account.destroy({
      where: {
        id: req.params.useId,
      },
    });

    res.json({
      success: true,
      message: "Success",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//@route get /api/account/reset-password/:useId
//@desp get account by id
//@private access
router.get("/reset-password/:useId", async (req, res) => {
  const { accRole } = req.body;
  //if (accRole === 0)
  //  return res.status(405).json({ error: "Method Not Allowed " });
  try {
    const account = await Account.findOne({
      where: { id: req.params.useId },
    });
    if (!account) {
      return res
        .status(400)
        .json({ success: false, message: "Username not exists" });
    }
    //all good
    const chars =
      "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const passwordLength = 12;
    let password = "";
    for (let i = 0; i < passwordLength; i++) {
      let randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    console.log("Generated password (before hashing):", password);
    const hashedPassword = await argon2.hash(password);
    console.log("Hashed password:", hashedPassword);
    console.log("ID được sử dụng để update:", req.params.useId);
    
    await Account.update(
      {
        password: hashedPassword,
      },
      {
        where: { id: req.params.useId },
      }
    );
    res.json({
      success: true,
      message: "Password reset",
      data: { newPassword: password },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

const upload = require("../middleware/upload");

const readXlsxFile = require("read-excel-file/node");

//@route post /api/account/import
//@desp import excel
//@private access
router.post("/import", upload.single("file"), async (req, res) => {
  const { accRole } = req.body;
  if (accRole === 0)
    return res.status(405).json({ error: "Method Not Allowed " });
  try {
    if (req.file == undefined) {
      return res.status(400).send("Please upload an excel file!");
    }
    console.log(__dirname);
    let path = __basedir + "/resources/" + req.file.filename;

    readXlsxFile(path).then(async (rows) => {
      // skip header
      rows.shift();

      let accounts = [];

      rows.forEach((row) => {
        let account = {
          username: row[0],
          password: row[1],
          fullname: row[2],
          role: row[3],
          email: row[4],
        };

        accounts.push(account);
      });

      const newArr = await Promise.all(
        accounts.map(async (item) => ({
          ...item,
          password: await argon2.hash(item.password),
        }))
      );
      console.log(newArr);
      Account.bulkCreate(newArr)
        .then(() => {
          res.status(200).send({
            message: "Uploaded the file successfully: " + req.file.originalname,
          });
        })
        .catch((error) => {
          res.status(500).send({
            message: "Fail to import data into database! ",
            error: error.message,
          });
        });
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "Could not upload the file: " + req.file.originalname,
    });
  }
});

//@route POST /api/account/changePass
//@desp changePass
//@private access

router.post("/changePass", async (req, res) => {
  const { pass, newpass1, newpass2, useId } = req.body;
  if (!pass || !newpass1 | !newpass2) {
    return res
      .status(400)
      .json({ success: false, message: "Missing something!" });
  }
  if (newpass1 !== newpass2) {
    return res
      .status(400)
      .json({ success: false, message: "Not verifying password!" });
  }
  try {
    const account = await Account.findOne({
      where: { id: useId },
    });

    if (!account) {
      return res.status(400).json({
        success: false,
        message: "Not found account",
      });
    }
    const passwordValid = await argon2.verify(account.password, pass);

    if (!passwordValid) {
      return res.status(400).json({
        success: false,
        message: "Password is not correct",
      });
    }
    //all good
    const hashPassword = await argon2.hash(newpass1);
    await Account.update(
      {
        password: hashPassword,
      },
      {
        where: { id: useId },
      }
    );
    res.json({
      success: true,
      message: "Success",
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
module.exports = router;
