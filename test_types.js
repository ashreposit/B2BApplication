"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// This won't cause an error if your express.d.ts is working
var myRequest = {}; // Simulate an Express Request object
if (myRequest.user) {
    console.log(myRequest.user.id);
    console.log(myRequest.user.email);
}
else {
    console.log("User not present");
}
// Attempt to assign a value that matches your CustomJwtPayload
myRequest.user = { id: '123', email: 'test@example.com', iat: 12345, exp: 67890 }; // Add iat/exp for JwtPayload compatibility
console.log("Test complete.");
