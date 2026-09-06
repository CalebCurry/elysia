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
  .get("/campaigns/:id", ({params: {id}, status}) => {
    const campaign = campaigns.find((c) => c.campaignId == Number(id))
    if (!campaign){
      return status(404)
    }
    return {data: campaign}
  })
  .get("/", () => "Hello Caleb!")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
