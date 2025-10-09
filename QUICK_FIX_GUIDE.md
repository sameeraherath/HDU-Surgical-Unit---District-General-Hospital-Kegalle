# Quick Fix: Convert CommonJS Routes to ES Modules

## Files Already Converted ✅

- `server/routes/clinicalAuditRoutes.js`
- `server/routes/consultantRoutes.js`
- `server/routes/consultationRoutes.js`

## Files to Check and Fix

Run this command to find files that still use CommonJS:

```powershell
cd server/routes
Get-ChildItem -Filter *.js | Select-String -Pattern "module.exports" -List | Select-Object Path
```

## Manual Fix Steps

For each file that uses `module.exports`:

### Step 1: Replace Import Statements

**Find:**

```javascript
const express = require("express");
const router = express.Router();
const someController = require("../controllers/someController");
const { authenticateJWT } = require("../middleware/auth");
```

**Replace with:**

```javascript
import express from "express";
import * as someController from "../controllers/someController.js";
import { authenticateJWT } from "../middleware/auth.js";

const router = express.Router();
```

### Step 2: Replace Export Statement

**Find:**

```javascript
module.exports = router;
```

**Replace with:**

```javascript
export default router;
```

## Files That Likely Need Fixing

Based on the error messages, these files may need conversion:

1. **server/routes/dischargePlanRoutes.js**
2. **server/routes/teachingNoteRoutes.js**
3. **server/routes/wardRoundRoutes.js**

## Quick Commands

### Check a specific file:

```powershell
Get-Content server/routes/dischargePlanRoutes.js | Select-String -Pattern "require|module.exports"
```

### Find all CommonJS files in routes:

```powershell
Get-ChildItem server/routes/*.js | Where-Object { (Get-Content $_.FullName -Raw) -match "module\.exports" } | Select-Object Name
```

## After Fixing

Once all files are converted, the server should start successfully with:

```bash
cd server
npm run dev
```

And you can access the API documentation at:

```
http://localhost:5000/api-docs
```

## Verification

To verify the server is running correctly:

1. Check terminal for:

   ```
   Server is running on port 5000
   📚 API Documentation available at http://localhost:5000/api-docs
   Socket.IO server is ready
   Database is connected and models are synchronized
   ```

2. Open browser to: `http://localhost:5000/api-docs`

3. You should see the Swagger UI interface with all your endpoints

## Need Help?

If you encounter issues:

1. Check the error message for the specific file name
2. Open that file
3. Convert `require` to `import`
4. Convert `module.exports` to `export default`
5. Add `.js` extension to relative imports
6. Save and let nodemon restart

The pattern is consistent across all files!
