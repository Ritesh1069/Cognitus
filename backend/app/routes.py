from flask import Blueprint, request, jsonify
from .agents import bug_agent, style_agent, performance_agent, security_agent

api = Blueprint('api', __name__)

@api.route('/analyze/bug', methods=['POST'])
def analyze_bug():
    data = request.json
    code = data.get('code')
    if not code:
        return jsonify({'error': 'No code provided'}), 400
    
    result = bug_agent.analyze_code(code)
    return jsonify({'result': result})

@api.route('/analyze/style', methods=['POST'])
def analyze_style():
    data = request.json
    code = data.get('code')
    language = data.get('language')
    team_conventions = data.get('team_conventions')
    
    if not code:
        return jsonify({'error': 'No code provided'}), 400
    
    result = style_agent.analyze_style(code, language, team_conventions)
    return jsonify({'result': result})

@api.route('/analyze/performance', methods=['POST'])
def analyze_performance():
    data = request.json
    code = data.get('code')
    language = data.get('language')
    context = data.get('context')
    
    if not code:
        return jsonify({'error': 'No code provided'}), 400
    
    result = performance_agent.analyze_performance(code, language, context)
    return jsonify({'result': result})

@api.route('/analyze/security', methods=['POST'])
def analyze_security():
    data = request.json
    code = data.get('code')
    language = data.get('language')
    
    if not code:
        return jsonify({'error': 'No code provided'}), 400
    
    result = security_agent.analyze_code(code, language)
    return jsonify({'result': result}) 