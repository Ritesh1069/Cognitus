from phi.agent import Agent
from phi.model.groq import Groq
from dotenv import load_dotenv
from phi.tools.duckduckgo import DuckDuckGo

load_dotenv()

performance_agent = Agent(
    model=Groq(id="llama-3.3-70b-versatile"),
    instructions=[
        "You are a Performance Optimization Specialist, focused on analyzing and improving code efficiency.",
        "Analyze code for performance issues including but not limited to:",
        "- Algorithmic complexity and efficiency",
        "- Memory usage and leaks",
        "- CPU utilization",
        "- I/O operations optimization",
        "- Database query optimization",
        "- Resource management",
        "- Caching opportunities",
        "- Concurrent execution possibilities",
        "Support analysis of multiple programming languages including:",
        "- Python",
        "- JavaScript/TypeScript",
        "- Java",
        "- C/C++",
        "- Go",
        "- Rust",
        "For each identified performance issue:",
        "1. Provide detailed explanation of the bottleneck",
        "2. Show the inefficient code section",
        "3. Suggest optimized alternatives",
        "4. Provide performance metrics and benchmarks when possible",
        "5. Include relevant design patterns and best practices",
        "Format your responses with:",
        "- Clear issue categorization",
        "- Impact levels (Critical, High, Medium, Low)",
        "- Code snippets with line numbers",
        "- Optimization steps",
        "- Expected performance improvements",
        "Consider the following aspects in analysis:",
        "- Time complexity (Big O notation)",
        "- Space complexity",
        "- Memory allocation patterns",
        "- CPU cache utilization",
        "- Network and I/O efficiency",
        "- Database query optimization",
        "- Concurrency and parallelism opportunities",
        "Maintain a professional and technical tone",
        "Focus on measurable performance improvements",
        "Include references to performance testing tools and methodologies",
        "Consider both micro-optimizations and architectural improvements"
    ]
)

def analyze_performance(code_snippet, language=None, context=None):
    """
    Analyze the provided code snippet for performance optimization opportunities.
    
    Args:
        code_snippet (str): The source code to analyze
        language (str, optional): The programming language of the code
        context (str, optional): Additional context about the code's usage and requirements
    
    Returns:
        str: Detailed performance analysis report
    """
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
    
    return performance_agent.print_response(prompt)

if __name__ == "__main__":
    print("Performance Optimization Analyzer")
    print("================================")
    print("Enter your code snippet (type 'exit' to quit):")
    
    while True:
        code = input("\nCode to analyze:\n")
        if code.lower() == 'exit':
            break
            
        language = input("Programming language (optional): ")
        context = input("Additional context (e.g., usage patterns, requirements) [optional]: ")
        
        result = analyze_performance(code, language, context)
        print("\nAnalysis Results:")
        print(result) 