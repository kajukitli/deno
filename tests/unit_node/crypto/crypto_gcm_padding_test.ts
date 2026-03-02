// Copyright 2018-2026 the Deno authors. MIT license.
import { Buffer } from "node:buffer";
import crypto from "node:crypto";
import { assert } from "@std/assert";

Deno.test("crypto AES-128-GCM setAutoPadding(false) should not throw", () => {
  const key = Buffer.from("0123456789abcdef0123456789abcdef", "hex");
  const iv = Buffer.from("0123456789abcdef01234567", "hex");
  const plaintext = Buffer.from("Hello, world!", "utf8");

  // Encrypt
  const cipher = crypto.createCipheriv("aes-128-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Decrypt with setAutoPadding(false) - this should not throw
  const decipher = crypto.createDecipheriv("aes-128-gcm", key, iv);
  decipher.setAutoPadding(false); // GCM mode doesn't use padding, so this should be a no-op
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  assert(decrypted.toString("utf8") === plaintext.toString("utf8"));
});

Deno.test("crypto AES-256-GCM setAutoPadding(false) should not throw", () => {
  const key = Buffer.from(
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
    "hex",
  );
  const iv = Buffer.from("0123456789abcdef01234567", "hex");
  const plaintext = Buffer.from("Hello, AES-256-GCM world!", "utf8");

  // Encrypt
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  // Decrypt with setAutoPadding(false) - this should not throw
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAutoPadding(false); // GCM mode doesn't use padding, so this should be a no-op
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);

  assert(decrypted.toString("utf8") === plaintext.toString("utf8"));
});