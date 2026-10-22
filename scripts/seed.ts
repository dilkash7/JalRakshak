import { hashPassword } from "../lib/auth";
import { userRepo } from "../lib/db";

async function runSeed() {
  console.log("=========================================");
  console.log("   JalRakshak Administrator Seed Script   ");
  console.log("=========================================\n");

  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();
  const name = process.env.ADMIN_NAME?.trim() || "Administrator";

  if (!email || !password) {
    console.error("❌ ERROR: ADMIN_EMAIL and ADMIN_PASSWORD must be set in your environment.");
    console.error("   Example: ADMIN_EMAIL=admin@jalrakshak.org ADMIN_PASSWORD=yourStrongPassword123 npm run seed\n");
    process.exit(1);
  }

  if (password.length < 8) {
    console.error("❌ ERROR: ADMIN_PASSWORD must be at least 8 characters long.\n");
    process.exit(1);
  }

  try {
    const existing = await userRepo.findByEmail(email);
    if (existing) {
      console.log(`ℹ️  Administrator (${email}) already exists. Idempotent skip: no changes made.\n`);
      process.exit(0);
    }

    const passwordHash = await hashPassword(password);
    const user = await userRepo.create({
      name,
      email,
      passwordHash,
      role: "admin",
    });

    console.log(`✅ Administrator created successfully!`);
    console.log(`   Name:  ${user.name}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Role:  ${user.role}`);
    console.log(`\nYou can now log in at /admin/login using these credentials.\n`);
    process.exit(0);
  } catch (err: any) {
    console.error("❌ ERROR during seed execution:", err.message || err);
    process.exit(1);
  }
}

runSeed();
