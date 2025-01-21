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
    return res.status(400).json({ error: "Invalid minimum 'umum' data" });
  }

  if (
    !Array.isArray(tb40) ||
    tb40.length !== 40 ||
    !tb40.every(
      (score) => typeof score === "number" && score >= 0 && score <= 100
    )
  ) {
    return res
      .status(400)
      .json({
        error:
          "Invalid tb40 data, should be array of 40 data of number between 0-100",
      });
  }

  next();
}

module.exports = validateRequestBody;
