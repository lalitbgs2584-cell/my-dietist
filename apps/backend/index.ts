import { prisma, type User } from "@mydietist/db";

console.log("Backend starting...");

const users: User[] = await prisma.user.findMany();
console.log("Fetched users from @mydietist/db:", users);
