import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getRecommendationSettingsCollection } from "../mongodb.server";
import type { RecommendationSettings } from "../types/drawer.types";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const collection = await getRecommendationSettingsCollection();
  const settings = await collection.findOne({ shop });

  if (!settings) {
    const defaultSettings: Partial<RecommendationSettings> = {
      shop,
      isEnabled: false,
      title: "Recommended for you",
      numberOfProducts: 4,
      layout: "grid",
      showPrice: true,
      showAddToCart: true,
      cardBackgroundColor: "#ffffff",
      cardBorderRadius: 8,
      titleColor: "#000000",
      titleFontSize: 16,
      priceColor: "#000000",
      priceFontSize: 14,
      buttonBackgroundColor: "#000000",
      buttonTextColor: "#ffffff",
      buttonFontSize: 14,
      order: 3,
    };
    return json(defaultSettings);
  }

  return json(settings);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const formData = await request.formData();
  const action = formData.get("action");

  const collection = await getRecommendationSettingsCollection();

  if (action === "update") {
    const settings: Partial<RecommendationSettings> = {
      shop,
      isEnabled: formData.get("isEnabled") === "true",
      title: formData.get("title")?.toString() || "Recommended for you",
      numberOfProducts: Number(formData.get("numberOfProducts")) || 4,
      layout: (formData.get("layout") as "grid" | "list") || "grid",
      showPrice: formData.get("showPrice") === "true",
      showAddToCart: formData.get("showAddToCart") === "true",
      cardBackgroundColor: formData.get("cardBackgroundColor")?.toString() || "#ffffff",
      cardBorderRadius: Number(formData.get("cardBorderRadius")) || 8,
      titleColor: formData.get("titleColor")?.toString() || "#000000",
      titleFontSize: Number(formData.get("titleFontSize")) || 16,
      priceColor: formData.get("priceColor")?.toString() || "#000000",
      priceFontSize: Number(formData.get("priceFontSize")) || 14,
      buttonBackgroundColor: formData.get("buttonBackgroundColor")?.toString() || "#000000",
      buttonTextColor: formData.get("buttonTextColor")?.toString() || "#ffffff",
      buttonFontSize: Number(formData.get("buttonFontSize")) || 14,
      order: Number(formData.get("order")) || 3,
      updatedAt: new Date(),
    };

    const result = await collection.updateOne(
      { shop },
      {
        $set: settings,
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    return json({ success: true, result });
  }

  return json({ success: false, error: "Invalid action" }, { status: 400 });
};
