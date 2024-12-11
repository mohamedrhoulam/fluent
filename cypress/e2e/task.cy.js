describe('Task Service', () => {
  const BASE_URL = 'http://localhost:5000/api/tasks';

  it('fetches tasks successfully', () => {
    cy.intercept('GET', BASE_URL, { fixture: 'tasks.json' }).as('fetchTasks');
    cy.request(BASE_URL).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body).to.be.an('array');
    });
  });

  it('creates a task successfully', () => {
    const mockTask = {
      title: 'Sample Task',
      description: 'This is a sample task description',
      completed: false,
      dueDate: new Date().toISOString(),
      location: 'Sample Location',
      participants: ['John Doe', 'Jane Doe'],
      subtasks: [
        {
          _id: 'subtask-id',
          title: 'Sample Subtask',
          description: 'Subtask description',
          completed: false,
          dueDate: new Date().toISOString(),
          location: 'Subtask Location',
          participants: ['Subtask Participant'],
        },
      ],
    };

    cy.intercept('POST', BASE_URL, { fixture: 'createdTask.json' }).as('createTask');
    cy.request('POST', BASE_URL, mockTask).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('_id');
      expect(response.body.title).to.eq(mockTask.title);
    });
  });

  it('updates a subtask successfully', () => {
    const mockTaskId = 'task-id';
    const mockSubtaskId = 'subtask-id';
    const mockUpdates = {
      title: 'Updated Subtask Title',
      completed: true,
    };

    cy.intercept('PUT', `${BASE_URL}/${mockTaskId}/subtasks/${mockSubtaskId}`, { fixture: 'updatedTask.json' }).as('updateSubtask');
    cy.request('PUT', `${BASE_URL}/${mockTaskId}/subtasks/${mockSubtaskId}`, mockUpdates).then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.subtasks[0].title).to.eq(mockUpdates.title);
      expect(response.body.subtasks[0].completed).to.be.true;
    });
  });

  it('creates a task with only the title', () => {
    const mockTask = {
      title: 'Title Only Task',
      description: '',
      completed: false,
      dueDate: null,
      location: '',
      participants: [],
      subtasks: [],
    };

    cy.intercept('POST', BASE_URL, { fixture: 'createdTask.json' }).as('createTask');
    cy.request('POST', BASE_URL, mockTask).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.title).to.eq(mockTask.title);
    });
  });

  it('creates a task with all attributes filled', () => {
    const mockTask = {
      title: 'Full Task',
      description: 'This is a fully detailed task',
      completed: false,
      dueDate: new Date().toISOString(),
      location: 'Office',
      participants: ['John Doe', 'Jane Doe'],
      subtasks: [
        {
          _id: 'subtask-id',
          title: 'Sample Subtask',
          description: 'Subtask description',
          completed: false,
          dueDate: new Date().toISOString(),
          location: 'Subtask Location',
          participants: ['Subtask Participant'],
        },
      ],
    };

    cy.intercept('POST', BASE_URL, { fixture: 'createdTask.json' }).as('createTask');
    cy.request('POST', BASE_URL, mockTask).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.title).to.eq(mockTask.title);
    });
  });

  it('creates a task with only the title and then updates it with subtasks', () => {
    const mockTask = {
      title: 'Title Only Task',
      description: '',
      completed: false,
      dueDate: null,
      location: '',
      participants: [],
      subtasks: [],
    };

    const updatedTask = {
      ...mockTask,
      subtasks: [
        {
          _id: 'subtask-id',
          title: 'New Subtask',
          description: 'Subtask description',
          completed: false,
          dueDate: new Date().toISOString(),
          location: 'Subtask Location',
          participants: ['Subtask Participant'],
        },
      ],
    };

    cy.intercept('POST', BASE_URL, { fixture: 'createdTask.json' }).as('createTask');
    cy.request('POST', BASE_URL, mockTask).then((response) => {
      expect(response.status).to.eq(201);
      const createdTaskId = response.body._id;

      cy.intercept('PUT', `${BASE_URL}/${createdTaskId}`, { fixture: 'updatedTask.json' }).as('updateTask');
      cy.request('PUT', `${BASE_URL}/${createdTaskId}`, { subtasks: updatedTask.subtasks }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
        expect(updateResponse.body.subtasks).to.have.length(1);
      });
    });
  });

  it('creates a task with a random name, then modifies it by adding a new subtask but keeps the task in the database', () => {
    const randomName = `Task-${Math.random().toString(36).substring(7)}`;
    const mockTask = {
      title: randomName,
      description: '',
      completed: false,
      dueDate: null,
      location: '',
      participants: [],
      subtasks: [],
    };

    const updatedTask = {
      ...mockTask,
      subtasks: [
        {
          _id: 'subtask-id',
          title: 'New Subtask',
          description: 'Subtask description',
          completed: false,
          dueDate: new Date().toISOString(),
          location: 'Subtask Location',
          participants: ['Subtask Participant'],
        },
      ],
    };

    cy.intercept('POST', BASE_URL, { fixture: 'createdTask.json' }).as('createTask');
    cy.request('POST', BASE_URL, mockTask).then((response) => {
      expect(response.status).to.eq(201);
      const createdTaskId = response.body._id;

      cy.intercept('PUT', `${BASE_URL}/${createdTaskId}`, { fixture: 'updatedTask.json' }).as('updateTask');
      cy.request('PUT', `${BASE_URL}/${createdTaskId}`, { subtasks: updatedTask.subtasks }).then((updateResponse) => {
        expect(updateResponse.status).to.eq(200);
        expect(updateResponse.body.subtasks).to.have.length(1);

        cy.intercept('GET', `${BASE_URL}/${createdTaskId}`, { fixture: 'updatedTask.json' }).as('fetchTask');
        cy.request('GET', `${BASE_URL}/${createdTaskId}`).then((fetchResponse) => {
          expect(fetchResponse.status).to.eq(200);
          expect(fetchResponse.body.subtasks).to.have.length(1);
        });
      });
    });
  });
});