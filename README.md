# UC Admin #

Automating some tasks on CUCM and CUC servers.


*please use ***full*** branch as main is only for front end developing for now*

## Enable AXL SOAP Service on CUCM:

Enable the AXL SOAP interface

Browse to the CUCM Serviceability page on https://<IP_CUCM>/ccmservice

Tools > Service Activation:

Enable the "Cisco AXL Web Service"

![](docs/2020-06-01-11-13-59.png)

---

## Create an AXL Service Account

> Step 1 - Create an AXL User Group

CUCM > User Management > User Group > Add.

> Step 2 - Assign the AXL role to the group

On the top right drop down list "Related Links". 


Select "Assign Role to User Group" and select "Standard AXL API Access"

![](docs/2020-06-01-11-29-06.png)


> Step 3 - Create a new Application User

CUCM > User Management > Application User > Add.

![](docs/2020-06-01-11-33-25.png)

Add the User Group "AXL Group" to this user so that after saving the roles of the new Application User appear as in the following screen:

![](docs/2020-06-01-11-43-34.png)

### Create DB
```sh
$ export DATABASE_URL="postgresql://username:password@localhost/mydatabase"

or

$ export DATABASE_URL="mysql+mysqlconnector://username:password@localhost/mydatabase"

or

$ export DATABASE_URL="sqlite:///your.db"
```
(More about connection strings in this [flask config guide](http://flask-sqlalchemy.pocoo.org/2.1/config/).)
```
$ python manage.py create_db
$ python manage.py db upgrade
$ python manage.py db migrate
```

To update database after creating new migrations, use:

```sh
$ python manage.py db upgrade
```

### Install Front-End Requirements
```sh
$ cd static
$ npm install
```

### Run Back-End

```sh
$ python manage.py runserver
```

### Test Back-End

```sh
$ python test.py --cov-report=term --cov-report=html --cov= tests/
```

### Run Front-End

```sh
$ cd static
$ npm start
```

### Build Front-End

```sh
$ npm run build:production
```

### New to Python?

If you are approaching this demo as primarily a frontend dev with limited or no python experience, you may need to install a few things that a seasoned python dev would already have installed.

Most Macs already have python 2.7 installed but you may not have pip install. You can check to see if you have them installed:

```
$ python --version
$ pip --version 
```

If pip is not installed, you can follow this simple article to [get both homebrew and python](https://howchoo.com/g/mze4ntbknjk/install-pip-on-mac-os-x)

After you install python, you can optionally also install python 3

```
$ brew install python3
```

Now you can check again to see if both python and pip are installed. Once pip is installed, you can download the required flask modules:

```
$ sudo pip install flask flask_script flask_migrate flask_bcrypt 
```

Now, you can decide on which database you wish to use. 

#### New to MySQL? 

If you decide on MySQL, install the free community edition of [MySQL](https://dev.mysql.com/downloads/mysql/) and [MySQL Workbench](https://www.mysql.com/products/workbench/)

1. start MySQL from the System Preferences
2. open MySQL Workbench and [create a database](http://stackoverflow.com/questions/5515745/create-a-new-database-with-mysql-workbench) called mydatabase but don't create the tables since python will do that for you
3. Install the MySQL connector for Python, add the DATABASE_URL configuration, and create the database and tables

```
$ sudo pip install mysql-connector-python-rf
$ export DATABASE_URL="mysql+mysqlconnector://username:password@localhost/mydatabase"
$ python manage.py create_db
```

Note: you do not need to run "python manage.py db upgrade" or "python manage.py db migrate" if its your first go at it

4. Run Back-End

```
$ python manage.py runserver
```

If all goes well, you should see ```* Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)``` followed by a few more lines in the terminal.

5. open a new tab to the same directory and run the front end

```
$ cd static
$ npm install
$ npm start
```

6. open your browser to http://localhost:3000/register and setup your first account
7. enjoy! By this point, you should be able to create an account and login without errors. 




