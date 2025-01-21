function validateRequestBody(req, res, next) {
//   console.log(req.body);
  const { parts } = req.body;

  if (!parts || !parts.umum || !parts.tb40) {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const { umum, tb40 } = parts;

  if (
    !umum.nama ||
    !umum.nama.lengkap ||
    !umum.lahir ||
    !umum.lahir.tanggal ||
    !umum.tanggal
  ) {
    return res.status(400).json({ error: "Invalid umum data" });
  }

  if (
    !Array.isArray(tb40) ||
    tb40.length !== 40 ||
    !tb40.every((score) => typeof score === "number")
  ) {
    return res.status(400).json({ error: "Invalid tb40 data" });
  }

  next();
}

module.exports = validateRequestBody;
