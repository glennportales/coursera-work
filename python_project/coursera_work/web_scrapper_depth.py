import requests
from bs4 import BeautifulSoup
import ssl
from urllib.parse import urljoin

# Create SSL context to ignore certificate errors
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# Set to keep track of visited URLs to avoid cycles
visited = set()

# Base URL to start scraping
base_url = 'https://www.poderjudicial.pr/eng'

def scrape_site(url, depth):
    # Check if the URL has already been visited
    if url in visited:
        return []
    
    visited.add(url)
    
    try:
        response = requests.get(url, verify=False)
        response.raise_for_status()
    except requests.RequestException as e:
        print(f"Failed to retrieve {url}: {e}")
        return []

    # Parse HTML content with BeautifulSoup
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Extract page title
    title = soup.title.string.strip() if soup.title else 'No Title'
    results = [(title, depth, url)]

    # Find all anchor tags to get links
    for tag in soup.find_all('a', href=True):
        link = tag.get('href')
        full_link = urljoin(url, link)
        
        # Only follow internal links (links starting with base URL)
        if base_url in full_link and full_link not in visited:
            results.extend(scrape_site(full_link, depth + 1))
    
    return results

# Start scraping from the base URL
site_map = scrape_site(base_url, depth=0)

# Print the report of page titles and their depths
for title, depth, link in site_map:
    print(f"{'  ' * depth}Title: {title} (Depth: {depth}) URL: {link}")