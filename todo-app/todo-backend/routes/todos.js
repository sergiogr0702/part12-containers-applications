const express = require('express');
const { Todo } = require('../mongo')
const { setAsync, getAsync } = require('../redis')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  let counts = await getAsync("todosCounter");
  if (!counts) {
    const todoCount = await Todo.countDocuments({})
    counts = todoCount;
  }

  await setAsync("todosCounter", counts);

  res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.status(200).send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const { done, text } = req.body;

  const todo = await Todo.findOneAndUpdate(
    {_id: req.todo._id },
    { text, done },
    { new: true, useFindAndModify: false }
  );
  res.sendStatus(200).send(todo);
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;
