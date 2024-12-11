/**
 * @swagger
 * /api/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "New Task"
 *               description:
 *                 type: string
 *                 example: "Task description"
 *               completed:
 *                 type: boolean
 *                 example: false
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2023-12-31T23:59:59.000Z"
 *               location:
 *                 type: string
 *                 example: "Office"
 *               participants:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["John Doe", "Jane Doe"]
 *               subtasks:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     title:
 *                       type: string
 *                       example: "Subtask title"
 *                     description:
 *                       type: string
 *                       example: "Subtask description"
 *                     completed:
 *                       type: boolean
 *                       example: false
 *                     dueDate:
 *                       type: string
 *                       format: date-time
 *                       example: "2023-12-31T23:59:59.000Z"
 *                     location:
 *                       type: string
 *                       example: "Office"
 *                     participants:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["John Doe", "Jane Doe"]
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/tasks/{taskId}/subtasks:
 *   get:
 *     summary: Get all subtasks for a task
 *     tags: [Subtasks]
 *     parameters:
 *       - in: path
 *         name: taskId
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: List of subtasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Subtask'
 *       404:
 *         description: Task not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/tasks/subtask/{subtaskId}:
 *   get:
 *     summary: Get a subtask by ID
 *     tags: [Subtasks]
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         schema:
 *           type: string
 *         description: The subtask ID
 *     responses:
 *       200:
 *         description: Subtask found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subtask'
 *       404:
 *         description: Subtask not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The task ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Task updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/tasks/subtask/{subtaskId}:
 *   put:
 *     summary: Update a subtask by ID
 *     tags: [Subtasks]
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         schema:
 *           type: string
 *         description: The subtask ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Subtask'
 *     responses:
 *       200:
 *         description: Subtask updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subtask'
 *       404:
 *         description: Subtask not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/tasks/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/tasks/subtask/{subtaskId}:
 *   delete:
 *     summary: Delete a subtask by ID
 *     tags: [Subtasks]
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         schema:
 *           type: string
 *         description: The subtask ID
 *     responses:
 *       200:
 *         description: Subtask deleted successfully
 *       404:
 *         description: Subtask not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/tasks/{id}/complete:
 *   put:
 *     summary: Mark a task as completed
 *     tags: [Tasks]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         description: The task ID
 *     responses:
 *       200:
 *         description: Task marked as completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       404:
 *         description: Task not found
 *       400:
 *         description: Bad request
 */

/**
 * @swagger
 * /api/tasks/subtask/{subtaskId}/complete:
 *   put:
 *     summary: Mark a subtask as completed
 *     tags: [Subtasks]
 *     parameters:
 *       - in: path
 *         name: subtaskId
 *         schema:
 *           type: string
 *         description: The subtask ID
 *     responses:
 *       200:
 *         description: Subtask marked as completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Subtask'
 *       404:
 *         description: Subtask not found
 *       400:
 *         description: Bad request
 */