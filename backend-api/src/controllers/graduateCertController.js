const GraduateCert = require("../models/graduateCertModel");

// graduateCertController.js
exports.getByStudentId = async (req, res) => {
  const { studentId } = req.params;

  try {
    const data = await new Promise((resolve, reject) => {
      GraduateCert.getByStudentId(studentId, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (!data) {
      return res.status(404).json({ message: "Không tìm thấy bằng tốt nghiệp" });
    }

    // ✅ Đảm bảo chỉ gửi 1 phản hồi
    return res.json(data);
  } catch (err) {
    console.error("Lỗi khi lấy bằng:", err);
    return res.status(500).json({ error: "Lỗi máy chủ" });
  }
};

