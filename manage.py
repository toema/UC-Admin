from flask_script import Manager
from flask_migrate import Migrate, MigrateCommand

from application.app import app, db

migrate = Migrate(app, db)
manager = Manager(app)

# migrations
manager.add_command('db', MigrateCommand)


@manager.command
def create_db():
    """Creates the db tables."""
    db.create_all()


if __name__ == '__main__':
    db.create_collection('Before_User')
    db.create_collection('After_DN')
    db.create_collection('Before_DN')
    db.create_collection('Before_Device')
    db.create_collection('After_Device')
    db.create_collection('After_VM')
    db.create_collection('Before_VM')
    db.create_collection('After_User')
    db.create_collection('Adduser package')

    manager.run()
