from flask import Blueprint
boisson = Blueprint('boisson', __name__)

from . import routes