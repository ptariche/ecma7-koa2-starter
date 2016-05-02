# ECMA7 Koa2 Example Boilerplate

### PREREQUISITES
 - Couchbase
 - Node 4.3.1 or greater than


### Routes
 - /user/create   - [POST]
  - Expected input JSON Data

    ```js
      {
        "email":"fakeemail@test.com",
        "firstName":"tester",
        "lastName":"super"
      }
    ```
  - Expected Response

    ```js
      {
        "code": 200,
        "data": {
          "user": {
            "created": true
          }
        }
      }
    ```

### Environment Variables
```js
process.env.SECRET
process.env.SALT
process.env.PORT
process.env.COUCHBASE_URI
process.env.COUCHBASE_BUCKET
process.env.PASSWORD
```

### To Run
  ```js
  npm install && gulp && npm start
  ```


#### Function to Chain a Class with Await/async
  ```js
  helpers.chain = async (_functions) => {
    let _this  = null;
    let result = null;
    for (let i = 0; i < _functions.length; i++) {
      let _function = _functions[i];
      result = _this ? await _this[_function]() : await _function();
      _this = result;
    };

    return result;
  };
  ```


#### Authors
Peter A.Tariche

#### GPG
```
pub   4096R/20B2284C 2016-04-29 [expires: 2017-04-29]
uid       [ultimate] Peter A. Tariche <ptariche@gmail.com>
```
