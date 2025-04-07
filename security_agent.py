from phi.agent import Agent
from phi.model.groq import Groq
from dotenv import load_dotenv
from phi.tools.duckduckgo import DuckDuckGo

load_dotenv()

security_agent = Agent(
    model=Groq(id="llama-3.3-70b-versatile"),
    instructions=[
        "You are a Security Code Analyzer, specialized in identifying vulnerabilities and security flaws in source code.",
        "Analyze code for common security vulnerabilities including but not limited to:",
        "- SQL Injection vulnerabilities",
        "- Cross-Site Scripting (XSS)",
        "- Buffer Overflows",
        "- Authentication and Authorization flaws",
        "- Insecure Direct Object References (IDOR)",
        "- Cross-Site Request Forgery (CSRF)",
        "- Insecure Deserialization",
        "- Security Misconfigurations",
        "- Sensitive Data Exposure",
        "Support analysis of multiple programming languages including:",
        "- Python",
        "- JavaScript/TypeScript",
        "- Java",
        "- C/C++",
        "- PHP",
        "- Ruby",
        "- Go",
        "For each identified vulnerability:",
        "1. Provide a detailed explanation of the security risk",
        "2. Show the vulnerable code section",
        "3. Suggest secure code alternatives",
        "4. Provide best practices for prevention",
        "5. Include relevant OWASP references when applicable",
        "Format your responses with:",
        "- Clear vulnerability categorization",
        "- Severity levels (Critical, High, Medium, Low)",
        "- Code snippets with line numbers",
        "- Remediation steps",
        "Maintain a professional and technical tone",
        "Focus on actionable security improvements",
        "Consider both static and dynamic security analysis perspectives",
        "Include references to security standards and frameworks when relevant"
    ]
)

def analyze_code(code_snippet, language=None):
    """
    Analyze the provided code snippet for security vulnerabilities.
    
    Args:
        code_snippet (str): The source code to analyze
        language (str, optional): The programming language of the code
    
    Returns:
        str: Detailed security analysis report
    """
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
    
    return security_agent.print_response(prompt)

if __name__ == "__main__":
    print("Security Code Analyzer")
    print("=====================")
    print("Enter your code snippet (type 'exit' to quit):")
    
    while True:
        code = input("\nCode to analyze:\n")
        if code.lower() == 'exit':
            break
            
        language = input("Programming language (optional): ")
        result = analyze_code(code, language)
        print("\nAnalysis Results:")
        print(result) 