import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const user = await prisma.user.upsert({
    where: { email: "demo@retellai.dev" },
    update: {},
    create: {
      email: "demo@retellai.dev",
      passwordHash,
      agents: {
        create: [
          {
            name: "Sales Assistant",
            description: "Handles inbound product inquiries",
            voiceModel: "en-US-Wavenet-D",
            callSessions: {
              create: [
                {
                  transcript: "Hello! Thanks for calling our sales line.",
                },
              ],
            },
          },
          {
            name: "Support Agent",
            description: "Resolves customer issues",
            voiceModel: "en-US-Wavenet-F",
          },
        ],
      },
    },
    include: {
      agents: {
        include: {
          callSessions: true,
        },
      },
    },
  });

  console.log("Seed completed:", JSON.stringify(user, null, 2));
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
