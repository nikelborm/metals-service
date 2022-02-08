# Description

Server expect process env variable `PORT` or if unpresent it will run on 3000 port by default

There is available only one single endpoint `/api/metalCosts`

It can be tested in any browser

```javascript
fetch('http://localhost:3000/api/metalCosts').then(res=>res.json()).then(console.log)
```

And also I deployed 1 instance on heroku (it free and will disable if too much queries will be sent)
You can check it by

```javascript
fetch('https://metals-service.herokuapp.com/api/metalCosts').then(res=>res.json()).then(console.log)
```
