from langchain_community.document_loaders import WebBaseLoader
import requests

class ScraperService:
    @staticmethod
    def extract_text(url: str) -> str:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"
        }
        
        try:
            # specialized Wikipedia handling
            if "wikipedia.org" in url.lower():
                try:
                    # Extract title from URL (e.g. https://en.wikipedia.org/wiki/Aladdin -> Aladdin)
                    title = url.split("/wiki/")[-1].split("?")[0].split("#")[0]
                    # Use MediaWiki API with explaintext=1 for clean, full text
                    # We use the en.wikipedia.org domain or the one from the URL
                    domain = url.split("://")[-1].split("/")[0]
                    api_url = f"https://{domain}/w/api.php"
                    params = {
                        "action": "query",
                        "format": "json",
                        "titles": title,
                        "prop": "extracts",
                        "explaintext": 1,
                        "redirects": 1
                    }
                    res = requests.get(api_url, params=params, headers=headers, timeout=10)
                    if res.status_code == 200:
                        data = res.json()
                        pages = data.get("query", {}).get("pages", {})
                        # The API returns pages keyed by their ID
                        for page_id in pages:
                            content = pages[page_id].get("extract", "")
                            if content:
                                return content
                except Exception as wiki_err:
                    print(f"Wikipedia API failed, falling back to standard scraping: {wiki_err}")

            # Standard scraping with browser headers
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code != 200:
                raise ValueError(f"Failed to fetch website (Status {response.status_code}): {url}")

            # Utilizing Langchain web loader for cleaner extracting.
            # We must pass the headers to the loader as well if it supports them
            loader = WebBaseLoader(url, header_template=headers)
            docs = loader.load()
            text = "\n".join([doc.page_content for doc in docs])
            
            # Simple cleanup of massive whitespaces
            text = " ".join(text.split())
            
            if not text.strip():
                raise ValueError(f"No text content could be extracted from {url}")
                
            return text
        except requests.exceptions.Timeout:
            raise ValueError(f"Request timed out while fetching {url}")
        except Exception as e:
            if isinstance(e, ValueError):
                raise e
            raise ValueError(f"An unexpected error occurred while scraping {url}: {str(e)}")

scraper_service = ScraperService()
