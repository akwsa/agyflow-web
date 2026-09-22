import assert from "node:assert/strict";
import { access, mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import { prepareDeploy } from "../scripts/prepare-deploy.mjs";

test("deployment bundle includes auth source required by remote tests", async () => {
  const output = await mkdtemp(path.join(os.tmpdir(), "agyflow-deploy-test-"));
  try {
    prepareDeploy(output);

    await access(path.join(output, "lib", "auth", "db.js"));
    await access(path.join(output, "lib", "auth", "auth-request-guard.js"));
    const manifest = JSON.parse(await readFile(path.join(output, "package.json"), "utf8"));
    assert.doesNotMatch(manifest.scripts["test:unit"], /prepare-deploy\.test\.mjs/);
    assert.equal(manifest.scripts["test:package"], "node --no-warnings tests/prepare-deploy.test.mjs");
    // cPanel install-modules populates node_modules (including next/react) from the
    // deployed manifest, because the FTP uploader skips node_modules. The framework
    // deps must therefore stay declared for the app to boot on Passenger.
    assert.ok(manifest.dependencies.next, "next must stay a runtime dependency for install-modules");
    assert.ok(manifest.dependencies.react, "react must stay a runtime dependency for install-modules");
    assert.ok(manifest.dependencies.nodemailer, "nodemailer must stay a runtime dependency");
    assert.ok(manifest.dependencies.mysql2, "mysql2 must stay a runtime dependency");
    assert.match(manifest.scripts["test:unit"], /node --no-warnings tests\/admin\.test\.mjs && node --no-warnings tests\/auth-email\.test\.mjs/);
    assert.doesNotMatch(manifest.scripts["test:unit"], /--test(?:\s|$)/);
    assert.match(manifest.scripts["test:db"], /node --no-warnings tests\/product-schema\.test\.mjs && node --no-warnings tests\/auth-db\.test\.mjs/);
    assert.doesNotMatch(manifest.scripts["test:db"], /--test(?:\s|$)/);
    await access(path.join(output, "scripts", "raw-remove.mjs"));
    const deployScript = await readFile(
      path.join(output, "scripts", "prepare-deploy.mjs"),
      "utf8",
    );
    assert.match(deployScript, /from "\.\/raw-remove\.mjs"/);
  } finally {
    await rm(output, { recursive: true, force: true });
  }
});
