from flask import render_template,current_app
from . import admin

@admin.route('/')
def dashboard():
    return render_template('admin/dashboard.html')

@admin.route('/login')
def login():
    return render_template('admin/login.html')
