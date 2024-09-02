const express = require('express');
const { Todo } = require('../mongo')
const { getAsync, setAsync } = require('../redis');
const router = express.Router();

const configs = require('../util/config')

let visits = 0

/* GET index data. */
router.get('/', async (req, res) => {
  visits++

  res.send({
    ...configs,
    visits
  });
});

router.get('/stadistics', async (req, res) => {
  let counts = await getAsync("todosCounter");

  if (!counts) {
    const todoCount = await Todo.countDocuments({})
    counts = todoCount;
    await setAsync("todosCounter", counts);
  }

  res.send({
    added_todos: Number(counts),
  });
});

module.exports = router;
