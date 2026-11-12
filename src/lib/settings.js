import { authenticatedFetch } from "@/lib/auth.js";

export function getEmailSettings() {
    return authenticatedFetch("/settings/email");
}

export function updateEmailSettings(settings) {
    return authenticatedFetch("/settings/email", {
        method: "PUT",
        body: JSON.stringify(settings)
    });
}

export function getAppearanceSettings() {
    return authenticatedFetch("/settings/appearance");
}

export function updateAppearanceSettings(settings) {
    return authenticatedFetch("/settings/appearance", {
        method: "PUT",
        body: JSON.stringify(settings)
    });
}
