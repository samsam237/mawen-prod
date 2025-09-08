from app import create_app
from flask_cors import CORS
#app=create_app('app.config.ProdConfig'); CORS(app)
app=create_app('app.config.DevConfig'); CORS(app, supports_credentials=True, origins=["*"])
if __name__=='__main__': app.run(debug=True)
