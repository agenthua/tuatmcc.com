import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { glob } from "astro/loaders";

interface GenerateIdOptions {
  entry: string;
  base: URL;
  data: Record<string, unknown>;
}

type GenerateIdFunction = (options: GenerateIdOptions) => string;

interface GithubLoaderOptions {
  pattern: string | string[];
  base: string;
  generateId?: GenerateIdFunction;
}

// Wrap Astro's glob loader, keeping ./content in sync with the repo.
export function github(
  patternOrOptions: string | string[] | GithubLoaderOptions,
  base?: string,
) {
  ensureContentRepo();

  // Support both old signature (pattern, base) and new signature (options object)
  if (
    typeof patternOrOptions === "object" &&
    !Array.isArray(patternOrOptions)
  ) {
    const { pattern, base: optBase, generateId } = patternOrOptions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return glob({ pattern, base: optBase, generateId } as any);
  }

  // Legacy signature - base is required for this path
  if (!base) {
    throw new Error("base is required when using the legacy signature");
  }
  return glob({ pattern: patternOrOptions, base });
}

const REPO_URL = "https://github.com/tuatmcc/hp-md-content.git";
const CONTENT_DIR = path.resolve(process.cwd(), "content");

function ensureContentRepo() {
  try {
    if (isGitRepo(CONTENT_DIR)) {
      if (!isCorrectRemote(CONTENT_DIR, REPO_URL)) {
        // Wrong remote configured; start clean.
        reclone();
        return;
      }
      // Try pulling updates. On any failure, start clean.
      try {
        execSync("git pull", { cwd: CONTENT_DIR, stdio: "inherit" });
      } catch {
        reclone();
      }
      return;
    }

    // Not a git repo. If directory exists, it's likely stale; start clean.
    if (fs.existsSync(CONTENT_DIR)) {
      reclone();
      return;
    }

    // No directory; perform a fresh clone.
    clone();
  } catch (_err) {
    // As a last resort, attempt a clean clone.
    try {
      reclone();
    } catch {
      // Swallow to avoid crashing config evaluation; loader will still exist.
      // Consumers can observe missing content if clone also fails.
    }
  }
}

function isGitRepo(dir: string): boolean {
  try {
    if (!fs.existsSync(dir)) return false;
    execSync("git rev-parse --is-inside-work-tree", {
      cwd: dir,
      stdio: "ignore",
    });
    return true;
  } catch {
    return false;
  }
}

function isCorrectRemote(dir: string, expectedUrl: string): boolean {
  try {
    const out = execSync("git remote get-url origin", {
      cwd: dir,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    // Accept both with and without .git suffix and potential https normalization
    const normalize = (u: string) => u.replace(/\.git$/, "");
    return normalize(out) === normalize(expectedUrl);
  } catch {
    return false;
  }
}

function clone() {
  // Ensure parent exists
  fs.mkdirSync(path.dirname(CONTENT_DIR), { recursive: true });
  execSync(`git clone ${REPO_URL} ${quotePath(CONTENT_DIR)}`, {
    stdio: "inherit",
  });
}

function reclone() {
  // Remove directory if it exists, then clone fresh.
  try {
    if (fs.existsSync(CONTENT_DIR)) {
      fs.rmSync(CONTENT_DIR, { recursive: true, force: true });
    }
  } catch {
    // If removal fails, try renaming as a fallback to avoid partial states.
    try {
      const backup = `${CONTENT_DIR}.bak-${Date.now()}`;
      fs.renameSync(CONTENT_DIR, backup);
      fs.rmSync(backup, { recursive: true, force: true });
    } catch {
      // Ignore if both removal and rename fail; clone will likely fail too.
    }
  }
  clone();
}

function quotePath(p: string): string {
  if (p.includes(" ")) return `"${p.replaceAll('"', '\\"')}"`;
  return p;
}
