const express = require("express");
const app = express();
const PORT = 3012;
app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
});
