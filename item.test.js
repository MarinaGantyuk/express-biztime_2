process.env.NODE_ENV = "test";
// npm packages
const request = require("supertest");

const slugify = require("slugify");
// app imports
const app = require("./app");

let company = {
  name: "Sony",
  description: "tech company",
};

const code = slugify(company.name, {
  trim: true,
  lower: true,
});

beforeEach(async () => {
  request(app).post("/companies").send(company);
});

afterEach(async () => {
  request(app).delete("/companies/" + code);
});
// end afterEach

/** GET /items - returns `{items: [item, ...]}` */

describe("GET /companies", function () {
  test("Gets a list of companies", function () {
    request(app)
      .get(`/items`)
      .then((response) => {
        const companies = response.body.companies;
        expect(response.statusCode).toBe(200);
        expect(companies).toContainObject({
          code: code,
          ...company,
        });
      });
  });
});
// end

/** GET /items/[name] - return data about one item: `{item: item}` */

describe("GET /companies/:code", function () {
  test("Gets a single company", function () {
    request(app)
      .get(`/companies/${code}`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.item).toEqual(item);
      });
  });

  test("Responds with 404 if can't find item", function () {
    request(app)
      .get(`/companies/0`)
      .then((response) => {
        expect(response.statusCode).toBe(404);
      });
  });
});
// end

/** POST /items - create item from data; return `{item: item}` */

describe("POST /items", function () {
  test("Creates a new item", function () {
    request(app)
      .post("/companies")
      .send({ name: "dell", description: "laptop manufacture" })
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body.company).toHaveProperty("name");
        expect(response.body.company).toHaveProperty("description");
        expect(response.body.company.name).toEqual("dell");
        expect(response.body.company.description).toEqual("laptop manufacture");
      });
  });
});
// end

/** PATCH /items/[name] - update item; return `{item: item}` */

// end;

/** DELETE /items/[name] - delete item,
 *  return `{message: "item deleted"}` */

describe("DELETE /companies/:name", function () {
  test("Deletes a single a company", function () {
    request(app)
      .delete(`/companies/dell`)
      .then((response) => {
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({ status: "deleted" });
      });
  });
});
// end
