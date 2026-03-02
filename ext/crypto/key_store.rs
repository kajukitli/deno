// Copyright 2018-2026 the Deno authors. MIT license.

use deno_core::OpState;
use deno_core::Resource;
use deno_core::ResourceId;
use serde::{Deserialize, Serialize};

/// The type of cryptographic key material stored
#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum KeyType {
  #[serde(rename = "private")]
  Private,
  #[serde(rename = "public")]
  Public,
  #[serde(rename = "secret")]
  Secret,
}

/// Key material stored in the Rust-side key store
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KeyMaterial {
  #[serde(rename = "type")]
  pub key_type: KeyType,
  pub data: Vec<u8>,
}

/// Resource representing stored key material
pub struct KeyResource {
  pub material: KeyMaterial,
}

impl Resource for KeyResource {
  fn name(&self) -> std::borrow::Cow<'_, str> {
    "CryptoKey".into()
  }
}

/// Store key material and return a resource ID
pub fn store_key(
  state: &mut OpState,
  key_type: KeyType,
  data: Vec<u8>,
) -> ResourceId {
  let material = KeyMaterial { key_type, data };
  let resource = KeyResource { material };
  state.resource_table.add(resource)
}

/// Retrieve key material by resource ID
pub fn get_key(state: &OpState, rid: ResourceId) -> Result<KeyMaterial, deno_core::error::AnyError> {
  let key_resource = state.resource_table.get::<KeyResource>(rid)?;
  Ok(key_resource.material.clone())
}

/// Split key material for asymmetric keypairs (RSA, EC)
/// Returns (private_key_rid, public_key_rid)
pub fn store_keypair(
  state: &mut OpState, 
  private_data: Vec<u8>,
  public_data: Vec<u8>,
) -> (ResourceId, ResourceId) {
  let private_rid = store_key(state, KeyType::Private, private_data);
  let public_rid = store_key(state, KeyType::Public, public_data);
  (private_rid, public_rid)
}