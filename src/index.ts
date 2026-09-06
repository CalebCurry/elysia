import { Elysia } from "elysia";

const campaigns = [
  {
    campaignId: 1,
    name: "Summer Sale",
    dueDate: new Date(),
    createdAt: new Date()
  },
  {
    campaignId: 2,
    name: "Black Friday",
    dueDate: new Date(),
    createdAt: new Date()
  }
]

const app = new Elysia({"prefix": "/api/v1"})
  .get("/campaigns", () => {
    return {data: campaigns}
  })
  .get("/", () => "Hello Caleb!")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
