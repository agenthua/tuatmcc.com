// src/loaders/github.ts

import { existsSync, rmSync } from "node:fs";
import { glob, type Loader, type LoaderContext } from "astro/loaders";
import { simpleGit } from "simple-git";

const clonDir = "./content";
const remoteUrl = "https://github.com/tuatmcc/hp-md-content.git";

const cloneRepo = async () => {
  const git = simpleGit();
  try {
    if (existsSync(clonDir)) {
      rmSync(clonDir, { force: true, recursive: true });
    }
    await git.clone(remoteUrl, clonDir);
  } catch (error) {
    console.error("Error cloning repository:", error);
  }
};

const updateRepo = async ({ logger }: LoaderContext) => {
  if (existsSync(clonDir)) {
    const git = simpleGit({ baseDir: clonDir });
    if (await git.checkIsRepo()) {
      try {
        await git.pull();
      } catch (error) {
        logger.error(
          `Error pulling changes: ${error}. Attempting to clone again...`,
        );
        await cloneRepo();
      }
    } else {
      logger.error(
        `Directory ${clonDir} is not a git repository. Cloning again...`,
      );
      await cloneRepo();
    }
  } else {
    logger.info(`Directory ${clonDir} does not exist. Cloning...`);
    await cloneRepo();
  }
};

export const github = (pattern: string, base: string): Loader => ({
  name: "github",
  async load(context) {
    await updateRepo(context);
    return glob({ pattern, base }).load(context);
  },
});
