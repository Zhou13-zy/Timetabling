from flask import Flask
from config import Config
from flask_migrate import Migrate
from flask.cli import FlaskGroup
from flask_cors import CORS
from routes import user_routes, unit_routes, venue_routes, main_routes, file_upload_routes, staff_routes, discipline_routes, cfs_routes, import_timetable_routes, cohort_routes,  faculty_routes, unitsession_routes, session_routes
from flask_swagger_ui import get_swaggerui_blueprint
import swagger_config as swag_conf
from flask_jwt_extended import JWTManager
from itsdangerous import URLSafeTimedSerializer

# importing the models to be created in the database
from models import db, execute_sql_file





def create_app(config_name="default"):
    app = Flask(__name__ , static_url_path='/static')
    CORS(app)
    app.config.from_object(Config)
    serializer = URLSafeTimedSerializer(app.config['TOKEN_SECRET_KEY'])
    jwt = JWTManager(app)
    
    db.init_app(app)
    

    # creating the tables for development purpose, later this will be replaced by migration 
    #with app.app_context():
    #    db.create_all()

    migrate = Migrate(app, db)

    with app.app_context():
        execute_sql_file('university_timetable.sql', db.session)
    # Register blueprints, Swagger, and routes here
    app.register_blueprint(user_routes.bp)
    app.register_blueprint(unit_routes.bp)
    app.register_blueprint(staff_routes.bp)
    app.register_blueprint(discipline_routes.bp)
    app.register_blueprint(venue_routes.bp)  
    app.register_blueprint(file_upload_routes.bp)
    app.register_blueprint(cfs_routes.bp)
    app.register_blueprint(main_routes.bp)
    app.register_blueprint(import_timetable_routes.bp)
    app.register_blueprint(cohort_routes.bp)
    app.register_blueprint(faculty_routes.bp)
    app.register_blueprint(unitsession_routes.bp)
    app.register_blueprint(session_routes.bp)
    # Swagger UI configuration
    swaggerui_blueprint = get_swaggerui_blueprint(
        swag_conf.SWAGGER_URL,
        swag_conf.API_URL,
        config={'app_name': "University Timetabling API"},
        blueprint_name=swag_conf.SWAGGER_BLUEPRINT_NAME
    )
    app.register_blueprint(swaggerui_blueprint, url_prefix=swag_conf.SWAGGER_URL)

    return app

if __name__ == '__main__':
    app = create_app()
    #serializer = URLSafeTimedSerializer(app.config['TOKEN_SECRET_KEY'])
    cli = FlaskGroup(create_app=create_app)
    app.run(host='0.0.0.0', port=5005, debug=True)
