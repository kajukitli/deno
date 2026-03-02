// Copyright 2018-2026 the Deno authors. MIT license.

use deno_core::op2;
use deno_core::OpState;
use deno_core::ResourceId;
use deno_core::JsBuffer;

use serde::{Deserialize, Serialize};

use crate::key_store::{KeyMaterial, KeyType, get_key, store_key, store_keypair};
use crate::generate_key::{GenerateKeyOptions, GenerateKeyError};
use crate::shared::SharedError;

#[derive(Deserialize)]
pub struct KeyData {
  #[serde(rename = "type")]
  pub key_type: KeyType,
  pub data: JsBuffer,
}



#[derive(Serialize)]
#[serde(untagged)]
pub enum GenerateKeyResult {
  Secret {
    key: ResourceId,
  },
  Keypair {
    #[serde(rename = "privateKey")]
    private_key: ResourceId,
    #[serde(rename = "publicKey")]
    public_key: ResourceId,
  },
}

/// Store a single key and return its resource ID
#[op2]
#[serde]
pub fn op_crypto_store_key(
  state: &mut OpState,
  #[serde] key_data: KeyData,
) -> ResourceId {
  store_key(state, key_data.key_type, key_data.data.to_vec())
}

/// Store a keypair and return both resource IDs
#[op2]
#[serde]
pub fn op_crypto_store_keypair(
  state: &mut OpState,
  #[buffer] private_data: JsBuffer,
  #[buffer] public_data: JsBuffer,
) -> (ResourceId, ResourceId) {
  store_keypair(state, private_data.to_vec(), public_data.to_vec())
}

/// Retrieve key material by resource ID
#[op2]
#[serde]
pub fn op_crypto_get_key(
  state: &OpState,
  #[smi] rid: ResourceId,
) -> Result<KeyMaterial, SharedError> {
  get_key(state, rid).map_err(|_| SharedError::ExpectedValidPrivateKey)
}

/// Generate key and store in resource, returning resource ID(s)
#[op2]
#[serde]
pub fn op_crypto_generate_key_rust(
  state: &mut OpState,
  #[serde] opts: GenerateKeyOptions,
) -> Result<GenerateKeyResult, GenerateKeyError> {
  let opts_for_match = opts.clone();
  let buf = crate::generate_key::generate_key_internal(opts)?;

  match opts_for_match {
    GenerateKeyOptions::Rsa { .. } | GenerateKeyOptions::Ec { .. } => {
      // For asymmetric algorithms, we store the private key data
      // and use the same data for public key (differentiated by KeyType)
      let private_rid = store_key(state, KeyType::Private, buf.clone());
      let public_rid = store_key(state, KeyType::Public, buf);
      Ok(GenerateKeyResult::Keypair {
        private_key: private_rid,
        public_key: public_rid,
      })
    }
    GenerateKeyOptions::Aes { .. } | GenerateKeyOptions::Hmac { .. } => {
      // For symmetric algorithms, we store as secret key
      let key_rid = store_key(state, KeyType::Secret, buf);
      Ok(GenerateKeyResult::Secret { key: key_rid })
    }
  }
}