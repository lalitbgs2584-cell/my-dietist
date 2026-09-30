import { db } from "./prisma/db";


const user = await db.orm.public.User.create({
  email: "lalit@dietist.dev",
  name: "Lalit",
});

console.log("created user:", user);

await db.close();