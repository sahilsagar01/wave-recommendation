/**
 * @typedef {import("../generated/api").RunInput} RunInput
 * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
 */

/**
 * @type {FunctionRunResult}
 */
const EMPTY_DISCOUNT = {
  discounts: [],
};

/**
 * @param {RunInput} input
 * @returns {FunctionRunResult}
 */
export function run(input) {
  // Get configuration from metafield (goal amount set in admin)
  const configuration = JSON.parse(
    input?.discountNode?.metafield?.value ?? "{}"
  );

  const goalAmount = parseFloat(configuration.goalAmount || "0");

  // Get cart subtotal
  const cartSubtotal = parseFloat(input?.cart?.cost?.subtotalAmount?.amount ?? "0");

  console.log("Wave Shipping Discount:", {
    cartSubtotal,
    goalAmount,
    qualifies: cartSubtotal >= goalAmount
  });

  // If cart subtotal is greater than or equal to goal amount, apply free shipping
  if (goalAmount > 0 && cartSubtotal >= goalAmount) {
    // Get all delivery groups from the cart
    const deliveryGroups = input?.cart?.deliveryGroups || [];

    // Create targets for all delivery groups
    const targets = deliveryGroups.map(group => ({
      deliveryGroup: {
        id: group.id
      }
    }));

    return {
      discounts: [
        {
          message: configuration.goalText || "Free Shipping",
          targets: targets,
          value: {
            percentage: {
              value: "100"
            }
          }
        }
      ]
    };
  }

  return EMPTY_DISCOUNT;
};