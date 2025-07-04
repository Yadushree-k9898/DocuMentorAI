def test_upload_pdf(test_client):
    with open("sample.pdf", "rb") as f:
        response = test_client.post(
            "/api/v1/documents/upload-pdf",
            files={"file": ("sample.pdf", f, "application/pdf")},
        )
    assert response.status_code == 200
    assert "document_id" in response.json()
