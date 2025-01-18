In this project, simple token and jwt token issuance processes were carried out. In the later stages of the project, nodemailer was installed and e-mail sending operations were carried out to the users. In the last stage, the multer module was installed and file upload operations were carried out. Finally, an addition was made to index.js and the images added to the project were shown in the browser when the relevant path was written. here is the structure:

### ERD:

![ERD](./erdPizzaAPI.png)

### Folder/File Structure:

```
    .env
    .gitignore
    index.js
    package.json
    readme.md
    logs/
    src/
        configs/
            dbConnection.js
        controllers/
            auth.js
            order.js
            pizza.js
            token.js
            topping.js
            user.js
        helpers/
            passwordEncrypt.js
            sync.js
        middlewares/
            authentication.js
            errorHandler.js
            queryHandler.js
            logger.js
            permissions.js
        models/
        routes/
            auth.js
            document.js
            index.js
            order.js
            pizza.js
            token.js
            topping.js
            user.js
```