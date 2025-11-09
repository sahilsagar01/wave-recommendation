import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getDrawerSettingsCollection } from "../mongodb.server";
import type { DrawerSettings } from "../types/drawer.types";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const collection = await getDrawerSettingsCollection();
  const settings = await collection.findOne({ shop });

  if (!settings) {
    // Return default settings
    const defaultSettings: Partial<DrawerSettings> = {
      shop,
      isEnabled: false,
      position: "right",
      width: 400,
      backgroundColor: "#ffffff",
      textColor: "#000000",
      closeButtonColor: "#000000",
      showTriggerButton: true,
      openOnCartClick: true,
      componentOrder: ["cart", "announcements", "progress", "recommendations"],
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

  const collection = await getDrawerSettingsCollection();

  if (action === "updateLayout") {
    // Only update the component order, don't touch other settings
    const componentOrderStr = formData.get("componentOrder")?.toString();
    const componentOrder = componentOrderStr ? JSON.parse(componentOrderStr) : ["cart", "announcements", "progress", "recommendations"];

    const result = await collection.updateOne(
      { shop },
      {
        $set: {
          componentOrder,
          updatedAt: new Date()
        },
        $setOnInsert: { createdAt: new Date() },
      },
      { upsert: true }
    );

    return json({ success: true, result });
  }

  if (action === "update") {
    const componentOrderStr = formData.get("componentOrder")?.toString();
    const componentOrder = componentOrderStr ? JSON.parse(componentOrderStr) : ["cart", "announcements", "progress", "recommendations"];

    const settings: Partial<DrawerSettings> = {
      shop,
      isEnabled: formData.get("isEnabled") === "true",
      position: (formData.get("position") as "left" | "right") || "right",
      width: Number(formData.get("width")) || 400,
      backgroundColor: formData.get("backgroundColor")?.toString() || "#ffffff",
      textColor: formData.get("textColor")?.toString() || "#000000",
      closeButtonColor: formData.get("closeButtonColor")?.toString() || "#000000",
      showTriggerButton: formData.get("showTriggerButton") === "true",
      openOnCartClick: formData.get("openOnCartClick") === "true",
      componentOrder,
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
