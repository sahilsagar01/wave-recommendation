import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getAnnouncementCollection } from "../mongodb.server";
import type { Announcement } from "../types/drawer.types";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const collection = await getAnnouncementCollection();
  const announcements = await collection.find({ shop }).sort({ order: 1 }).toArray();

  return json(announcements);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const formData = await request.formData();
  const action = formData.get("action");

  const collection = await getAnnouncementCollection();

  if (action === "create" || action === "update") {
    const announcement: Partial<Announcement> = {
      shop,
      isEnabled: formData.get("isEnabled") === "true",
      title: formData.get("title")?.toString() || "",
      message: formData.get("message")?.toString() || "",
      backgroundColor: formData.get("backgroundColor")?.toString() || "#f3f4f6",
      textColor: formData.get("textColor")?.toString() || "#000000",
      fontSize: Number(formData.get("fontSize")) || 14,
      fontWeight: formData.get("fontWeight")?.toString() || "normal",
      link: formData.get("link")?.toString() || "",
      linkText: formData.get("linkText")?.toString() || "",
      order: Number(formData.get("order")) || 0,
      updatedAt: new Date(),
    };

    if (action === "create") {
      announcement.createdAt = new Date();
      const result = await collection.insertOne(announcement as Announcement);
      return json({ success: true, id: result.insertedId });
    } else {
      const id = formData.get("id")?.toString();
      if (!id) {
        return json({ success: false, error: "ID required for update" }, { status: 400 });
      }
      const { ObjectId } = await import("mongodb");
      const result = await collection.updateOne(
        { _id: new ObjectId(id), shop },
        { $set: announcement }
      );
      return json({ success: true, result });
    }
  }

  if (action === "delete") {
    const id = formData.get("id")?.toString();
    if (!id) {
      return json({ success: false, error: "ID required" }, { status: 400 });
    }
    const { ObjectId } = await import("mongodb");
    await collection.deleteOne({ _id: new ObjectId(id), shop });
    return json({ success: true });
  }

  return json({ success: false, error: "Invalid action" }, { status: 400 });
};
