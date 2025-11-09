import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  getDrawerSettingsCollection,
  getAnnouncementCollection,
  getProgressBarCollection,
  getRecommendationSettingsCollection,
} from "../mongodb.server";

// This route is accessible via app proxy: /apps/wave/drawer
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const shop = url.searchParams.get("shop");

  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  if (!shop) {
    return json({ error: "Shop parameter is required" }, { status: 400, headers });
  }

  try {
    // Fetch all drawer related data
    const [drawerSettings, announcements, progressBars, recommendationSettings] = await Promise.all([
      (await getDrawerSettingsCollection()).findOne({ shop }),
      (await getAnnouncementCollection()).find({ shop, isEnabled: true }).sort({ order: 1 }).toArray(),
      (await getProgressBarCollection()).find({ shop, isEnabled: true }).sort({ order: 1 }).toArray(),
      (await getRecommendationSettingsCollection()).findOne({ shop }),
    ]);

    // Return data only if drawer is enabled
    if (!drawerSettings || !drawerSettings.isEnabled) {
      return json({ enabled: false }, { headers });
    }

    return json({
      enabled: true,
      settings: drawerSettings,
      announcements,
      progressBars,
      recommendationSettings,
    }, { headers });
  } catch (error) {
    console.error("Error fetching drawer data:", error);
    return json({ error: "Failed to fetch drawer data" }, { status: 500, headers });
  }
};
