from groq import Groq
from dotenv import load_dotenv
import os

load_dotenv()

# Initialize the Groq client
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def analyze_code(code):
    """
    Analyze code for bugs and suggest improvements using Groq's API
    """
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
        model="llama3-70b-8192",  # Updated to use the correct model name
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

print("Hello! I am CodeReviewer, your AI code review assistant. How can I help you with your code today?")
user_input = input("Please share your code or describe the issue you'd like me to review:\n")

# Analyze the code and print the response
analysis = analyze_code(user_input)
print("\nAnalysis Results:")
print(analysis)