# model folder will be using for managing data, locig and rules of our app
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text

db = SQLAlchemy()

def execute_sql_file(file_path, session):
    with open(file_path, 'r') as file:
        statements = file.read().split(';')
        for statement in statements:
            if statement.strip():
                session.execute(text(statement))
    session.commit()