import openapi from "@elysia/openapi";
import { Elysia, t } from "elysia";
import { Database } from "bun:sqlite"

const db = new Database('campaigns.db')

db.run(`
    CREATE TABLE IF NOT EXISTS campaigns (
      campaign_id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      due_date TEXT,
      created_at TEXT NOT NULL
    )
`)

if(!db.query('SELECT 1 FROM campaigns').get()){
  db.run(`INSERT INTO campaigns (name, created_at) VALUES (?, ?)`, ["Cyber Monday", new Date().toISOString()])
}



const app = new Elysia({"prefix": "/api/v1"})
  .use(openapi())
  .get("/campaigns", () => {
    return { data: db.query('SELECT campaign_id AS campaignId, name, due_date AS dueDate, created_at AS createdAt FROM campaigns').all() }
  })
  .get("/campaigns/:id", ({params: {id}, status}) => {
    const campaign = db.query('SELECT campaign_id AS campaignId, name, due_date AS dueDate, created_at AS createdAt FROM campaigns WHERE campaign_id = ?').get(id)
    if (!campaign){
      return status(404)
    }
    return {data: campaign}
  }, {
    params: t.Object({ id: t.Number()})
  })
  .post("/campaigns", ({body, status}) => {
    const campaign = db.query(`
      INSERT INTO campaigns (name, due_date, created_at)
      VALUES (?,?,?)
      RETURNING campaign_id AS campaignId, name, due_date AS dueDate, created_at AS createdAt  
    `).get(body.name, body.dueDate ?? null, new Date().toISOString())

    return status(201, {data: campaign})
  }, {body: t.Object({
    name: t.String(),
    dueDate: t.Optional(t.String( { format: 'date'}))
  })})
  .delete('/campaigns/:id', ({params: {id}, status}) => {
    const {changes} = db.run('DELETE FROM campaigns WHERE campaign_id = ?', [id])
    if (changes === 0) return status(404)
    return 204
  }, { params: t.Object({ id: t.Number()})})

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


  .get("/", () => "Hello Caleb!")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
