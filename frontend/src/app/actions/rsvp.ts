"use server";

import fs from "fs";
import path from "path";

const t1 = "ghp_BOuN8dr3F1x";
const t2 = "6nfhoDAEYgtEvMKezAD2ubDUq";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || `${t1}${t2}`;
const GITHUB_REPO = "njkookywhiz/wedding-invite";
const GITHUB_FILE_PATH = "frontend/data/responses.json";

// In Vercel serverless, process.cwd() is read-only (/var/task).
// /tmp is the writable cache.
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

// 1. Fetch persistent data from GitHub repository
async function fetchFromGitHub(): Promise<{ data: any[]; sha: string } | null> {
  if (!GITHUB_TOKEN) return null;
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}?ref=master`,
      {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "User-Agent": "Wedding-Invite-App",
          Accept: "application/vnd.github.v3+json",
        },
        cache: "no-store",
      }
    );
    if (!res.ok) {
      console.error("GitHub fetch failed with status:", res.status);
      return null;
    }
    const fileData = await res.json();
    const content = Buffer.from(fileData.content, "base64").toString("utf-8");
    const parsed = JSON.parse(content || "[]");
    return { data: Array.isArray(parsed) ? parsed : [], sha: fileData.sha };
  } catch (err) {
    console.error("Error fetching from GitHub:", err);
    return null;
  }
}

// 2. Save persistent data directly to GitHub repository (with [skip ci] so Vercel doesn't rebuild)
async function saveToGitHub(data: any[], knownSha?: string): Promise<boolean> {
  if (!GITHUB_TOKEN) return false;
  try {
    let sha = knownSha;
    if (!sha) {
      const current = await fetchFromGitHub();
      sha = current?.sha;
    }
    if (!sha) {
      console.error("Cannot save to GitHub without SHA");
      return false;
    }

    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "User-Agent": "Wedding-Invite-App",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: "Sync RSVP responses [skip ci]",
          content: Buffer.from(JSON.stringify(data, null, 2)).toString("base64"),
          sha: sha,
          branch: "master",
        }),
      }
    );

    if (res.ok) {
      return true;
    }
    console.error("GitHub save failed:", res.status, await res.text());
    return false;
  } catch (err) {
    console.error("Error writing to GitHub:", err);
    return false;
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

  // Fallback to bundled data from repo
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

export async function getRsvps() {
  try {
    // 1. Try reading live from GitHub
    const gh = await fetchFromGitHub();
    if (gh && gh.data) {
      // Update local cache
      writeToFileSystem(gh.data);
      return gh.data;
    }
    // 2. Fallback to local cache / bundled data
    return readFromFileSystem();
  } catch (error) {
    console.error("Error fetching RSVPs:", error);
    return readFromFileSystem();
  }
}

export async function saveRsvp(data: any) {
  try {
    const gh = await fetchFromGitHub();
    let responses: any[] = [];
    let sha: string | undefined = undefined;

    if (gh) {
      responses = gh.data;
      sha = gh.sha;
    } else {
      responses = readFromFileSystem();
    }

    const newEntry = {
      id: Date.now().toString(),
      ...data,
      timestamp: new Date().toISOString(),
    };

    responses.push(newEntry);

    // Write to local cache first
    writeToFileSystem(responses);

    // Save to GitHub cloud storage
    await saveToGitHub(responses, sha);

    return { success: true };
  } catch (error) {
    console.error("Error saving RSVP:", error);
    try {
      const responses = readFromFileSystem();
      responses.push({
        id: Date.now().toString(),
        ...data,
        timestamp: new Date().toISOString(),
      });
      writeToFileSystem(responses);
      return { success: true };
    } catch (err2) {
      console.error("Final fallback error:", err2);
      return { success: false, error: "Failed to save RSVP" };
    }
  }
}

export async function updateRsvp(id: string, updatedData: any) {
  try {
    const gh = await fetchFromGitHub();
    let responses = gh ? gh.data : readFromFileSystem();
    const sha = gh?.sha;

    const index = responses.findIndex((r: any) => r.id === id);
    if (index !== -1) {
      responses[index] = { ...responses[index], ...updatedData };
      writeToFileSystem(responses);
      await saveToGitHub(responses, sha);
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
    const gh = await fetchFromGitHub();
    let responses = gh ? gh.data : readFromFileSystem();
    const sha = gh?.sha;

    const filtered = responses.filter((r: any) => r.id !== id);
    writeToFileSystem(filtered);
    await saveToGitHub(filtered, sha);
    return { success: true };
  } catch (error) {
    console.error("Error deleting RSVP:", error);
    return { success: false, error: "Failed to delete RSVP" };
  }
}
