from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize the Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class BugAgent:
    def analyze_code(self, code):
        prompt = f"""You are a Code Review Expert specializing in bug detection and code improvement.
        Please analyze the following code and provide:
        1. Any bugs or issues found
        2. Suggestions for improvement
        3. Best practices that could be applied
        
        Code to analyze:
        {code}
        
        Please format your response with clear sections for issues, explanations, and solutions.
        """
        
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": "You are a Code Review Expert specializing in bug detection and code improvement."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000,
            top_p=0.95,
            stream=False
        )
        
        return response.choices[0].message.content

class StyleAgent:
    def analyze_style(self, code_snippet, language=None, team_conventions=None):
        prompt = f"""
        Please analyze the following code for style and best practices compliance:
        
        Language: {language if language else 'Not specified'}
        Team Conventions: {team_conventions if team_conventions else 'Not provided'}
        
        Code:
        {code_snippet}
        
        Provide a comprehensive style analysis including:
        1. Identified style violations and best practice issues
        2. Priority levels and rationale
        3. Detailed explanations of issues
        4. Compliant code alternatives
        5. Relevant style guide references
        6. Team convention compliance (if provided)
        """
        
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": "You are a Code Style and Best Practices Enforcer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000,
            top_p=0.95,
            stream=False
        )
        
        return response.choices[0].message.content

class PerformanceAgent:
    def analyze_performance(self, code_snippet, language=None, context=None):
        prompt = f"""
        Please analyze the following code for performance optimization opportunities:
        
        Language: {language if language else 'Not specified'}
        Context: {context if context else 'Not provided'}
        
        Code:
        {code_snippet}
        
        Provide a comprehensive performance analysis including:
        1. Identified bottlenecks and inefficiencies
        2. Impact levels and potential improvements
        3. Detailed explanations of issues
        4. Optimized code alternatives
        5. Best practices for performance
        6. Expected performance gains
        """
        
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": "You are a Performance Optimization Specialist."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000,
            top_p=0.95,
            stream=False
        )
        
        return response.choices[0].message.content

class SecurityAgent:
    def analyze_code(self, code_snippet, language=None):
        prompt = f"""
        Please analyze the following code for security vulnerabilities:
        
        Language: {language if language else 'Not specified'}
        
        Code:
        {code_snippet}
        
        Provide a comprehensive security analysis including:
        1. Identified vulnerabilities
        2. Severity levels
        3. Detailed explanations
        4. Secure code alternatives
        5. Best practices for prevention
        """
        
        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": "You are a Security Code Analyzer."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
            max_tokens=1000,
            top_p=0.95,
            stream=False
        )
        
        return response.choices[0].message.content

# Initialize agent instances
bug_agent = BugAgent()
style_agent = StyleAgent()
performance_agent = PerformanceAgent()
security_agent = SecurityAgent() 