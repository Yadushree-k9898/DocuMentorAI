import google.generativeai as genai

genai.configure(api_key="AIzaSyDlSFUmi9bK5sXbQLbiJ9-nPDx-0E2FqTg")

# ✅ Use the correct full model name
model = genai.GenerativeModel(model_name="models/gemini-1.5-pro")

response = model.generate_content("Hello! How are you?")
print(response.text)
