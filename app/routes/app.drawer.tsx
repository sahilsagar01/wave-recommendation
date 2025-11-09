import { useState, useCallback, useEffect } from "react";
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher, useSubmit } from "@remix-run/react";
import {
  Page,
  Layout,
  Card,
  BlockStack,
  Text,
  TextField,
  Button,
  InlineStack,
  Checkbox,
  Select,
  ColorPicker,
  RangeSlider,
  Tabs,
  Banner,
  DataTable,
  Modal,
  FormLayout,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authenticate.admin(request);
  return json({});
};

export default function DrawerAdmin() {
  const [selected, setSelected] = useState(0);

  const tabs = [
    {
      id: "settings",
      content: "Drawer Settings",
      component: <DrawerSettings />,
    },
    {
      id: "layout",
      content: "Layout Order",
      component: <LayoutManager />,
    },
    {
      id: "announcements",
      content: "Announcements",
      component: <AnnouncementManager />,
    },
    {
      id: "progress",
      content: "Progress Bar",
      component: <ProgressBarManager />,
    },
    {
      id: "recommendations",
      content: "Recommendations",
      component: <RecommendationSettings />,
    },
  ];

  return (
    <Page>
      <TitleBar title="Drawer Configuration" />
      <Layout>
        <Layout.Section>
          <Card>
            <Tabs tabs={tabs} selected={selected} onSelect={setSelected}>
              <div style={{ padding: "20px" }}>
                {tabs[selected].component}
              </div>
            </Tabs>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function DrawerSettings() {
  const fetcher = useFetcher();
  const [isEnabled, setIsEnabled] = useState(false);
  const [position, setPosition] = useState("right");
  const [width, setWidth] = useState(400);
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [textColor, setTextColor] = useState("#000000");
  const [closeButtonColor, setCloseButtonColor] = useState("#000000");
  const [showTriggerButton, setShowTriggerButton] = useState(true);
  const [openOnCartClick, setOpenOnCartClick] = useState(true);

  useEffect(() => {
    fetcher.load("/api/drawer/settings");
  }, []);

  useEffect(() => {
    if (fetcher.data) {
      setIsEnabled(fetcher.data.isEnabled || false);
      setPosition(fetcher.data.position || "right");
      setWidth(fetcher.data.width || 400);
      setBackgroundColor(fetcher.data.backgroundColor || "#ffffff");
      setTextColor(fetcher.data.textColor || "#000000");
      setCloseButtonColor(fetcher.data.closeButtonColor || "#000000");
      setShowTriggerButton(fetcher.data.showTriggerButton !== false);
      setOpenOnCartClick(fetcher.data.openOnCartClick !== false);
    }
  }, [fetcher.data]);

  const handleSave = () => {
    const formData = new FormData();
    formData.append("action", "update");
    formData.append("isEnabled", String(isEnabled));
    formData.append("position", position);
    formData.append("width", String(width));
    formData.append("backgroundColor", backgroundColor);
    formData.append("textColor", textColor);
    formData.append("closeButtonColor", closeButtonColor);
    formData.append("showTriggerButton", String(showTriggerButton));
    formData.append("openOnCartClick", String(openOnCartClick));

    fetcher.submit(formData, {
      method: "post",
      action: "/api/drawer/settings",
    });
  };

  return (
    <BlockStack gap="400">
      <Checkbox
        label="Enable Drawer"
        checked={isEnabled}
        onChange={setIsEnabled}
      />

      <Select
        label="Position"
        options={[
          { label: "Right", value: "right" },
          { label: "Left", value: "left" },
        ]}
        value={position}
        onChange={setPosition}
      />

      <TextField
        label="Width (px)"
        type="number"
        value={String(width)}
        onChange={(value) => setWidth(Number(value))}
        autoComplete="off"
      />

      <FormLayout>
        <TextField
          label="Background Color"
          value={backgroundColor}
          onChange={setBackgroundColor}
          autoComplete="off"
        />

        <TextField
          label="Text Color"
          value={textColor}
          onChange={setTextColor}
          autoComplete="off"
        />

        <TextField
          label="Close Button Color"
          value={closeButtonColor}
          onChange={setCloseButtonColor}
          autoComplete="off"
        />
      </FormLayout>

      <BlockStack gap="300">
        <Text as="h3" variant="headingMd">Trigger Options</Text>

        <Checkbox
          label="Show Floating Trigger Button"
          checked={showTriggerButton}
          onChange={setShowTriggerButton}
          helpText="Display a floating button in the bottom right corner"
        />

        <Checkbox
          label="Open Drawer on Cart Click"
          checked={openOnCartClick}
          onChange={setOpenOnCartClick}
          helpText="Open the drawer when customers click the cart icon instead of going to cart page"
        />
      </BlockStack>

      <InlineStack align="end">
        <Button
          variant="primary"
          onClick={handleSave}
          loading={fetcher.state === "submitting"}
        >
          Save Settings
        </Button>
      </InlineStack>

      {fetcher.data?.success && (
        <Banner tone="success" onDismiss={() => {}}>
          Settings saved successfully!
        </Banner>
      )}
    </BlockStack>
  );
}

function AnnouncementManager() {
  const fetcher = useFetcher();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [modalActive, setModalActive] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [isEnabled, setIsEnabled] = useState(true);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#f3f4f6");
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(14);
  const [link, setLink] = useState("");
  const [linkText, setLinkText] = useState("");

  useEffect(() => {
    fetcher.load("/api/drawer/announcement");
  }, []);

  useEffect(() => {
    if (fetcher.data && Array.isArray(fetcher.data)) {
      setAnnouncements(fetcher.data);
    }
  }, [fetcher.data]);

  const handleOpenModal = (announcement?: any) => {
    if (announcement) {
      setEditingId(announcement._id);
      setIsEnabled(announcement.isEnabled);
      setTitle(announcement.title);
      setMessage(announcement.message);
      setBackgroundColor(announcement.backgroundColor);
      setTextColor(announcement.textColor);
      setFontSize(announcement.fontSize);
      setLink(announcement.link || "");
      setLinkText(announcement.linkText || "");
    } else {
      resetForm();
    }
    setModalActive(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setIsEnabled(true);
    setTitle("");
    setMessage("");
    setBackgroundColor("#f3f4f6");
    setTextColor("#000000");
    setFontSize(14);
    setLink("");
    setLinkText("");
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("action", editingId ? "update" : "create");
    if (editingId) formData.append("id", editingId);
    formData.append("isEnabled", String(isEnabled));
    formData.append("title", title);
    formData.append("message", message);
    formData.append("backgroundColor", backgroundColor);
    formData.append("textColor", textColor);
    formData.append("fontSize", String(fontSize));
    formData.append("link", link);
    formData.append("linkText", linkText);
    formData.append("order", String(announcements.length));

    fetcher.submit(formData, {
      method: "post",
      action: "/api/drawer/announcement",
    });

    setModalActive(false);
    resetForm();
    setTimeout(() => fetcher.load("/api/drawer/announcement"), 500);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      const formData = new FormData();
      formData.append("action", "delete");
      formData.append("id", id);

      fetcher.submit(formData, {
        method: "post",
        action: "/api/drawer/announcement",
      });

      setTimeout(() => fetcher.load("/api/drawer/announcement"), 500);
    }
  };

  const rows = announcements.map((announcement) => [
    announcement.title,
    announcement.message.substring(0, 50) + "...",
    announcement.isEnabled ? "Yes" : "No",
    <InlineStack gap="200">
      <Button size="slim" onClick={() => handleOpenModal(announcement)}>
        Edit
      </Button>
      <Button
        size="slim"
        tone="critical"
        onClick={() => handleDelete(announcement._id)}
      >
        Delete
      </Button>
    </InlineStack>,
  ]);

  return (
    <BlockStack gap="400">
      <InlineStack align="end">
        <Button variant="primary" onClick={() => handleOpenModal()}>
          Add Announcement
        </Button>
      </InlineStack>

      {announcements.length > 0 ? (
        <DataTable
          columnContentTypes={["text", "text", "text", "text"]}
          headings={["Title", "Message", "Enabled", "Actions"]}
          rows={rows}
        />
      ) : (
        <Text as="p" tone="subdued">
          No announcements yet. Click "Add Announcement" to create one.
        </Text>
      )}

      <Modal
        open={modalActive}
        onClose={() => {
          setModalActive(false);
          resetForm();
        }}
        title={editingId ? "Edit Announcement" : "Add Announcement"}
        primaryAction={{
          content: "Save",
          onAction: handleSave,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => {
              setModalActive(false);
              resetForm();
            },
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <Checkbox
              label="Enabled"
              checked={isEnabled}
              onChange={setIsEnabled}
            />

            <TextField
              label="Title"
              value={title}
              onChange={setTitle}
              autoComplete="off"
            />

            <TextField
              label="Message"
              value={message}
              onChange={setMessage}
              multiline={3}
              autoComplete="off"
            />

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '13px' }}>
                Background Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  style={{
                    width: '60px',
                    height: '38px',
                    border: '1px solid #c9cccf',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                />
                <TextField
                  value={backgroundColor}
                  onChange={setBackgroundColor}
                  autoComplete="off"
                  placeholder="#f3f4f6"
                  connectedLeft={<div style={{ width: '60px' }} />}
                />
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '13px' }}>
                Text Color
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  style={{
                    width: '60px',
                    height: '38px',
                    border: '1px solid #c9cccf',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                />
                <TextField
                  value={textColor}
                  onChange={setTextColor}
                  autoComplete="off"
                  placeholder="#000000"
                  connectedLeft={<div style={{ width: '60px' }} />}
                />
              </div>
            </div>

            <TextField
              label="Font Size"
              type="number"
              value={String(fontSize)}
              onChange={(value) => setFontSize(Number(value))}
              autoComplete="off"
            />

            <TextField
              label="Link (optional)"
              value={link}
              onChange={setLink}
              autoComplete="off"
              placeholder="https://example.com"
            />

            <TextField
              label="Link Text (optional)"
              value={linkText}
              onChange={setLinkText}
              autoComplete="off"
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </BlockStack>
  );
}

function ProgressBarManager() {
  const fetcher = useFetcher();
  const [progressBars, setProgressBars] = useState<any[]>([]);
  const [modalActive, setModalActive] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [isEnabled, setIsEnabled] = useState(true);
  const [title, setTitle] = useState("Cart Progress");
  const [goalAmount, setGoalAmount] = useState(100);
  const [goalText, setGoalText] = useState("Free Shipping");
  const [backgroundColor, setBackgroundColor] = useState("#e5e7eb");
  const [progressColor, setProgressColor] = useState("#10b981");
  const [textColor, setTextColor] = useState("#000000");
  const [showPercentage, setShowPercentage] = useState(true);
  const [showAmount, setShowAmount] = useState(true);
  const [height, setHeight] = useState(20);
  const [borderRadius, setBorderRadius] = useState(10);

  useEffect(() => {
    fetcher.load("/api/drawer/progressbar");
  }, []);

  useEffect(() => {
    if (fetcher.data && Array.isArray(fetcher.data)) {
      setProgressBars(fetcher.data);
    }
  }, [fetcher.data]);

  const handleOpenModal = (bar?: any) => {
    if (bar) {
      setEditingId(bar._id);
      setIsEnabled(bar.isEnabled);
      setTitle(bar.title);
      setGoalAmount(bar.goalAmount);
      setGoalText(bar.goalText);
      setBackgroundColor(bar.backgroundColor);
      setProgressColor(bar.progressColor);
      setTextColor(bar.textColor);
      setShowPercentage(bar.showPercentage);
      setShowAmount(bar.showAmount);
      setHeight(bar.height);
      setBorderRadius(bar.borderRadius);
    } else {
      resetForm();
    }
    setModalActive(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setIsEnabled(true);
    setTitle("Cart Progress");
    setGoalAmount(100);
    setGoalText("Free Shipping");
    setBackgroundColor("#e5e7eb");
    setProgressColor("#10b981");
    setTextColor("#000000");
    setShowPercentage(true);
    setShowAmount(true);
    setHeight(20);
    setBorderRadius(10);
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("action", editingId ? "update" : "create");
    if (editingId) formData.append("id", editingId);
    formData.append("isEnabled", String(isEnabled));
    formData.append("title", title);
    formData.append("goalAmount", String(goalAmount));
    formData.append("goalText", goalText);
    formData.append("backgroundColor", backgroundColor);
    formData.append("progressColor", progressColor);
    formData.append("textColor", textColor);
    formData.append("showPercentage", String(showPercentage));
    formData.append("showAmount", String(showAmount));
    formData.append("height", String(height));
    formData.append("borderRadius", String(borderRadius));
    formData.append("order", String(progressBars.length));

    fetcher.submit(formData, {
      method: "post",
      action: "/api/drawer/progressbar",
    });

    setModalActive(false);
    resetForm();
    setTimeout(() => fetcher.load("/api/drawer/progressbar"), 500);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this progress bar?")) {
      const formData = new FormData();
      formData.append("action", "delete");
      formData.append("id", id);

      fetcher.submit(formData, {
        method: "post",
        action: "/api/drawer/progressbar",
      });

      setTimeout(() => fetcher.load("/api/drawer/progressbar"), 500);
    }
  };

  const rows = progressBars.map((bar) => [
    bar.title,
    `$${bar.goalAmount}`,
    bar.goalText,
    bar.isEnabled ? "Yes" : "No",
    <InlineStack gap="200">
      <Button size="slim" onClick={() => handleOpenModal(bar)}>
        Edit
      </Button>
      <Button
        size="slim"
        tone="critical"
        onClick={() => handleDelete(bar._id)}
      >
        Delete
      </Button>
    </InlineStack>,
  ]);

  return (
    <BlockStack gap="400">
      <InlineStack align="end">
        <Button variant="primary" onClick={() => handleOpenModal()}>
          Add Progress Bar
        </Button>
      </InlineStack>

      {progressBars.length > 0 ? (
        <DataTable
          columnContentTypes={["text", "text", "text", "text", "text"]}
          headings={["Title", "Goal Amount", "Goal Text", "Enabled", "Actions"]}
          rows={rows}
        />
      ) : (
        <Text as="p" tone="subdued">
          No progress bars yet. Click "Add Progress Bar" to create one.
        </Text>
      )}

      <Modal
        open={modalActive}
        onClose={() => {
          setModalActive(false);
          resetForm();
        }}
        title={editingId ? "Edit Progress Bar" : "Add Progress Bar"}
        primaryAction={{
          content: "Save",
          onAction: handleSave,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => {
              setModalActive(false);
              resetForm();
            },
          },
        ]}
      >
        <Modal.Section>
          <FormLayout>
            <Checkbox
              label="Enabled"
              checked={isEnabled}
              onChange={setIsEnabled}
            />

            <TextField
              label="Title"
              value={title}
              onChange={setTitle}
              autoComplete="off"
            />

            <TextField
              label="Goal Amount ($)"
              type="number"
              value={String(goalAmount)}
              onChange={(value) => setGoalAmount(Number(value))}
              autoComplete="off"
            />

            <TextField
              label="Goal Text"
              value={goalText}
              onChange={setGoalText}
              autoComplete="off"
              placeholder="e.g., Free Shipping"
            />

            <TextField
              label="Background Color"
              value={backgroundColor}
              onChange={setBackgroundColor}
              autoComplete="off"
            />

            <TextField
              label="Progress Color"
              value={progressColor}
              onChange={setProgressColor}
              autoComplete="off"
            />

            <TextField
              label="Text Color"
              value={textColor}
              onChange={setTextColor}
              autoComplete="off"
            />

            <Checkbox
              label="Show Percentage"
              checked={showPercentage}
              onChange={setShowPercentage}
            />

            <Checkbox
              label="Show Amount"
              checked={showAmount}
              onChange={setShowAmount}
            />

            <TextField
              label="Height (px)"
              type="number"
              value={String(height)}
              onChange={(value) => setHeight(Number(value))}
              autoComplete="off"
            />

            <TextField
              label="Border Radius (px)"
              type="number"
              value={String(borderRadius)}
              onChange={(value) => setBorderRadius(Number(value))}
              autoComplete="off"
            />
          </FormLayout>
        </Modal.Section>
      </Modal>
    </BlockStack>
  );
}

function RecommendationSettings() {
  const fetcher = useFetcher();
  const [isEnabled, setIsEnabled] = useState(false);
  const [title, setTitle] = useState("Recommended for you");
  const [numberOfProducts, setNumberOfProducts] = useState(4);
  const [layout, setLayout] = useState("grid");
  const [showPrice, setShowPrice] = useState(true);
  const [showAddToCart, setShowAddToCart] = useState(true);
  const [cardBackgroundColor, setCardBackgroundColor] = useState("#ffffff");
  const [cardBorderRadius, setCardBorderRadius] = useState(8);
  const [titleColor, setTitleColor] = useState("#000000");
  const [titleFontSize, setTitleFontSize] = useState(16);
  const [priceColor, setPriceColor] = useState("#000000");
  const [priceFontSize, setPriceFontSize] = useState(14);
  const [buttonBackgroundColor, setButtonBackgroundColor] = useState("#000000");
  const [buttonTextColor, setButtonTextColor] = useState("#ffffff");
  const [buttonFontSize, setButtonFontSize] = useState(14);

  useEffect(() => {
    fetcher.load("/api/drawer/recommendation");
  }, []);

  useEffect(() => {
    if (fetcher.data) {
      setIsEnabled(fetcher.data.isEnabled || false);
      setTitle(fetcher.data.title || "Recommended for you");
      setNumberOfProducts(fetcher.data.numberOfProducts || 4);
      setLayout(fetcher.data.layout || "grid");
      setShowPrice(fetcher.data.showPrice !== false);
      setShowAddToCart(fetcher.data.showAddToCart !== false);
      setCardBackgroundColor(fetcher.data.cardBackgroundColor || "#ffffff");
      setCardBorderRadius(fetcher.data.cardBorderRadius || 8);
      setTitleColor(fetcher.data.titleColor || "#000000");
      setTitleFontSize(fetcher.data.titleFontSize || 16);
      setPriceColor(fetcher.data.priceColor || "#000000");
      setPriceFontSize(fetcher.data.priceFontSize || 14);
      setButtonBackgroundColor(fetcher.data.buttonBackgroundColor || "#000000");
      setButtonTextColor(fetcher.data.buttonTextColor || "#ffffff");
      setButtonFontSize(fetcher.data.buttonFontSize || 14);
    }
  }, [fetcher.data]);

  const handleSave = () => {
    const formData = new FormData();
    formData.append("action", "update");
    formData.append("isEnabled", String(isEnabled));
    formData.append("title", title);
    formData.append("numberOfProducts", String(numberOfProducts));
    formData.append("layout", layout);
    formData.append("showPrice", String(showPrice));
    formData.append("showAddToCart", String(showAddToCart));
    formData.append("cardBackgroundColor", cardBackgroundColor);
    formData.append("cardBorderRadius", String(cardBorderRadius));
    formData.append("titleColor", titleColor);
    formData.append("titleFontSize", String(titleFontSize));
    formData.append("priceColor", priceColor);
    formData.append("priceFontSize", String(priceFontSize));
    formData.append("buttonBackgroundColor", buttonBackgroundColor);
    formData.append("buttonTextColor", buttonTextColor);
    formData.append("buttonFontSize", String(buttonFontSize));

    fetcher.submit(formData, {
      method: "post",
      action: "/api/drawer/recommendation",
    });
  };

  return (
    <BlockStack gap="400">
      <Checkbox
        label="Enable Recommendations"
        checked={isEnabled}
        onChange={setIsEnabled}
      />

      <TextField
        label="Title"
        value={title}
        onChange={setTitle}
        autoComplete="off"
      />

      <TextField
        label="Number of Products"
        type="number"
        value={String(numberOfProducts)}
        onChange={(value) => setNumberOfProducts(Number(value))}
        autoComplete="off"
      />

      <Select
        label="Layout"
        options={[
          { label: "Grid", value: "grid" },
          { label: "List", value: "list" },
        ]}
        value={layout}
        onChange={setLayout}
      />

      <Checkbox
        label="Show Price"
        checked={showPrice}
        onChange={setShowPrice}
      />

      <Checkbox
        label="Show Add to Cart Button"
        checked={showAddToCart}
        onChange={setShowAddToCart}
      />

      <FormLayout>
        <FormLayout.Group>
          <TextField
            label="Card Background Color"
            value={cardBackgroundColor}
            onChange={setCardBackgroundColor}
            autoComplete="off"
          />

          <TextField
            label="Card Border Radius (px)"
            type="number"
            value={String(cardBorderRadius)}
            onChange={(value) => setCardBorderRadius(Number(value))}
            autoComplete="off"
          />
        </FormLayout.Group>

        <FormLayout.Group>
          <TextField
            label="Title Color"
            value={titleColor}
            onChange={setTitleColor}
            autoComplete="off"
          />

          <TextField
            label="Title Font Size (px)"
            type="number"
            value={String(titleFontSize)}
            onChange={(value) => setTitleFontSize(Number(value))}
            autoComplete="off"
          />
        </FormLayout.Group>

        <FormLayout.Group>
          <TextField
            label="Price Color"
            value={priceColor}
            onChange={setPriceColor}
            autoComplete="off"
          />

          <TextField
            label="Price Font Size (px)"
            type="number"
            value={String(priceFontSize)}
            onChange={(value) => setPriceFontSize(Number(value))}
            autoComplete="off"
          />
        </FormLayout.Group>

        <FormLayout.Group>
          <TextField
            label="Button Background Color"
            value={buttonBackgroundColor}
            onChange={setButtonBackgroundColor}
            autoComplete="off"
          />

          <TextField
            label="Button Text Color"
            value={buttonTextColor}
            onChange={setButtonTextColor}
            autoComplete="off"
          />
        </FormLayout.Group>

        <TextField
          label="Button Font Size (px)"
          type="number"
          value={String(buttonFontSize)}
          onChange={(value) => setButtonFontSize(Number(value))}
          autoComplete="off"
        />
      </FormLayout>

      <InlineStack align="end">
        <Button
          variant="primary"
          onClick={handleSave}
          loading={fetcher.state === "submitting"}
        >
          Save Settings
        </Button>
      </InlineStack>

      {fetcher.data?.success && (
        <Banner tone="success" onDismiss={() => {}}>
          Settings saved successfully!
        </Banner>
      )}
    </BlockStack>
  );
}

function LayoutManager() {
  const fetcher = useFetcher();
  const [components, setComponents] = useState([
    { id: "cart", name: "Cart Items", icon: "🛒", description: "Shopping cart items with checkout button" },
    { id: "announcements", name: "Announcements", icon: "📢", description: "Marketing messages and promotional banners" },
    { id: "progress", name: "Cart Progress Bar", icon: "📊", description: "Progress towards goals like free shipping" },
    { id: "recommendations", name: "Product Recommendations", icon: "⭐", description: "Recommended products for upselling" },
  ]);

  useEffect(() => {
    fetcher.load("/api/drawer/settings");
  }, []);

  useEffect(() => {
    if (fetcher.data?.componentOrder) {
      const ordered = fetcher.data.componentOrder.map((id: string) =>
        components.find(c => c.id === id)
      ).filter(Boolean);
      if (ordered.length > 0) setComponents(ordered);
    }
  }, [fetcher.data]);

  const handleSave = () => {
    const formData = new FormData();
    formData.append("action", "updateLayout");
    formData.append("componentOrder", JSON.stringify(components.map(c => c.id)));

    fetcher.submit(formData, {
      method: "post",
      action: "/api/drawer/settings",
    });
  };

  const moveComponent = (fromIndex: number, toIndex: number) => {
    const newComponents = [...components];
    const [movedItem] = newComponents.splice(fromIndex, 1);
    newComponents.splice(toIndex, 0, movedItem);
    setComponents(newComponents);
  };

  return (
    <BlockStack gap="400">
      <Banner tone="info">
        Drag and drop components to reorder them. The order here determines how they appear in the drawer on your storefront.
      </Banner>

      <BlockStack gap="300">
        <Text as="h3" variant="headingMd">Component Order</Text>
        <Text as="p" tone="subdued">
          Components will appear in this order from top to bottom in the drawer
        </Text>

        <BlockStack gap="200">
          {components.map((component, index) => (
            <Card key={component.id}>
              <BlockStack gap="200">
                <InlineStack align="space-between" blockAlign="center">
                  <InlineStack gap="300" blockAlign="center">
                    <Text as="span" variant="headingLg">{component.icon}</Text>
                    <BlockStack gap="100">
                      <Text as="h4" variant="headingMd">{component.name}</Text>
                      <Text as="p" tone="subdued" variant="bodySm">{component.description}</Text>
                    </BlockStack>
                  </InlineStack>
                  <InlineStack gap="200">
                    <Button
                      size="slim"
                      disabled={index === 0}
                      onClick={() => moveComponent(index, index - 1)}
                    >
                      ↑ Move Up
                    </Button>
                    <Button
                      size="slim"
                      disabled={index === components.length - 1}
                      onClick={() => moveComponent(index, index + 1)}
                    >
                      ↓ Move Down
                    </Button>
                  </InlineStack>
                </InlineStack>
              </BlockStack>
            </Card>
          ))}
        </BlockStack>
      </BlockStack>

      <InlineStack align="end">
        <Button
          variant="primary"
          onClick={handleSave}
          loading={fetcher.state === "submitting"}
        >
          Save Layout Order
        </Button>
      </InlineStack>

      {fetcher.data?.success && (
        <Banner tone="success" onDismiss={() => {}}>
          Layout order saved successfully! Changes will be reflected on your storefront.
        </Banner>
      )}
    </BlockStack>
  );
}
