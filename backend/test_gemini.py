import google.generativeai as genai

# 🔑 Paste your MakerSuite key directly here
genai.configure(api_key="AIzaSyB4uSATHPObAWPyxdzf0v-EvoqnAN2Ot6M")

print("\n📌 Listing Models:")
try:
    for model in genai.list_models():
        print("✅", model.name, model.supported_generation_methods)
except Exception as e:
    print("❌ Error listing models:", e)

print("\n📄 Testing generateContent with gemini-pro")
try:
    model = genai.GenerativeModel(model_name="models/gemini-pro")
    response = model.generate_content("Summarize the benefits of AI in education.")
    print("✅ Summary:\n", response.text)
except Exception as e:
    print("❌ Error during summarization:", e)
