const express = require('express');
const asyncHandler = require('express-async-handler');
const { validationResult } = require('express-validator');
const { Dig } = require('../../db/models');
const { digValidators } = require('../../validations');

const router = express.Router();

router.get('/',
  asyncHandler(async (_req, res) => {
    const digs = await Dig.findAll();
    return res.status(200).json({
      digs
    });
  })
);

router.get('/:digId(\\d+)',
  asyncHandler(async (req, res) => {
    const dig = await Dig.findOne(req.params.id);
    return res.json(dig);
  })
);

router.post('/',
  digValidators,
  asyncHandler(async (req, res) => {
    const { address, city, state, country, title, price, description, guests, bedrooms, beds, baths, pets, userId } = req.body;
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errors = validationErrors.array().map(error => error.msg);
      return res.status(400).json(errors);
    }
    const dig = Dig.build({
      address,
      city,
      state,
      country,
      title,
      price,
      description,
      guests,
      bedrooms,
      beds,
      baths,
      pets,
      userId
    });
    const result = await dig.save();
    return res.status(200).json(result);
  })
)

router.put(`/:digId(\\d+)`,
  asyncHandler(async (req, res) => {
    const dig = await Dig.findByPk(req.params.digId);
    dig.address = req.body.address;
    dig.city = req.body.city;
    dig.state = req.body.state;
    dig.country = req.body.country;
    dig.title = req.body.title;
    dig.price = req.body.price;
    dig.description = req.body.description;
    dig.guests = req.body.guests;
    dig.bedrooms = req.body.bedrooms;
    dig.beds = req.body.beds;
    dig.baths = req.body.baths;
    dig.pets = req.body.pets;
    const result = await dig.save();
    return res.status(200).json(result);
  })
)

router.delete('/:digId(\\d+)',
  asyncHandler(async (req, res) => {
    const dig = await Dig.findByPk(req.params.digId);
    await dig.destroy();
    return res.json({id: dig.id});
  })

);

module.exports = router;
