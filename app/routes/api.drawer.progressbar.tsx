import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import { getProgressBarCollection } from "../mongodb.server";
import type { ProgressBar } from "../types/drawer.types";

async function createShippingDiscount(admin: any, goalAmount: number, goalText: string) {
  try {
    // First, get the function ID
    const queryFunctions = `
      query {
        shopifyFunctions(first: 25) {
          nodes {
            id
            apiType
            title
          }
        }
      }
    `;

    const functionsResponse = await admin.graphql(queryFunctions);
    const functionsResult = await functionsResponse.json();

    // Find the shipping discount function
    const shippingFunction = functionsResult.data?.shopifyFunctions?.nodes?.find(
      (func: any) => func.apiType === "shipping_discounts"
    );

    if (!shippingFunction) {
      console.error("Shipping discount function not found. Available functions:", functionsResult.data?.shopifyFunctions?.nodes);
      return {
        success: false,
        error: "Shipping discount function not deployed. Please run 'npm run deploy' first."
      };
    }

    console.log("Found shipping function:", shippingFunction);

    // Create an automatic discount using the Shopify Function
    const mutation = `
      mutation CreateAutomaticDiscount($discount: DiscountAutomaticAppInput!) {
        discountAutomaticAppCreate(automaticAppDiscount: $discount) {
          automaticAppDiscount {
            discountId
            title
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const variables = {
      discount: {
        title: `Wave Free Shipping - ${goalText}`,
        functionId: shippingFunction.id,
        startsAt: new Date().toISOString(),
        metafields: [
          {
            namespace: "$app:shipping-discount",
            key: "function-configuration",
            type: "json",
            value: JSON.stringify({
              goalAmount: goalAmount,
              goalText: goalText
            })
          }
        ]
      }
    };

    const response = await admin.graphql(mutation, { variables });
    const result = await response.json();

    if (result.data?.discountAutomaticAppCreate?.userErrors?.length > 0) {
      console.error("Error creating discount:", result.data.discountAutomaticAppCreate.userErrors);
      return { success: false, errors: result.data.discountAutomaticAppCreate.userErrors };
    }

    console.log("Created automatic shipping discount:", result.data?.discountAutomaticAppCreate?.automaticAppDiscount);
    return { success: true, discount: result.data?.discountAutomaticAppCreate?.automaticAppDiscount };
  } catch (error) {
    console.error("Failed to create shipping discount:", error);
    return { success: false, error: String(error) };
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const shop = session.shop;

  const collection = await getProgressBarCollection();
  const progressBars = await collection.find({ shop }).sort({ order: 1 }).toArray();

  return json(progressBars);
};

export const action = async ({ request }: ActionFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);
  const shop = session.shop;

  const formData = await request.formData();
  const action = formData.get("action");

  const collection = await getProgressBarCollection();

  if (action === "create" || action === "update") {
    const progressBar: Partial<ProgressBar> = {
      shop,
      isEnabled: formData.get("isEnabled") === "true",
      title: formData.get("title")?.toString() || "",
      goalAmount: Number(formData.get("goalAmount")) || 100,
      goalText: formData.get("goalText")?.toString() || "Free Shipping",
      backgroundColor: formData.get("backgroundColor")?.toString() || "#e5e7eb",
      progressColor: formData.get("progressColor")?.toString() || "#10b981",
      textColor: formData.get("textColor")?.toString() || "#000000",
      showPercentage: formData.get("showPercentage") === "true",
      showAmount: formData.get("showAmount") === "true",
      height: Number(formData.get("height")) || 20,
      borderRadius: Number(formData.get("borderRadius")) || 10,
      order: Number(formData.get("order")) || 0,
      updatedAt: new Date(),
    };

    // Create automatic shipping discount when enabled
    if (progressBar.isEnabled && progressBar.goalAmount && progressBar.goalText) {
      const discountResult = await createShippingDiscount(admin, progressBar.goalAmount, progressBar.goalText);
      console.log("Discount creation result:", discountResult);
    }

    if (action === "create") {
      progressBar.createdAt = new Date();
      const result = await collection.insertOne(progressBar as any);
      return json({ success: true, id: result.insertedId });
    } else {
      const id = formData.get("id")?.toString();
      if (!id) {
        return json({ success: false, error: "ID required for update" }, { status: 400 });
      }
      const { ObjectId } = await import("mongodb");
      const result = await collection.updateOne(
        { _id: new ObjectId(id), shop },
        { $set: progressBar }
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
