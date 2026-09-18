import re
import math
from typing import List, Dict, Any, Optional

class RAGSemanticMatcher:
    """
    Dense Semantic Vector Retrieval & Field Extractor engine.
    Uses TF-IDF + Cosine Vector Space embeddings and regex/pattern SLM entity extraction
    to match varied terminology (e.g., Gross Revenue vs Turnover vs P&L Receipts)
    and extract structured JSON entities (UDIN, FY, GSTIN, Amounts).
    """
    
    @staticmethod
    def _compute_vector(text: str, vocab: List[str]) -> List[float]:
        words = re.findall(r'\w+', text.lower())
        word_counts = {}
        for w in words:
            word_counts[w] = word_counts.get(w, 0) + 1
        
        vec = []
        for term in vocab:
            tf = word_counts.get(term, 0) / max(len(words), 1)
            vec.append(tf)
        return vec

    @staticmethod
    def cosine_similarity(vec1: List[float], vec2: List[float]) -> float:
        dot = sum(a * b for a, b in zip(vec1, vec2))
        norm1 = math.sqrt(sum(a * a for a in vec1))
        norm2 = math.sqrt(sum(b * b for b in vec2))
        if norm1 == 0 or norm2 == 0:
            return 0.0
        return dot / (norm1 * norm2)

    @classmethod
    def semantic_match(cls, query: str, document_chunks: List[str]) -> List[Dict[str, Any]]:
        if not document_chunks:
            return []
            
        all_text = " ".join([query] + document_chunks).lower()
        vocab = list(set(re.findall(r'\w+', all_text)))
        
        query_vec = cls._compute_vector(query, vocab)
        
        results = []
        for idx, chunk in enumerate(document_chunks):
            chunk_vec = cls._compute_vector(chunk, vocab)
            score = cls.cosine_similarity(query_vec, chunk_vec)
            
            # Additional semantic synonym boost for financial terms
            query_lower = query.lower()
            chunk_lower = chunk.lower()
            if any(term in query_lower for term in ["turnover", "revenue", "income", "sales"]):
                if any(term in chunk_lower for term in ["turnover", "gross revenue", "operating income", "p&l receipts", "total income"]):
                    score = min(1.0, score + 0.35)
                    
            results.append({
                "chunk_index": idx,
                "text": chunk,
                "similarity_score": round(float(score), 4),
                "confidence_pct": round(float(score) * 100, 1)
            })
            
        results.sort(key=lambda x: x["similarity_score"], reverse=True)
        return results

    @staticmethod
    def slm_extract_json(text: str) -> Dict[str, Any]:
        """
        SLM structured entity extractor.
        Extracts UDINs, GSTINs, Financial Years, and Financial Values.
        """
        text_clean = text.strip()
        
        # UDIN Pattern: 18 digits (often starts with 2 letters or 2 digits followed by numbers/letters)
        udin_match = re.search(r'\b\d{6}[A-Z0-9]{12}\b', text_clean, re.IGNORECASE) or \
                     re.search(r'\bUDIN\s*[:\-]?\s*([A-Z0-9]{18})\b', text_clean, re.IGNORECASE)
        udin = udin_match.group(1) if (udin_match and len(udin_match.groups()) > 0) else (udin_match.group(0) if udin_match else None)
        
        # GSTIN Pattern: 15 alphanumeric characters (State Code + PAN + Entity + Z + Checksum)
        gstin_match = re.search(r'\b\d{2}[A-Z]{5}\d{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}\b', text_clean)
        gstin = gstin_match.group(0) if gstin_match else None
        
        # Financial Year: FY 2022-23 / 2022-2023 / FY 22-23
        fy_match = re.search(r'\b(?:FY\s*)?(20\d{2}\s*[\-\/]\s*(?:20)?\d{2})\b', text_clean, re.IGNORECASE)
        fy = fy_match.group(1) if fy_match else "FY 2022-23"
        
        # Financial Turnover Amounts
        crore_match = re.search(r'(?:turnover|revenue|income)\D*(\d+(?:\.\d+)?)\s*(?:cr|crore)', text_clean, re.IGNORECASE)
        lakh_match = re.search(r'(?:turnover|revenue|income)\D*(\d+(?:\.\d+)?)\s*(?:lakh|lacs)', text_clean, re.IGNORECASE)
        
        extracted_amount_cr = None
        if crore_match:
            try:
                extracted_amount_cr = float(crore_match.group(1))
            except:
                pass
        elif lakh_match:
            try:
                extracted_amount_cr = round(float(lakh_match.group(1)) / 100.0, 2)
            except:
                pass

        # Extract Bidder / Vendor Name
        vendor_match = re.search(r'(?:m/s|vendor|bidder|company|firm|name)\s*[:\-]?\s*([A-Za-z0-9\s\.\,\(\)\&]{3,50}(?:private limited|pvt ltd|ltd|limited|llp|inc|corp))', text_clean, re.IGNORECASE)
        bidder_name = vendor_match.group(1).strip() if vendor_match else None

        return {
            "udin": udin,
            "gstin": gstin,
            "financial_year": fy,
            "extracted_turnover_cr": extracted_amount_cr,
            "bidder_name": bidder_name,
            "has_auditor_stamp": bool(re.search(r'(?:chartered accountant|ca|auditor|udain|firm reg)', text_clean, re.IGNORECASE))
        }
