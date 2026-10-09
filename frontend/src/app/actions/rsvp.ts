"use server";

import fs from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "responses.json");

export async function saveRsvp(data: any) {
  try {
    const dir = path.dirname(dataFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    let responses = [];
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, "utf-8");
      responses = JSON.parse(fileContent || "[]");
    }

    const newEntry = {
      id: Date.now().toString(),
      ...data,
      timestamp: new Date().toISOString(),
    };

    responses.push(newEntry);
    fs.writeFileSync(dataFilePath, JSON.stringify(responses, null, 2));

    return { success: true };
  } catch (error) {
    console.error("Error saving RSVP:", error);
    return { success: false, error: "Failed to save RSVP" };
  }
}

export async function getRsvps() {
  try {
    if (!fs.existsSync(dataFilePath)) return [];
    const fileContent = fs.readFileSync(dataFilePath, "utf-8");
    return JSON.parse(fileContent || "[]");
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
      fs.writeFileSync(dataFilePath, JSON.stringify(responses, null, 2));
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
    fs.writeFileSync(dataFilePath, JSON.stringify(filtered, null, 2));
    return { success: true };
  } catch (error) {
    console.error("Error deleting RSVP:", error);
    return { success: false, error: "Failed to delete RSVP" };
  }
}
