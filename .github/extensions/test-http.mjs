import { request } from "node:http";

export async function splitJson(url, headers, value) {
    const bytes = Buffer.from(JSON.stringify(value));
    const marker = bytes.indexOf(Buffer.from("é"));
    if (marker < 0) throw new Error("Missing split character");
    return new Promise((resolve, reject) => {
        const req = request(url, { method: "POST", headers }, res => {
            const chunks = [];
            res.on("data", chunk => chunks.push(chunk));
            res.on("end", () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString("utf8") }));
        });
        req.on("error", reject);
        req.write(bytes.subarray(0, marker + 1));
        setTimeout(() => req.end(bytes.subarray(marker + 1)), 20);
    });
}
