from app import create_app
from models import db
from sqlalchemy.orm import scoped_session, sessionmaker
import pytest
import sys
import os
sys.path.insert(0, os.path.abspath(
    os.path.join(os.path.dirname(__file__), '..')))


@pytest.fixture
def app():
    app = create_app("test")
    return app


@pytest.fixture
def session(app):
    with app.app_context():
        db.create_all()
        connection = db.engine.connect()
        # Start a transaction at the beginning of the test
        transaction = connection.begin()

        # bind the session to the connection
        SessionLocal = sessionmaker(bind=connection)
        session = scoped_session(SessionLocal)

        yield session

        session.close()  # close the session
        transaction.rollback()  # Rollback the transaction after the test
        connection.close()  # Close the connection


@pytest.fixture
def client(app):
    return app.test_client()
