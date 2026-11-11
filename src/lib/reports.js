
import { authenticatedFetch } from "@/lib/auth.js";

export async function getMonthlySummary(year, month) {
    return await authenticatedFetch(`/reports/sales/monthly-summary?year=${year}&month=${month}`);
}

export async function getBestClientsBySales(year, month, page = 0) {
    return await authenticatedFetch(`/reports/sales/clients/best-sellers?year=${year}&month=${month}&page=${page}`);
}

export async function getBestClientsByRevenue(year, month, page = 0) {
    return await authenticatedFetch(`/reports/sales/clients/highest-revenue?year=${year}&month=${month}&page=${page}`);
}