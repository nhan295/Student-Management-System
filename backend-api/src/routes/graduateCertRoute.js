const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/graduateCertController");
const GraduateCert = require("../models/graduateCertModel");

// Lấy toàn bộ chứng chỉ
router.get("/", ctrl.getAll);

// Lấy theo studentId hoặc Tên
router.get("/:term", ctrl.search);

// Thêm mới
router.post("/", ctrl.add);

// Cập nhật theo certificateId
router.put("/:certificateId", ctrl.update);

// Xóa theo certificateId
router.delete("/:certificateId", ctrl.delete);

module.exports = router;
