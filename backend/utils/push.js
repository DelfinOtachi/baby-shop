import webpush from "web-push";

const VAPID_PUBLIC = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY;
const CONTACT = process.env.VAPID_CONTACT || "mailto:admin@example.com";

if (!VAPID_PUBLIC || !VAPID_PRIVATE) {
  console.warn("VAPID keys not set. Web push will be disabled.");
} else {
  webpush.setVapidDetails(CONTACT, VAPID_PUBLIC, VAPID_PRIVATE);
}

export const sendPush = async (subscription, payload) => {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) return;
  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
  } catch (err) {
    console.error("Push send error:", err);
    throw err;
  }
};

export const getPublicKey = () => VAPID_PUBLIC;
