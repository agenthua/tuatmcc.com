export const prerender = false;

import { DISCORD_INVITE, TUAT_CIDR } from "astro:env/server";
import { inCidr } from "@libs/inCidr";
import type { APIRoute } from "astro";

export const GET: APIRoute = async ({ request, redirect }) => {
  const ip =
    request.headers.get("CF-Connecting-IP") ??
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ??
    "";

  const target = ip && inCidr(ip, TUAT_CIDR) ? DISCORD_INVITE : "/join/manual";
  return redirect(target, 302);
};
