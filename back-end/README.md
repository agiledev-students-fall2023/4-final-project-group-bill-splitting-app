# Backend Setup for Our Application

Welcome to the backend part of our application, which uses Express.js. This guide provides step-by-step instructions to set up and run the backend on your local machine.

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/): Required to run the Express.js server and manage dependencies.
- [npm](https://www.npmjs.com/): Comes bundled with Node.js and is used for package management.

## Getting Started

Follow these steps to get the backend server running:

### Step 1: Clone the Repository

If you haven't already, clone the main repository to your local machine. Use the following command in your terminal:

```bash
git clone https://github.com/agiledev-students-fall2023/4-final-project-group-bill-splitting-app.git
```

Navigate to the backend directory:

```bash
cd back-end
```

### Step 2: Install Dependencies

Install the necessary Node.js packages for the backend:

```bash
npm install
```

### Step 3: Start the Server

Run the following command to start the Express.js server:

```bash
npm start
```

#### Using Nodemon for Automatic Server Restart

To automatically restart the server on file changes, install Nodemon globally:

```bash
sudo npm install -g nodemon
```
Then, start your Express.js server with Nodemon:

```bash
nodemon server
```
Nodemon monitors your files for changes and restarts the server automatically, streamlining the development process.


### Step 4: Unit Testing with Mocha, Chai, and c8

Unit testing is crucial for maintaining the quality of our application. We use Mocha as our test framework, Chai for assertions, and c8 to track test coverage. 

### Prerequisites for Testing

Ensure you have the following testing tools installed:

- [Mocha](https://mochajs.org/): A feature-rich JavaScript test framework running on Node.js, making asynchronous testing simple and fun.
- [Chai](https://www.chaijs.com/): A BDD/TDD assertion library for node and the browser that can be paired with any JavaScript testing framework.
- [c8](https://github.com/bcoe/c8): A tool for generating test coverage reports.

These should already be included in your `package.json` dependencies. 

### Running Unit Tests

To run the unit tests, execute the following command:

```bash
npm test
```

This command will run all tests written in the `test` directory.

### Generating Test Coverage Report

To see how well our tests cover the code, we use c8 to generate coverage reports. Run the following command:

```bash
npm run coverage
```

The server will start, typically on `http://localhost:3001`. 

Thank you for contributing to our project!
