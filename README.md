# Precious metals service

Server expects process env variable `PORT` to be present. If it's not, server will default to 3000 port

There is available only one single endpoint `/api/metalCosts`

It can be tested in any browser

```javascript
fetch('http://localhost:3000/api/metalCosts').then(res=>res.json()).then(console.log)
```
