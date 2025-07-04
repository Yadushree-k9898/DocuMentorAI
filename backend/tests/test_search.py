from app.utils.search_utils import build_vector_store, search_similar

def test_vector_index_search():
    index, ids = build_vector_store(["hello world", "ai proposal"])
    results = search_similar(index, "ai", ids)
    
    assert results
    assert any("ai" in r.lower() for r in results)
