from functools import wraps
from flask import request, jsonify
from pydantic import ValidationError

def parse_request(model_class):
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            try:
                json_data = request.get_json()
                if json_data is None:
                    return jsonify({"error": "No JSON data provided"}), 400
                
                # Validate with Pydantic
                validated_data = model_class(**json_data)
                
                # Call the original function with validated data
                return f(validated_data, *args, **kwargs)
                
            except ValidationError as e:
                return jsonify({"error": "Invalid request data", "details": e.errors()}), 400
            except Exception as e:
                return jsonify({"error": str(e)}), 500
        return decorated_function
    return decorator