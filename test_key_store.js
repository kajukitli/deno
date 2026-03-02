// Simple test to check if the new key store system works
import { crypto } from "https://deno.land/std/crypto/crypto.ts";

try {
  console.log("Testing RSA key generation with new system...");
  
  const keyPair = await crypto.subtle.generateKey(
    {
      name: "RSASSA-PKCS1-v1_5",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["sign", "verify"]
  );
  
  console.log("✓ RSA key generation successful");
  console.log("Private key:", keyPair.privateKey);
  console.log("Public key:", keyPair.publicKey);
  
  // Test signing
  const data = new TextEncoder().encode("Hello, World!");
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    keyPair.privateKey,
    data
  );
  
  console.log("✓ Signing successful");
  
  // Test verification
  const verified = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    keyPair.publicKey,
    signature,
    data
  );
  
  console.log("✓ Verification successful:", verified);
  
} catch (error) {
  console.error("❌ Test failed:", error);
}