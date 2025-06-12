const GraduateCert = require("../models/graduateCertModel");

exports.getByStudentId = async (req, res) => {
  const { student_id } = req.params;

  try {
    const data = await new Promise((resolve, reject) => {
      GraduateCert.getByStudentId(student_id, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy bằng tốt nghiệp" });
    }

    res.json(data[0]); // trả về object đầu tiên
  } catch (err) {
    console.error("Lỗi khi lấy bằng:", err);
    res.status(500).json({ error: "Lỗi máy chủ" });
  }
};
