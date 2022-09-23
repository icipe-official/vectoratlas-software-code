# Backend Auth story

## Stories covered

- [57. Add auth workflow to the backend](https://github.com/icipe-official/vectoratlas-software-code/issues/57)

## Demo
1. Check out the `demo/sprint1-kita` branch
1. Start whole docker stack as usual
1. Browse to Auth0 management page, and navigate to the `APIs` page. For the `vector-atlas-api`, navigate to the `Test` tab.
1. In a terminal, run the curl command shown to get a bearer token
1. In Postman or equivalent, make a http get request to `localhost:1234/vector-api/authz` and show that it returns a 401
1. Add the bearer token to the request and send again. Show that `true` is returned.