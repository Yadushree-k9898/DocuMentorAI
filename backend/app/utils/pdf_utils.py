import fitz  


def extract_text_from_pdf(filepath: str) -> str:
    text = ""
    with fitz.open(filepath) as doc:
        for page in doc:
            text += page.get_text()
    return text
