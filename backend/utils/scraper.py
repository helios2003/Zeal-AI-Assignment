import requests
import json
from bs4 import BeautifulSoup

def scrape_url(url):
    """
    Scrapes the URL as given by the user and extracts the necessary information
    """
    response = requests.get(url)
    if response.status_code == 200:
        soup = BeautifulSoup(response.text, 'html.parser')

        events = []
        event_names = []

        for event_card in soup.find_all('a', class_='event-card-link'):
            # Extract event details
            event_name = event_card.get('aria-label', 'No Title')

            if event_name not in event_names:
                event_names.append(event_name)
                event_link = event_card.get('href', 'No Link')
                event_location = event_card.get('data-event-location', 'No Location')
                event_category = event_card.get('data-event-category', 'No Category')

                events.append({
                    'name': event_name,
                    'link': event_link,
                    'location': event_location,
                    'category': event_category,
                })
        return events
    else:
        print(f"Failed to fetch data from the website. Status code: {response.status_code}")

def scrape_seattle_website(start_page, end_page):
    """
    Scrapes all the pages of the website
    """
    all_events = []
    for page in range(start_page, end_page + 1):
        URL = f"https://www.eventbrite.com/d/wa--seattle/all-events/?page={page}"
        new_events = scrape_url(URL)
        all_events.extend(new_events)
        print(f"Extracted the page: {page}'s events details")
    
    output_file = "events_details.json"
    with open(output_file, 'w', encoding='utf-8') as file:
        json.dump(all_events, file, indent=4, ensure_ascii=False)

