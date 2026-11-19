"use server";

import fs from "fs";
import path from "path";

// Helper to check for Vercel KV / Upstash Redis env vars
function getKvConfig() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    return { url, token };
  }
  return null;
}

async function kvGet(): Promise<any[] | null> {
  const kv = getKvConfig();
  if (!kv) return null;
  try {
    const res = await fetch(`${kv.url}/get/wedding_rsvps`, {
      headers: { Authorization: `Bearer ${kv.token}` },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data.result) {
        return typeof data.result === "string" ? JSON.parse(data.result) : data.result;
      }
      return [];
    }
  } catch (err) {
    console.error("KV get error:", err);
  }
  return null;
}

async function kvSet(data: any[]): Promise<boolean> {
  const kv = getKvConfig();
  if (!kv) return false;
  try {
    const res = await fetch(`${kv.url}/set/wedding_rsvps`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${kv.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(typeof data === "string" ? data : JSON.stringify(data)),
    });
    return res.ok;
  } catch (err) {
    console.error("KV set error:", err);
    return false;
  }
}

// In Vercel serverless, process.cwd() is read-only (/var/task).
// Only /tmp is writable.
function getWritableFilePath(): string {
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join("/tmp", "responses.json");
  }

  const localDir = path.join(process.cwd(), "data");
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    fs.accessSync(localDir, fs.constants.W_OK);
    return path.join(localDir, "responses.json");
  } catch {
    return path.join("/tmp", "responses.json");
  }
}

function readFromFileSystem(): any[] {
  const writablePath = getWritableFilePath();
  if (fs.existsSync(writablePath)) {
    try {
      const content = fs.readFileSync(writablePath, "utf-8");
      return JSON.parse(content || "[]");
    } catch (e) {
      console.error("Error reading writable file:", e);
    }
  }

  // Fallback to bundled data from repo if writable file does not exist yet
  const possiblePaths = [
    path.join(process.cwd(), "data", "responses.json"),
    path.join(process.cwd(), "frontend", "data", "responses.json"),
  ];
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, "utf-8");
        return JSON.parse(content || "[]");
      }
    } catch {
      // ignore
    }
  }

  return [];
}

function writeToFileSystem(data: any[]): boolean {
  const targetPaths = [
    getWritableFilePath(),
    path.join("/tmp", "responses.json"),
  ];

  for (const targetPath of targetPaths) {
    try {
      const dir = path.dirname(targetPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(targetPath, JSON.stringify(data, null, 2));
      return true;
    } catch (e) {
      console.error(`Failed writing to ${targetPath}:`, e);
    }
  }
  return false;
}

export async function saveRsvp(data: any) {
  try {
    const responses = await getRsvps();
    const newEntry = {
      id: Date.now().toString(),
      ...data,
      timestamp: new Date().toISOString(),
    };

    responses.push(newEntry);

    // Save to KV if configured
    await kvSet(responses);

    // Also persist to writable file system
    writeToFileSystem(responses);

    return { success: true };
  } catch (error) {
    console.error("Error saving RSVP:", error);
    // Last-resort fallback to /tmp
    try {
      const responses = readFromFileSystem();
      responses.push({
        id: Date.now().toString(),
        ...data,
        timestamp: new Date().toISOString(),
      });
      fs.writeFileSync(path.join("/tmp", "responses.json"), JSON.stringify(responses, null, 2));
      return { success: true };
    } catch (err2) {
      console.error("Final fallback error:", err2);
      return { success: false, error: "Failed to save RSVP" };
    }
  }
}

export async function getRsvps() {
  try {
    const kvData = await kvGet();
    if (kvData !== null) {
      return kvData;
    }
    return readFromFileSystem();
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return [];
  }
}

export async function updateRsvp(id: string, updatedData: any) {
  try {
    let responses = await getRsvps();
    const index = responses.findIndex((r: any) => r.id === id);
    
    if (index !== -1) {
      responses[index] = { ...responses[index], ...updatedData };
      await kvSet(responses);
      writeToFileSystem(responses);
      return { success: true };
    }
    return { success: false, error: "Not found" };
  } catch (error) {
    console.error("Error updating RSVP:", error);
    return { success: false, error: "Failed to update RSVP" };
  }
}

export async function deleteRsvp(id: string) {
  try {
    let responses = await getRsvps();
    const filtered = responses.filter((r: any) => r.id !== id);
    await kvSet(filtered);
    writeToFileSystem(filtered);
    return { success: true };
  } catch (error) {
    console.error("Error deleting RSVP:", error);
    return { success: false, error: "Failed to delete RSVP" };
  }
}

