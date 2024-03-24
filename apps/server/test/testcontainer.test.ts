import {
  DockerComposeEnvironment,
  StartedDockerComposeEnvironment,
} from "testcontainers";
import { describe, test, beforeAll, afterAll } from "vitest";
import * as path from "path";

const __dirname = import.meta.dirname;

describe("start testcontainers", async () => {
  let containers: StartedDockerComposeEnvironment;
  beforeAll(async () => {
    const composePath = path.resolve(__dirname, "../../../");
    const composeFile = "compose.yaml";
    containers = await new DockerComposeEnvironment(
      composePath,
      composeFile,
    ).up();
  });
  afterAll(async () => {
    await containers.down();
  });
});
