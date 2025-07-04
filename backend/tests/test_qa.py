from unittest.mock import patch

@patch("app.services.qa_service.qa_chain.run")
def test_ask_question(mock_qa_run, test_client):
    mock_qa_run.return_value = "The proposal aims to..."
    
    response = test_client.post("/api/v1/qa/1/ask", params={"question": "What is the goal?"})
    assert response.status_code == 200
    assert "answer" in response.json()
