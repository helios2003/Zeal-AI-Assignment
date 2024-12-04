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

        with open('events_details.json', 'w', encoding='utf-8') as file:
            for event in events:
                file.write(json.dumps(event, indent=4))
    else:
        print(f"Failed to fetch data from the website. Status code: {response.status_code}")

def main():
    for page in range(1, 257):
        URL = f"https://www.eventbrite.com/d/wa--seattle/all-events/?{page}"
        scrape_url(URL)
        print(f"Extracted the page: {page}'s events details")

if __name__ == "__main__":
    main()    
