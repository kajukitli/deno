// Check if WebSocketStream has the required symbols
try {
  const ws = new WebSocketStream("ws://localhost:12345");
  const symbols = Object.getOwnPropertySymbols(ws);
  console.log("WebSocketStream symbols:", symbols.length);
  symbols.forEach((sym, i) => {
    console.log(`  ${i}: ${sym.toString()}`);
  });
  
  // Look for our specific symbols
  const hasRemoteCloseCode = symbols.some(s => s.toString().includes('remoteCloseCode'));
  const hasRemoteCloseReason = symbols.some(s => s.toString().includes('remoteCloseReason'));
  
  console.log("Has _remoteCloseCode symbol:", hasRemoteCloseCode);  
  console.log("Has _remoteCloseReason symbol:", hasRemoteCloseReason);
  
} catch (e) {
  console.error("Error:", e.message);
}