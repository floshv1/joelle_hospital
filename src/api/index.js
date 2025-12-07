import app from "./app.js";

// launch the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`[server] listening on http://localhost:${PORT}`);
});
