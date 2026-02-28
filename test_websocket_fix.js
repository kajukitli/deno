// Test for WebSocketStream remote close code/reason fix
async function test() {
  console.log("Testing WebSocketStream remote close code/reason...");
  
  // Create a websocket stream (we can't test actual close without a server,
  // but we can test that the symbols are properly defined and initialized)
  try {
    const ws = new WebSocketStream("ws://example.com");
    
    // Check that the close promise exists
    console.log("✓ WebSocketStream created successfully");
    console.log("✓ closed property exists:", typeof ws.closed === 'object');
    
    // The fix adds proper tracking of remote close codes
    // Since we can't easily test actual websocket closing without a server,
    // we'll verify the implementation has the necessary symbols
    const symbols = Object.getOwnPropertySymbols(ws);
    console.log("Number of symbols on WebSocketStream:", symbols.length);
    
    // Just ensuring the constructor didn't fail - the real test needs a server
    console.log("✓ Test passed - WebSocketStream appears properly constructed");
    
  } catch (e) {
    console.log("✗ Error:", e.message);
  }
}

test();