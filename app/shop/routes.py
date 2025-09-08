from flask import render_template,current_app
from . import shop
@shop.route('/')
def index():
    ds=current_app.extensions['data_service']; items=ds.get_marketplace_data('shop')
    return render_template('shop/index.html', data=items)
