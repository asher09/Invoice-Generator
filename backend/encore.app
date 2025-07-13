aimport { api } from "encore.dev/api";

// Import all services to register them with Encore
import "./src/index";

// Health check endpoint
export const health = api(
  { expose: true, method: "GET", path: "/health" },
  async (): Promise<{ status: string; timestamp: string }> => {
    return { 
      status: "ok", 
      timestamp: new Date().toISOString() 
    };
  }
);
