from flask import Blueprint, request, jsonify
from models.venue import Venue
from controllers import get_venues, update_venue, add_venue

bp = Blueprint('venue', __name__, url_prefix='/v1/api')

@bp.route('/venues', methods=['GET'])
def venues_info_route():
    return get_venues()

@bp.route('/venue/<string:venue_id>', methods=['PUT'])
def update_venue_route(venue_id):
    return update_venue(venue_id)

@bp.route('/add_venue', methods=['POST'])
def add_single_venue():
    return add_venue()

