# The Group Bill Splitting App

## Description of Project

The Group Bill Splitting App is designed to streamline the process of splitting bills among groups of people. In today's social and financial landscape, individuals often find themselves sharing expenses in various settings, such as dining out, traveling, or living together. This application aims to provide an efficient and user-friendly solution for managing shared expenses, ensuring that everyone pays their fair share effortlessly.

### Product Vision Statement

In a world where coming together and sharing moments are core to our daily lives - whether it's traveling abroad, dining out with friends, going on work trips with colleagues, or handling routine household bills with family - dealing with shared financial responsibilities should be simple and straightforward. Our vision is to introduce a unified platform where handling and dividing shared expenses is as easy as a single click. We aim for an app that makes group financial transactions clear-cut while prioritizing clarity, adaptability, and user comfort. The Group Bill Splitting App is designed to enable users to easily track, manage, and clear their shared expenses, fostering trust and enhancing the pleasure of shared moments without the monetary hassle.

## Core Team Members

- [Allison Ji](https://github.com/Allison67)
- [Joy Chen](https://github.com/joyc7)
- [Cindy Liang](https://github.com/cindyliang01)
- [Laura Zhao](https://github.com/HedwigO)
- [Elaine Zhang](https://github.com/elaineZhang67)

## Contribution

Please refer to [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this project.

## Instructions for Building and Testing

### Step 1. Clone the [Group Bill Split Repo](https://github.com/agiledev-students-fall2023/4-final-project-group-bill-splitting-app) by

```bash
git clone https://github.com/agiledev-students-fall2023/4-final-project-group-bill-splitting-app.git
```

### Step 2. Make sure you have Node installed.

Both the back-end and front-end should be running.

### Step 3. Building and Running the Backend

#### Navigate to the backend directory:

```bash
cd back-end
```

#### Install Dependencies

Install the necessary Node.js packages for the backend:

```bash
npm install
```

#### Start the Server

Run the following command to start the Express.js server:

```bash
nodemon server
```

You can open `http://localhost:3001` to see back end.<br>

### Step 4. Building and Running the Frontend

#### Navigate to the front-end directory

```bash
cd front-end
```

#### Install Dependencies

Install the required packages using npm. These packages are essential for the app to function correctly:

```bash
npm install
```

#### Start the Application

With all the dependencies in place, start the application by running:

```bash
npm start
```

### Step 5. Accessing the App

Once the app is running, it will be available in development mode. Open your web browser and go to [http://localhost:3000](http://localhost:3000) to view the app.

### Step 6. Unit tests

#### Navigate to the back-end directory

```bash
cd back-end
```

#### Running Unit Tests

To run the unit tests, execute the following command:

```bash
npm test
```

## CI/CD using GitHub Actions

We have set up Continuous Integration and Continuous Deployment (CI/CD) using GitHub Actions. Every push to the main branch triggers automatic testing and deployment to our Digital Ocean Droplet.

## Docker Integration

We have containerized our application using Docker. You can build and run the Docker containers for both the front end and back end with the provided Dockerfiles.

## Deployment to Digital Ocean Droplet

Front end address is `http://165.22.42.62:3000/`

Back end address is `http://165.22.42.62:3001/`

## Additional Links

- [User Experience Design](UX-DESIGN.md)

## Project Roles

| Week     | Product Owner | Scrum Master |
| -------- | ------------- | ------------ |
| Sprint 1 | Laura Zhao    | Elaine Zhang |
| Sprint 2 | Joy Chen      | Cindy Liang  |
| Sprint 3 | Allison Ji    | Joy Chen     |
| Sprint 4 | Cindy Liang   | Allison Ji   |
