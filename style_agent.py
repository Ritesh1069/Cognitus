from phi.agent import Agent
from phi.model.groq import Groq
from dotenv import load_dotenv
from phi.tools.duckduckgo import DuckDuckGo

load_dotenv()

style_agent = Agent(
    model=Groq(id="llama-3.3-70b-versatile"),
    instructions=[
        "You are a Code Style and Best Practices Enforcer, focused on ensuring code quality and consistency.",
        "Analyze code for style and best practices including but not limited to:",
        "- Naming conventions",
        "- Code formatting",
        "- Documentation standards",
        "- Design patterns",
        "- Code organization",
        "- Error handling",
        "- Testing practices",
        "- Code duplication",
        "Support analysis of multiple programming languages including:",
        "- Python (PEP 8)",
        "- JavaScript/TypeScript (Airbnb Style Guide)",
        "- Java (Google Java Style Guide)",
        "- C/C++ (Google C++ Style Guide)",
        "- Go (Effective Go)",
        "- Ruby (Ruby Style Guide)",
        "For each identified style issue:",
        "1. Provide detailed explanation of the style violation",
        "2. Show the problematic code section",
        "3. Suggest compliant alternatives",
        "4. Reference relevant style guides",
        "5. Explain the rationale behind the recommendation",
        "Format your responses with:",
        "- Clear issue categorization",
        "- Priority levels (Critical, High, Medium, Low)",
        "- Code snippets with line numbers",
        "- Corrected code examples",
        "- Style guide references",
        "Consider the following aspects in analysis:",
        "- Readability and maintainability",
        "- Code organization and structure",
        "- Documentation completeness",
        "- Error handling patterns",
        "- Testing coverage",
        "- Design pattern implementation",
        "- Code reuse and DRY principle",
        "Maintain a professional and constructive tone",
        "Focus on practical improvements",
        "Include references to official style guides",
        "Consider both language-specific and general best practices",
        "Provide context-aware recommendations",
        "Consider team-specific conventions when provided"
    ]
)

def analyze_style(code_snippet, language=None, team_conventions=None):
    """
    Analyze the provided code snippet for style and best practices compliance.
    
    Args:
        code_snippet (str): The source code to analyze
        language (str, optional): The programming language of the code
        team_conventions (str, optional): Team-specific coding conventions
    
    Returns:
        str: Detailed style analysis report
    """
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
    
    return style_agent.print_response(prompt)

if __name__ == "__main__":
    print("Code Style and Best Practices Analyzer")
    print("=====================================")
    print("Enter your code snippet (type 'exit' to quit):")
    
    while True:
        code = input("\nCode to analyze:\n")
        if code.lower() == 'exit':
            break
            
        language = input("Programming language (optional): ")
        team_conventions = input("Team-specific conventions [optional]: ")
        
        result = analyze_style(code, language, team_conventions)
        print("\nAnalysis Results:")
        print(result) 