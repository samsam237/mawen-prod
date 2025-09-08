from flask import render_template,current_app
from . import contact
@contact.route('/')
def index():
    ds=current_app.extensions['data_service']; items=ds.get_marketplace_data('contact')
    return render_template('contact/index.html', data=items)
