from flask import render_template,current_app
from . import boisson
@boisson.route('/')
def index():
    ds=current_app.extensions['data_service']; items=ds.get_marketplace_data('boisson')
    return render_template('boisson/index.html', data=items)
