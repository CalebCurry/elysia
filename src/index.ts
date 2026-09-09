import openapi from '@elysia/openapi';
import { Elysia, t } from 'elysia';
import { Database } from 'bun:sqlite';
import { drizzle } from 'drizzle-orm/bun-sql';
import { eq } from 'drizzle-orm'
import { campaigns } from './schema';
import * as schema from './schema'
import { createInsertSchema } from 'drizzle-typebox';

const db = drizzle(process.env.DATABASE_URL!, { schema, casing: "snake_case"})

const _insertCampaign = createInsertSchema(campaigns)
const campaignBody = t.Omit(_insertCampaign, ['campaignId', 'createdAt'])

const app = new Elysia({ prefix: '/api/v1' })
    .use(openapi())
    // .onError(({ code, error, status }) => {
    //   if (code === "NOT_FOUND") return status(404, {error: "Not Found"})
    //   if (code === "VALIDATION") return status(422, {error: "Bad request data"}) 
    //   console.error(error)
    //   return status(500, {error: "Something went wrong, try again later"})
    // })
    .get('/campaigns', async () => {
        return {
            data: await db.select().from(campaigns)
        };
    })
    .get(
        '/campaigns/:id',
        async ({ params: { id }, status }) => {
            const [campaign] = await db
                .select()
                .from(campaigns)
                .where(eq(campaigns.campaignId, id))
            if (!campaign) {
                return status(404);
            }
            return { data: campaign };
        },
        {
            params: t.Object({ id: t.Number() }),
        },
    )
    .post(
        '/campaigns',
        async ({ body, status }) => {
            const [campaign] = await db
              .insert(campaigns).values(body).returning()
            return status(201, { data: campaign });
        },
        {
            body: campaignBody
        },
    )
    .delete(
        '/campaigns/:id',
        async ({ params: { id }, status }) => {
            const deleted = await db
            .delete(campaigns)
            .where(eq(campaigns.campaignId, id))
            .returning()
            if (deleted.length === 0) return status(404);
            return status(204);
        },
        { params: t.Object({ id: t.Number() }) },
    )
    .put(
        '/campaigns/:id',
        async ({ params: { id }, body, status }) => {
            const [campaign] = await db
                .update(campaigns)
                .set({
                  name: body.name,
                  dueDate: body.dueDate ?? null
                })
                .where(eq(campaigns.campaignId, id))
                .returning()

            if (!campaign) return status(404);
            return { data: campaign };
        },
        {
            params: t.Object({ id: t.Number() }),
            body: campaignBody
        },
    )
    /*
  {
    params: t.Object({ id: t.Number() }),
    query: t.Object({ limit: t.Optional(t.Number()) }),
    body: t.Object({
        name: t.String(),
        dueDate: t.Optional(t.String())
    })
  } 
  */

    .get('/', () => 'Hello Caleb!')
    .listen(3000);

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
