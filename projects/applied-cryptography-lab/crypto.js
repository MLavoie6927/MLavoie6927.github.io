    "use strict";

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    const subtle = window.crypto && window.crypto.subtle;

    const byId = (id) => document.getElementById(id);

    const securityGoals = {
      confidentiality: {
        title: "Confidentiality + integrity",
        description: "Protect application data with authenticated encryption and reject modified ciphertext before releasing plaintext.",
        primitive: "AES-256-GCM",
        key: "256-bit symmetric key",
        failure: "Authentication error",
        path: ["Plaintext", "Unique IV", "AEAD", "Ciphertext + tag"],
        boundary: "Production deployments need managed random keys, nonce controls, authorization, rotation, recovery, and monitoring."
      },
      integrity: {
        title: "Integrity comparison",
        description: "Calculate a deterministic digest so later evidence can be compared with the expected bytes.",
        primitive: "SHA-256",
        key: "No secret key",
        failure: "Digest mismatch",
        path: ["Input bytes", "SHA-256", "32-byte digest", "Compare"],
        boundary: "A bare hash detects a difference only when the expected digest is trusted; it does not authenticate the creator."
      },
      authenticity: {
        title: "Shared-secret authenticity",
        description: "Bind a message to a secret held by approved parties and reject modified content or an incorrect key.",
        primitive: "HMAC-SHA-256",
        key: "Shared secret",
        failure: "Verification rejected",
        path: ["Message", "Secret key", "HMAC", "Verify"],
        boundary: "HMAC requires secure secret distribution and rotation, and it does not provide digital-signature non-repudiation."
      },
      "key-transport": {
        title: "Public-key transport",
        description: "Use a public key to protect a small value that only the corresponding private key can recover.",
        primitive: "RSA-OAEP-2048",
        key: "Ephemeral key pair",
        failure: "Decryption error",
        path: ["Small secret", "Public key", "RSA-OAEP", "Private-key recovery"],
        boundary: "RSA-OAEP is not for bulk data. Production systems normally combine a KEM or public-key mechanism with symmetric envelope encryption."
      }
    };

    function closeProjectMenu() {
      const toggle = byId("navToggle");
      const menu = byId("projectMenu");
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
    }

    function updateSecurityGoal(name) {
      const goal = securityGoals[name];
      if (!goal) return;

      byId("goalTitle").textContent = goal.title;
      byId("goalDescription").textContent = goal.description;
      byId("goalPrimitive").textContent = goal.primitive;
      byId("goalKey").textContent = goal.key;
      byId("goalFailure").textContent = goal.failure;
      const boundary = byId("goalBoundary");
      const boundaryLabel = document.createElement("strong");
      boundaryLabel.textContent = "Boundary: ";
      boundary.replaceChildren(boundaryLabel, document.createTextNode(goal.boundary));

      const path = byId("goalPath");
      path.replaceChildren(...goal.path.map((step) => {
        const item = document.createElement("span");
        item.textContent = step;
        return item;
      }));

      document.querySelectorAll("[data-goal]").forEach((button) => {
        const active = button.dataset.goal === name;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    }

    function setSelfTestResult(result, status, title, detail) {
      const heading = document.createElement("strong");
      const description = document.createElement("span");

      heading.textContent = title;
      description.textContent = detail;
      result.className = `self-test-result${status ? ` ${status}` : ""}`;
      result.replaceChildren(heading, description);
    }

    function bytesToHex(buffer) {
      return Array.from(new Uint8Array(buffer), (byte) => byte.toString(16).padStart(2, "0")).join("");
    }

    function hexToBytes(hex) {
      const normalized = hex.trim().toLowerCase();
      if (!/^[0-9a-f]+$/.test(normalized) || normalized.length % 2 !== 0) {
        throw new Error("Expected an even-length hexadecimal value.");
      }
      return new Uint8Array(normalized.match(/.{2}/g).map((pair) => parseInt(pair, 16)));
    }

    function bytesToBase64(buffer) {
      const bytes = new Uint8Array(buffer);
      let binary = "";
      for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
      return btoa(binary);
    }

    function base64ToBytes(value) {
      const binary = atob(value);
      return Uint8Array.from(binary, (character) => character.charCodeAt(0));
    }

    function generateDemoValue(byteLength = 18) {
      if (!window.crypto) throw new Error("A cryptographically secure random generator is unavailable.");
      const bytes = window.crypto.getRandomValues(new Uint8Array(byteLength));
      return `demo-${bytesToBase64(bytes).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "")}`;
    }

    function setStatus(id, message, type = "") {
      const element = byId(id);
      element.textContent = message;
      element.className = `result-meta ${type}`.trim();
    }

    async function withBusyButton(button, busyText, operation) {
      const original = button.textContent;
      button.disabled = true;
      button.textContent = busyText;
      try {
        await operation();
      } finally {
        button.disabled = false;
        button.textContent = original;
      }
    }

    function requireCrypto() {
      if (!subtle) throw new Error("Web Cryptography is unavailable. Open this page over HTTPS or localhost in a current browser.");
    }

    byId("navToggle").addEventListener("click", () => {
      const toggle = byId("navToggle");
      const menu = byId("projectMenu");
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      menu.classList.toggle("is-open", !expanded);
    });

    document.querySelectorAll("#projectMenu a").forEach((link) => {
      link.addEventListener("click", closeProjectMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeProjectMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 980) closeProjectMenu();
    });

    document.querySelectorAll("[data-goal]").forEach((button) => {
      button.addEventListener("click", () => updateSecurityGoal(button.dataset.goal));
    });

    updateSecurityGoal("confidentiality");

    const runtimeNotice = byId("runtimeNotice");
    if (subtle && window.isSecureContext) {
      runtimeNotice.querySelector("span:last-child").textContent = "Web Cryptography ready · secure context";
    } else {
      runtimeNotice.classList.add("error");
      runtimeNotice.querySelector("span:last-child").textContent = "Web Cryptography unavailable · use HTTPS or localhost";
    }

    byId("hashButton").addEventListener("click", async (event) => {
      await withBusyButton(event.currentTarget, "Calculating…", async () => {
        try {
          requireCrypto();
          const input = byId("hashInput").value;
          const digest = await subtle.digest("SHA-256", encoder.encode(input));
          byId("hashOutput").value = bytesToHex(digest);
          setStatus("hashStatus", `${encoder.encode(input).byteLength} input bytes → 32 digest bytes`, "success");
        } catch (error) {
          setStatus("hashStatus", error.message, "error");
        }
      });
    });

    async function deriveAesKey(passphrase, salt, iterations) {
      const material = await subtle.importKey(
        "raw",
        encoder.encode(passphrase),
        "PBKDF2",
        false,
        ["deriveKey"]
      );
      return subtle.deriveKey(
        { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
        material,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      );
    }

    byId("generateAesPassphrase").addEventListener("click", () => {
      try {
        byId("aesPassphrase").value = generateDemoValue(18);
        setStatus("aesStatus", "Generated a fresh demonstration value in this browser tab.", "success");
      } catch (error) {
        setStatus("aesStatus", error.message, "error");
      }
    });

    byId("aesEncryptButton").addEventListener("click", async (event) => {
      await withBusyButton(event.currentTarget, "Deriving + encrypting…", async () => {
        try {
          requireCrypto();
          const passphrase = byId("aesPassphrase").value;
          const plaintext = byId("aesPlaintext").value;
          if (!passphrase) throw new Error("Enter a demonstration passphrase.");
          if (!plaintext) throw new Error("Enter plaintext to encrypt.");

          const iterations = 600000;
          const salt = crypto.getRandomValues(new Uint8Array(16));
          const iv = crypto.getRandomValues(new Uint8Array(12));
          const key = await deriveAesKey(passphrase, salt, iterations);
          const ciphertext = await subtle.encrypt({ name: "AES-GCM", iv, tagLength: 128 }, key, encoder.encode(plaintext));

          const payload = {
            v: 1,
            alg: "AES-256-GCM",
            kdf: "PBKDF2-HMAC-SHA-256",
            iterations,
            salt: bytesToBase64(salt),
            iv: bytesToBase64(iv),
            ciphertext: bytesToBase64(ciphertext)
          };

          byId("aesPayload").value = JSON.stringify(payload, null, 2);
          setStatus("aesStatus", "Encrypted with a fresh 128-bit salt and 96-bit IV.", "success");
        } catch (error) {
          setStatus("aesStatus", error.message, "error");
        }
      });
    });

    byId("aesDecryptButton").addEventListener("click", async (event) => {
      await withBusyButton(event.currentTarget, "Authenticating + decrypting…", async () => {
        try {
          requireCrypto();
          const passphrase = byId("aesPassphrase").value;
          if (!passphrase) throw new Error("Enter the passphrase used for encryption.");

          let payload;
          try {
            payload = JSON.parse(byId("aesPayload").value);
          } catch {
            throw new Error("The payload is not valid JSON.");
          }

          if (payload.v !== 1 || payload.alg !== "AES-256-GCM" || payload.kdf !== "PBKDF2-HMAC-SHA-256") {
            throw new Error("Unsupported or incomplete encrypted payload.");
          }
          if (!Number.isInteger(payload.iterations) || payload.iterations < 10000 || payload.iterations > 2000000) {
            throw new Error("The PBKDF2 iteration count is outside the accepted demonstration range.");
          }

          const salt = base64ToBytes(payload.salt);
          const iv = base64ToBytes(payload.iv);
          const ciphertext = base64ToBytes(payload.ciphertext);
          if (salt.byteLength !== 16 || iv.byteLength !== 12 || ciphertext.byteLength < 17) {
            throw new Error("The payload contains invalid salt, IV, or ciphertext lengths.");
          }

          const key = await deriveAesKey(passphrase, salt, payload.iterations);
          const plaintext = await subtle.decrypt({ name: "AES-GCM", iv, tagLength: 128 }, key, ciphertext);
          byId("aesPlaintext").value = decoder.decode(plaintext);
          setStatus("aesStatus", "Authentication succeeded; plaintext restored.", "success");
        } catch (error) {
          setStatus("aesStatus", error.name === "OperationError" ? "Authentication failed: wrong passphrase or modified payload." : error.message, "error");
        }
      });
    });

    async function importHmacKey(secret, usages) {
      if (!secret) throw new Error("Enter a demonstration shared secret.");
      return subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        usages
      );
    }

    byId("generateHmacSecret").addEventListener("click", () => {
      try {
        byId("hmacSecret").value = generateDemoValue(24);
        setStatus("hmacStatus", "Generated a fresh demonstration secret in this browser tab.", "success");
      } catch (error) {
        setStatus("hmacStatus", error.message, "error");
      }
    });

    byId("hmacSignButton").addEventListener("click", async (event) => {
      await withBusyButton(event.currentTarget, "Signing…", async () => {
        try {
          requireCrypto();
          const key = await importHmacKey(byId("hmacSecret").value, ["sign"]);
          const signature = await subtle.sign("HMAC", key, encoder.encode(byId("hmacMessage").value));
          byId("hmacOutput").value = bytesToHex(signature);
          setStatus("hmacStatus", "HMAC generated from the current secret and message.", "success");
        } catch (error) {
          setStatus("hmacStatus", error.message, "error");
        }
      });
    });

    byId("hmacVerifyButton").addEventListener("click", async (event) => {
      await withBusyButton(event.currentTarget, "Verifying…", async () => {
        try {
          requireCrypto();
          const key = await importHmacKey(byId("hmacSecret").value, ["verify"]);
          const supplied = hexToBytes(byId("hmacOutput").value);
          if (supplied.byteLength !== 32) throw new Error("HMAC-SHA-256 must be exactly 32 bytes (64 hex characters).");
          const valid = await subtle.verify("HMAC", key, supplied, encoder.encode(byId("hmacMessage").value));
          setStatus("hmacStatus", valid ? "VERIFIED: secret and message match the authentication code." : "REJECTED: message, secret, or authentication code changed.", valid ? "success" : "error");
        } catch (error) {
          setStatus("hmacStatus", error.message, "error");
        }
      });
    });

    let rsaKeyPair = null;
    let rsaCiphertext = null;

    byId("rsaGenerateButton").addEventListener("click", async (event) => {
      await withBusyButton(event.currentTarget, "Generating key pair…", async () => {
        try {
          requireCrypto();
          rsaKeyPair = await subtle.generateKey(
            {
              name: "RSA-OAEP",
              modulusLength: 2048,
              publicExponent: new Uint8Array([1, 0, 1]),
              hash: "SHA-256"
            },
            true,
            ["encrypt", "decrypt"]
          );
          const publicKeyBytes = await subtle.exportKey("spki", rsaKeyPair.publicKey);
          const fingerprint = await subtle.digest("SHA-256", publicKeyBytes);
          byId("rsaFingerprint").value = bytesToHex(fingerprint).match(/.{2}/g).join(":");
          byId("rsaEncryptButton").disabled = false;
          byId("rsaDecryptButton").disabled = true;
          byId("rsaCiphertext").value = "";
          rsaCiphertext = null;
          setStatus("rsaStatus", "Ephemeral public/private key pair generated in memory.", "success");
        } catch (error) {
          setStatus("rsaStatus", error.message, "error");
        }
      });
    });

    byId("rsaEncryptButton").addEventListener("click", async (event) => {
      await withBusyButton(event.currentTarget, "Encrypting…", async () => {
        try {
          if (!rsaKeyPair) throw new Error("Generate a key pair first.");
          const bytes = encoder.encode(byId("rsaPlaintext").value);
          if (!bytes.byteLength) throw new Error("Enter a short plaintext value.");
          if (bytes.byteLength > 190) throw new Error("RSA-OAEP-2048 with SHA-256 accepts at most 190 plaintext bytes.");
          rsaCiphertext = await subtle.encrypt({ name: "RSA-OAEP" }, rsaKeyPair.publicKey, bytes);
          byId("rsaCiphertext").value = bytesToBase64(rsaCiphertext);
          byId("rsaDecryptButton").disabled = false;
          setStatus("rsaStatus", `${bytes.byteLength} plaintext bytes → ${rsaCiphertext.byteLength} ciphertext bytes.`, "success");
        } catch (error) {
          setStatus("rsaStatus", error.message, "error");
        }
      });
    });

    byId("rsaDecryptButton").addEventListener("click", async (event) => {
      await withBusyButton(event.currentTarget, "Decrypting…", async () => {
        try {
          if (!rsaKeyPair || !rsaCiphertext) throw new Error("Generate a key pair and ciphertext first.");
          const plaintext = await subtle.decrypt({ name: "RSA-OAEP" }, rsaKeyPair.privateKey, rsaCiphertext);
          byId("rsaPlaintext").value = decoder.decode(plaintext);
          setStatus("rsaStatus", "Private-key decryption succeeded.", "success");
        } catch (error) {
          setStatus("rsaStatus", error.message, "error");
        }
      });
    });

    async function runRuntimeSelfTests() {
      requireCrypto();
      const tests = [];

      const digest = bytesToHex(await subtle.digest("SHA-256", encoder.encode("abc")));
      tests.push(digest === "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");

      const aesKey = await subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
      const aesIv = window.crypto.getRandomValues(new Uint8Array(12));
      const aesExpected = "self-test-aes-gcm";
      const aesCiphertext = await subtle.encrypt({ name: "AES-GCM", iv: aesIv, tagLength: 128 }, aesKey, encoder.encode(aesExpected));
      const aesPlaintext = await subtle.decrypt({ name: "AES-GCM", iv: aesIv, tagLength: 128 }, aesKey, aesCiphertext);
      tests.push(decoder.decode(aesPlaintext) === aesExpected);

      const hmacKey = await subtle.importKey(
        "raw",
        encoder.encode("synthetic-self-test-secret"),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"]
      );
      const hmacMessage = encoder.encode("self-test-hmac");
      const hmacSignature = await subtle.sign("HMAC", hmacKey, hmacMessage);
      tests.push(await subtle.verify("HMAC", hmacKey, hmacSignature, hmacMessage));

      const selfTestRsa = await subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: 2048,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256"
        },
        false,
        ["encrypt", "decrypt"]
      );
      const rsaExpected = "self-test-rsa";
      const rsaEncrypted = await subtle.encrypt({ name: "RSA-OAEP" }, selfTestRsa.publicKey, encoder.encode(rsaExpected));
      const rsaDecrypted = await subtle.decrypt({ name: "RSA-OAEP" }, selfTestRsa.privateKey, rsaEncrypted);
      tests.push(decoder.decode(rsaDecrypted) === rsaExpected);

      return tests;
    }

    byId("selfTestButton").addEventListener("click", async (event) => {
      const result = byId("selfTestResult");
      setSelfTestResult(result, "", "Running...", "Executing four local cryptographic round trips.");

      await withBusyButton(event.currentTarget, "Testing...", async () => {
        try {
          const tests = await runRuntimeSelfTests();
          const passed = tests.filter(Boolean).length;
          const success = passed === tests.length;
          setSelfTestResult(
            result,
            success ? "success" : "error",
            `${passed}/${tests.length} passed`,
            success
              ? "Native Web Crypto operations completed successfully."
              : "One or more operations did not return the expected result."
          );
        } catch (error) {
          setSelfTestResult(result, "error", "Self-test failed", error.message);
        }
      });
    });

    byId("clearLabButton").addEventListener("click", () => {
      [
        "hashInput",
        "hashOutput",
        "aesPassphrase",
        "aesPlaintext",
        "aesPayload",
        "hmacSecret",
        "hmacMessage",
        "hmacOutput",
        "rsaFingerprint",
        "rsaPlaintext",
        "rsaCiphertext"
      ].forEach((id) => { byId(id).value = ""; });

      setStatus("hashStatus", "Lab data cleared.");
      setStatus("aesStatus", "Lab data cleared.");
      setStatus("hmacStatus", "Lab data cleared.");
      setStatus("rsaStatus", "Ephemeral key material cleared.");
      rsaKeyPair = null;
      rsaCiphertext = null;
      byId("rsaEncryptButton").disabled = true;
      byId("rsaDecryptButton").disabled = true;
      setSelfTestResult(
        byId("selfTestResult"),
        "",
        "Not run",
        "Tests SHA-256, AES-GCM, HMAC-SHA-256, and RSA-OAEP locally."
      );
    });

    document.querySelectorAll("[data-copy]").forEach((button) => {
      button.addEventListener("click", async () => {
        const target = byId(button.dataset.copy);
        if (!target.value) return;
        try {
          await navigator.clipboard.writeText(target.value);
          const original = button.textContent;
          button.textContent = "Copied";
          window.setTimeout(() => { button.textContent = original; }, 1200);
        } catch {
          target.focus();
          target.select();
        }
      });
    });
