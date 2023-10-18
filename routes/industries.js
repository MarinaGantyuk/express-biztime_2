const express = require("express");
const ExpressError = require("../expressError");
const db = require("../db");
const slugify = require("slugify");

let router = new express.Router();

router.get("/:code", async function (req, res, next) {
  try {
    let code = req.params.code;

    const indResult = await db.query(
      `SELECT code, industry
           FROM industries
           WHERE code = $1`,
      [code]
    );

    const compResult = await db.query(
      `SELECT comp_code
           FROM indusries_company
           JOIN industries on industry_code = code
           WHERE code = $1`,
      [code]
    );

    if (indResult.rows.length === 0) {
      throw new ExpressError(`No such company: ${code}`, 404);
    }

    const industry = indResult.rows[0];
    const companies = compResult.rows;

    industry.company = companies.map((inv) => inv.comp_code);

    return res.json({ industry: industry });
  } catch (err) {
    return next(err);
  }
});

router.post("/", async function (req, res, next) {
  try {
    let { name, industry } = req.body;
    let code = slugify(name, industry, {
      trim: true,
      lower: true,
    });

    const result = await db.query(
      `INSERT INTO industries (code, industry) 
           VALUES ($1, $2) 
           RETURNING code, industry`,
      [code, industry]
    );

    return res.status(201).json({ industry: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

router.post("/associate", async function (req, res, next) {
  try {
    let { comp_code, industry_code } = req.body;

    const result = await db.query(
      `INSERT INTO indusries_company (comp_code, industry_code) 
           VALUES ($1, $2) 
           RETURNING comp_code, industry_code`,
      [comp_code, industry_code]
    );

    return res.status(201).json({ associate: result.rows[0] });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
