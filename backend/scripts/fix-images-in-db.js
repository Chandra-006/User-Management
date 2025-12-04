// scripts/fix-images-in-db.js
const mongoose = require("mongoose");
const User = require("../src/models/User");
require("dotenv").config();

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to Mongo");

  const users = await User.find({});
  let updated = 0;

  for (const u of users) {
    const pi = u.profile_image;
    if (!pi) continue;

    // if it contains drive letter or backslashes
    if (pi.includes(":/") || pi.includes("\\") || pi.startsWith("/")) {
      const filename = pi.split(/[\\/]+/).pop();
      u.profile_image = `uploads/${filename}`;
      await u.save();
      updated++;
      console.log(`Fixed ${u._id} -> ${u.profile_image}`);
    }
  }

  console.log("Done. Updated:", updated);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
