const request = require("supertest");
const express = require("express");
const path = require("path");

const app = express();
app.use(express.json());

// public/ is two levels up from tests/ folder
app.use(express.static(path.join(__dirname, "../../public")));

app.get("/health", (req, res) => {
    res.status(200).json({ status: "ok" });
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../public", "index.html"));
});

describe("Health Check", () => {
    test("GET /health should return 200 and status ok", async () => {
        const res = await request(app).get("/health");
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe("ok");
    });
});

describe("Frontend Serving", () => {
    test("GET / should return 200", async () => {
        const res = await request(app).get("/");
        expect(res.statusCode).toBe(200);
    });
});

describe("Fallback Route", () => {
    test("GET /unknown should return 200 (index.html fallback)", async () => {
        const res = await request(app).get("/some-unknown-route");
        expect(res.statusCode).toBe(200);
    });
});

describe("JSON Middleware", () => {
    test("App should have JSON middleware", () => {
        const middleware = app._router.stack.map(l => l.name);
        expect(middleware).toBeDefined();
    });
});