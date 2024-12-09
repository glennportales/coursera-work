import requests
from bs4 import BeautifulSoup
import ssl
from urllib.parse import urljoin, urlparse, urlunparse
import warnings
from requests.packages.urllib3.exceptions import InsecureRequestWarning
from datetime import datetime

# Ignore SSL warnings
warnings.simplefilter('ignore', InsecureRequestWarning)

# Create SSL context to ignore certificate errors
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Keep track of visited URLs to avoid infinite loops
visited = set()

# A global counter to keep track of how many pages we've processed
pages_visited_count = 0

# Base URL to start scraping
base_url = 'https://www.poderjudicial.pr/'
parsed_base = urlparse(base_url)
base_domain = parsed_base.netloc.lower()

# The partial path or filename you are looking for
target_path = "Documentos/Resolucion/2011/RESOLUCION-APROBANDO-REGLAS-PARA-IMPLANTACION-DE-LEY-ASUNTOS-NO-CONTENCIOSOS-ANTE-NOTARIO.pdf"

# List to store URLs where the target_path is found
found_urls = []

def normalize_url(u):
    """Normalize a URL by removing fragments and queries and lowercasing the domain."""
    parsed = urlparse(u)
    normalized = urlunparse((parsed.scheme.lower(),
                             parsed.netloc.lower(),
                             parsed.path,
                             '', '', ''))
    return normalized

def log_heartbeat():
    """Log a heartbeat message to a file to indicate the script is still running."""
    global pages_visited_count
    with open("heartbeat.txt", "a") as f:
        f.write(f"{datetime.now().isoformat()} - Still running. Pages visited: {pages_visited_count}\n")
        f.flush()

def scrape_site(url, depth=0, max_depth=5):
    global pages_visited_count

    # Limit recursion depth to prevent infinite crawling
    if depth > max_depth:
        return

    normalized_url = normalize_url(url)
    if normalized_url in visited:
        return
    visited.add(normalized_url)

    try:
        response = requests.get(url, verify=False, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Failed to retrieve {url}: {e}")
        return

    # Check if the response is HTML
    content_type = response.headers.get('Content-Type', '')
    if 'text/html' not in content_type.lower():
        # If it's not HTML, skip parsing this URL
        print(f"Skipping URL {url} because it does not appear to be HTML. Content-Type: {content_type}")
        return

    # Attempt to parse HTML with lxml parser
    try:
        soup = BeautifulSoup(response.content, 'html.parser')
    except Exception as e:
        print(f"Failed to parse {url} as HTML: {e}")
        return

    # Check for the target_path in anchor tags
    for tag in soup.find_all('a', href=True):
        link = tag.get('href')
        if link and target_path in link:
            found_urls.append((url, link))

    # Increment the count of visited pages and log heartbeat after processing this page
    pages_visited_count += 1
    log_heartbeat()

    # Follow internal links within the same domain
    for tag in soup.find_all('a', href=True):
        link = tag.get('href')
        if link:
            full_link = urljoin(url, link)
            parsed_link = urlparse(full_link)
            # Only follow links within the same domain
            if parsed_link.netloc.lower() == base_domain:
                scrape_site(full_link, depth + 1, max_depth)

# Start scraping from the base URL
scrape_site(base_url)

# Print the results
if found_urls:
    print("The target document was found on the following pages:")
    for page_url, doc_link in found_urls:
        print(f"Page: {page_url}\nAnchor Link: {doc_link}\n")
else:
    print("The target document was not found on any visited pages.")
