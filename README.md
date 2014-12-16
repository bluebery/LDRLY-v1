# LDRLY-v1

**Installation**

- Clone repo to your local machine
- Run npm install
- Run npm server

By default the server will run on port 8080 and will connect to mongodb running at bluebery.dyx.com:27017/test.
You can change these parameters in the server.js file to suit your needs.

Note that there is a commented out call at the end of the file used for generating sample data in a new mongodb instance. You can uncomment this before a run of the server if you are pointing at a new mongodb instance, but do not run it against the mongodb running at bluebery.dyx.com as it is already pre-populated. Remember to comment the method again if you are re-running the server or it will keep on creating duplicate records.

Postman is a chrome browser plugin you can use to test the API features.



**API Methods**

HTTP 200 Returned on okay
HTTP 422 Returned on bad input semantics

POST /api/sendStat

    eg.
    
    POST /api/sendStat HTTP/1.1
    Host: localhost:8080
    Cache-Control: no-cache
    Content-Type: application/x-www-form-urlencoded
    
    value=243&username=user1&name=weapons

GET /api/getLeaderboard?statname=name

    eg.
    
    GET /api/getLeaderboard?statname=xp HTTP/1.1
    Host: localhost:8080
    Cache-Control: no-cache
    Content-Type: application/x-www-form-urlencoded

GET /api/getStats?username=name

    eg.
    
    GET /api/getStats?username=user1 HTTP/1.1
    Host: localhost:8080
    Cache-Control: no-cache
    Content-Type: application/x-www-form-urlencoded
