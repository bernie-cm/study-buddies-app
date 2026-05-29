## Project information
### Overview
Study Buddies is designed to help university students manage their study groups, or join others. It provides Create, Read, Update, and Delete operations for users to manage study groups.

#### How to access the app
**Public URL** http://3.27.136.168

Use the following username and password of a fake test user
- Email: `m.smith@example.com`
- Password: `pass1234`

#### Technology
- React
- JavaScript
- Git
- AWS (EC2)
- MongoDB

### Getting started
```
$ git clone https://github.com/bernie-cm/study-buddies-app.git
$ cd study-buddies-app
```

#### Initial configuration
`$ cp backend/.env.example backend/.env # Add your own environment variables in .env`

#### Running the app
```
# From the root directory
$ npm run install-all
$ npm start
```
Now open your browser and navigate to `http://localhost:3000`.

### Developing
Clone the GitHub repository to your local environment
```
$ git clone https://github.com/bernie-cm/study-buddies-app.git
$ cd study-buddies-app
```

### Features
- User authentication
- New user registration
- Create new study groups
- Read existing study groups
- Filter by university or study subject
- Edit study groups owned by the authenticated user
- Delete study groups owned by the authenticated user